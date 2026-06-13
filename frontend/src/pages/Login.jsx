import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { validators, mapBackendErrors } from '../utils/validators';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors(prev => ({ ...prev, [name]: null, form: null }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Frontend Validation
    const validationErrors = validators.login(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      const status = error.response?.status;
      const backendData = error.response?.data;
      
      if (status === 401 || backendData?.message?.includes("Bad credentials")) {
        setErrors({ form: "Email və ya şifrə yanlışdır." });
      } else if (status === 403) {
        setErrors({ form: "Hesaba giriş icazəsi yoxdur (Email təsdiqlənməyib)." });
      } else {
        const fieldErrors = mapBackendErrors(backendData);
        setErrors(fieldErrors);
        if (!Object.keys(fieldErrors).length) {
          setErrors({ form: backendData?.message || "Daxil olarkən xəta baş verdi." });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 glass-card p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-accent/10 blur-3xl rounded-full"></div>

        <div className="relative text-center space-y-2">
          <div className="w-16 h-16 bg-primary-accent rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl">
            <LogIn size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Xoş Gəlmisiniz</h2>
          <p className="text-gray-400 font-medium">Hesabınıza daxil olun</p>
        </div>

        <form onSubmit={handleLogin} className="relative space-y-6">
          {errors.form && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-in shake duration-300">
              <AlertCircle size={18} />
              <span className="font-bold">{errors.form}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nümunə@mail.com"
                  className={`w-full bg-glass-bg border ${errors.email ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary-accent transition-all font-medium`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Şifrə</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.password ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-glass-bg border ${errors.password ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary-accent transition-all font-medium`}
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.password}</p>}
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
            className="w-full bg-primary-accent hover:bg-primary-light text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <><Loader2 className="animate-spin" size={20} /> Göndərilir...</> : 'Daxil Ol'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm font-medium">
          Hesabınız yoxdur?{' '}
          <Link to="/register" className="text-primary-accent font-black hover:underline transition-all">
            Qeydiyyatdan keçin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
