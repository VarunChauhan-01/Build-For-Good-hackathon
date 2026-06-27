import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Briefcase,
  Award,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sprout,
  Heart,
  Building2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { authAPI, jobsAPI, getStoredUser, clearToken } from '../services/api';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const BCP47_MAP: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
  pa: 'pa-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  gu: 'gu-IN',
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { darkMode, language, t } = useTheme();
  const [voiceQuery, setVoiceQuery] = useState(t('howCanIHelp'));
  
  const [user, setUser] = useState<any>(getStoredUser());
  const [stats, setStats] = useState<any[]>([
    { label: t('weeklyEarnings'), value: '₹4,800', change: '+₹1,200', trend: 'up' },
    { label: t('jobsCompleted'), value: '14', change: '89% score', trend: 'up' },
    { label: t('profileViews'), value: '142', change: '18 new', trend: 'up' },
  ]);

  const {
    transcript,
    interimTranscript,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    retry,
  } = useSpeechRecognition(language);

  const [suggestedJobs, setSuggestedJobs] = useState<any[]>([
    { title: 'Farm Harvest Hand', employer: 'Verma Agriculture Farms', category: 'Daily Wage', pay: '₹450/day', location: 'Sonipat (3 km away)' },
    { title: 'Electrical Helper', employer: 'Apex Electric Works', category: 'Temporary', pay: '₹600/day', location: 'Narela (5 km away)' },
  ]);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Sync translation labels when language changes
  useEffect(() => {
    setVoiceQuery(t('howCanIHelp'));
    setStats([
      { label: t('weeklyEarnings'), value: '₹4,800', change: '+₹1,200', trend: 'up' },
      { label: t('jobsCompleted'), value: '14', change: '89% score', trend: 'up' },
      { label: t('profileViews'), value: '142', change: '18 new', trend: 'up' },
    ]);
  }, [language]);

  const fetchUserData = async () => {
    try {
      const [profileRes, statsRes, suggestedRes] = await Promise.all([
        authAPI.getProfile(),
        authAPI.getStats(),
        jobsAPI.getSuggestedJobs().catch(() => null)
      ]);
      if (profileRes?.user) setUser(profileRes.user);
      if (statsRes?.stats) setStats(statsRes.stats);
      if (suggestedRes?.jobs && suggestedRes.jobs.length > 0) {
        setSuggestedJobs(suggestedRes.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch user data', err);
    }
  };

  const speakResponse = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = BCP47_MAP[language] || 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Update voice query text based on real speech
  useEffect(() => {
    if (isListening) {
      if (interimTranscript) {
        setVoiceQuery(`Hearing: "${interimTranscript}"`);
      } else if (transcript) {
        setVoiceQuery(`Recognized: "${transcript}"`);
      } else {
        setVoiceQuery(t('listening'));
      }
    }
  }, [isListening, interimTranscript, transcript, language]);

  // Command processing engine for Dashboard Voice Assistant
  useEffect(() => {
    if (!isListening && transcript) {
      const lower = transcript.toLowerCase();
      setVoiceQuery(`Processing: "${transcript}"`);

      let spokenFeedback = "";
      let targetPage: string | null = null;
      let action: (() => void) | null = null;

      if (lower.includes('dashboard') || lower.includes('home') || lower.includes('मुख्य') || lower.includes('डैशबोर्ड')) {
        spokenFeedback = "You are on your dashboard.";
        setVoiceQuery(t('dashboard'));
      } else if (lower.includes('earning') || lower.includes('salary') || lower.includes('pay') || lower.includes('कमाई')) {
        const earningStat = stats.find(s => s.label.includes('Earning') || s.label.includes('कमाई'))?.value || '₹4,800';
        spokenFeedback = `Your weekly earnings are ${earningStat}.`;
        setVoiceQuery(`${t('weeklyEarnings')}: ${earningStat}`);
      } else if (lower.includes('completed') || lower.includes('कार्य')) {
        const completedStat = stats.find(s => s.label.includes('Completed') || s.label.includes('कार्य'))?.value || '14';
        spokenFeedback = `You have completed ${completedStat} jobs.`;
        setVoiceQuery(`${t('jobsCompleted')}: ${completedStat}`);
      } else if (lower.includes('view') || lower.includes('प्रोफ़ाइल')) {
        const viewsStat = stats.find(s => s.label.includes('View') || s.label.includes('दृश्य'))?.value || '142';
        spokenFeedback = `You have ${viewsStat} profile views.`;
        setVoiceQuery(`${t('profileViews')}: ${viewsStat}`);
      } else if (lower.includes('suggested') || lower.includes('job') || lower.includes('नौकरी')) {
        spokenFeedback = "Opening local suggested jobs.";
        targetPage = 'jobs';
      } else if (lower.includes('farmer') || lower.includes('kisan') || lower.includes('किसान')) {
        spokenFeedback = "Opening Farmer Hub.";
        targetPage = 'farmer-hub';
      } else if (lower.includes('admin') || lower.includes('एडमिन')) {
        spokenFeedback = "Opening Admin Panel.";
        targetPage = 'admin';
      } else if (lower.includes('logout') || lower.includes('sign out') || lower.includes('लॉगआउट')) {
        spokenFeedback = "Logging out.";
        action = () => {
          clearToken();
          window.location.reload();
        };
      } else {
        spokenFeedback = `Searching for ${transcript}`;
        targetPage = 'jobs';
      }

      if (spokenFeedback) {
        speakResponse(spokenFeedback);
      }

      const timer = setTimeout(() => {
        if (action) {
          action();
        } else if (targetPage) {
          onNavigate(targetPage);
        }
        resetTranscript();
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, onNavigate, resetTranscript, stats, language]);

  // Show error in voice query area
  useEffect(() => {
    if (error) {
      setVoiceQuery(error);
    }
  }, [error]);

  const handleVoiceAssistant = () => {
    if (isListening) {
      stopListening();
      if (!transcript) {
        setVoiceQuery(t('howCanIHelp'));
      }
    } else {
      resetTranscript();
      startListening(language);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200/50 dark:border-slate-800`}>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-govBlue-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg uppercase">
            {user?.name ? user.name.substring(0, 2) : 'JS'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {t('welcome')}, {user?.name || 'Guest'}!
              </h1>
              {user?.is_verified === 1 && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  Aadhaar OK
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-1">
              {t('trustScore')} <span className="font-bold text-emerald-500">{user?.trust_score || 75}/100</span>.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('verification')}
          className="px-5 py-2.5 rounded-xl bg-govBlue-500 hover:bg-govBlue-600 text-white font-semibold text-sm transition-colors shadow-md"
        >
          {t('checkStatus')}
        </button>
      </div>

      {/* Voice Assistant Module */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-teal-500/20 bg-gradient-to-r from-teal-500/5 via-slate-50 to-slate-50 dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-900 text-center flex flex-col items-center justify-center`}>
        <h2 className={`text-lg font-bold flex items-center gap-1.5 ${darkMode ? 'text-teal-400' : 'text-slate-800'}`}>
          <Mic className="w-5 h-5 animate-pulse" />
          {t('aiVoiceAssistant')}
        </h2>
        
        {/* Animated Mic Ring */}
        <div className="relative my-6">
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-govBlue-500 to-teal-500 pulse-ring scale-150 opacity-30" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-govBlue-500 to-teal-500 pulse-ring scale-125 opacity-40" />
            </>
          )}
          <button
            onClick={handleVoiceAssistant}
            disabled={!isSupported}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${
              !isSupported
                ? 'bg-slate-400 cursor-not-allowed'
                : isListening
                ? 'bg-red-500 hover:bg-red-600 scale-105 shadow-red-500/30'
                : 'bg-gradient-to-br from-govBlue-500 to-teal-500 hover:shadow-teal-500/30'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 mb-1" />
            ) : (
              <Mic className="w-10 h-10 mb-1" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isListening ? t('stop') : t('tapToCommand')}
            </span>
          </button>
        </div>

        <p className={`text-sm font-semibold italic min-h-[20px] ${
          error ? 'text-red-500' : darkMode ? 'text-slate-300' : 'text-slate-500'
        }`}>
          {voiceQuery}
        </p>

        {/* Error retry button */}
        {error && (
          <button
            onClick={retry}
            className={`mt-3 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              darkMode
                ? 'bg-red-800/30 hover:bg-red-700/30 text-red-400'
                : 'bg-red-100 hover:bg-red-200 text-red-600'
            }`}
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        )}

        {/* Wave animation */}
        {isListening && !error && (
          <div className="flex gap-1 justify-center mt-3">
            {[1, 2, 3, 4, 5].map((b) => (
              <div key={b} className="w-1 h-4 bg-teal-500 rounded-full animate-wave" style={{ animationDelay: `${b * 0.1}s` }} />
            ))}
          </div>
        )}

        {!isSupported && (
          <p className={`text-xs mt-3 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
            Voice recognition is not supported in this browser. Please use Chrome or Edge.
          </p>
        )}
      </div>

      {/* Core Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-slate-200/50 dark:border-slate-800`}>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
              <span className="text-xs font-bold text-emerald-500">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid of Main Services + Suggested Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Navigation Core Services */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('services')}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Briefcase,
                title: t('findJobs'),
                desc: t('findJobsDesc'),
                color: 'from-blue-500 to-blue-600',
                target: 'jobs',
              },
              {
                icon: Sprout,
                title: t('farmerHub'),
                desc: t('farmerHubDesc'),
                color: 'from-emerald-500 to-teal-600',
                target: 'farmer-hub',
              },
              {
                icon: Award,
                title: t('verifyProfile'),
                desc: t('verifyProfileDesc'),
                color: 'from-indigo-500 to-purple-600',
                target: 'verification',
              },
            ].map((srv, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(srv.target)}
                className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 text-left flex flex-col justify-between group hover:scale-[1.03] hover:border-teal-500/20 transition-all border border-slate-200/50 dark:border-slate-800`}
              >
                <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${srv.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                  <srv.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-govBlue-500 dark:group-hover:text-teal-400 transition-colors">{srv.title}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">{srv.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Secondary features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 border border-slate-200/50 dark:border-slate-800 flex gap-4 items-center`}>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{t('healthRecords')}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{t('healthDesc')}</p>
              </div>
            </div>

            <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 border border-slate-200/50 dark:border-slate-800 flex gap-4 items-center`}>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{t('govtSchemes')}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{t('govtDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Local Jobs */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('suggestedJobs')}</h2>
          
          <div className="space-y-4">
            {suggestedJobs.map((job, idx) => (
              <div
                key={idx}
                className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 border border-slate-200/50 dark:border-slate-800 hover:border-govBlue-500/30 transition-all`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{job.title}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{job.employer || job.company}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-govBlue-500/10 text-govBlue-600 dark:text-sky-400 text-[10px] font-bold uppercase">
                    {job.category || job.type || 'Job'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.pay}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{job.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('jobs')}
                  className="w-full mt-4 py-2 rounded-lg bg-slate-100 hover:bg-govBlue-500 dark:bg-slate-800 dark:hover:bg-govBlue-500 text-slate-700 hover:text-white dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  {t('applyNow')}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
export default Dashboard;
