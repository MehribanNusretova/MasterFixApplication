import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import apiService from '../api/apiService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Xəta baş verdi. Zəhmət olmasa emailinizi yoxlayın.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a0505]">
        <div className="w-full max-w-md glass-card p-10 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white">Email Göndərildi!</h2>
          <p className="text-gray-400 font-medium">
            Şifrə yeniləmə linki <b>{email}</b> ünvanına göndərildi. Zəhmət olmasa emailinizi yoxlayın.
          </p>
          <Link to="/login" className="flex items-center justify-center gap-2 text-primary-accent font-bold hover:underline">
            <ArrowLeft size={18} /> Giriş səhifəsinə qayıt
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a0505]">
      <div className="w-full max-w-md space-y-8 glass-card p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-accent/10 blur-3xl rounded-full"></div>

        <div className="relative text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white text-center">Şifrəni unutmusunuz?</h2>
          <p className="text-gray-400 font-medium px-4">Email ünvanınızı daxil edin, sizə bərpa linki göndərək.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-6">
          {error && (
            <div className="bg-red-950/50 border border-red-500 text-red-300 p-4 rounded-xl flex items-center gap-3 text-sm animate-in shake">
              <AlertCircle size={18} />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nümunə@mail.com"
                className="w-full bg-glass-bg border border-glass-border rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-accent transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-accent hover:bg-primary-light text-white py-5 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            Linki Göndər
          </button>
        </form>

        <Link to="/login" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-bold group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Geri qayıt
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
