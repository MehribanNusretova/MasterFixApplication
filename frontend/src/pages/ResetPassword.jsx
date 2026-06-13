import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, Loader2, Save, ArrowLeft } from 'lucide-react';
import apiService from '../api/apiService';
import { validators, mapBackendErrors } from '../utils/validators';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
        setErrors({ form: 'Token tapılmadı. Zəhmət olmasa emailinizdəki linkə yenidən daxil olun.' });
        return;
    }

    // Frontend Validation
    const vErrors = validators.resetPassword(formData);
    if (Object.keys(vErrors).length > 0) {
      setErrors(vErrors);
      return;
    }

    setLoading(true);

    try {
      await apiService.resetPassword({
        token: token,
        newPassword: formData.newPassword
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const backendErrors = mapBackendErrors(err.response?.data);
      setErrors(backendErrors);
      if (!Object.keys(backendErrors).length) {
        setErrors({ form: err.response?.data?.message || 'Xəta baş verdi. Tokenin vaxtı bitmiş ola bilər.' });
      }
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
          <h2 className="text-3xl font-bold text-white">Şifrə Yeniləndi!</h2>
          <p className="text-gray-400 font-medium">
            Yeni şifrəniz uğurla yadda saxlanıldı. 3 saniyə sonra giriş səhifəsinə yönləndiriləcəksiniz.
          </p>
          <Link to="/login" className="block text-primary-accent font-bold hover:underline">
            İndi daxil ol
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a0505]">
      <div className="w-full max-w-md space-y-8 glass-card p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-accent/20 blur-3xl rounded-full"></div>

        <div className="relative text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white text-center">Yeni Şifrə Təyin Edin</h2>
          <p className="text-gray-400 font-medium px-4">Təhlükəsizliyiniz üçün güclü bir şifrə seçin.</p>
        </div>

        {!token ? (
            <div className="bg-red-950/50 border border-red-500 text-red-300 p-6 rounded-2xl text-center space-y-4">
                <AlertCircle size={40} className="mx-auto" />
                <p className="font-bold">Keçərsiz və ya əksik token!</p>
                <Link to="/forgot-password" size={18} className="block bg-primary-accent text-white py-3 rounded-xl font-bold">Yeni link al</Link>
            </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative space-y-6">
            {errors.form && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-in shake">
                <AlertCircle size={18} />
                <span className="font-bold">{errors.form}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Yeni Şifrə</label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.newPassword ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => {
                      setFormData({...formData, newPassword: e.target.value});
                      if (errors.newPassword || errors.form) setErrors({});
                    }}
                    placeholder="••••••••"
                    className={`w-full bg-glass-bg border ${errors.newPassword ? 'border-red-500' : 'border-glass-border'} rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-accent transition-all font-medium`}
                  />
                </div>
                {errors.newPassword && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.newPassword}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Şifrənin Təkrarı</label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.confirmPassword ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({...formData, confirmPassword: e.target.value});
                      if (errors.confirmPassword || errors.form) setErrors({});
                    }}
                    placeholder="••••••••"
                    className={`w-full bg-glass-bg border ${errors.confirmPassword ? 'border-red-500' : 'border-glass-border'} rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-accent transition-all font-medium`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-accent hover:bg-primary-light text-white py-5 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <><Loader2 className="animate-spin" size={20} /> Göndərilir...</> : <><Save size={20} /> Şifrəni Yenilə</>}
            </button>
          </form>
        )}

        <Link to="/login" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-bold group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Giriş səhifəsinə qayıt
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
