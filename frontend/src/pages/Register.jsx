import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';
import { validators, mapBackendErrors } from '../utils/validators';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name] || errors.form) {
        setErrors(prev => ({...prev, [name]: null, form: null}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Frontend Validation
    const validationErrors = validators.register(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      const backendError = err.response?.data;
      console.log("Register error response:", backendError);
      
      // Problem 3: 409 Conflict və ya digər xətaların UI-da göstərilməsi
      if (err.response?.status === 409) {
          setErrors({ form: backendError.message || "Bu məlumat artıq sistemdə istifadə olunur." });
      } else {
          const fieldErrors = mapBackendErrors(backendError);
          setErrors(fieldErrors);
          if (!Object.keys(fieldErrors).length) {
              setErrors({ form: "Qeydiyyat zamanı xəta baş verdi." });
          }
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-card p-10 text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto flex items-center justify-center">
            <UserPlus size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold">Qeydiyyat Uğurludur!</h2>
          <p className="text-gray-400 font-medium">
            Zəhmət olmasa email ünvanınızı yoxlayın və hesabınızı təsdiqləyin. 
            5 saniyə sonra giriş səhifəsinə yönləndiriləcəksiniz.
          </p>
          <Link to="/login" className="block text-primary-accent font-bold hover:underline">
            İndi daxil ol
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8 glass-card p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-accent/20 blur-3xl rounded-full"></div>
        
        <div className="relative text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Yeni Hesab Yaradın</h2>
          <p className="text-gray-400">MasterFix ailəsinə qoşulun</p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-6">
          {/* Main Error Alert (for 409 Conflict etc) */}
          {errors.form && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-in shake duration-300">
              <AlertCircle size={18} />
              <span className="font-bold">{errors.form}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Ad</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.firstName ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Adınız"
                  className={`w-full bg-glass-bg border ${errors.firstName ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-accent transition-all`}
                />
              </div>
              {errors.firstName && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Soyad</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.lastName ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Soyadınız"
                  className={`w-full bg-glass-bg border ${errors.lastName ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-accent transition-all`}
                />
              </div>
              {errors.lastName && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.lastName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">İstifadəçi adı</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.userName ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                <input
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="username"
                  className={`w-full bg-glass-bg border ${errors.userName ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-accent transition-all`}
                />
              </div>
              {errors.userName && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.userName}</p>}
            </div>

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
                  className={`w-full bg-glass-bg border ${errors.email ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-accent transition-all`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Telefon</label>
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.phone ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+99450XXXXXXX"
                  className={`w-full bg-glass-bg border ${errors.phone ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-accent transition-all`}
                />
              </div>
              {errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.phone}</p>}
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
                  placeholder="minimum 8 simvol"
                  className={`w-full bg-glass-bg border ${errors.password ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-accent transition-all`}
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.password}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-accent hover:bg-primary-light text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 shadow-lg shadow-primary-accent/20 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="animate-spin" size={20} /> Göndərilir...</> : 'Qeydiyyatdan Keç'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm">
          Artıq hesabınız var?{' '}
          <Link to="/login" className="text-primary-accent font-bold hover:underline">
            Daxil olun
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
