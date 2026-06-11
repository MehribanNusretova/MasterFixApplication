import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, Briefcase, ChevronRight } from 'lucide-react';
import bookingService from '../services/bookingService';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';

const MasterBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMasterBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching master bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'accept') await bookingService.accept(id);
      if (action === 'reject') await bookingService.reject(id);
      if (action === 'complete') await bookingService.complete(id);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Service Requests</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your incoming jobs and scheduled tasks.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center space-x-2">
           <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
           <span className="font-bold text-indigo-600 dark:text-indigo-400">{bookings.filter(b => b.status === 'PENDING').length} New Requests</span>
        </div>
      </div>

      {loading ? <Loading /> : (
        <>
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-8">
                    <div className="flex-grow flex items-start space-x-6">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{booking.user?.fullName}</h3>
                          <StatusBadge status={booking.status} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{new Date(booking.bookingDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div className="flex items-center col-span-full mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl italic">
                             "{booking.notes || "No notes provided"}"
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 min-w-[200px] justify-end">
                      {booking.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleAction(booking.id, 'reject')}
                            className="flex-grow md:flex-grow-0 px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleAction(booking.id, 'accept')}
                            className="flex-grow md:flex-grow-0 px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                          >
                            Accept
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'ACCEPTED' && (
                        <button 
                          onClick={() => handleAction(booking.id, 'complete')}
                          className="w-full md:w-auto px-8 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>Mark as Completed</span>
                        </button>
                      )}

                      <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No service requests" 
              message="You don't have any bookings yet. Make sure your profile is complete to attract clients!" 
              icon={Briefcase}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MasterBookings;
