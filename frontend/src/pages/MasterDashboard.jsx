import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import Chat from '../components/Chat';
import { 
  CheckCircle2, XCircle, Clock, MapPin, User, Briefcase, Calendar, MessageSquare,
  Star, CheckCircle, AlertCircle, Loader2, TrendingUp, Award, Image as ImageIcon, Video, Trash2, Plus, Send, X
} from 'lucide-react';

const MasterDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, accepted: 0, completed: 0 });

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatBooking, setActiveChatBooking] = useState(null);

  // Portfolio Form State
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({ title: '', description: '', mediaType: 'IMAGE' });
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [portfolioSaving, setPortfolioSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const { data: bData } = await apiService.getMasterBookings();
      console.log("MASTER BOOKINGS RESPONSE:", bData);
      setBookings(bData);
      
      const pending = bData.filter(b => (b.status || b.bookingStatus) === 'PENDING').length;
      const accepted = bData.filter(b => (b.status || b.bookingStatus) === 'ACCEPTED').length;
      const completed = bData.filter(b => (b.status || b.bookingStatus) === 'COMPLETED').length;
      setStats({ pending, accepted, completed });

      // Fetch Portfolio
      const profRes = await apiService.getMyProfile();
      const mastersList = await apiService.getMasters({ size: 1000 });
      const currentMaster = mastersList.data.content?.find(m => m.fullName.includes(profRes.data.firstName));
      
      if (currentMaster) {
          const { data: pData } = await apiService.getMasterPortfolio(currentMaster.id);
          setPortfolio(pData);
      }

    } catch (error) {
      console.error('Data yüklenirken xeta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    console.log("BOOKING STATUS UPDATE:", bookingId, status);
    try {
      const response = await apiService.updateBookingStatus(bookingId, status);
      console.log("UPDATED BOOKING:", response.data);
      fetchInitialData();
    } catch (error) {
      console.error("Status update error:", error);
      alert('Sifariş statusu yenilənmədi.');
    }
  };

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedia) return;

    setPortfolioSaving(true);
    const formData = new FormData();
    const dataBlob = new Blob([JSON.stringify({
        title: portfolioForm.title,
        description: portfolioForm.description,
        mediaType: portfolioForm.mediaType
    })], { type: 'application/json' });

    formData.append('data', dataBlob);
    formData.append('file', selectedMedia);

    try {
      await apiService.addPortfolioItem(formData);
      setIsPortfolioModalOpen(false);
      setPortfolioForm({ title: '', description: '', mediaType: 'IMAGE' });
      setMediaPreview(null);
      setSelectedMedia(null);
      fetchInitialData();
    } catch (error) {
      alert('Portfolio əlavə edilmədi');
    } finally {
      setPortfolioSaving(false);
    }
  };

  const handleDeletePortfolio = async (id) => {
      if (window.confirm("Bu işi silmək istəyirsiniz?")) {
          try {
              await apiService.deletePortfolioItem(id);
              fetchInitialData();
          } catch (e) { alert("Silinmədi"); }
      }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'ACCEPTED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'COMPLETED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'REJECTED': 
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-primary-accent" size={40} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white">Usta Paneli</h1>
        <p className="text-gray-400 font-medium">Sifarişləriniz və portfolio idarəetməsi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center justify-between border-l-4 border-yellow-500">
           <div><p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Gözləyən</p><p className="text-2xl font-black text-white">{stats.pending}</p></div>
           <Clock className="text-yellow-500" size={28} />
        </div>
        <div className="glass-card p-6 flex items-center justify-between border-l-4 border-blue-500">
           <div><p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aktiv</p><p className="text-2xl font-black text-white">{stats.accepted}</p></div>
           <TrendingUp className="text-blue-500" size={28} />
        </div>
        <div className="glass-card p-6 flex items-center justify-between border-l-4 border-green-500">
           <div><p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tamamlanan</p><p className="text-2xl font-black text-white">{stats.completed}</p></div>
           <CheckCircle className="text-green-500" size={28} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Bookings Section */}
        <section className="glass-card overflow-hidden border-glass-border">
          <div className="p-6 border-b border-glass-border bg-glass-bg flex justify-between items-center">
            <h2 className="font-bold text-lg text-white flex items-center gap-2"><Calendar size={20} className="text-primary-accent" /> Son Sifarişlər</h2>
          </div>
          <div className="divide-y divide-glass-border">
            {bookings.length > 0 ? bookings.map((b) => {
              const currentStatus = b.status || b.bookingStatus;
              
              return (
              <div key={b.id} className="p-6 hover:bg-glass-hover transition-all">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center text-primary-accent border border-primary-accent/20"><User size={24} /></div>
                      <div>
                        <h4 className="font-bold text-white">{b.userName}</h4>
                        <div className="flex items-center gap-2">
                           <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${getStatusStyle(currentStatus)}`}>{currentStatus}</span>
                           <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Status: {currentStatus}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-gray-500 font-bold uppercase">
                      <p>{new Date(b.bookingDate).toLocaleDateString()}</p>
                      <p>{new Date(b.bookingDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 italic">"{b.description}"</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} className="text-primary-accent" /> {b.address}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* Status Buttons */}
                    {currentStatus === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => {
                            console.log("STATUS BUTTON CLICKED:", b.id, "ACCEPTED");
                            handleStatusUpdate(b.id, 'ACCEPTED');
                          }} 
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                        >
                          <CheckCircle2 size={14} /> Qəbul et
                        </button>
                        <button 
                          onClick={() => {
                            console.log("STATUS BUTTON CLICKED:", b.id, "REJECTED");
                            handleStatusUpdate(b.id, 'REJECTED');
                          }} 
                          className="flex-1 py-2 bg-red-600/10 text-red-500 rounded-lg text-xs font-bold border border-red-500/20 hover:bg-red-600 hover:text-white transition-all"
                        >
                          <XCircle size={14} /> Rədd et
                        </button>
                      </>
                    )}
                    
                    {currentStatus === 'ACCEPTED' && (
                      <button 
                        onClick={() => {
                          console.log("STATUS BUTTON CLICKED:", b.id, "COMPLETED");
                          handleStatusUpdate(b.id, 'COMPLETED');
                        }} 
                        className="flex-1 py-2 bg-primary-accent text-white rounded-lg text-xs font-bold shadow-lg shadow-primary-accent/20 flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={14} /> Tamamlandı kimi işarələ
                      </button>
                    )}

                    {currentStatus === 'COMPLETED' && (
                      <div className="flex-1 py-2 bg-green-500/10 text-green-500 rounded-lg text-xs font-black uppercase text-center border border-green-500/20 flex items-center justify-center gap-2">
                        <CheckCircle2 size={14} /> Tamamlanıb
                      </div>
                    )}

                    {currentStatus === 'REJECTED' && (
                      <div className="flex-1 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-black uppercase text-center border border-red-500/20 flex items-center justify-center gap-2">
                        <XCircle size={14} /> Rədd edilib
                      </div>
                    )}
                    
                    {/* Chat Button */}
                    <button 
                      onClick={() => {
                        setActiveChatBooking(b);
                        setIsChatOpen(true);
                      }}
                      className="px-4 py-2 bg-glass-hover text-gray-300 rounded-lg text-xs font-bold border border-glass-border hover:bg-glass-border flex items-center justify-center gap-2 transition-all"
                    >
                      <MessageSquare size={14} className="text-primary-accent" /> Müştəriyə yaz
                    </button>
                  </div>
                </div>
              </div>
            )}) : <div className="p-12 text-center text-gray-500 italic">Sifariş yoxdur</div>}
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="glass-card p-8 space-y-6 border-glass-border">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-white flex items-center gap-2"><Award size={20} className="text-primary-accent" /> Əl işlərim</h2>
            <button onClick={() => setIsPortfolioModalOpen(true)} className="p-2 bg-primary-accent text-white rounded-lg shadow-lg active:scale-90 transition-all"><Plus size={20} /></button>
          </div>

          <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {portfolio.map((item) => (
              <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-glass-border bg-glass-bg aspect-square">
                 {item.mediaType === 'IMAGE' ? (
                   <img src={`/api${item.mediaUrl}`} className="w-full h-full object-cover" alt={item.title} />
                 ) : (
                   <video src={`/api${item.mediaUrl}`} className="w-full h-full object-cover" muted />
                 )}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                    <h5 className="font-bold text-white text-sm">{item.title}</h5>
                    <button onClick={() => handleDeletePortfolio(item.id)} className="mt-4 p-2 bg-red-500 text-white rounded-full"><Trash2 size={14} /></button>
                 </div>
              </div>
            ))}
            {portfolio.length === 0 && <div className="col-span-2 p-12 text-center text-gray-600 italic">Hələ heç bir əl işi əlavə edilməyib.</div>}
          </div>
        </section>
      </div>

      {/* Portfolio Modal */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
           <div className="glass-card w-full max-w-md p-8 space-y-6 border-glass-border shadow-2xl relative">
              <button onClick={() => setIsPortfolioModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={20} /></button>
              <h3 className="text-xl font-bold text-white">Yeni əl işi əlavə et</h3>
              <form onSubmit={handlePortfolioSubmit} className="space-y-4">
                 <input type="text" required placeholder="Başlıq" className="w-full bg-glass-bg border border-glass-border rounded-xl p-3 outline-none focus:border-primary-accent text-white" value={portfolioForm.title} onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})} />
                 <textarea placeholder="Qısa açıqlama" className="w-full bg-glass-bg border border-glass-border rounded-xl p-3 h-24 outline-none focus:border-primary-accent text-white resize-none" value={portfolioForm.description} onChange={e => setPortfolioForm({...portfolioForm, description: e.target.value})}></textarea>
                 
                 <div className="flex gap-4">
                    <button type="button" onClick={() => setPortfolioForm({...portfolioForm, mediaType: 'IMAGE'})} className={`flex-1 py-2 rounded-xl border ${portfolioForm.mediaType === 'IMAGE' ? 'bg-primary-accent border-primary-accent text-white' : 'border-glass-border text-gray-400'}`}>Şəkil</button>
                    <button type="button" onClick={() => setPortfolioForm({...portfolioForm, mediaType: 'VIDEO'})} className={`flex-1 py-2 rounded-xl border ${portfolioForm.mediaType === 'VIDEO' ? 'bg-primary-accent border-primary-accent text-white' : 'border-glass-border text-gray-400'}`}>Video</button>
                 </div>

                 <div className="relative group">
                    <div className="w-full h-40 rounded-2xl border-2 border-dashed border-glass-border flex flex-col items-center justify-center gap-2 overflow-hidden bg-glass-hover">
                       {mediaPreview ? (
                          portfolioForm.mediaType === 'IMAGE' ? <img src={mediaPreview} className="w-full h-full object-cover" /> : <video src={mediaPreview} className="w-full h-full object-cover" />
                       ) : (
                          <>
                            <ImageIcon size={32} className="text-gray-500" />
                            <p className="text-xs text-gray-500">Şəkil və ya video seçin</p>
                          </>
                       )}
                    </div>
                    <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleMediaSelect} />
                 </div>

                 <button type="submit" disabled={portfolioSaving} className="w-full py-4 bg-primary-accent text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                    {portfolioSaving ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} Əlavə et
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatOpen && activeChatBooking && (
        <Chat 
          bookingId={activeChatBooking.id}
          recipientName={activeChatBooking.userName}
          onClose={() => {
            setIsChatOpen(false);
            setActiveChatBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default MasterDashboard;
