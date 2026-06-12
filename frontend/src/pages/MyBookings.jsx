import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import { 
  Calendar, MapPin, Clock, MessageSquare, CheckCircle2, XCircle, AlertCircle,
  User, Star, X, Send, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validators, mapBackendErrors } from '../utils/validators';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await apiService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Sifarişler yüklenirken xeta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Frontend Validation
    const validationErrors = validators.review({ rating, comment });
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    setReviewLoading(true);
    try {
      await apiService.addReview({
        bookingId: selectedBooking.id,
        rating: Number(rating),
        comment: comment
      });
      setIsModalOpen(false);
      setComment('');
      setRating(5);
      fetchBookings();
    } catch (error) {
      console.log("Backend validation errors:", error.response?.data);
      setErrors(mapBackendErrors(error.response?.data));
    } finally {
      setReviewLoading(false);
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

  const translateStatus = (status) => {
    const statuses = {
      'PENDING': 'Gözləyir',
      'ACCEPTED': 'Qəbul edildi',
      'COMPLETED': 'Tamamlandı',
      'REJECTED': 'İmtina edildi',
      'CANCELLED': 'Ləğv edildi'
    };
    return statuses[status] || status;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold">Sifarişlərim</h1>
        <p className="text-gray-400">Xidmət tarixçəniz və aktiv sifarişlər</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary-accent" size={40} />
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="glass-card p-6 hover:border-primary-accent/30 transition-all group border-glass-border">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center text-primary-accent shrink-0 border border-primary-accent/20">
                    <User size={32} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-xl">{booking.masterName}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-2 ${getStatusStyle(booking.status)}`}>
                        {translateStatus(booking.status)}
                      </span>
                    </div>
                    <p className="text-primary-accent font-medium text-sm">{booking.categoryName}</p>
                    <p className="text-gray-400 text-sm italic">"{booking.description}"</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-glass-border pt-4 md:pt-0 md:pl-6 gap-4">
                  <div className="space-y-2 text-right w-full">
                    <div className="flex items-center justify-end gap-2 text-gray-400 text-xs font-bold uppercase">
                      <Calendar size={12} className="text-primary-accent" />
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-end gap-2 text-gray-400 text-xs font-bold uppercase">
                      <MapPin size={12} className="text-primary-accent" />
                      {booking.address}
                    </div>
                  </div>
                  
                  {booking.status === 'COMPLETED' && (
                    <button 
                      onClick={() => {
                        setSelectedBooking(booking);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-2 bg-primary-accent/10 hover:bg-primary-accent text-primary-accent hover:text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all active:scale-95 shadow-lg border border-primary-accent/20"
                    >
                      <Star size={14} className="fill-current" /> Rəy yaz
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-20 text-center space-y-6 border-glass-border">
          <div className="w-20 h-20 bg-glass-hover rounded-full mx-auto flex items-center justify-center text-gray-500 shadow-inner">
            <Calendar size={40} />
          </div>
          <h3 className="text-2xl font-bold">Hələ sifarişiniz yoxdur</h3>
          <button className="bg-primary-accent text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-light transition-all shadow-lg shadow-primary-accent/20">Usta Tap</button>
        </div>
      )}

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-md p-8 space-y-8 animate-in zoom-in-95 duration-300 relative border-glass-border shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2 bg-glass-hover rounded-lg"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-primary-accent/10 rounded-3xl mx-auto flex items-center justify-center text-primary-accent mb-2 shadow-inner border border-primary-accent/20">
                <MessageSquare size={36} />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Xidməti Qiymətləndir</h3>
              <p className="text-gray-400 text-sm font-medium">Usta: <span className="text-white font-bold">{selectedBooking?.masterName}</span></p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-8">
              {/* Star Selection */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Ulduz sayı</p>
                <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-75 hover:scale-110"
                    >
                        <Star 
                        size={40} 
                        className={`${star <= rating ? 'text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'text-gray-700'} transition-all`} 
                        />
                    </button>
                    ))}
                </div>
                {errors.rating && <p className="text-[10px] text-red-500 font-bold uppercase text-center mt-2">{errors.rating}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Şərhiniz</label>
                <textarea 
                  placeholder="Təcrübəniz haqqında bir neçə söz yazın..."
                  className={`w-full bg-primary-light/20 border ${errors.comment ? 'border-red-500' : 'border-glass-border'} rounded-2xl p-5 h-36 outline-none focus:border-primary-accent transition-all resize-none font-medium shadow-inner`}
                  value={comment}
                  onChange={(e) => {
                      setComment(e.target.value);
                      if (errors.comment) setErrors(prev => ({...prev, comment: null}));
                  }}
                ></textarea>
                {errors.comment && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.comment}</p>}
              </div>

              <button 
                type="submit"
                disabled={reviewLoading}
                className="w-full bg-primary-accent hover:bg-primary-light text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50 shadow-2xl shadow-primary-accent/30"
              >
                {reviewLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Rəyi Göndər
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
