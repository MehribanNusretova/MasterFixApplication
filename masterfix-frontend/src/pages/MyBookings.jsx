import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, XCircle, MessageSquare, Star } from 'lucide-react';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import ErrorMessage from '../components/ErrorMessage';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ bookingId: null, rating: 5, comment: '', masterId: null });
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingService.cancel(id);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Cancellation failed");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: '', error: '' });
    try {
      await reviewService.create({
        masterId: reviewForm.masterId,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setStatus({ loading: false, success: 'Review submitted! Thank you.', error: '' });
      setReviewForm({ bookingId: null, rating: 5, comment: '', masterId: null });
      fetchBookings();
    } catch (error) {
      setStatus({ loading: false, success: '', error: error.response?.data?.message || 'Review submission failed' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Bookings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your service requests and history.</p>
      </div>

      {loading ? <Loading /> : (
        <>
          {bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{booking.master?.user?.fullName}</h3>
                          <StatusBadge status={booking.status} />
                        </div>
                        <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{new Date(booking.bookingDate).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{booking.master?.city}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {booking.status === 'PENDING' && (
                        <button 
                          onClick={() => handleCancel(booking.id)}
                          className="px-5 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold transition-all flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                      
                      {booking.status === 'COMPLETED' && !booking.reviewed && (
                        <button 
                          onClick={() => setReviewForm({ ...reviewForm, bookingId: booking.id, masterId: booking.master?.id })}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center space-x-2"
                        >
                          <Star className="w-4 h-4" />
                          <span>Rate Service</span>
                        </button>
                      )}
                      
                      <button className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div className="px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                        " {booking.notes} "
                      </p>
                    </div>
                  )}

                  {/* Review Modal-like inline form */}
                  {reviewForm.bookingId === booking.id && (
                    <div className="p-8 border-t border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10">
                       <h4 className="font-bold text-slate-900 dark:text-white mb-4">Rate your experience</h4>
                       <form onSubmit={handleReviewSubmit} className="space-y-4">
                         <ErrorMessage message={status.error} />
                         <div>
                           <label className="block text-sm font-semibold mb-2">Rating</label>
                           <div className="flex space-x-2">
                             {[1,2,3,4,5].map(num => (
                               <button 
                                 key={num}
                                 type="button"
                                 onClick={() => setReviewForm({...reviewForm, rating: num})}
                                 className={`p-2 rounded-lg transition-all ${reviewForm.rating >= num ? 'text-amber-400' : 'text-slate-300'}`}
                               >
                                 <Star className={reviewForm.rating >= num ? 'fill-amber-400' : ''} />
                               </button>
                             ))}
                           </div>
                         </div>
                         <div>
                           <label className="block text-sm font-semibold mb-2">Comment</label>
                           <textarea
                             required
                             rows="3"
                             value={reviewForm.comment}
                             onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                             className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all resize-none"
                             placeholder="How was the service?"
                           ></textarea>
                         </div>
                         <div className="flex justify-end space-x-3">
                           <button 
                             type="button"
                             onClick={() => setReviewForm({ bookingId: null, rating: 5, comment: '', masterId: null })}
                             className="px-6 py-2.5 text-slate-500 font-bold"
                           >
                             Cancel
                           </button>
                           <button 
                             type="submit"
                             disabled={status.loading}
                             className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold"
                           >
                             Submit Review
                           </button>
                         </div>
                       </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No bookings found" 
              message="You haven't booked any services yet. Find a master and get things fixed!" 
              icon={Calendar}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MyBookings;
