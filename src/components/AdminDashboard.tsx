import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Ban,
  Check,
  Search,
  Calendar,
  FileText,
  BarChart3,
  Zap,
  Flame,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { reportsAPI } from '../services/api';

function AdminDashboard() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'flagged' | 'actions'>('overview');
  
  const [reports, setReports] = useState<any[]>([]);
  const [flaggedUsers, setFlaggedUsers] = useState<any[]>([]);
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await reportsAPI.getAll();
      setReports(data.reports);
      setFlaggedUsers(data.flaggedUsers);
      setRecentActions(data.actions);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionFn: () => Promise<any>) => {
    try {
      await actionFn();
      await fetchData(); // Refresh data
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  const dashboardStats = [
    { label: 'Total Users', value: stats.totalUsers || 0, change: '+12', icon: Users, color: 'from-blue-500 to-cyan-500', trend: 'up' },
    { label: 'Pending Reports', value: stats.pendingReports || 0, change: 'Requires Action', icon: AlertTriangle, color: 'from-red-500 to-rose-500', trend: 'down' },
    { label: 'Flagged Profiles', value: stats.flaggedProfiles || 0, change: '+1', icon: Shield, color: 'from-amber-500 to-orange-500', trend: 'up' },
    { label: 'Verification Queue', value: stats.verificationQueue || 0, change: 'Processing', icon: CheckCircle, color: 'from-green-500 to-emerald-500', trend: 'up' },
  ];

  const renderTabContent = () => {
    if (loading) {
      return <div className="text-center py-12 text-slate-400">Loading admin data...</div>;
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Activity */}
              <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6`}>
                <h3 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Activity className="w-5 h-5 text-blue-500" />
                  Daily Platform Activity
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Profile Registrations', value: stats.totalUsers || 0, color: 'bg-green-500', width: stats.regWidth || '0%' },
                    { label: 'Job Applications', value: stats.jobApplications || 0, color: 'bg-blue-500', width: stats.appWidth || '0%' },
                    { label: 'Reports Filed', value: stats.pendingReports || 0, color: 'bg-red-500', width: stats.repWidth || '0%' },
                    { label: 'Verifications Completed', value: stats.verifiedUsers || 0, color: 'bg-cyan-500', width: stats.verWidth || '0%' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{item.label}</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
                      </div>
                      <div className={`h-2 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Severity */}
              <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6`}>
                <h3 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Report Severity Distribution
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Critical', count: stats.severityCritical || 0, color: 'bg-red-500', percent: stats.critPercent || '0%' },
                    { label: 'High', count: stats.severityHigh || 0, color: 'bg-amber-500', percent: stats.highPercent || '0%' },
                    { label: 'Medium', count: stats.severityMedium || 0, color: 'bg-yellow-500', percent: stats.medPercent || '0%' },
                    { label: 'Low', count: stats.severityLow || 0, color: 'bg-green-500', percent: stats.lowPercent || '0%' },
                  ].map((item) => (
                    <div key={item.label} className={`p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{item.label}</span>
                      </div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.count}</p>
                      <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>{item.percent} of total</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6`}>
              <h3 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Clock className="w-5 h-5 text-cyan-500" />
                Recent Admin Actions
              </h3>
              <div className="space-y-3">
                {recentActions.map((action) => (
                  <div
                    key={action.id}
                    className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        action.action.includes('Blacklisted')
                          ? 'bg-red-500/20'
                          : action.action.includes('Verified') || action.action.includes('Safe')
                            ? 'bg-green-500/20'
                            : 'bg-amber-500/20'
                      }`}>
                        {action.action.includes('Blacklisted') ? (
                          <Ban className="w-4 h-4 text-red-500" />
                        ) : action.action.includes('Verified') || action.action.includes('Safe') ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Shield className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {action.action}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          {action.target_user} | by {action.admin_name}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                      {new Date(action.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
                {recentActions.length === 0 && (
                  <p className="text-center text-sm text-slate-500 py-4">No recent actions.</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-4">
            <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-4`}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      darkMode ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
                <div className="flex gap-2">
                  <select className={`px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'}`}>
                    <option>All Severities</option>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        report.severity === 'Critical'
                          ? 'bg-red-500/20'
                          : report.severity === 'High'
                            ? 'bg-amber-500/20'
                            : 'bg-yellow-500/20'
                      }`}>
                        <AlertTriangle className={`w-6 h-6 ${
                          report.severity === 'Critical'
                            ? 'text-red-500'
                            : report.severity === 'High'
                              ? 'text-amber-500'
                              : 'text-yellow-500'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                            report.severity === 'Critical'
                              ? 'bg-red-100 text-red-700'
                              : report.severity === 'High'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {report.severity}
                          </span>
                          <span className={`px-2 py-0.5 rounded-lg text-xs ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                            {report.type}
                          </span>
                          {report.status === 'pending' && (
                            <Zap className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          User: {report.reported_user}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          Reported by: {report.reporter}
                        </p>
                        <p className={`text-sm mt-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          "{report.reason}"
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        {new Date(report.created_at).toLocaleString()}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded-lg text-xs font-medium ${
                        report.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : report.status === 'resolved'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                      }`}>
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {report.status === 'pending' && (
                    <div className={`flex items-center gap-3 mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                      <button 
                        onClick={() => handleAction(() => reportsAPI.addStrike(report.id))}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                        Add Strike
                      </button>
                      <button 
                        onClick={() => handleAction(() => reportsAPI.markSafe(report.id))}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Mark Safe
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {reports.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-8">No reports found.</p>
              )}
            </div>
          </div>
        );

      case 'flagged':
        return (
          <div className="space-y-4">
            {flaggedUsers.map((user) => (
              <div
                key={user.id}
                className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      user.status === 'flagged'
                        ? 'bg-red-500/20'
                        : 'bg-amber-500/20'
                    }`}>
                      <Shield className={`w-7 h-7 ${
                        user.status === 'flagged'
                          ? 'text-red-500'
                          : 'text-amber-500'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                          user.status === 'flagged'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.status.toUpperCase()}
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        Aadhaar: {user.aadhaar_masked || 'Not provided'} | {user.profession || 'Unknown'}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-red-500" />
                          <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            {user.strikes}/3 Strikes
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            {user.reports_count} Reports
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            Last active: {new Date(user.last_active).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-3 mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                  {user.status === 'warning' && (
                    <button 
                      onClick={() => handleAction(() => reportsAPI.blacklistUser(user.id))}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                    >
                      <Ban className="w-4 h-4" />
                      Blacklist User
                    </button>
                  )}
                  <button className={`flex-grow flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    <FileText className="w-4 h-4" />
                    Report History
                  </button>
                </div>
              </div>
            ))}
            {flaggedUsers.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-8">No flagged users.</p>
            )}
          </div>
        );

      case 'actions':
        return (
          <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6`}>
            <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Action Guidelines
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Strike System', desc: 'Each valid report adds one strike. 3 strikes = auto-blacklist', icon: Zap, color: 'from-amber-500 to-orange-500' },
                { title: 'Report to Authority', desc: 'Critical fraud cases are forwarded to law enforcement', icon: Shield, color: 'from-red-500 to-rose-500' },
                { title: 'Profile Verification', desc: 'Aadhaar-based verification ensures single profile per person', icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
                { title: 'Price Monitoring', desc: 'AI monitors for price anomalies and overcharging', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
              ].map((item) => (
                <div key={item.title} className={`flex items-start gap-4 p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Monitoring Dashboard
            </h1>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Platform security, fraud detection, and user management
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Monitoring
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-2`}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'reports', label: 'Reports', icon: AlertTriangle, count: stats.pendingReports || 0 },
            { id: 'flagged', label: 'Flagged Users', icon: Shield, count: flaggedUsers.length },
            { id: 'actions', label: 'Guidelines', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                  : darkMode
                    ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-xs">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </section>
  );
}

export default AdminDashboard;
