<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  UserCheck,
  RefreshCw,
  Award,
  AlertTriangle,
  ArrowRight,
<<<<<<< HEAD
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
=======
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { verificationAPI } from '../services/api';
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70

interface VerificationSystemProps {
  onNavigate: (page: string) => void;
}

export const VerificationSystem: React.FC<VerificationSystemProps> = ({ onNavigate }) => {
<<<<<<< HEAD
  const { darkMode } = useTheme();
=======
  const { darkMode, t } = useTheme();
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
  
  const [aadhaarNum, setAadhaarNum] = useState('');
  const [otpVal, setOtpVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'otp_sent' | 'verifying' | 'verified'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
<<<<<<< HEAD

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNum.replace(/\s/g, '').length !== 12) {
      setErrorMsg('Aadhaar number must be exactly 12 digits.');
      return;
    }
    setErrorMsg('');
    setStatus('otp_sent');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpVal !== '123456') {
      setErrorMsg('Invalid OTP. Use "123456" for mock simulation.');
=======
  const [maskedAadhaar, setMaskedAadhaar] = useState('');
  const [newTrustScore, setNewTrustScore] = useState(92);

  useEffect(() => {
    // Check if user is already verified
    verificationAPI.getStatus().then(res => {
      if (res.verification && res.verification.status === 'verified') {
        setStatus('verified');
      }
    }).catch(console.error);
  }, []);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNum.replace(/\s/g, '').length !== 12) {
      setErrorMsg(t('vsErrAadhaarLen'));
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
      return;
    }
    setErrorMsg('');
    setStatus('verifying');
    
<<<<<<< HEAD
    setTimeout(() => {
      setStatus('verified');
    }, 2000);
=======
    try {
      const res = await verificationAPI.requestOtp(aadhaarNum.replace(/\s/g, ''));
      setMaskedAadhaar(res.masked_aadhaar);
      setStatus('otp_sent');
    } catch (err: any) {
      setErrorMsg(err.message || t('vsErrReqOtp'));
      setStatus('idle');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpVal.length !== 6) {
      setErrorMsg(t('vsErrOtpLen'));
      return;
    }
    setErrorMsg('');
    setStatus('verifying');
    
    try {
      const res = await verificationAPI.verifyOtp(otpVal);
      setNewTrustScore(res.trust_score);
      setStatus('verified');
    } catch (err: any) {
      setErrorMsg(err.message || t('vsErrInvalidOtp'));
      setStatus('otp_sent');
    }
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
  };

  const formatAadhaar = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    const matches = cleaned.match(/\d{4,12}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

<<<<<<< HEAD
    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return cleaned;
    }
