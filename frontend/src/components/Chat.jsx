import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, User } from 'lucide-react';
import apiService from '../api/apiService';

const Chat = ({ bookingId, recipientName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = JSON.parse(localStorage.getItem("user") || "{}").id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await apiService.getBookingMessages(bookingId);
      setMessages(data);
    } catch (error) {
      console.error("Mesajlar yüklenmədi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const { data } = await apiService.sendBookingMessage(bookingId, newMessage);
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      alert("Mesaj göndərilmədi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-lg h-[600px] flex flex-col overflow-hidden border-glass-border shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-glass-border bg-glass-bg flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-accent/10 rounded-full flex items-center justify-center text-primary-accent border border-primary-accent/20">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{recipientName}</h3>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-xl text-gray-400 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-primary-accent" size={32} />
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium shadow-lg ${
                    isMine 
                      ? 'bg-primary-accent text-white rounded-tr-none' 
                      : 'bg-glass-hover text-gray-200 border border-glass-border rounded-tl-none'
                  }`}>
                    <p>{msg.content}</p>
                    <p className={`text-[9px] mt-1 ${isMine ? 'text-white/60' : 'text-gray-500'} font-bold`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2 italic">
              <p className="text-xs uppercase font-bold tracking-widest">Mesaj yoxdur</p>
              <p className="text-[10px]">İlk mesajı siz yazın!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer / Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-glass-bg border-t border-glass-border flex gap-2 shrink-0">
          <input 
            type="text" 
            placeholder="Mesajınızı yazın..."
            className="flex-1 bg-primary-light/10 border border-glass-border rounded-xl px-4 py-2 outline-none focus:border-primary-accent text-white font-medium text-sm transition-all"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={sending || !newMessage.trim()}
            className="p-3 bg-primary-accent hover:bg-primary-light text-white rounded-xl shadow-lg shadow-primary-accent/20 transition-all active:scale-90 disabled:opacity-50"
          >
            {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
