import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Star, XCircle, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EmptyState } from '../components/EmptyState';

export function MyBookings() {
  const { bookings, properties, currentUser, cancelBooking, addReview, login, reviews } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Auto-login as demo guest if not logged in
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="font-heading font-bold text-2xl text-sand-900 dark:text-sand-100 mb-6">Minhas Reservas</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-sand-100 dark:bg-sand-800 rounded-xl p-1 mb-6">
        {[
          { key: 'upcoming', label: 'Próximas', count: upcoming.length },
          { key: 'past', label: 'Passadas', count: past.length },
          { key: 'cancelled', label: 'Canceladas', count: cancelled.length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-white dark:bg-sand-700 text-sand-900 dark:text-sand-100 shadow-sm' : 'text-sand-500 hover:text-sand-700 dark:hover:text-sand-300'}`}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {currentTab.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={tab === 'upcoming' ? 'Nenhuma reserva futura' : tab === 'past' ? 'Nenhuma reserva passada' : 'Nenhuma reserva cancelada'}
          description={tab === 'upcoming' ? 'Encontre seu próximo destino na Duna!' : 'Suas reservas aparecerão aqui.'}
          action={tab === 'upcoming' ? { label: 'Buscar imóveis', onClick: () => navigate('/buscar') } : undefined}
        />
      ) : (
        <div className="space-y-4">
          {currentTab.map((booking, i) => {
            const property = properties.find(p => p.id === booking.propertyId);
            if (!property) return null;
            const hasReview = reviews.some(r => r.bookingId === booking.id);

            return (
              <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <img src={property.photos[0]} alt={property.title} className="w-full sm:w-48 h-40 sm:h-auto object-cover" />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-heading font-semibold text-sand-900 dark:text-sand-100">{property.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-sand-500 mt-1">
                          <MapPin size={12} /> {property.city}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        booking.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-sand-100 dark:bg-sand-700 text-sand-600'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmada' : booking.status === 'cancelled' ? 'Cancelada' : 'Concluída'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-sand-600 dark:text-sand-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{format(parseISO(booking.checkIn), "dd/MM")} — {format(parseISO(booking.checkOut), "dd/MM/yy")}</span>
                      </div>
                      <span className="font-semibold text-terra-600 dark:text-terra-400">R$ {booking.totalPrice}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {tab === 'upcoming' && booking.status === 'confirmed' && (
                        <button onClick={() => handleCancel(booking.id)} className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1">
                          <XCircle size={12} /> Cancelar
                        </button>
                      )}
                      {tab === 'past' && !hasReview && (
                        <button onClick={() => setReviewModal(booking.id)} className="px-3 py-1.5 text-xs font-medium text-terra-600 dark:text-terra-400 hover:bg-terra-50 dark:hover:bg-terra-900/20 rounded-lg transition-colors flex items-center gap-1">
                          <Star size={12} /> Avaliar
                        </button>
                      )}
                      {hasReview && (
                        <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle size={12} /> Avaliado</span>
                      )}
                      <button onClick={() => navigate(`/imovel/${property.id}`)} className="ml-auto px-3 py-1.5 text-xs font-medium text-sand-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-sand-700 rounded-lg transition-colors">
                        Ver imóvel
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setReviewModal(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-sand-800 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100 mb-4">Avaliar sua estadia</h3>
            <div className="mb-4">
              <label className="text-sm text-sand-600 dark:text-sand-400 block mb-2">Nota</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setReviewRating(n)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${n <= reviewRating ? 'bg-amber-400 text-white' : 'bg-sand-100 dark:bg-sand-700 text-sand-400'}`}>
                    <Star size={18} className={n <= reviewRating ? 'fill-white' : ''} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-sand-600 dark:text-sand-400 block mb-2">Comentário</label>
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} placeholder="Conte como foi sua experiência..." className="w-full px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setReviewModal(null)} className="flex-1 py-2 bg-sand-100 dark:bg-sand-700 text-sand-700 dark:text-sand-300 font-medium rounded-xl">Cancelar</button>
              <button onClick={() => handleSubmitReview(reviewModal)} className="flex-1 py-2 bg-terra-500 hover:bg-terra-600 text-white font-medium rounded-xl transition-colors">Enviar</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
