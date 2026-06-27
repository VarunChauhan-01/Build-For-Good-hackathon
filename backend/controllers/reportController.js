/**
 * Report Controller (Mongoose Version)
 */
const { Report, User, Job, Application, Worker } = require('../models');

// Mock action history in-memory since it doesn't need to persist forever,
// or we can query it. We'll store it in a simple global array.
const adminActions = [
  { id: 1, action: 'Verified Profile', target_user: 'Ramesh Pujari', admin_name: 'Admin User', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, action: 'Flagged Profile', target_user: 'Suspicious User', admin_name: 'Admin User', created_at: new Date(Date.now() - 7200000).toISOString() }
];

const reportController = {
  getReports: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const reports = await Report.find({}).sort({ createdAt: -1 });
      const flaggedUsers = await User.find({
        $or: [
          { strikes: { $gt: 0 } },
          { status: 'flagged' }
        ]
      });

      // Calculate Admin Stats
      const totalUsers = await User.countDocuments();
      const totalWorkers = await Worker.countDocuments();
      // Count employers who posted jobs or have role 'employer'
      const totalEmployers = await User.countDocuments({ role: 'employer' }) || 2;
      const activeJobs = await Job.countDocuments();
      const jobApplications = await Application.countDocuments();
      const pendingVerifications = await User.countDocuments({ is_verified: 0, aadhaar_masked: { $exists: true, $ne: null } });
      const verifiedUsers = await User.countDocuments({ is_verified: 1 });
      const pendingReports = await Report.countDocuments({ status: 'pending' });
      const flaggedProfiles = flaggedUsers.length;
      
      // Severity Counts
      const severityCritical = await Report.countDocuments({ severity: 'Critical' });
      const severityHigh = await Report.countDocuments({ severity: 'High' });
      const severityMedium = await Report.countDocuments({ severity: 'Medium' });
      const severityLow = await Report.countDocuments({ severity: 'Low' });

      // Daily activity widths based on some scale (max 100%)
      const regWidth = Math.min(100, Math.round((totalUsers / 10) * 100)) + '%';
      const appWidth = Math.min(100, Math.round((jobApplications / 20) * 100)) + '%';
      const repWidth = Math.min(100, Math.round((reports.length / 5) * 100)) + '%';
      const verWidth = Math.min(100, Math.round((verifiedUsers / 10) * 100)) + '%';

      // Severity percents
      const totalReps = reports.length || 1;
      const critPercent = Math.round((severityCritical / totalReps) * 100) + '%';
      const highPercent = Math.round((severityHigh / totalReps) * 100) + '%';
      const medPercent = Math.round((severityMedium / totalReps) * 100) + '%';
      const lowPercent = Math.round((severityLow / totalReps) * 100) + '%';

      const stats = {
        totalUsers,
        totalWorkers,
        totalEmployers,
        activeJobs,
        jobApplications,
        pendingVerifications,
        verifiedUsers,
        pendingReports,
        flaggedProfiles,
        verificationQueue: pendingVerifications,
        
        // Severity
        severityCritical,
        severityHigh,
        severityMedium,
        severityLow,
        
        critPercent,
        highPercent,
        medPercent,
        lowPercent,
        
        // Widths
        regWidth,
        appWidth,
        repWidth,
        verWidth
      };

      // Normalize reports and flaggedUsers for frontend IDs
      const normalizedReports = reports.map(r => {
        const obj = r.toObject();
        obj.id = String(obj._id);
        return obj;
      });

      const normalizedFlagged = flaggedUsers.map(u => {
        const obj = u.toObject();
        obj.id = String(obj._id);
        return obj;
      });

      res.json({
        reports: normalizedReports,
        flaggedUsers: normalizedFlagged,
        actions: adminActions,
        stats
      });
    } catch (error) {
      next(error);
    }
  },

  addStrike: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const reportId = req.params.id;
      const report = await Report.findByIdAndUpdate(reportId, { status: 'resolved' }, { new: true });
      if (!report) return res.status(404).json({ error: 'Report not found' });

      // Find user and increment strikes
      const user = await User.findOne({ name: report.reported_user });
      if (user) {
        user.strikes = (user.strikes || 0) + 1;
        user.reports_count = (user.reports_count || 0) + 1;
        if (user.strikes >= 3) {
          user.status = 'blacklisted';
        } else {
          user.status = 'flagged';
        }
        await user.save();

        adminActions.unshift({
          id: adminActions.length + 1,
          action: `Added Strike to ${user.name}`,
          target_user: user.name,
          admin_name: req.user.name || 'Admin',
          created_at: new Date().toISOString()
        });
      }

      res.json({ message: 'Strike added to user and report resolved' });
    } catch (error) {
      next(error);
    }
  },

  markSafe: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const reportId = req.params.id;
      const report = await Report.findByIdAndUpdate(reportId, { status: 'safe' }, { new: true });
      if (!report) return res.status(404).json({ error: 'Report not found' });

      adminActions.unshift({
        id: adminActions.length + 1,
        action: `Marked Report Safe`,
        target_user: report.reported_user,
        admin_name: req.user.name || 'Admin',
        created_at: new Date().toISOString()
      });

      res.json({ message: 'Report marked as safe' });
    } catch (error) {
      next(error);
    }
  },

  blacklistUser: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const userId = req.params.id;
      const user = await User.findByIdAndUpdate(userId, { status: 'blacklisted' }, { new: true });
      if (!user) return res.status(404).json({ error: 'User not found' });

      adminActions.unshift({
        id: adminActions.length + 1,
        action: `Blacklisted User`,
        target_user: user.name,
        admin_name: req.user.name || 'Admin',
        created_at: new Date().toISOString()
      });

      res.json({ message: 'User blacklisted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reportController;
