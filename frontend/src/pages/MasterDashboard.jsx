import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  User, 
  Briefcase, 
  Calendar,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  Award
} from 'lucide-react';

const MasterDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await apiService.getMasterBookings();
      setBookings(data);
      
      // Calculate stats
      const pending = data.filter(b => b.status === 'PENDING').length;
      const accepted = data.filter(b => b.status === 'ACCEPTED').length;
      const completed = data.filter(b => b.status === 'COMPLETED').length;
      
      setStats({ pending, accepted, completed });
    } catch (error) {
      console.error('Bookingler yüklenirken xeta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, action) => {
    try {
      if (action === 'accept') await apiService.acceptBooking(id);
      else if (action === 'reject') await apiService.rejectBooking(id);
      else if (action === 'complete') await apiService.completeBooking(id);
      
      fetchBookings(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || 'Emeliyyat ugursuz oldu');
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

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-accent" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Usta Paneli</h1>
          <p className="text-gray-400">Sifarişləriniz və fəaliyyət statistikanız</p>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-yellow-500">
          <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Gözləyən</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{stats.pending}</span>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-blue-500">
          <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Aktiv</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{stats.accepted}</span>
            <TrendingUp className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-green-500">
          <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Tamamlanan</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{stats.completed}</span>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-primary-accent">
          <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Reytinq</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">5.0</span>
            <Star className="text-primary-accent fill-primary-accent" size={24} />
          </div>
        </div>
      </div>

      {/* Bookings Table/List */}
      <section className="glass-card overflow-hidden">
        <div className="p-6 border-b border-glass-border flex justify-between items-center bg-glass-bg">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Calendar className="text-primary-accent" size={20} />
            Son Sifarişlər
          </h2>
        </div>

        <div className="divide-y divide-glass-border">
          {bookings.length > 0 ? bookings.map((booking) => (
            <div key={booking.id} className="p-6 hover:bg-glass-hover transition-colors">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-light/50 rounded-xl flex items-center justify-center shrink-0">
                    <User className="text-gray-300" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">{booking.userName}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <MapPin size={14} /> {booking.address}
                    </p>
                    <p className="text-gray-300 text-sm italic py-2 border-l-2 border-primary-accent/30 pl-3">
                      "{booking.description}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="text-right hidden sm:block pr-4 border-r border-glass-border">
                    <p className="text-sm font-bold">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {booking.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(booking.id, 'accept')}
                          className="flex-1 sm:flex-none px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                        >
                          <CheckCircle2 size={16} /> Qəbul et
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(booking.id, 'reject')}
                          className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                        >
                          <XCircle size={16} /> İmtina
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'ACCEPTED' && (
                      <button 
                        onClick={() => handleStatusUpdate(booking.id, 'complete')}
                        className="w-full sm:w-auto px-6 py-2 bg-primary-accent hover:bg-primary-light text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <CheckCircle size={16} /> İşi Tamamla
                      </button>
                    )}

                    {(booking.status === 'COMPLETED' || booking.status === 'REJECTED' || booking.status === 'CANCELLED') && (
                      <span className="text-xs text-gray-500 font-medium italic">Arxivlənib</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-gray-500">Hələ heç bir sifarişiniz yoxdur.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MasterDashboard;
