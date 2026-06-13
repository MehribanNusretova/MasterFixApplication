import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';
import { 
  Star, MapPin, Briefcase, Clock, Calendar, MessageSquare, CheckCircle2, ChevronLeft,
  ShieldCheck, Award, Loader2, AlertCircle, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validators, mapBackendErrors } from '../utils/validators';

const MasterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [master, setMaster] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    description: '',
    address: '',
    bookingDate: ''
  });

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [masterRes, reviewsRes, portfolioRes] = await Promise.all([
          apiService.getMasterById(id),
          apiService.getMasterReviews(id),
          apiService.getMasterPortfolio(id)
        ]);
        setMaster(masterRes.data);
        setReviews(reviewsRes.data);

        console.log("PORTFOLIO RESPONSE:", portfolioRes.data);
        const pData = portfolioRes.data;
        if (Array.isArray(pData)) {
            setPortfolio(pData);
        } else if (pData?.content && Array.isArray(pData.content)) {
            setPortfolio(pData.content);
        } else if (pData?.data && Array.isArray(pData.data)) {
            setPortfolio(pData.data);
        }

      } catch (error) {
        console.error('Master datası yüklenirken xeta:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMasterData();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!user) {
      navigate('/login');
      return;
    }
    
    // Frontend Validation
    const validationErrors = validators.booking(bookingData);
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    setBookingLoading(true);
    try {
      // Ensure date is in YYYY-MM-DDTHH:mm:ss format
      let formattedDate = bookingData.bookingDate;
      if (formattedDate && !formattedDate.includes('T')) {
          // If it's just a date, append time
          formattedDate += 'T12:00:00';
      } else if (formattedDate && formattedDate.length === 16) {
          // If it's YYYY-MM-DDTHH:mm, append :00
          formattedDate += ':00';
      }

      const payload = {
        masterId: Number(id),
        description: bookingData.description,
        address: bookingData.address,
        bookingDate: formattedDate
      };

      if (!payload.description || !payload.address || !payload.bookingDate || !payload.masterId) {
          setErrors({ global: "Sifariş məlumatlarını tam doldurun." });
          setBookingLoading(false);
          return;
      }

      console.log("Booking payload:", payload);
      await apiService.createBooking(payload);
      
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 5000);
      setBookingData({ description: '', address: '', bookingDate: '' });
    } catch (error) {
      console.log("Backend validation errors:", error.response?.data);
      const backendErrors = error.response?.data;
      if (backendErrors && typeof backendErrors === 'object') {
          setErrors(mapBackendErrors(backendErrors));
          setErrors(prev => ({ ...prev, global: "Sifariş məlumatlarını tam doldurun." }));
      } else {
          setErrors({ global: "Sifariş zamanı xəta baş verdi. Zəhmət olmasa yenidən yoxlayın." });
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-accent" size={40} />
    </div>
  );

  if (!master) return <div className="text-center p-12 glass-card">Usta tapılmadı</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Geri qayıt
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile & Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-accent/10 blur-3xl rounded-full"></div>

            <div className="w-40 h-40 shrink-0 relative">
              <img 
                src={master.profileImageUrl ? `/api${master.profileImageUrl}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop'} 
                className="w-full h-full object-cover rounded-3xl border-2 border-glass-border shadow-2xl"
                alt={master.fullName}
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-xl border-4 border-[#1a0505] shadow-lg">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{master.fullName}</h1>
                  <p className="text-primary-accent font-semibold flex items-center gap-2">
                    <Briefcase size={16} /> {master.categoryName}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-glass-hover px-4 py-2 rounded-2xl border border-glass-border">
                  <Star size={20} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xl font-bold">{master.averageRating || 'N/A'}</span>
                  <span className="text-gray-400 text-sm">({reviews.length} rəy)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-glass-border">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Təcrübə</p>
                  <p className="font-bold flex items-center gap-1 text-white"><Award size={14} className="text-primary-accent" /> {master.experienceYear} il</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Şəhər</p>
                  <p className="font-bold flex items-center gap-1 text-white"><MapPin size={14} className="text-primary-accent" /> {master.city}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tamamlanmış İş</p>
                  <p className="font-bold flex items-center gap-1 text-white"><CheckCircle2 size={14} className="text-primary-accent" /> {master.completedJobs}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-gray-300 uppercase text-xs tracking-widest">Usta Haqqında</h3>
                <p className="text-gray-400 leading-relaxed italic">"{master.description || 'Usta haqqında məlumat qeyd edilməyib.'}"</p>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <MessageSquare className="text-primary-accent" />
              Müştəri Rəyləri
            </h2>

            <div className="space-y-4">
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className="glass-card p-6 space-y-4 border-l-4 border-primary-accent">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-glass-hover border border-glass-border rounded-full flex items-center justify-center font-bold text-primary-accent">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white">{review.userName}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 italic text-sm">"{review.comment}"</p>
                </div>
              )) : (
                <div className="glass-card p-12 text-center text-gray-500 italic">Hələ rəy yazılmayıb. İlk rəyi siz yazın!</div>
              )}
            </div>
          </section>

          {/* Portfolio Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Award className="text-primary-accent" />
              Ustanın Əl İşləri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.length > 0 ? portfolio.map((item) => {
                const fullUrl = item.mediaUrl.startsWith("http") 
                  ? item.mediaUrl 
                  : `http://localhost:8080${item.mediaUrl}`;

                return (
                  <div key={item.id} className="glass-card overflow-hidden group border-glass-border bg-glass-bg">
                    <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                      {item.mediaType === 'IMAGE' ? (
                        <img 
                          src={fullUrl} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt={item.title} 
                        />
                      ) : (
                        <video 
                          controls 
                          src={fullUrl} 
                          className="w-full h-full object-cover"
                        ></video>
                      )}
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-full glass-card p-12 text-center text-gray-500 italic">
                  Bu usta hələ əl işi əlavə etməyib.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Booking Form */}
        <div className="space-y-6">
          <div className="glass-card p-8 sticky top-8 space-y-6 border-glass-border shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Ustanı Sifariş Et</h3>
              <p className="text-sm text-gray-400">Təxmini qiymət: <span className="text-white font-black">{master.priceFrom}₼ - {master.priceTo}₼</span></p>
            </div>

            {errors.global && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm flex items-center gap-2 animate-in zoom-in-95 font-bold">
                <AlertCircle size={18} />
                {errors.global}
              </div>
            )}

            {bookingSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl text-sm flex items-center gap-2 animate-in zoom-in-95 font-bold">
                <CheckCircle2 size={18} />
                Sifarişiniz uğurla yaradıldı.
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">İşin təsviri</label>
                <textarea 
                  placeholder="Nə problem var? Qısa qeyd edin..."
                  className={`w-full bg-primary-light/20 border ${errors.description ? 'border-red-500' : 'border-glass-border'} rounded-xl p-4 h-32 outline-none focus:border-primary-accent transition-all resize-none font-medium`}
                  value={bookingData.description}
                  onChange={(e) => {
                    setBookingData({...bookingData, description: e.target.value});
                    if (errors.description) setErrors(prev => ({...prev, description: null}));
                  }}
                ></textarea>
                {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Ünvan</label>
                <div className="relative">
                  <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.address ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                  <input 
                    type="text" 
                    placeholder="Tam ünvanı qeyd edin..."
                    className={`w-full bg-primary-light/20 border ${errors.address ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-accent transition-all font-medium`}
                    value={bookingData.address}
                    onChange={(e) => {
                        setBookingData({...bookingData, address: e.target.value});
                        if (errors.address) setErrors(prev => ({...prev, address: null}));
                    }}
                  />
                </div>
                {errors.address && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tarix və Saat</label>
                <div className="relative">
                  <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.bookingDate ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                  <input 
                    type="datetime-local" 
                    className={`w-full bg-primary-light/20 border ${errors.bookingDate ? 'border-red-500' : 'border-glass-border'} rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-accent transition-all text-white scheme-dark font-medium`}
                    value={bookingData.bookingDate}
                    onChange={(e) => {
                        setBookingData({...bookingData, bookingDate: e.target.value});
                        if (errors.bookingDate) setErrors(prev => ({...prev, bookingDate: null}));
                    }}
                  />
                </div>
                {errors.bookingDate && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.bookingDate}</p>}
              </div>

              <button 
                type="submit"
                disabled={bookingLoading || !master.available}
                className="w-full bg-primary-accent hover:bg-primary-light text-white py-4 rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50 shadow-xl shadow-primary-accent/20 flex items-center justify-center gap-2"
              >
                {bookingLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {master.available ? 'Sifarişi Təsdiqlə' : 'Usta Hazırda Məşğuldur'}
              </button>
            </form>

            <div className="p-4 bg-primary-accent/5 rounded-2xl border border-primary-accent/10">
              <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                <Clock size={14} className="text-primary-accent" />
                Gözlənilən cavab vaxtı: 1 saat
              </div>
              <p className="text-[10px] text-gray-600 leading-tight">Sifariş təsdiqləndikdən sonra usta sizinlə dərhal əlaqə saxlayacaq.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterDetail;
