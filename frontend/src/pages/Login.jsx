import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // Prevent and Stop
    e.preventDefault();
    e.stopPropagation();

    // 1. handleLogin əvvəlində log
    console.log("LOGIN SUBMIT CLICKED");
    console.log("PAYLOAD:", { email, password });

    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });
      
      console.log("LOGIN SUCCESS! Navigating to home...");
      navigate("/");

    } catch (error) {
      // Texniki xətanı console-da saxlayırıq
      console.error("Login error:", error.response?.data || error.message);

      const status = error.response?.status;
      const backendMsg = error.response?.data?.message || "";
      
      let displayMsg = "Server ilə əlaqə qurmaq mümkün olmadı.";

      if (status === 401 || backendMsg.includes("Bad credentials")) {
        displayMsg = "Email və ya şifrə yanlışdır.";
      } else if (status === 403) {
        displayMsg = "Hesaba giriş icazəsi yoxdur.";
      }

      setError(displayMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a0505]">
      <div className="w-full max-w-md space-y-8 glass-card p-10 relative overflow-hidden">
        
        {/* 4. JSX-də sabit debug paneli */}
        {error && (
          <div style={{ 
            background: "red", 
            color: "white", 
            padding: "16px", 
            marginBottom: "20px", 
            borderRadius: "12px",
            fontWeight: "bold",
            border: "2px solid white",
            zIndex: 9999,
            position: "relative"
          }}>
            XƏTA: {error}
          </div>
        )}

        <div className="relative text-center space-y-2">
          <div className="w-16 h-16 bg-primary-accent rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl">
            <LogIn size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Xoş Gəlmisiniz</h2>
          <p className="text-gray-400">Hesabınıza daxil olun</p>
        </div>

        <form onSubmit={handleLogin} className="relative space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nümunə@mail.com"
                  className="w-full bg-glass-bg border border-glass-border rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary-accent transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Şifrə</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-glass-bg border border-glass-border rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary-accent transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-glass-border bg-glass-bg text-primary-accent focus:ring-primary-accent" />
              <span className="text-gray-400 group-hover:text-gray-300 font-medium transition-colors">Məni xatırla</span>
            </label>
            <Link to="/forgot-password" size={18} className="text-primary-accent hover:text-primary-light transition-colors font-bold">
              Şifrəni unutmusunuz?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-accent hover:bg-primary-light text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Daxil Ol'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm">
          Hesabınız yoxdur?{' '}
          <Link to="/register" className="text-primary-accent font-black hover:underline">
            Qeydiyyatdan keçin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
