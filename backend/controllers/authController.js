/**
 * Auth Controller (Mongoose Version) — Phase 2
 * Full profile management + live dashboard stats from MongoDB.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { User, ProfileView, Application, Job, Booking, Payment, Review } = require('../models');
const { validateRegister, validateLogin } = require('../utils/validators');

const authController = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, phone } = req.body;
      const { valid, errors } = validateRegister({ name, email, password });

      if (!valid) return res.status(400).json({ error: 'Validation failed', details: errors });

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) return res.status(400).json({ error: 'Email already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        phone: phone || null,
        is_verified: 0,
        trust_score: 75,
        role: 'user',
        reports_count: 0,
        strikes: 0,
        status: 'active'
      });

      const token = jwt.sign(
        { id: String(newUser._id), role: newUser.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      const userResponse = newUser.toObject();
      delete userResponse.password_hash;
      userResponse.id = String(userResponse._id);

      res.status(201).json({ message: 'User registered successfully', token, user: userResponse });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { valid, errors } = validateLogin({ email, password });

      if (!valid) return res.status(400).json({ error: 'Validation failed', details: errors });

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      if (user.status === 'blacklisted' || user.status === 'suspended') {
        return res.status(403).json({ error: 'Your account has been suspended.' });
      }

      // Update last login
      user.last_login = new Date().toISOString();
      await user.save();

      const token = jwt.sign(
        { id: String(user._id), role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      const userResponse = user.toObject();
      delete userResponse.password_hash;
      userResponse.id = String(userResponse._id);

      res.json({ message: 'Login successful', token, user: userResponse });
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Calculate average rating from reviews
      const reviews = await Review.find({ target_id: String(user._id) });
      let avgRating = 0;
      if (reviews.length > 0) {
        avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      }

      const userResponse = user.toObject();
      delete userResponse.password_hash;
      userResponse.id = String(userResponse._id);
      userResponse.avgRating = Math.round(avgRating * 10) / 10;
      userResponse.totalReviews = reviews.length;

      res.json({ user: userResponse });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const { name, phone, location, language, profession, experience, photo, address, skills, availability } = req.body;

      const updates = {};
      if (name) updates.name = name;
      if (phone) updates.phone = phone;
      if (location) updates.location = location;
      if (language) updates.language = language;
      if (profession) updates.profession = profession;
      if (experience) updates.experience = experience;
      if (photo) updates.photo = photo;
      if (address) updates.address = address;
      if (skills) updates.skills = Array.isArray(skills) ? skills : [skills];
      if (availability) updates.availability = availability;

      const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const userResponse = user.toObject();
      delete userResponse.password_hash;
      userResponse.id = String(userResponse._id);

      res.json({ message: 'Profile updated', user: userResponse });
    } catch (error) {
      next(error);
    }
  },

  getStats: async (req, res, next) => {
    try {
      const userId = req.user ? req.user.id : null;
      if (!userId) {
        return res.json({
          stats: [
            { label: 'Weekly Earnings', value: '₹0', change: '--', trend: 'up' },
            { label: 'Jobs Completed', value: '0', change: '--', trend: 'up' },
            { label: 'Profile Views', value: '0', change: '--', trend: 'up' }
          ]
        });
      }

      // --- Live calculations from MongoDB ---

      // 1. Profile views (total & recent 7 days)
      const totalViews = await ProfileView.countDocuments({ user_id: userId });
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentViews = await ProfileView.countDocuments({ user_id: userId, createdAt: { $gte: weekAgo } });

      // 2. Job applications by this user
      const userApps = await Application.find({ user_id: userId });
      const completedApps = userApps.filter(a => a.status === 'Completed' || a.status === 'Accepted');
      const pendingApps = userApps.filter(a => a.status === 'Applied' || a.status === 'Under Review' || a.status === 'Shortlisted');
      const completedCount = completedApps.length;

      // 3. Earnings from bookings where this user is the worker, or from Payment records
      const payments = await Payment.find({ user_id: userId, status: 'completed' });
      const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

      // Weekly earnings from payments in last 7 days
      const weeklyPayments = payments.filter(p => new Date(p.createdAt) >= weekAgo);
      const weeklyEarnings = weeklyPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      // If no payment records, fall back to user model fields
      const user = await User.findById(userId);
      const finalTotalEarnings = totalEarnings || (user ? user.total_earnings : 0);
      const finalCompletedJobs = completedCount || (user ? user.completed_jobs : 0);

      // Success rate
      const totalApps = userApps.length;
      const successRate = totalApps > 0 ? Math.round((completedApps.length / totalApps) * 100) : 0;

      // 4. Active jobs count (jobs the user has applied to that are still active)
      const activeJobIds = userApps.filter(a => a.status === 'Applied' || a.status === 'Under Review' || a.status === 'Accepted').map(a => a.job_id);

      res.json({
        stats: [
          { label: 'Weekly Earnings', value: `₹${weeklyEarnings.toLocaleString('en-IN')}`, change: `Total ₹${finalTotalEarnings.toLocaleString('en-IN')}`, trend: 'up' },
          { label: 'Jobs Completed', value: String(finalCompletedJobs), change: `${successRate}% success`, trend: 'up' },
          { label: 'Profile Views', value: String(totalViews), change: `${recentViews} this week`, trend: 'up' }
        ],
        analytics: {
          totalEarnings: finalTotalEarnings,
          weeklyEarnings,
          completedJobs: finalCompletedJobs,
          activeJobs: activeJobIds.length,
          pendingApplications: pendingApps.length,
          totalApplications: totalApps,
          successRate,
          profileViews: totalViews,
          recentViews
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
