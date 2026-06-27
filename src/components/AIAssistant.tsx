import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Mic, MicOff, Send, Bot, User, RefreshCw, AlertCircle, Volume2, Trash2 } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTheme } from '../context/ThemeContext';
import { chatAPI } from '../services/api';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  isVoice?: boolean;
}

export const AIAssistant: React.FC = () => {
  const { darkMode, language, t } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'Namaste! 🙏 I am your JeevanSetu AI Assistant. You can type or use your voice to ask me about jobs, agriculture, or verification.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    transcript, interimTranscript, isListening, error,
    startListening, stopListening, resetTranscript, isSupported, retry,
  } = useSpeechRecognition(language);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript, isAiTyping]);

  useEffect(() => {
    if (transcript) setInputValue(transcript);
  }, [transcript]);

  useEffect(() => {
    if (!isListening && transcript) {
      const text = transcript.trim();
      if (text) { sendMessage(text, true); resetTranscript(); setInputValue(''); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const sendMessage = async (text?: string, isVoice = false) => {
    const msg = (text || inputValue).trim();
    if (!msg) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, text: msg, sender: 'user', timestamp: new Date(), isVoice };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    resetTranscript();
    setIsAiTyping(true);

    try {
      const data = await chatAPI.sendMessage(msg, isVoice);
      const aiMsg: ChatMessage = { id: data.aiMessage.id, text: data.aiMessage.text, sender: 'ai', timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, text: err.message || 'Failed to get response.', sender: 'system', timestamp: new Date() }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } };
  const toggleMic = () => { isListening ? stopListening() : startListening(language); };

  return (
    <>
      <button onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${isOpen ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'} bg-gradient-to-r from-govBlue-500 to-teal-500 text-white`}
        aria-label="Open AI Assistant">
        <Bot className="w-7 h-7" />
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
      </button>

      <div className={`fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] sm:w-[400px] h-[520px] max-h-[calc(100vh-100px)] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'} ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'}`}>

        {/* Header */}
        <div className="bg-gradient-to-r from-govBlue-600 to-teal-600 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Bot className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-sm">JeevanSetu AI ({language.toUpperCase()})</h3>
              <p className="text-[10px] text-teal-100 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Online • Voice Enabled</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Messages */}
        <div className={`flex-1 p-4 overflow-y-auto space-y-3 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.sender === 'user' ? 'bg-govBlue-500 text-white rounded-br-sm'
                : msg.sender === 'system' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-bl-sm border border-amber-200 dark:border-amber-800'
                : darkMode ? 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700' : 'bg-white text-slate-700 rounded-bl-sm border border-slate-200 shadow-sm'
              }`}>
                {msg.isVoice && msg.sender === 'user' && <span className="inline-flex items-center gap-1 text-[10px] text-blue-200 mb-1"><Volume2 className="w-3 h-3" /> Voice</span>}
                <p className="whitespace-pre-line">{msg.text}</p>
                <p className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isListening && interimTranscript && (
            <div className="flex justify-end"><div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm bg-govBlue-500/40 text-white rounded-br-sm animate-pulse italic">{interimTranscript}</div></div>
          )}
          {isAiTyping && (
            <div className="flex justify-start">
              <div className={`rounded-2xl px-4 py-3 rounded-bl-sm ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 shadow-sm'}`}>
                <div className="flex gap-1.5">{[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}</div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center my-2">
              <div className={`text-xs px-4 py-3 rounded-xl flex flex-col items-center gap-2 max-w-[90%] ${darkMode ? 'bg-red-900/30 text-red-400 border border-red-800/50' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>
                <button onClick={retry} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${darkMode ? 'bg-red-800/50 hover:bg-red-700/50 text-red-300' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}>
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {isListening && (
          <div className="absolute bottom-[72px] inset-x-0 flex justify-center pointer-events-none z-10">
            <div className="bg-teal-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
              <Mic className="w-3 h-3" /> {t('listening')}
              <div className="flex gap-0.5 ml-1">{[1,2,3,4,5].map(i => <div key={i} className="w-0.5 h-3 bg-white rounded-full animate-wave" style={{animationDelay:`${i*0.1}s`}} />)}</div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className={`p-3 border-t shrink-0 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <input type="text" value={isListening ? (interimTranscript || transcript || '') : inputValue}
                onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={isListening ? t('listening') : t('typeYourMessage')} readOnly={isListening}
                className={`w-full rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-govBlue-500 transition-all ${darkMode ? 'bg-slate-800 text-white placeholder-slate-500' : 'bg-slate-100 text-slate-900 placeholder-slate-400'} ${isListening ? 'ring-2 ring-teal-500 bg-teal-500/5' : ''}`}
              />
              <button type="button" onClick={toggleMic} disabled={!isSupported}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${!isSupported ? 'text-slate-300 cursor-not-allowed' : isListening ? 'bg-red-500 text-white shadow-md hover:bg-red-600' : darkMode ? 'text-slate-400 hover:text-teal-400 hover:bg-slate-700' : 'text-slate-400 hover:text-teal-500 hover:bg-slate-200'}`}>
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={() => sendMessage()} disabled={(!inputValue.trim() && !transcript.trim()) || isListening}
              className={`p-2.5 rounded-full flex items-center justify-center transition-all ${(!inputValue.trim() && !transcript.trim()) || isListening ? darkMode ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-govBlue-500 hover:bg-govBlue-600 text-white shadow-md'}`}>
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
