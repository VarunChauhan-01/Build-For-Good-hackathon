import React, { useState, useEffect } from 'react';
import {
  Search,
  Mic,
  MapPin,
  Clock,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { jobsAPI } from '../services/api';

interface JobSearchProps {
  onNavigate: (page: string) => void;
}

export const JobSearch: React.FC<JobSearchProps> = () => {
  const { darkMode, t } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyVerified, setOnlyVerified] = useState(false);
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [voiceContext, setVoiceContext] = useState<'search' | 'apply' | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  const {
    transcript,
    interimTranscript,
    isListening,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const categories = [t('catAll'), t('catAgriculture'), t('catCarpenter'), t('catPainter'), t('catElectrician'), t('catPlumber'), t('catDriver'), t('catDailyWage')];

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [searchQuery, selectedCategory, onlyVerified]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getJobs({
        search: searchQuery,
        category: selectedCategory,
        verified: onlyVerified ? 'true' : undefined
      });
      setJobs(res.jobs);
    } catch (err: any) {
      setErrorMsg(err.message || t('jsFailedToFetch'));
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await jobsAPI.getApplications();
      setAppliedJobs(res.applications.map((app: any) => app.job_id));
    } catch {
      // Ignore auth errors if not logged in
    }
  };

  const handleApply = async (jobId: number, method: string, voice_transcript: string = '') => {
    try {
      await jobsAPI.applyToJob(jobId, { method, voice_transcript });
      setAppliedJobs(prev => [...prev, jobId]);
    } catch (err: any) {
      alert(err.message || t('jsFailedToApply'));
    }
  };

  // Handle auto-stop for voice contexts
  useEffect(() => {
    if (!isListening && transcript) {
      if (voiceContext === 'search') {
        setSearchQuery(transcript);
        // Basic mapping for categories if mentioned
        categories.forEach(cat => {
          if (transcript.toLowerCase().includes(cat.toLowerCase()) && cat !== 'All') {
            setSelectedCategory(cat);
          }
        });
      } else if (voiceContext === 'apply' && applyingJobId !== null) {
        handleApply(applyingJobId, 'voice', transcript);
        setApplyingJobId(null);
      }
      setVoiceContext(null);
      resetTranscript();
    }
  }, [isListening, transcript, voiceContext, applyingJobId, categories, resetTranscript]);

  const handleVoiceSearchToggle = () => {
    if (isListening && voiceContext === 'search') {
      stopListening();
    } else {
      setVoiceContext('search');
      setApplyingJobId(null);
      startListening();
    }
  };

  const handleVoiceApplyToggle = (jobId: number) => {
    if (isListening && voiceContext === 'apply' && applyingJobId === jobId) {
      stopListening();
    } else {
      setVoiceContext('apply');
      setApplyingJobId(jobId);
      startListening();
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-6">
        <div>
          <h1 className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {t('jsExplore')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t('jsExploreDesc')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <UserCheck className="w-3.5 h-3.5" />
            {t('jsAadhaarInspected')}
          </span>
        </div>
      </div>

      {/* Search and Filters Box */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 space-y-4 border border-slate-200/50 dark:border-slate-800`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t('jsSearchPlaceholder')}
              value={isListening && voiceContext === 'search' ? (interimTranscript || transcript || t('jsListening')) : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-11 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-govBlue-500 ${
                darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
              } ${isListening && voiceContext === 'search' ? 'border-teal-500 ring-1 ring-teal-500' : ''}`}
            />
            <button
              onClick={handleVoiceSearchToggle}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isListening && voiceContext === 'search' ? 'bg-teal-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Mic className={`w-5 h-5 ${isListening && voiceContext === 'search' ? 'animate-bounce' : ''}`} />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-4 py-3 rounded-xl border font-semibold text-sm flex items-center gap-2 transition-all ${
                onlyVerified
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Verified Employers Only
            </button>
          </div>
        </div>
        
        {voiceError && voiceContext === 'search' && (
          <p className="text-red-500 text-xs mt-1">{voiceError}</p>
        )}

        {/* Categories Carousel */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-govBlue-500 text-white shadow-md'
                  : darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Job Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400">{t('jsLoadingJobs')}</div>
        ) : errorMsg ? (
          <div className="col-span-full text-center py-12 text-red-500">{errorMsg}</div>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.id}
              className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border flex flex-col justify-between hover:shadow-xl hover:border-govBlue-500/20 transition-all ${
                job.verified ? 'border-slate-200/50 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase">
                    {job.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('jsEmployerTrust')}</span>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">{job.trust_score}%</span>
                  </div>
                </div>

                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{job.title}</h3>
                
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('jsEmployer')}: <span className="font-bold">{job.employer}</span></p>
                  {job.verified === 1 && (
                    <span className="inline-flex items-center text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.2 rounded border border-emerald-500/20">
                      <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                      {t('jsGovtOk')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-5 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{job.pay}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{job.distance} {t('jsAway')}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{job.location} • {job.date}</span>
                  </div>
                </div>
              </div>

              {/* Application CTA */}
              <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-3">
                {appliedJobs.includes(job.id) ? (
                  <button className="flex-1 py-2.5 rounded-lg bg-emerald-500 text-white font-bold text-sm cursor-default flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    {t('jsAppSubmitted')}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleVoiceApplyToggle(job.id)}
                      className={`flex-1 py-2.5 rounded-lg hover:shadow-lg text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 group ${
                        isListening && voiceContext === 'apply' && applyingJobId === job.id
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                          : 'bg-gradient-to-r from-govBlue-500 to-teal-600'
                      }`}
                    >
                      <Mic className={`w-4 h-4 ${isListening && voiceContext === 'apply' && applyingJobId === job.id ? 'animate-bounce' : ''}`} />
                      {isListening && voiceContext === 'apply' && applyingJobId === job.id ? t('jsStopRecording') : t('jsApplyVoice')}
                    </button>
                    <button
                      onClick={() => handleApply(job.id, 'manual')}
                      className={`px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors ${
                        darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      {t('jsApplyManual')}
                    </button>
                  </>
                )}
              </div>

              {/* Voice Apply Modal Overlay Simulation Inside Card */}
              {applyingJobId === job.id && voiceContext === 'apply' && (
                <div className="mt-3 p-3 rounded-lg bg-teal-500/10 border border-teal-500/35 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5 text-center">
                    {voiceError ? (
                      <span className="text-xs font-semibold text-red-500">{voiceError}</span>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse shrink-0" />
                        <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 italic">
                          {interimTranscript || transcript || t('jsSayToApply')}
                        </span>
                      </>
                    )}
                  </div>
                  {isListening && !voiceError && (
                    <div className="flex gap-0.5 justify-center mt-1">
                      {[1, 2, 3, 4].map((b) => (
                        <div key={b} className="w-0.5 h-3 bg-teal-500 rounded-full animate-wave" style={{ animationDelay: `${b * 0.1}s` }} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            {t('jsNoJobsFound')}
          </div>
        )}
      </div>

    </section>
  );
};
export default JobSearch;