=======
    return parts.length > 0 ? parts.join(' ') : cleaned;
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-govBlue-500/10 border border-govBlue-500/30 text-govBlue-600 dark:text-sky-400 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
<<<<<<< HEAD
          Secure Government API Sandbox
        </div>
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Aadhaar Identity Verification
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Verify your identity with secure OTP verification to unlock higher Trust Scores and qualify for higher-paying verified jobs.
=======
          {t('vsSecureGov')}
        </div>
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {t('vsTitle')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {t('vsDesc')}
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
        
        {/* Verification Checklist */}
        <div className="md:col-span-1 space-y-4">
<<<<<<< HEAD
          <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Why Verify Identity?</h3>
          
          <div className="space-y-3">
            {[
              { title: 'Zero Scam Platform Check', desc: 'Ensures each user owns exactly one verified account.' },
              { title: 'Trust Score Boot', desc: 'Aadhaar matching increases baseline trust score immediately by +25 points.' },
              { title: 'Employer Priority View', desc: 'Verified workers show up first in employer nearby searches.' },
=======
          <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('vsWhyVerify')}</h3>
          
          <div className="space-y-3">
            {[
              { title: t('vsZeroScam'), desc: t('vsZeroScamDesc') },
              { title: t('vsTrustScore'), desc: t('vsTrustScoreDesc') },
              { title: t('vsEmployerPriority'), desc: t('vsEmployerPriorityDesc') },
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
            ].map((item, idx) => (
              <div key={idx} className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-4 border border-slate-200/50 dark:border-slate-800`}>
                <h4 className="font-bold text-sm text-slate-800 dark:text-teal-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Form Body */}
        <div className="md:col-span-2">
          <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-8 border border-govBlue-500/20 shadow-xl relative overflow-hidden`}>
            
            {status === 'idle' && (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-200/50 dark:border-slate-800">
                  <UserCheck className="w-6 h-6 text-govBlue-500" />
<<<<<<< HEAD
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Step 1: Enter 12-Digit Aadhaar</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Aadhaar Number</label>
=======
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('vsStep1')}</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('vsAadhaarNum')}</label>
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
                  <input
                    type="text"
                    value={aadhaarNum}
                    onChange={(e) => setAadhaarNum(formatAadhaar(e.target.value))}
<<<<<<< HEAD
                    placeholder="XXXX XXXX XXXX"
=======
                    placeholder={t('vsAadhaarPlaceholder')}
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
                    className={`w-full p-4 rounded-xl border text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-govBlue-500 ${
                      darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
<<<<<<< HEAD
                  <p className="text-[10px] text-slate-400">We do not store your Aadhaar credentials. Direct CIDR verification sandbox query.</p>
=======
                  <p className="text-[10px] text-slate-400">{t('vsNoStore')}</p>
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-govBlue-500 hover:bg-govBlue-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
                >
<<<<<<< HEAD
                  Request OTP Verification
=======
                  {t('vsRequestOtp')}
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {status === 'otp_sent' && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-200/50 dark:border-slate-800">
                  <Smartphone className="w-6 h-6 text-govBlue-500 animate-bounce" />
<<<<<<< HEAD
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Step 2: Enter SMS OTP</h3>
                </div>

                <p className="text-sm text-slate-400">
                  A verification code has been sent to your Aadhaar-linked mobile phone number (XXXX-XX-1234). Use code <span className="font-bold text-teal-500">123456</span> to simulate mock response.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">6-Digit One Time Password</label>
=======
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('vsStep2')}</h3>
                </div>

                <p className="text-sm text-slate-400">
                  {t('vsOtpSent')} <span className="font-bold text-slate-300">({maskedAadhaar || 'XXXX-XX-1234'})</span>. {t('vsUseCode')} <span className="font-bold text-teal-500">123456</span> {t('vsSimulate')}.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('vs6DigitOtp')}</label>
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
                  <input
                    type="text"
                    maxLength={6}
                    value={otpVal}
                    onChange={(e) => setOtpVal(e.target.value.replace(/\D/g, ''))}
<<<<<<< HEAD
                    placeholder="Enter 6-digit OTP"
=======
                    placeholder={t('vsEnterOtpPlaceholder')}
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
                    className={`w-full p-4 rounded-xl border text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-govBlue-500 ${
                      darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    {errorMsg}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="flex-1 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-white"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl bg-govBlue-500 hover:bg-govBlue-600 text-white font-semibold"
                  >
<<<<<<< HEAD
                    Verify & Match Identity
=======
                    {t('vsVerifyMatch')}
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
                  </button>
                </div>
              </form>
            )}

            {status === 'verifying' && (
              <div className="py-12 text-center space-y-6 flex flex-col items-center justify-center">
                <RefreshCw className="w-12 h-12 text-govBlue-500 animate-spin" />
                <div>
<<<<<<< HEAD
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Connecting to CIDR Sandboxes</h3>
                  <p className="text-xs text-slate-400 mt-1">Inspecting biometric data and matching names. Please wait...</p>
=======
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('vsConnecting')}</h3>
                  <p className="text-xs text-slate-400 mt-1">{t('vsInspecting')}</p>
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
                </div>
              </div>
            )}

            {status === 'verified' && (
              <div className="py-8 text-center space-y-6 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/35">
                  <Award className="w-10 h-10 animate-bounce" />
                </div>
                <div>
<<<<<<< HEAD
                  <h3 className={`font-bold text-2xl text-emerald-600 dark:text-emerald-400`}>Aadhaar Identity Confirmed!</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Congratulations! Your profile has been updated with the government verification badge.
=======
                  <h3 className={`font-bold text-2xl text-emerald-600 dark:text-emerald-400`}>{t('vsConfirmed')}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {t('vsCongrats')}
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-left border border-slate-200 dark:border-slate-700 w-full max-w-sm">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
<<<<<<< HEAD
                    <span>Base Trust Score:</span>
                    <span className="font-bold">75/100</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400 mt-2 border-t pt-2 font-bold">
                    <span>New Trust Score:</span>
                    <span>92/100 (+25 Verified Bonus)</span>
=======
                    <span>{t('vsBaseTrust')}</span>
                    <span className="font-bold">75/100</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400 mt-2 border-t pt-2 font-bold">
                    <span>{t('vsNewTrust')}</span>
                    <span>{newTrustScore}/100</span>
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-4 rounded-xl bg-govBlue-500 hover:bg-govBlue-600 text-white font-semibold flex items-center justify-center gap-2"
                >
<<<<<<< HEAD
                  Return to Dashboard
=======
                  {t('vsReturn')}
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

    </section>
  );
};
export default VerificationSystem;
