import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../api/apiService';
import { 
  User, Phone, Wrench, MapPin, Briefcase, Camera, Save, Award,
  CheckCircle2, AlertCircle, Loader2, Settings, Shield, X, ArrowRight, DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { validators, mapBackendErrors } from '../utils/validators';

const CATEGORY_EMOJIS = {
  'Elektrik': '⚡', 'Santexnik': '🚿', 'Kondisioner': '❄️', 'Kompüter': '💻',
  'Mebel': '🪑', 'Rəngsaz': '🎨', 'Təmizlik': '🧹', 'Kombi': '🔥'
};

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Loading States
  const [initialLoading, setInitialLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [masterSaving, setMasterSaving] = useState(false);

  // Form States
  const [profileForm, setProfileForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', profileImageUrl: ''
  });

  const [masterForm, setMasterForm] = useState({
    categoryId: '', description: '', experienceYear: '', city: 'Bakı', address: '', priceFrom: '', priceTo: ''
  });

  const [categories, setCategories] = useState([]);
  const [isMaster, setIsMaster] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [userErrors, setUserErrors] = useState({});
  const [masterErrors, setMasterErrors] = useState({});

  const loadAllData = useCallback(async () => {
    try {
      const [userRes, catRes] = await Promise.all([
        apiService.getMyProfile(),
        apiService.getCategories()
      ]);

      const userData = userRes.data;
      
      // Merge with localStorage if needed to keep profileImageUrl if it's there
      const cached = JSON.parse(localStorage.getItem("user") || "{}");
      const mergedData = { ...userData, ...cached, ...userData }; 
      
      setProfileForm(mergedData);
      setIsMaster(userData.role === 'MASTER');
      localStorage.setItem("user", JSON.stringify(mergedData));

      // Handle real categories only. No fake IDs for registration.
      let apiCats = [];
      if (Array.isArray(catRes.data)) apiCats = catRes.data;
      else if (catRes.data?.content) apiCats = catRes.data.content;
      
      setCategories(apiCats);
    } catch (error) {
      console.error("Profile load error:", error);
      const cached = localStorage.getItem("user");
      if (cached) setProfileForm(JSON.parse(cached));
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Şəkil maksimum 5MB ola bilər' });
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!selectedImage) return;
    
    setProfileSaving(true);
    const formData = new FormData();
    formData.append('image', selectedImage);
    
    const url = "/masters/me/profile-image";
    console.log("PROFILE IMAGE UPLOAD URL:", url);

    try {
      const res = await apiService.uploadMasterImage(formData);
      // Backend response can have profileImageUrl or imageUrl
      const newImgUrl = res.data.profileImageUrl || res.data.imageUrl || res.data.avatarUrl;
      
      if (newImgUrl) {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...stored, profileImageUrl: newImgUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setProfileForm(prev => ({ ...prev, profileImageUrl: newImgUrl }));
        setMessage({ type: 'success', text: 'Profil şəkli uğurla yeniləndi' });
        setImagePreview(null);
        setSelectedImage(null);
      } else {
        setMessage({ type: 'error', text: 'Şəkil yükləndi, amma backend şəkil linki qaytarmadı.' });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setMessage({ type: 'error', text: 'Şəkil yüklənərkən xəta baş verdi' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUserErrors({});
    const vErrors = validators.updateUser(profileForm);
    if (Object.keys(vErrors).length > 0) {
      setUserErrors(vErrors);
      return;
    }

    setProfileSaving(true);
    try {
      await apiService.updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone
      });

      setMessage({ type: 'success', text: 'Profil məlumatları yeniləndi' });
      loadAllData();
    } catch (err) {
      setUserErrors(mapBackendErrors(err.response?.data));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleBecomeMaster = async (e) => {
    e.preventDefault();
    setMasterErrors({});
    setMessage({ type: '', text: '' });

    if (!masterForm.categoryId) {
      setMasterErrors({ categoryId: "İxtisas seçilməlidir" });
      return;
    }

    const vErrors = validators.master(masterForm);
    if (Object.keys(vErrors).length > 0) {
      setMasterErrors(vErrors);
      return;
    }

    setMasterSaving(true);
    const payload = {
      categoryId: Number(masterForm.categoryId),
      description: masterForm.description,
      experienceYear: Number(masterForm.experienceYear),
      city: masterForm.city,
      address: masterForm.address,
      priceFrom: Number(masterForm.priceFrom),
      priceTo: Number(masterForm.priceTo) || (Number(masterForm.priceFrom) + 50)
    };

    try {
      await apiService.createMaster(payload);
      setMessage({ type: 'success', text: 'Usta profili yaradıldı' });
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({...stored, role: 'MASTER'}));
      localStorage.setItem("userRole", "MASTER");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error("Master registration error:", err);
      // User-friendly error mapping
      let errorText = "Usta profili yaradılmadı";
      const status = err.response?.status;
      const backendMessage = err.response?.data?.message;

      if (status === 404 && backendMessage?.includes("Category")) {
          errorText = "Seçilmiş xidmət sahəsi tapılmadı. Zəhmət olmasa başqa ixtisas seçin.";
      } else if (backendMessage) {
          errorText = backendMessage;
      }
      
      setMessage({ type: 'error', text: errorText });
      setMasterErrors(mapBackendErrors(err.response?.data));
    } finally {
      setMasterSaving(false);
    }
  };

  if (initialLoading && !profileForm.email) {
    return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-primary-accent" size={48} /></div>;
  }

  const getEmoji = (name) => {
    if (!name) return '🛠️';
    const entry = Object.entries(CATEGORY_EMOJIS).find(([k]) => name.includes(k));
    return entry ? entry[1] : '🛠️';
  };

  const avatarUrl = imagePreview || (profileForm.profileImageUrl ? (profileForm.profileImageUrl.startsWith('http') ? profileForm.profileImageUrl : `/api${profileForm.profileImageUrl}`) : 'https://cdn-icons-png.flaticon.com/512/149/149071.png');

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Profil</h1>
        <button onClick={logout} className="px-5 py-2 rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Çıxış Et</button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 shadow-lg ${
          message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="space-y-6">
          <div className="glass-card p-8 text-center space-y-6 relative overflow-hidden border-glass-border">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-accent/10 blur-2xl rounded-full"></div>
            
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-3xl bg-glass-hover border-2 border-glass-border overflow-hidden shadow-inner flex items-center justify-center">
                <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
              </div>
              {isMaster && (
                <label className="absolute -bottom-2 -right-2 p-2 bg-primary-accent text-white rounded-xl cursor-pointer shadow-lg border-4 border-[#1a0505] hover:bg-primary-light transition-all">
                  <Camera size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                </label>
              )}
            </div>

            <div className="space-y-2">
              {isMaster && !selectedImage && (
                <label className="block w-full py-2.5 bg-glass-hover hover:bg-glass-border text-gray-300 rounded-xl font-bold cursor-pointer transition-all text-xs border border-glass-border">
                  Profil şəklini dəyiş
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                </label>
              )}

              {selectedImage && (
                <div className="flex gap-2 animate-in zoom-in-95">
                  <button 
                    onClick={handleUploadImage}
                    disabled={profileSaving}
                    className="flex-1 py-2.5 bg-primary-accent hover:bg-primary-light text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-primary-accent/20"
                  >
                    {profileSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                    Saxla
                  </button>
                  <button 
                    onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                    className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">{profileForm.firstName} {profileForm.lastName}</h3>
              <p className="text-sm text-gray-400 font-medium">{profileForm.email}</p>
            </div>

            <div className="pt-6 border-t border-glass-border flex flex-col gap-3 text-left">
               <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="p-2 bg-primary-accent/10 rounded-lg text-primary-accent border border-primary-accent/10"><Phone size={16} /></div>
                <span className="font-medium text-gray-300">{profileForm.phone || 'Nömrə yoxdur'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="p-2 bg-primary-accent/10 rounded-lg text-primary-accent border border-primary-accent/10"><Shield size={16} /></div>
                <span className="font-bold text-xs uppercase">{isMaster ? 'Usta' : 'Müştəri'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Info */}
          <section className="glass-card p-8 space-y-6 border-glass-border shadow-lg">
            <h2 className="text-lg font-bold flex items-center gap-3 text-white">
              <div className="p-2 bg-primary-accent/10 rounded-xl text-primary-accent border border-primary-accent/20"><Settings size={20} /></div>
              Şəxsi Məlumatlar
            </h2>
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1">Ad</label>
                <input type="text" className={`w-full bg-glass-bg border ${userErrors.firstName ? 'border-red-500' : 'border-glass-border'} rounded-xl p-3 outline-none focus:border-primary-accent text-white font-medium`} value={profileForm.firstName} onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})} />
                {userErrors.firstName && <p className="text-[10px] text-red-500 font-bold ml-1">{userErrors.firstName}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1">Soyad</label>
                <input type="text" className={`w-full bg-glass-bg border ${userErrors.lastName ? 'border-red-500' : 'border-glass-border'} rounded-xl p-3 outline-none focus:border-primary-accent text-white font-medium`} value={profileForm.lastName} onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})} />
                {userErrors.lastName && <p className="text-[10px] text-red-500 font-bold ml-1">{userErrors.lastName}</p>}
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 ml-1">Telefon</label>
                <input type="text" className={`w-full bg-glass-bg border ${userErrors.phone ? 'border-red-500' : 'border-glass-border'} rounded-xl p-3 outline-none focus:border-primary-accent text-white font-medium`} value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} />
                {userErrors.phone && <p className="text-[10px] text-red-500 font-bold ml-1">{userErrors.phone}</p>}
              </div>
              <button type="submit" disabled={profileSaving} className="md:col-span-2 bg-primary-accent hover:bg-primary-light text-white py-4 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2">
                {profileSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Dəyişiklikləri Saxla
              </button>
            </form>
          </section>

          {/* Master Section */}
          {!isMaster ? (
            <section className="glass-card p-8 space-y-6 border-glass-border shadow-lg">
              <h2 className="text-lg font-bold flex items-center gap-3 text-white">
                <div className="p-2 bg-primary-accent/10 rounded-xl text-primary-accent border border-primary-accent/20"><Wrench size={20} /></div>
                Usta olaraq qeydiyyatdan keç
              </h2>
              <form onSubmit={handleBecomeMaster} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Xidmət Sahəsi</label>
                    <select 
                      required 
                      disabled={categories.length === 0}
                      className={`w-full bg-glass-bg border ${masterErrors.categoryId ? 'border-red-500' : 'border-glass-border'} rounded-xl p-3 outline-none focus:border-primary-accent text-white font-medium shadow-inner`} 
                      value={masterForm.categoryId} 
                      onChange={(e) => setMasterForm({...masterForm, categoryId: e.target.value})}
                    >
                      <option value="" className="bg-[#1a0505]">
                        {categories.length === 0 ? "Xidmət sahələri hələ əlavə edilməyib" : "İxtisas seçin..."}
                      </option>
                      {categories.map(cat => (
                        <option key={cat.id} value={String(cat.id)} className="bg-[#1a0505]">
                          {getEmoji(cat.name)} {cat.name}
                        </option>
                      ))}
                    </select>
                    {masterErrors.categoryId && <p className="text-[10px] text-red-500 font-bold ml-1">{masterErrors.categoryId}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Təcrübə (İl)</label>
                    <input type="number" className={`w-full bg-glass-bg border ${masterErrors.experienceYear ? 'border-red-500' : 'border-glass-border'} rounded-xl p-3 outline-none focus:border-primary-accent text-white font-medium`} value={masterForm.experienceYear} onChange={(e) => setMasterForm({...masterForm, experienceYear: e.target.value})} placeholder="3" />
                    {masterErrors.experienceYear && <p className="text-[10px] text-red-500 font-bold ml-1">{masterErrors.experienceYear}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Şəhər</label>
                    <select className="bg-glass-bg border border-glass-border rounded-xl p-3 outline-none focus:border-primary-accent w-full text-white font-medium" value={masterForm.city} onChange={(e) => setMasterForm({...masterForm, city: e.target.value})}>
                      <option value="Bakı" className="bg-[#1a0505]">Bakı 🇦🇿</option>
                      <option value="Sumqayıt" className="bg-[#1a0505]">Sumqayıt 🏙️</option>
                      <option value="Gəncə" className="bg-[#1a0505]">Gəncə 🏰</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Qiymət (₼-dan)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-accent" size={16} />
                      <input type="number" className={`w-full bg-glass-bg border ${masterErrors.priceFrom ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary-accent text-white font-medium`} value={masterForm.priceFrom} onChange={(e) => setMasterForm({...masterForm, priceFrom: e.target.value, priceTo: (Number(e.target.value) + 50)})} placeholder="20" />
                    </div>
                    {masterErrors.priceFrom && <p className="text-[10px] text-red-500 font-bold ml-1">{masterErrors.priceFrom}</p>}
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">Dəqiq İş Ünvanı</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-accent" size={16} />
                    <input type="text" className={`w-full bg-glass-bg border ${masterErrors.address ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary-accent text-white font-medium`} value={masterForm.address} placeholder="Məsələn: Nizami r., Xalqlar m." onChange={(e) => setMasterForm({...masterForm, address: e.target.value})} />
                  </div>
                  {masterErrors.address && <p className="text-[10px] text-red-500 font-bold ml-1">{masterErrors.address}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">Haqqınızda (Bio)</label>
                  <textarea className={`w-full bg-glass-bg border ${masterErrors.description ? 'border-red-500' : 'border-glass-border'} rounded-2xl p-4 h-32 outline-none focus:border-primary-accent resize-none text-white font-medium`} value={masterForm.description} placeholder="Gördüyünüz işlər haqqında qısa məlumat..." onChange={(e) => setMasterForm({...masterForm, description: e.target.value})}></textarea>
                  {masterErrors.description && <p className="text-[10px] text-red-500 font-bold ml-1">{masterErrors.description}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={masterSaving || categories.length === 0} 
                  className="w-full bg-gradient-to-r from-primary-accent to-accent-pink text-white py-4 rounded-xl font-bold shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {masterSaving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  Peşəkar Hesabı Aktivləşdir
                </button>
              </form>
            </section>
          ) : (
             <section className="glass-card p-8 border-2 border-primary-accent/20 bg-primary-accent/5 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-6 relative z-10">
                   <div className="w-20 h-20 bg-gradient-to-tr from-primary-accent to-accent-pink rounded-2xl text-white shadow-lg flex items-center justify-center"><Shield size={36} /></div>
                   <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">Usta Profili Aktivdir</h3>
                      <p className="text-gray-400 font-medium text-sm mt-0.5">Xidmət göstərməyə hazırsınız.</p>
                   </div>
                </div>
                <button onClick={() => navigate('/master-dashboard')} className="mt-8 w-full py-4 bg-white text-[#1a0505] rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2">
                   Usta Panelinə Get <ArrowRight size={20} />
                </button>
             </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
