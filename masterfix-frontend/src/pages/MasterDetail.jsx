import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, MessageSquare, Heart, Share2, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import masterService from '../services/masterService';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';
import favoriteService from '../services/favoriteService';
import Loading from '../components/Loading';
import RatingStars from '../components/RatingStars';
import ErrorMessage from '../components/ErrorMessage';

const MasterDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [master, setMaster] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState({ loading: false, success: '', error: '' });
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [masterData, reviewsData] = await Promise.all([
          masterService.getById(id),
          reviewService.getByMaster(id)
        ]);
        setMaster(masterData);
        setReviews(reviewsData);

        if (user) {
          const myFavs = await favoriteService.getMyFavorites();
          setIsFavorite(myFavs.some(f => f.masterId === parseInt(id)));
        }
      } catch (error) {
        console.error("Error fetching master detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/masters/${id}` } } });
      return;
    }

    setBookingStatus({ loading: true, success: '', error: '' });
    try {
      await bookingService.create({
        masterId: master.id,
        bookingDate,
        notes: bookingNotes
      });
      setBookingStatus({ loading: false, success: 'Booking request sent successfully!', error: '' });
      setBookingDate('');
      setBookingNotes('');
    } catch (error) {
      setBookingStatus({ loading: false, success: '', error: error.response?.data?.message || 'Booking failed' });
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await favoriteService.remove(id);
        setIsFavorite(false);
      } else {
        await favoriteService.add(id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) return <Loading fullScreen />;
  if (!master) return <div className="text-center py-20 text-slate-500">Master not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Master Info */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-48 h-48 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-20 h-20 text-indigo-200 dark:text-slate-700" />
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-md">
                        {master.category?.name}
                      </span>
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified Pro
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{master.user?.fullName}</h1>
                    <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                        <span>{master.city}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-900 dark:text-white">{master.averageRating?.toFixed(1) || '0.0'}</span>
                        <span className="ml-1">({reviews.length} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={toggleFavorite}
                      className={`p-3 rounded-xl border transition-all ${
                        isFavorite 
                        ? 'bg-red-50 border-red-100 text-red-500' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                    </button>
                    <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {master.bio || "No biography provided. This professional is dedicated to providing high-quality service and customer satisfaction."}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                   <div>
                     <div className="text-xs text-slate-500 mb-1">Price per Hour</div>
                     <div className="font-bold text-indigo-600 dark:text-indigo-400">{master.pricePerHour} ₼/hr</div>
                   </div>
                   <div>
                     <div className="text-xs text-slate-500 mb-1">Availability</div>
                     <div className="font-bold text-slate-900 dark:text-white">Mon - Sat</div>
                   </div>
                   <div>
                     <div className="text-xs text-slate-500 mb-1">Experience</div>
                     <div className="font-bold text-slate-900 dark:text-white">5+ Years</div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews</h2>
              <div className="flex items-center space-x-2">
                <RatingStars rating={master.averageRating || 0} />
                <span className="text-slate-400">({reviews.length})</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{review.user?.fullName}</div>
                        <div className="text-xs text-slate-500">2 days ago</div>
                      </div>
                    </div>
                    <RatingStars rating={review.rating} size={14} />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{review.comment}</p>
                </div>
              )) : (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/30 rounded-3xl text-slate-500">
                  No reviews yet. Be the first to review!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-indigo-500/5 p-8 overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -z-10 rounded-full"></div>
             
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Book this Master</h3>
             
             <form onSubmit={handleBooking} className="space-y-6">
               <ErrorMessage message={bookingStatus.error} />
               {bookingStatus.success && (
                 <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                   {bookingStatus.success}
                 </div>
               )}
               
               <div>
                 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Date & Time</label>
                 <div className="relative">
                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                   <input
                     type="datetime-local"
                     required
                     value={bookingDate}
                     onChange={(e) => setBookingDate(e.target.value)}
                     className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
                   />
                 </div>
               </div>
               
               <div>
                 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Notes for Master</label>
                 <textarea
                   placeholder="Describe your problem briefly..."
                   rows="4"
                   value={bookingNotes}
                   onChange={(e) => setBookingNotes(e.target.value)}
                   className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all resize-none"
                 ></textarea>
               </div>
               
               <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                 <div className="flex justify-between items-center mb-4">
                   <span className="text-slate-500">Service Fee</span>
                   <span className="font-bold text-slate-900 dark:text-white">5.00 ₼</span>
                 </div>
                 <div className="flex justify-between items-center mb-6">
                   <span className="text-slate-900 dark:text-white font-bold text-lg">Estimated Total</span>
                   <span className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">{master.pricePerHour + 5} ₼</span>
                 </div>
                 
                 <button
                   type="submit"
                   disabled={bookingStatus.loading}
                   className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
                 >
                   {bookingStatus.loading ? (
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   ) : (
                     <>
                       <Clock className="w-5 h-5" />
                       <span>Book Now</span>
                     </>
                   )}
                 </button>
                 <p className="text-center text-xs text-slate-400 mt-4">You won't be charged yet. Payment after completion.</p>
               </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterDetail;
