import React, { useState } from 'react';
import { Hexagon, Loader2, ArrowRight, Mail, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError("Please enter your credentials.");
        return;
    }
    
    setLoading(true);
    setError('');

    // Simulate Node.js Auth API call
    setTimeout(() => {
        if (email.includes('@')) {
            localStorage.setItem('kaa_token', 'jwt_mock_token_' + Date.now());
            onLogin();
        } else {
            setError("Invalid email format. Please try again.");
            setLoading(false);
        }
    }, 1500);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 flex items-stretch overflow-hidden">
      
      {/* Left Panel - Brand Visual (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
            <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
            <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-lg text-white">
             <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-8 animate-fade-in-up">
                <Hexagon className="w-8 h-8 text-white fill-white/20" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                Intelligent CRM for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Modern Sales.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                Manage leads, close deals, and automate your pipeline with the power of Gemini AI. 
                Seamlessly synced across web and mobile.
            </p>
            
            <div className="space-y-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <FeatureItem text="AI-Powered Lead Scoring" />
                <FeatureItem text="Real-time Pipeline Analytics" />
                <FeatureItem text="Voice Grounding" />
            </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-white lg:bg-transparent">
         <div className="absolute inset-0 bg-white/50 backdrop-blur-3xl lg:hidden z-0"></div>
         {/* Mobile bg blobs */}
         <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl lg:hidden"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl lg:hidden"></div>

         <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 border border-white relative z-10 animate-fade-in-up">
            <div className="mb-8 text-center lg:text-left">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 mx-auto lg:mx-0 lg:hidden">
                    <Hexagon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Welcome to KAA</h2>
                <p className="text-slate-500 mt-2">Enter your credentials to access your workspace.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@kaa.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                        <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Forgot?</a>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-fade-in-up">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        {error}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-[15px] shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure End-to-End Encryption</span>
                </div>
                <p className="text-sm text-slate-500">
                    Don't have an account? <a href="#" className="font-bold text-indigo-600 hover:text-indigo-700">Contact Sales</a>
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
        </div>
        <span className="text-slate-300 font-medium">{text}</span>
    </div>
);

export default LoginView;