import React, { useState, useEffect } from 'react';
import {
  Mic,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Volume2,
  ChevronRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { authAPI } from '../services/api';

interface VoiceRegistrationProps {
  onNavigate: (page: string) => void;
}

export const VoiceRegistration: React.FC<VoiceRegistrationProps> = ({ onNavigate }) => {
  const { darkMode } = useTheme();
  
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  const [profile, setProfile] = useState({
    name: '',
    language: '',
    profession: '',
    experience: '',
    location: '',
  });

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

  const steps = [
    {
      prompt: 'JeevanSetu Voice Assistant: Welcome! Please tell me your full name. [नमस्ते! कृपया अपना पूरा नाम बताएं।]',
      field: 'name',
    },
    {
      prompt: 'JeevanSetu Voice Assistant: Which languages can you speak comfortably? [आप कौन सी भाषाएं बोल सकते हैं?]',
      field: 'language',
    },
    {
      prompt: 'JeevanSetu Voice Assistant: What skills or local work do you do? [आप किस प्रकार का कार्य करते हैं?]',
      field: 'profession',
    },
    {
      prompt: 'JeevanSetu Voice Assistant: How many years of experience do you have? [आपको कितने वर्षों का अनुभव है?]',
      field: 'experience',
    },
    {
      prompt: 'JeevanSetu Voice Assistant: What is your village name or pin code? [अपने गांव का नाम या पिन कोड बताएं।]',
      field: 'location',
    },
  ];

  // Auto-advance step when speech stops and we have a transcript
  useEffect(() => {
    if (!isListening && transcript && step < steps.length) {
      const currentStepObj = steps[step];
      const updatedProfile = {
        ...profile,
        [currentStepObj.field]: transcript,
      };
      setProfile(updatedProfile);
      
      if (step + 1 === steps.length) {
        saveProfile(updatedProfile);
      }
      
      setStep((prev) => prev + 1);
      resetTranscript();
    }
  }, [isListening, transcript, step, steps, resetTranscript, profile]);

  const saveProfile = async (finalProfile: any) => {
    setIsSaving(true);
    setSaveError('');
    try {
      await authAPI.updateProfile(finalProfile);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save profile. Please ensure you are logged in.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    const updatedProfile = {
      ...profile,
      [steps[step].field]: 'Skipped (Manual Entry)',
    };
    setProfile(updatedProfile);
    
    if (step + 1 === steps.length) {
      saveProfile(updatedProfile);
    }
    
    setStep(step + 1);
    resetTranscript();
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const resetFlow = () => {
    setStep(0);
    resetTranscript();
    setSaveError('');
    setProfile({
      name: '',
      language: '',
      profession: '',
      experience: '',
      location: '',
    });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          AI Conversation Register
        </div>
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Voice-Guided Onboarding
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Create a fully verified digital employment profile simply by talking. Perfect for semi-literate or busy workers.
        </p>
      </div>

      {step < steps.length ? (
        <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-8 border border-govBlue-500/20 shadow-xl max-w-2xl mx-auto flex flex-col items-center justify-center text-center relative`}>
          
          <div className="absolute top-4 right-6 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            Question {step + 1} of {steps.length}
          </div>

          <div className="w-12 h-12 rounded-full bg-govBlue-500/10 text-govBlue-500 flex items-center justify-center mb-6">
            <Volume2 className="w-6 h-6 animate-pulse" />
          </div>

          <p className={`text-lg sm:text-xl font-medium mb-8 leading-relaxed ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            {steps[step].prompt}
          </p>

          {!isSupported ? (
            <p className="text-red-500 text-sm font-semibold mb-6">Voice recognition is not supported in this browser.</p>
          ) : (
            <div className="relative mb-6">
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-govBlue-500 to-teal-500 pulse-ring scale-150 opacity-30" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-govBlue-500 to-teal-500 pulse-ring scale-125 opacity-40" />
                </>
              )}
              <button
                onClick={handleMicClick}
                className={`w-28 h-28 rounded-full bg-gradient-to-br from-govBlue-500 to-teal-600 flex flex-col items-center justify-center text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${
                  isListening ? 'scale-105 shadow-teal-500/40' : 'hover:shadow-govBlue-500/30'
                }`}
              >
                <Mic className={`w-10 h-10 mb-1 ${isListening ? 'animate-pulse animate-bounce' : ''}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {isListening ? 'Stop' : 'Tap & Speak'}
                </span>
              </button>
            </div>
          )}

          <div className="h-10 flex items-center justify-center flex-col">
            {isListening && (
               <div className="text-xs text-teal-600 dark:text-teal-400 font-bold mb-1 animate-pulse">Listening...</div>
            )}
            {(interimTranscript || transcript) && (
              <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 italic">
                {transcript || interimTranscript}
              </p>
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-3 py-2 rounded-lg flex items-center gap-2 max-w-full">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isListening && (
            <div className="flex gap-1 justify-center mt-4">
              {[1, 2, 3, 4, 5].map((b) => (
                <div
                  key={b}
                  className="w-1 h-5 bg-teal-500 rounded-full animate-wave"
                  style={{ animationDelay: `${b * 0.1}s` }}
                />
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800 w-full flex justify-between items-center text-xs text-slate-400">
            <span>Powered by Digital India Bhashini Translation API</span>
            <button
              onClick={handleSkip}
              className="text-govBlue-500 hover:text-govBlue-600 dark:text-sky-400 font-semibold flex items-center gap-0.5"
            >
              Skip Voice (Manual Input)
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 max-w-2xl mx-auto">
          <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-8 border border-emerald-500/20 text-center flex flex-col items-center justify-center relative`}>
            
            {isSaving ? (
              <div className="py-12">
                <div className="w-12 h-12 border-4 border-govBlue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">Saving Profile...</p>
              </div>
            ) : saveError ? (
              <div className="py-8">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-red-500">Error Saving Profile</h2>
                <p className="text-sm text-slate-500 mt-2">{saveError}</p>
                <button
                  onClick={resetFlow}
                  className="mt-6 px-6 py-2 rounded-lg bg-red-500 text-white font-semibold shadow-md"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Profile Created Successfully!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Your voice responses have been compiled and saved to your digital employment profile.
                </p>

                <div className="w-full max-w-sm mt-8 p-6 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-left border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 border-b pb-2">
                    Card Data Summary
                  </h3>
                  <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Full Name:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{profile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Languages spoken:</span>
                      <span className="font-semibold">{profile.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Specialization:</span>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">{profile.profession}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Experience:</span>
                      <span className="font-semibold">{profile.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-semibold">{profile.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4 w-full">
                  <button
                    onClick={resetFlow}
                    className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Re-record Profile
                  </button>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="flex-1 py-3 rounded-xl bg-govBlue-500 hover:bg-govBlue-600 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center max-w-3xl mx-auto pt-6">
        <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-4 border border-slate-200/50 dark:border-slate-800`}>
          <ShieldCheck className="w-6 h-6 text-teal-500 mx-auto mb-2" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">No Typing Required</h4>
          <p className="text-xs text-slate-500 mt-1">Complete profile verification in local dialects via interactive voice prompt answers.</p>
        </div>
        <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-4 border border-slate-200/50 dark:border-slate-800`}>
          <UserCheck className="w-6 h-6 text-teal-500 mx-auto mb-2" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Aadhaar Linked</h4>
          <p className="text-xs text-slate-500 mt-1">Verify identity instantly with OTP voice simulation matching. One profile per user.</p>
        </div>
        <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-4 border border-slate-200/50 dark:border-slate-800`}>
          <CheckCircle2 className="w-6 h-6 text-teal-500 mx-auto mb-2" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Job Matching</h4>
          <p className="text-xs text-slate-500 mt-1">AI decodes audio responses to automatically match skills with nearby verified job posts.</p>
        </div>
      </div>

    </section>
  );
};
export default VoiceRegistration;
