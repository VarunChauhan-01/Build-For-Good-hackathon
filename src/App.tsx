import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Menu,
  X,
  Sun,
  Moon,
  Accessibility,
  Globe2,
  Lock,
  UserCheck,
  ChevronDown,
  LogOut,
  LogIn
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/dashboard';
import VoiceRegistration from './components/VoiceRegistration';
import JobSearch from './components/JobSearch';
import FarmerHub from './components/FarmerHub';
import VerificationSystem from './components/VerificationSystem';
import AdminDashboard from './components/AdminDashboard';
import { AIAssistant } from './components/AIAssistant';
import AuthModal from './components/AuthModal';
import { getStoredUser, clearToken } from './services/api';

export const App: React.FC = () => {
  const {
    darkMode,
    toggleDarkMode,
    highContrast,
    toggleHighContrast,
    language,
    setLanguage,
    t,
  } = useTheme();

  const [activePage, setActivePage] = useState<string>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    setUser(getStoredUser());
    if (activePage === 'landing') {
      setActivePage('dashboard');
    }
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setActivePage('landing');
  };

  const pages = [
    { id: 'landing', label: t('home') },
    { id: 'dashboard', label: t('dashboard') },
    { id: 'jobs', label: t('jobSearch') },
    { id: 'voice-registration', label: t('voiceRegister') },
    { id: 'farmer-hub', label: t('farmerHub') },
    { id: 'verification', label: t('verification') },
    { id: 'admin', label: t('adminPanel') },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'mr', name: 'मराठी' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'gu', name: 'ગુજરાતી' },
  ] as const;

  const currentLanguageName = languages.find((l) => l.code === language)?.name || 'English';

  const renderActivePage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage onNavigate={setActivePage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'voice-registration':
        return <VoiceRegistration onNavigate={setActivePage} />;
      case 'jobs':
        return <JobSearch onNavigate={setActivePage} />;
      case 'farmer-hub':
        return <FarmerHub onNavigate={setActivePage} />;
      case 'verification':
        return <VerificationSystem onNavigate={setActivePage} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingPage onNavigate={setActivePage} />;
    }
  };

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* Top Banner Notice */}
      <div className="w-full bg-gradient-to-r from-govBlue-800 to-govGreen-900 text-white text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 select-none border-b border-white/5">
        <Lock className="w-3 h-3 text-teal-400" />
        <span>{t('appTopBanner')}</span>
      </div>

      {/* Sticky Glassmorphism Header */}
      <header className={`sticky top-0 z-40 w-full transition-colors border-b ${darkMode ? 'glass-navbar-dark' : 'glass-navbar'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-govBlue-500 to-govGreen-500 flex items-center justify-center text-white font-bold shadow-md shadow-govBlue-500/10 group-hover:scale-105 transition-transform">
                JS
              </div>
              <div>
                <span className="font-display font-extrabold text-base tracking-tight flex items-center gap-1.5 text-slate-900 dark:text-white">
                  JeevanSetu
                  <span className="text-[10px] bg-teal-500/10 dark:bg-teal-500/25 text-teal-600 dark:text-teal-400 px-1.5 py-0.2 rounded border border-teal-500/20 font-bold">AI</span>
                </span>
                <span className="text-[9px] text-slate-400 block -mt-0.5">{t('appLogoSubtitle')}</span>
              </div>
            </button>

            {/* Desktop Navbar Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleNavClick(p.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activePage === p.id
                    ? 'bg-govBlue-500 text-white shadow-md'
                    : darkMode
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </nav>

            {/* Toolbar Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Accessibility Toggler */}
              <button
                onClick={toggleHighContrast}
                title="Toggle High Contrast Mode"
                className={`p-2 rounded-xl border transition-colors ${highContrast
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                  : darkMode
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-400'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-500'
                  }`}
              >
                <Accessibility className="w-5 h-5" />
              </button>

              {/* Theme Toggler */}
              <button
                onClick={toggleDarkMode}
                title="Toggle Dark Mode"
                className={`p-2 rounded-xl border transition-colors ${darkMode
                  ? 'border-slate-800 bg-slate-800 hover:bg-slate-700 text-amber-400'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-500'
                  }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className={`px-3 py-2 rounded-xl border font-semibold text-xs flex items-center gap-1.5 transition-colors ${darkMode ? 'border-slate-800 bg-slate-900/50 text-slate-300' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                >
                  <Globe2 className="w-4 h-4" />
                  {currentLanguageName}
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isLangDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-32 rounded-xl border shadow-xl p-1 z-50 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 block transition-colors ${language === l.code ? 'text-govBlue-500' : 'text-slate-600 dark:text-slate-300'
                          }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth Button */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout')} ({user.name.split(' ')[0]})
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-govBlue-500 hover:bg-govBlue-600 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  {t('loginRegister')}
                </button>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl border transition-colors ${darkMode ? 'border-slate-800 text-amber-400' : 'border-slate-200 text-slate-500'
                  }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-xl border ${darkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'
                  }`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden border-t border-slate-200 dark:border-slate-800 p-4 space-y-3 z-50 absolute inset-x-0 top-16 shadow-2xl ${darkMode ? 'bg-slate-900' : 'bg-white'
            }`}>
            <nav className="flex flex-col gap-1.5">
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleNavClick(p.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePage === p.id
                    ? 'bg-govBlue-500 text-white'
                    : darkMode
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  {p.label}
                </button>
              ))}

              {user ? (
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  {t('logout')} ({user.name})
                </button>
              ) : (
                <button
                  onClick={() => { setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm bg-govBlue-500 text-white hover:bg-govBlue-600"
                >
                  {t('loginRegister')}
                </button>
              )}
            </nav>

            <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={toggleHighContrast}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold"
              >
                <Accessibility className="w-4 h-4" />
                Contrast
              </button>

              <div className="flex-1 relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full py-3 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl flex items-center justify-center text-xs font-bold text-center appearance-none focus:outline-none"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code} className="text-slate-900 bg-white">
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-grow">
        {renderActivePage()}
      </main>

      {/* Corporate Govt Startup Footer */}
      <footer className={`border-t py-12 ${darkMode ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex justify-center items-center gap-6 opacity-60">
            {/* Mock Digital India label */}
            <div className="flex items-center gap-1 text-slate-800 dark:text-white font-extrabold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Digital India
            </div>
            <div className="flex items-center gap-1 text-slate-800 dark:text-white font-extrabold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              NCS Partnered
            </div>
            <div className="flex items-center gap-1 text-slate-800 dark:text-white font-extrabold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              Ministry of IT Sandbox
            </div>
          </div>

          <p className="text-xs leading-relaxed max-w-2xl mx-auto">
            JeevanSetu employs Aadhaar Unified API queries, location geofencing, and natural language model analysis to build scam-free hiring connections. Built under sandbox guidelines for India’s informal worker population.
          </p>

          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} JeevanSetu Employment Platform. Built for Digital India. All rights reserved.
          </p>
        </div>
      </footer>

      <AIAssistant />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
};
export default App;
