import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { verificationAPI } from '../services/api';

interface VerificationSystemProps {
  onNavigate: (page: string) => void;
}

export const VerificationSystem: React.FC<VerificationSystemProps> = ({ onNavigate }) => {
  const { darkMode, t } = useTheme();
  
  const [aadhaarNum, setAadhaarNum] = useState('');
  const [otpVal, setOtpVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'otp_sent' | 'verifying' | 'verified'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
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
      return;
    }
    setErrorMsg('');
    setStatus('verifying');
    
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
  };

  const formatAadhaar = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    const matches = cleaned.match(/\d{4,12}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length > 0 ? parts.join(' ') : cleaned;
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-govBlue-500/10 border border-govBlue-500/30 text-govBlue-600 dark:text-sky-400 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          {t('vsSecureGov')}
        </div>
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {t('vsTitle')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {t('vsDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
        
        {/* Verification Checklist */}
        <div className="md:col-span-1 space-y-4">
          <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('vsWhyVerify')}</h3>
          
          <div className="space-y-3">
            {[
              { title: t('vsZeroScam'), desc: t('vsZeroScamDesc') },
              { title: t('vsTrustScore'), desc: t('vsTrustScoreDesc') },
              { title: t('vsEmployerPriority'), desc: t('vsEmployerPriorityDesc') },
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
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('vsStep1')}</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('vsAadhaarNum')}</label>
                  <input
                    type="text"
                    value={aadhaarNum}
                    onChange={(e) => setAadhaarNum(formatAadhaar(e.target.value))}
                    placeholder={t('vsAadhaarPlaceholder')}
                    className={`w-full p-4 rounded-xl border text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-govBlue-500 ${
                      darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400">{t('vsNoStore')}</p>
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
                  {t('vsRequestOtp')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {status === 'otp_sent' && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-200/50 dark:border-slate-800">
                  <Smartphone className="w-6 h-6 text-govBlue-500 animate-bounce" />
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('vsStep2')}</h3>
                </div>

                <p className="text-sm text-slate-400">
                  {t('vsOtpSent')} <span className="font-bold text-slate-300">({maskedAadhaar || 'XXXX-XX-1234'})</span>. {t('vsUseCode')} <span className="font-bold text-teal-500">123456</span> {t('vsSimulate')}.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('vs6DigitOtp')}</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpVal}
                    onChange={(e) => setOtpVal(e.target.value.replace(/\D/g, ''))}
                    placeholder={t('vsEnterOtpPlaceholder')}
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
                    {t('vsVerifyMatch')}
                  </button>
                </div>
              </form>
            )}

            {status === 'verifying' && (
              <div className="py-12 text-center space-y-6 flex flex-col items-center justify-center">
                <RefreshCw className="w-12 h-12 text-govBlue-500 animate-spin" />
                <div>
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('vsConnecting')}</h3>
                  <p className="text-xs text-slate-400 mt-1">{t('vsInspecting')}</p>
                </div>
              </div>
            )}

            {status === 'verified' && (
              <div className="py-8 text-center space-y-6 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/35">
                  <Award className="w-10 h-10 animate-bounce" />
                </div>
                <div>
                  <h3 className={`font-bold text-2xl text-emerald-600 dark:text-emerald-400`}>{t('vsConfirmed')}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {t('vsCongrats')}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-left border border-slate-200 dark:border-slate-700 w-full max-w-sm">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{t('vsBaseTrust')}</span>
                    <span className="font-bold">75/100</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400 mt-2 border-t pt-2 font-bold">
                    <span>{t('vsNewTrust')}</span>
                    <span>{newTrustScore}/100</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-4 rounded-xl bg-govBlue-500 hover:bg-govBlue-600 text-white font-semibold flex items-center justify-center gap-2"
                >
                  {t('vsReturn')}
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
