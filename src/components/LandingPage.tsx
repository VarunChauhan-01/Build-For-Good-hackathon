import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  MapPin,
  Wrench,
  Smartphone,
  ChevronRight,
  Mic,
  AudioLines,
  Sparkles,
  Bot,
  Search,
  FileText,
  UserCheck,
  BadgeAlert,
  GraduationCap,
  Sprout,
  Calendar,
  CloudSun,
  DollarSign,
  Info,
  Globe2,
  Users,
  Compass,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ScrollReveal from './ScrollReveal';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { darkMode, t } = useTheme();
  
  // Interactive micro-states for counters and demos
  const [workerScore, setWorkerScore] = useState(0);
  const [employerScore, setEmployerScore] = useState(0);
  const [activeLang, setActiveLang] = useState('en');

  const {
    transcript,
    interimTranscript,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  } = useSpeechRecognition();

  // Animate progress rings on component load
  useEffect(() => {
    const wTimer = setTimeout(() => setWorkerScore(92), 300);
    const eTimer = setTimeout(() => setEmployerScore(98), 500);
    return () => {
      clearTimeout(wTimer);
      clearTimeout(eTimer);
    };
  }, []);

  const languages = [
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  ];

  useEffect(() => {
    if (!isListening && transcript) {
      setTimeout(() => {
        onNavigate('voice-registration');
        resetTranscript();
      }, 1500);
    }
  }, [isListening, transcript, onNavigate, resetTranscript]);

  const handleVoiceDemo = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getVoiceText = () => {
    if (error) return error;
    if (isListening) return interimTranscript || transcript || t('voiceListeningDialect');
    if (transcript) return `${t('voiceRecognized')}: "${transcript}" - ${t('voiceRedirecting')}`;
    return t('voiceClickMic');
  };

  return (
    <div className="overflow-x-hidden">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━ HERO SECTION ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative py-24 lg:py-36 flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-cover bg-center transition-all duration-300"
        style={{
          backgroundImage: darkMode
            ? 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.7)), url("/hero_bg.png")'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3)), url("/hero_bg.png")',
        }}
      >
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-govBlue-500/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-700 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            {t('heroTagline')}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight">
            <span className="text-slate-900 dark:text-white flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
              {/* Premium SVG India Flag */}
              <svg className="w-10 h-7 inline-block shadow-sm rounded border border-white/10" viewBox="0 0 3 2">
                <rect width="3" height="2" fill="#FF9933" />
                <rect y="0.666" width="3" height="0.666" fill="#FFFFFF" />
                <rect y="1.333" width="3" height="0.666" fill="#138808" />
                <circle cx="1.5" cy="1" r="0.222" fill="#000080" />
                <circle cx="1.5" cy="1" r="0.177" fill="#FFFFFF" />
                <circle cx="1.5" cy="1" r="0.088" fill="#000080" />
                <path d="M 1.5 0.778 L 1.5 1.222 M 1.278 1 L 1.722 1 M 1.343 0.843 L 1.657 1.157 M 1.343 1.157 L 1.657 0.843" stroke="#000080" strokeWidth="0.015" />
              </svg>
              <span>{t('heroTitle1')}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{t('heroTitle2')}</span>
            </span>
            <span className="bg-gradient-to-r from-govBlue-800 to-slate-900 dark:from-sky-400 dark:to-white bg-clip-text text-transparent block mt-2">
              {t('heroTitle3')}
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mt-8 text-lg sm:text-2xl font-bold max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="text-govBlue-600 dark:text-sky-400">{t('heroZeroScams')}</span>
            <span className="text-slate-300 dark:text-slate-700 font-normal select-none">•</span>
            <span className="text-emerald-600 dark:text-emerald-400">{t('heroVoiceReg')}</span>
            <span className="text-slate-300 dark:text-slate-700 font-normal select-none">•</span>
            <span className="text-govBlue-600 dark:text-sky-400">{t('heroJobsAgri')}</span>
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate('voice-registration')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-govBlue-500 to-teal-600 text-white font-semibold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 group"
            >
              <Mic className="w-5 h-5 animate-pulse" />
              Start Voice Registration
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('jobs')}
              className="px-8 py-4 rounded-xl font-semibold text-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Local Jobs
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ 1. TRUST & VERIFICATION SYSTEM ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <ShieldCheck className="w-8 h-8 text-teal-500" />
                🛡️ {t('trustSectionTitle')}
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg">
                "{t('trustSectionSubtitle')}"
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Worker Trust Card */}
            <ScrollReveal delay={100}>
              <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-8 relative overflow-hidden group`}>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-teal-500/10 transition-colors" />
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Progress Ring */}
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" className="stroke-slate-200 dark:stroke-slate-700 fill-none" strokeWidth="8" />
                      <circle cx="56" cy="56" r="48" className="stroke-teal-500 fill-none transition-all duration-1000 ease-out" strokeWidth="8"
                        strokeDasharray={301.6}
                        strokeDashoffset={301.6 - (301.6 * workerScore) / 100}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{workerScore}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{t('scoreLabel')}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Worker Trust Score
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">{t('verified')}</span>
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Aadhaar Verified</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Mobile Verified</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Skill Verified</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Previous Work Verified</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Positive Reviews</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Employer Trust Card */}
            <ScrollReveal delay={200}>
              <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-8 relative overflow-hidden group`}>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-govBlue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-govBlue-500/10 transition-colors" />
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Progress Ring */}
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" className="stroke-slate-200 dark:stroke-slate-700 fill-none" strokeWidth="8" />
                      <circle cx="56" cy="56" r="48" className="stroke-govBlue-500 fill-none transition-all duration-1000 ease-out" strokeWidth="8"
                        strokeDasharray={301.6}
                        strokeDashoffset={301.6 - (301.6 * employerScore) / 100}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{employerScore}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{t('scoreLabel')}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Employer Trust Score
                      <span className="px-2 py-0.5 rounded-full bg-govBlue-500/10 text-govBlue-600 dark:text-govBlue-400 text-xs font-semibold">{t('premiumRecruiter')}</span>
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-govBlue-500" /> Aadhaar Verified</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-govBlue-500" /> GST Verified</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-govBlue-500" /> Business Verified</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-govBlue-500" /> Payment Verified</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-govBlue-500" /> Trusted Recruiter Badge</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ 2. INDIA'S EMPLOYMENT CHALLENGES ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 animate-bounce" />
                📊 {t('challengeTitle')}
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                stat: '80%',
                title: t('challengeLackProfiles'),
                desc: t('challengeLackProfilesDesc'),
                color: 'border-l-4 border-red-500',
                iconBg: 'bg-red-500/10 text-red-600',
              },
              {
                stat: t('challengeMillions'),
                title: t('challengeJobScams'),
                desc: t('challengeJobScamsDesc'),
                color: 'border-l-4 border-amber-500',
                iconBg: 'bg-amber-500/10 text-amber-600',
              },
              {
                stat: '90%',
                title: t('challengeEnglishBarrier'),
                desc: t('challengeEnglishBarrierDesc'),
                color: 'border-l-4 border-sky-500',
                iconBg: 'bg-sky-500/10 text-sky-600',
              },
              {
                stat: t('challengeSeasonal'),
                title: t('challengeLabourShortages'),
                desc: t('challengeLabourShortagesDesc'),
                color: 'border-l-4 border-emerald-500',
                iconBg: 'bg-emerald-500/10 text-emerald-600',
              },
            ].map((card, idx) => (
              <ScrollReveal key={idx} delay={(idx * 100) as any}>
                <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 h-full flex flex-col justify-between ${card.color} hover:translate-y-[-4px] transition-transform`}>
                  <div>
                    <span className="text-4xl font-black bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent block mb-2">{card.stat}</span>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{card.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <div className="text-center p-6 rounded-2xl bg-teal-500/5 border border-teal-500/20 max-w-4xl mx-auto">
              <p className="text-slate-800 dark:text-teal-200 text-lg font-medium">
                "{t('challengeQuote')}"
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ 3. SMART AGRICULTURE NETWORK ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <Sprout className="w-8 h-8 text-emerald-500" />
                🌾 {t('agriTitle')}
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Direct peer-to-peer agriculture marketplace matching farmers, machinery rentals, and labor at verified fair market rates.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Wrench,
                title: t('agriEquipmentTitle'),
                desc: t('agriEquipmentDesc'),
                action: t('agriEquipmentAction'),
                color: 'from-emerald-500/10 to-teal-500/10 hover:shadow-emerald-500/20',
              },
              {
                icon: Users,
                title: t('agriLabourTitle'),
                desc: t('agriLabourDesc'),
                action: t('agriLabourAction'),
                color: 'from-blue-500/10 to-cyan-500/10 hover:shadow-blue-500/20',
              },
              {
                icon: CloudSun,
                title: t('agriWeatherTitle'),
                desc: t('agriWeatherDesc'),
                action: t('agriWeatherAction'),
                color: 'from-amber-500/10 to-yellow-500/10 hover:shadow-amber-500/20',
              },
              {
                icon: TrendingUp,
                title: t('agriMarketTitle'),
                desc: t('agriMarketDesc'),
                action: t('agriMarketAction'),
                color: 'from-teal-500/10 to-indigo-500/10 hover:shadow-teal-500/20',
              },
              {
                icon: HelpCircle,
                title: t('agriCropTitle'),
                desc: t('agriCropDesc'),
                action: t('agriCropAction'),
                color: 'from-rose-500/10 to-orange-500/10 hover:shadow-rose-500/20',
              },
              {
                icon: MapPin,
                title: t('agriMandiTitle'),
                desc: t('agriMandiDesc'),
                action: t('agriMandiAction'),
                color: 'from-cyan-500/10 to-sky-500/10 hover:shadow-cyan-500/20',
              },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={(idx % 3 * 100) as any}>
                <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 h-full flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 border border-slate-200/50 dark:border-slate-800`}>
                  <div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                      <item.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('farmer-hub')}
                    className="w-full py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white font-semibold text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    {item.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ 4. MULTI-LANGUAGE VOICE SUPPORT ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <Globe2 className="w-8 h-8 text-govBlue-500" />
                🗣️ {t('voiceSectionTitle')}
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center max-w-6xl mx-auto">
            {/* Languages Grid */}
            <div className="grid grid-cols-2 gap-4 lg:col-span-2">
              {languages.map((lang, idx) => (
                <ScrollReveal key={lang.code} delay={(idx % 2 * 100) as any}>
                  <button
                    onClick={() => setActiveLang(lang.code)}
                    className={`w-full p-4 rounded-xl flex items-center gap-3 border text-left transition-all ${
                      activeLang === lang.code
                        ? 'border-govBlue-500 bg-govBlue-500/10 text-govBlue-600 dark:text-sky-400 font-bold scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-lg">{lang.name}</span>
                  </button>
                </ScrollReveal>
              ))}
            </div>

            {/* Interactive Mic wave center */}
            <ScrollReveal delay={200}>
              <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-8 text-center flex flex-col items-center justify-center border border-govBlue-500/20`}>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Interactive Voice Test</h4>
                
                {/* Voice Circle */}
                <div className="relative mb-8">
                  {isListening && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-govBlue-500 to-teal-500 pulse-ring scale-150 opacity-30" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-govBlue-500 to-teal-500 pulse-ring scale-125 opacity-40 animate-pulse" />
                    </>
                  )}
                  <button
                    onClick={handleVoiceDemo}
                    className={`relative w-28 h-28 rounded-full bg-gradient-to-br from-govBlue-500 to-teal-600 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                      isListening ? 'animate-pulse' : ''
                    }`}
                  >
                    <Mic className="w-10 h-10" />
                  </button>
                </div>

                <div className="h-16 flex items-center justify-center">
                  <p className={`text-sm font-medium italic px-4 ${error ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'}`}>
                    {getVoiceText()}
                  </p>
                </div>

                {isListening && !error && (
                  <div className="flex gap-1.5 justify-center mt-2">
                    {[1, 2, 3, 4, 5, 6].map((bar) => (
                      <div
                        key={bar}
                        className="w-1.5 h-6 bg-teal-500 rounded-full animate-wave"
                        style={{ animationDelay: `${bar * 0.15}s` }}
                      />
                    ))}
                  </div>
                )}

                <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
                  "{t('voiceNoTyping')}"
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ 5. AI-POWERED FEATURES ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <Bot className="w-8 h-8 text-teal-500" />
                🤖 {t('aiSectionTitle')}
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: t('aiVoiceProfile'),
                desc: t('aiVoiceProfileDesc'),
                badge: t('badgeActive'),
              },
              {
                title: t('aiSmartMatch'),
                desc: t('aiSmartMatchDesc'),
                badge: t('badgeActive'),
              },
              {
                title: t('aiScamDetect'),
                desc: t('aiScamDetectDesc'),
                badge: t('badgeActive'),
              },
              {
                title: t('aiResume'),
                desc: t('aiResumeDesc'),
                badge: t('badgeBeta'),
              },
              {
                title: t('aiVoiceApply'),
                desc: t('aiVoiceApplyDesc'),
                badge: t('badgeActive'),
              },
              {
                title: t('aiCareerGrowth'),
                desc: t('aiCareerGrowthDesc'),
                badge: t('badgeBeta'),
              },
            ].map((feat, idx) => (
              <ScrollReveal key={idx} delay={(idx % 3 * 100) as any}>
                <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 h-full flex flex-col justify-between border border-slate-200/50 dark:border-slate-800 hover:border-teal-500/30 transition-colors relative overflow-hidden group`}>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      feat.badge === t('badgeActive') ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'bg-govBlue-500/10 text-govBlue-600 dark:text-sky-400'
                    }`}>
                      {feat.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-3">
                      <Sparkles className="w-4.5 h-4.5 text-teal-500" />
                      {feat.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ 6. DIGITAL ROZGAAR CARD ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <Smartphone className="w-8 h-8 text-teal-500" />
                📱 Digital Rozgaar Card
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Descriptive Content */}
            <ScrollReveal>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('cardVerifyQR')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{t('cardDesc1')}"
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('cardDesc2')}
                </p>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3 rounded-xl bg-govBlue-500 text-white font-semibold flex items-center gap-2 hover:bg-govBlue-600 transition-colors"
                >
                  Generate My Card
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </ScrollReveal>

            {/* Rozgaar Card Mockup */}
            <ScrollReveal delay={200}>
              <div className="relative flex justify-center">
                {/* Horizontal Card Body */}
                <div className="w-[380px] sm:w-[420px] h-[260px] rounded-2xl bg-gradient-to-br from-govBlue-800 via-slate-900 to-govGreen-900 text-white p-6 shadow-2xl relative overflow-hidden border border-white/10">
                  
                  {/* Digital India and Government Label */}
                  <div className="flex justify-between items-start border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-xs font-bold tracking-widest text-teal-400 uppercase">JeevanSetu</h4>
                      <p className="text-[9px] text-slate-400">{t('cardGovtId')}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      AADHAAR OK
                    </span>
                  </div>

                  {/* Profile Layout */}
                  <div className="flex gap-4 mt-4">
                    {/* Photo */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                        {/* Inline SVG Avatar */}
                        <svg className="w-16 h-16 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2a5 5 0 00-5 5v3a5 5 0 0010 0V7a5 5 0 00-5-5zm0 10a7 7 0 00-7 7v3h14v-3a7 7 0 00-7-7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center border-2 border-slate-900">
                        <UserCheck className="w-3.5 h-3.5 text-white" />
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-lg font-bold truncate">Ramesh Pujari</h5>
                      <p className="text-xs text-teal-400 font-semibold mt-0.5">{t('cardAgriSpecialist')}</p>
                      
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-3 text-[10px] text-slate-300">
                        <div>
                          <p className="text-slate-400 font-light">{t('cardExp')}</p>
                          <p className="font-semibold">{t('cardYears')}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-light">{t('cardTrustScoreLabel')}</p>
                          <p className="font-semibold text-emerald-400">92 / 100</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-slate-400 font-light">{t('cardSkillsLabel')}</p>
                          <p className="font-semibold truncate">{t('cardSkillsList')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR and Card Footer */}
                  <div className="absolute bottom-5 right-5 w-14 h-14 bg-white p-1 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                    <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                      {/* Decorative QR Code Block Vector */}
                      <path d="M0 0h30v30H0zm5 5h20v20H5zM70 0h30v30H70zm5 5h20v20H75zM0 70h30v30H0zm5 5h20v20H5z" />
                      <path d="M12 12h6v6h-6zM82 12h6v6h-6zM12 82h6v6h-6zM35 15h10v10H35zm0 15h20v10H35zm0 15h10v10H35zm25-15h10v10H60zm0 15h10v20H60zm15 15h15v10H75zm-15 15h20v15H60zm-25 0h10v10H35z" />
                    </svg>
                  </div>

                  {/* Animated QR laser scan effect */}
                  <div className="absolute inset-x-0 scanner-laser pointer-events-none" />

                  {/* Holographic background seal */}
                  <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full border border-teal-500/10 pointer-events-none" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ 7. POTENTIAL NATIONAL IMPACT ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
        {/* Subtle India Silhouette or abstract connections network */}
        <div className="absolute inset-0 opacity-[0.06] flex items-center justify-center pointer-events-none">
          <svg className="w-[600px] h-[700px] text-teal-400" fill="currentColor" viewBox="0 0 400 500">
            {/* Outline map polygon helper */}
            <path d="M200 20 L230 40 L240 60 L260 80 L280 120 L300 150 L310 180 L290 220 L280 250 L270 280 L260 300 L250 340 L230 380 L210 420 L200 450 L190 480 L180 490 L170 470 L160 440 L165 400 L155 380 L140 360 L130 330 L110 300 L95 280 L80 250 L95 230 L110 200 L125 180 L135 150 L140 120 L150 100 L160 80 L170 60 L180 40 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/35 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-4">
                National Vision
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight flex items-center justify-center gap-2 text-white">
                🚀 {t('impactTitle')}
              </h2>
              <p className="mt-4 text-slate-400 text-lg">
                {t('impactSubtitle')}
              </p>
            </ScrollReveal>
          </div>

          {/* Infographic Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                stat: '500M+',
                label: t('impactWorkersLabel'),
                desc: t('impactWorkersDesc'),
                color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
                glowColor: 'bg-blue-500',
              },
              {
                stat: '120M+',
                label: t('impactFarmersLabel'),
                desc: t('impactFarmersDesc'),
                color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
                glowColor: 'bg-emerald-500',
              },
              {
                stat: t('challengeMillions'),
                label: t('impactEmployersLabel'),
                desc: t('impactEmployersDesc'),
                color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30',
                glowColor: 'bg-indigo-500',
              },
              {
                stat: '22+',
                label: t('impactLanguagesLabel'),
                desc: t('impactLanguagesDesc'),
                color: 'from-rose-500/20 to-orange-500/10 border-rose-500/30',
                glowColor: 'bg-rose-500',
              },
              {
                stat: t('impactThousands'),
                label: t('impactVillagesLabel'),
                desc: t('impactVillagesDesc'),
                color: 'from-teal-500/20 to-sky-500/10 border-teal-500/30',
                glowColor: 'bg-teal-500',
              },
              {
                stat: t('impactZeroScam'),
                label: t('impactHiringVision'),
                desc: t('impactHiringVisionDesc'),
                color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30',
                glowColor: 'bg-amber-500',
              },
            ].map((stat, idx) => (
              <ScrollReveal key={idx} delay={(idx * 80) as any}>
                <div className={`p-8 rounded-2xl bg-gradient-to-br ${stat.color} border hover:border-white/20 transition-all duration-300 relative overflow-hidden group`}>
                  
                  {/* Floating Pulsing Glow node */}
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${stat.glowColor} animate-ping`} />
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${stat.glowColor}`} />

                  <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent block">{stat.stat}</span>
                  <h4 className="text-lg font-bold text-teal-300 mt-2 mb-3">{stat.label}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{stat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={500}>
            <div className="text-center border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>{t('impactNCS')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-govBlue-500" />
                <span>{t('impactAadhaarAPI')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>{t('impactDigitalIndia')}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
};
export default LandingPage;
