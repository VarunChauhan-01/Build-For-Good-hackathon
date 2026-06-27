import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { authAPI, setToken, setStoredUser } from '../services/api';
import { X, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { darkMode } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let res;
      if (isLogin) {
        res = await authAPI.login({ email: formData.email, password: formData.password });
      } else {
        res = await authAPI.register(formData);
      }
      
      setToken(res.token);
      setStoredUser(res.user);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
        <button onClick={onClose} className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
          <X className="w-5 h-5" />
        </button>

        <h2 className={`text-2xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-govBlue-500 focus:outline-none ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email" name="email" required value={formData.email} onChange={handleChange}
                className={`w-full pl-9 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-govBlue-500 focus:outline-none ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-govBlue-500 focus:outline-none ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password" name="password" required value={formData.password} onChange={handleChange} minLength={6}
                className={`w-full pl-9 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-govBlue-500 focus:outline-none ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-govBlue-500 hover:bg-govBlue-600 text-white font-semibold shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Processing...' : isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-govBlue-500 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};
export default AuthModal;
