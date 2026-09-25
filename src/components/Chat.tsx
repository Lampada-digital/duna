import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Send, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatProps {
  bookingId: string;
  onClose: () => void;
}

export function Chat({ bookingId, onClose }: ChatProps) {
  const { getMessages, sendMessage, currentUser, bookings, properties } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = getMessages(bookingId);
  const booking = bookings.find(b => b.id === bookingId);
  const property = booking ? properties.find(p => p.id === booking.propertyId) : null;

  useEffect(() => {
    if (currentUser) {
      // Mark messages as read when opening chat
      const timer = setTimeout(() => {
        // markMessagesAsRead(bookingId, currentUser.id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [bookingId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser) return;
    
    sendMessage(
      bookingId,
      currentUser.id,
      currentUser.role === 'realEstate' ? 'host' : 'guest',
      newMessage.trim()
    );
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!booking || !property) {
    return (
      <div className="p-8 text-center">
        <p className="text-sand-500">Reserva não encontrada</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-sand-50 dark:bg-sand-950 flex flex-col md:inset-auto md:top-20 md:right-4 md:bottom-4 md:w-96 md:rounded-2xl md:shadow-2xl md:border md:border-sand-200 dark:md:border-sand-700"
    >
      {/* Header */}
      <div className="bg-white dark:bg-sand-800 border-b border-sand-200 dark:border-sand-700 p-4 flex items-center gap-3">
        <button onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-sand-700 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-sand-700 dark:text-sand-300" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sand-900 dark:text-sand-100 truncate">{property.title}</p>
          <p className="text-xs text-sand-500">
            {format(parseISO(booking.checkIn), "dd/MM")} - {format(parseISO(booking.checkOut), "dd/MM/yy")}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-sand-500">Nenhuma mensagem ainda</p>
            <p className="text-xs text-sand-400 mt-1">Envie a primeira mensagem!</p>
          </div>
        )}
        
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${isMe ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl ${
                    isMe
                      ? 'bg-terra-500 text-white rounded-br-sm'
                      : 'bg-white dark:bg-sand-800 text-sand-900 dark:text-sand-100 border border-sand-200 dark:border-sand-700 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                <p className={`text-[10px] text-sand-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {format(parseISO(msg.timestamp), 'HH:mm')}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-sand-800 border-t border-sand-200 dark:border-sand-700 p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite sua mensagem..."
            rows={1}
            className="flex-1 px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2.5 bg-terra-500 hover:bg-terra-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors btn-press"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
