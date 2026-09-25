import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Star, XCircle, CheckCircle, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EmptyState } from '../components/EmptyState';
import { Chat } from '../components/Chat';

export function MyBookings() {
  const { bookings, properties, currentUser, cancelBooking, addReview, login, reviews } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [chatBookingId, setChatBookingId] = useState<string | null>(null);

  if (!currentUser) {
    login('demo@duna.com', 'guest');
  }

  const userBookings = bookings.filter(b => b.guestId === (currentUser?.id || 'user-1'));
  const now = new Date();

  const upcoming = userBookings.filter(b => b.status === 'confirmed' && isAfter(parseISO(b.checkIn), now));
  const past = userBookings.filter(b => (b.status === 'confirmed' && isBefore(parseISO(b.checkOut), now)) || b.status === 'completed');
  const cancelled = userBookings.filter(b => b.status === 'cancelled');

  const currentTab = tab === 'upcoming' ? upcoming : tab === 'past' ? past : cancelled;

  const handleSubmitReview = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    addReview({
      propertyId: booking.propertyId,
      bookingId,
      guestName: currentUser?.name || 'Hóspede',
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewModal(null);
    setReviewComment('');
    setReviewRating(5);
  };

  const handleCancel = (bookingId: string) => {
    if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
      cancelBooking(bookingId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12 animate-fade-in">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50 mb-2">Viagens</h1>
      <p className="text-sand-500 dark:text-sand-400 mb-8">Suas reservas passadas, futuras e canceladas</p>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-sand-200 dark:border-sand-800 mb-8">
        {[
          { key: 'upcoming', label: 'Próximas', count: upcoming.length },
          { key: 'past', label: 'Passadas', count: past.length },
          { key: 'cancelled', label: 'Canceladas', count: cancelled.length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === t.key ? 'border-sand-900 dark:border-sand-100 text-sand-900 dark:text-sand-100' : 'border-transparent text-sand-500 hover:text-sand-700 dark:hover:text-sand-300'}`}>
            {t.label} {t.count > 0 && `(${t.count})`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {currentTab.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={tab === 'upcoming' ? 'Nenhuma viagem futura' : tab === 'past' ? 'Nenhuma viagem passada' : 'Nenhuma reserva cancelada'}
          description={tab === 'upcoming' ? 'Encontre seu próximo destino na Duna!' : 'Suas reservas aparecerão aqui.'}
          action={tab === 'upcoming' ? { label: 'Explorar imóveis', onClick: () => navigate('/buscar') } : undefined}
        />
      ) : (
        <div className="space-y-6">
          {currentTab.map((booking, i) => {
            const property = properties.find(p => p.id === booking.propertyId);
            if (!property) return null;
            const hasReview = reviews.some(r => r.bookingId === booking.id);

            return (
              <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 overflow-hidden card-shadow">
                <div className="flex flex-col sm:flex-row">
                  <img src={property.photos[0]} alt={property.title} className="w-full sm:w-56 h-48 sm:h-auto object-cover" />
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-sand-500 mb-1">
                          {tab === 'upcoming' ? 'Próxima viagem' : tab === 'past' ? 'Viagem passada' : 'Cancelada'}
                        </p>
                        <h3 className="font-display font-bold text-lg text-sand-900 dark:text-sand-100">{property.title}</h3>
                        <p className="text-sm text-sand-500 mt-0.5">{property.city}, {property.state}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        booking.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-sand-100 dark:bg-sand-700 text-sand-600'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmada' : booking.status === 'cancelled' ? 'Cancelada' : 'Concluída'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-sand-600 dark:text-sand-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span className="font-medium">{format(parseISO(booking.checkIn), "dd/MM")} — {format(parseISO(booking.checkOut), "dd/MM/yy")}</span>
                      </div>
                      <span className="font-bold text-sand-900 dark:text-sand-100">R$ {booking.totalPrice}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-5 pt-4 border-t border-sand-100 dark:border-sand-700">
                      {tab === 'upcoming' && booking.status === 'confirmed' && (
                        <button onClick={() => handleCancel(booking.id)} className="px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1.5">
                          <XCircle size={14} /> Cancelar reserva
                        </button>
                      )}
                      {tab === 'past' && !hasReview && (
                        <button onClick={() => setReviewModal(booking.id)} className="px-3 py-2 text-xs font-semibold text-terra-600 dark:text-terra-400 hover:bg-terra-50 dark:hover:bg-terra-900/20 rounded-lg transition-colors flex items-center gap-1.5">
                          <Star size={14} /> Avaliar estadia
                        </button>
                      )}
                      {hasReview && (
                        <span className="text-xs text-green-600 flex items-center gap-1.5 font-medium"><CheckCircle size={14} /> Avaliado</span>
                      )}
                      <button onClick={() => setChatBookingId(booking.id)} className="px-3 py-2 text-xs font-semibold text-duna-600 dark:text-duna-400 hover:bg-duna-50 dark:hover:bg-duna-900/20 rounded-lg transition-colors flex items-center gap-1.5">
                        <MessageCircle size={14} /> Chat
                      </button>
                      <button onClick={() => navigate(`/imovel/${property.id}`)} className="ml-auto px-3 py-2 text-xs font-semibold text-sand-700 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-700 rounded-lg transition-colors">
                        Ver imóvel →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setReviewModal(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-sand-800 rounded-2xl p-6 md:p-8 w-full max-w-md card-shadow" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold text-sand-900 dark:text-sand-100 mb-6">Como foi sua estadia?</h3>
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-3">Sua nota</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setReviewRating(n)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${n <= reviewRating ? 'bg-terra-500 text-white scale-110' : 'bg-sand-100 dark:bg-sand-700 text-sand-400 hover:bg-sand-200 dark:hover:bg-sand-600'}`}>
                    <Star size={20} className={n <= reviewRating ? 'fill-white' : ''} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Seu comentário</label>
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} placeholder="Conte para outros hóspedes como foi..." className="w-full px-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setReviewModal(null)} className="flex-1 py-3 border border-sand-300 dark:border-sand-600 text-sand-700 dark:text-sand-300 font-semibold rounded-xl hover:bg-sand-50 dark:hover:bg-sand-700 transition-colors">Cancelar</button>
              <button onClick={() => handleSubmitReview(reviewModal)} className="flex-1 py-3 bg-terra-500 hover:bg-terra-600 text-white font-semibold rounded-xl transition-colors btn-press">Enviar avaliação</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Chat */}
      {chatBookingId && (
        <Chat bookingId={chatBookingId} onClose={() => setChatBookingId(null)} />
      )}
    </div>
  );
}
