import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, Mail, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function BookingConfirmation() {
  const { bookingId } = useParams();
  const { bookings, properties } = useApp();
  const navigate = useNavigate();
  const booking = bookings.find(b => b.id === bookingId);
  const property = booking ? properties.find(p => p.id === booking.propertyId) : null;

  if (!booking || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-sand-900 dark:text-sand-100">Reserva não encontrada</h1>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-3 bg-terra-500 text-white rounded-xl font-semibold">Voltar ao início</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16 animate-fade-in">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }} className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30">
          <CheckCircle size={40} className="text-white" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50">Reserva confirmada!</h1>
        <p className="text-sand-600 dark:text-sand-400 mt-3 text-lg">Sua viagem está garantida. Mal podemos esperar!</p>
      </motion.div>

      <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 overflow-hidden card-shadow">
        {/* Property info */}
        <div className="relative h-52">
          <img src={property.photos[0]} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-5 text-white">
            <h2 className="font-display font-bold text-xl">{property.title}</h2>
            <div className="flex items-center gap-1.5 text-sm opacity-90 mt-1">
              <MapPin size={14} /> {property.neighborhood}, {property.city}
            </div>
          </div>
        </div>

        {/* Booking details */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sand-50 dark:bg-sand-700 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sand-500 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar size={12} /> Check-in
              </div>
              <p className="font-semibold text-sand-900 dark:text-sand-100">{format(parseISO(booking.checkIn), "dd 'de' MMM", { locale: ptBR })}</p>
              <p className="text-xs text-sand-500 mt-0.5">A partir das 15h</p>
            </div>
            <div className="bg-sand-50 dark:bg-sand-700 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sand-500 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar size={12} /> Check-out
              </div>
              <p className="font-semibold text-sand-900 dark:text-sand-100">{format(parseISO(booking.checkOut), "dd 'de' MMM", { locale: ptBR })}</p>
              <p className="text-xs text-sand-500 mt-0.5">Até as 11h</p>
            </div>
          </div>

          <div className="border-t border-sand-200 dark:border-sand-700 pt-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-sand-500">Código da reserva</span>
              <span className="font-mono font-bold text-sand-900 dark:text-sand-100">{booking.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sand-500">Hóspedes</span>
              <span className="font-medium text-sand-900 dark:text-sand-100">{booking.guests}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sand-500">Status do pagamento</span>
              <span className="px-2.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">Confirmado</span>
            </div>
            <div className="flex justify-between font-bold pt-3 border-t border-sand-200 dark:border-sand-700">
              <span className="text-sand-700 dark:text-sand-300">Total</span>
              <span className="text-lg text-sand-900 dark:text-sand-100">R$ {booking.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email notification */}
      <div className="mt-6 bg-terra-50 dark:bg-terra-900/20 rounded-2xl p-5 flex items-start gap-3 border border-terra-200 dark:border-terra-800">
        <Mail size={20} className="text-terra-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-sand-900 dark:text-sand-100">Confirmação enviada por e-mail</p>
          <p className="text-xs text-sand-600 dark:text-sand-400 mt-1">
            Um e-mail com todos os detalhes da sua reserva foi enviado pela Duna.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button onClick={() => navigate('/minhas-reservas')} className="flex-1 py-3.5 bg-sand-900 dark:bg-sand-100 hover:bg-sand-800 dark:hover:bg-sand-200 text-white dark:text-sand-900 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 btn-press">
          Ver minhas reservas <ArrowRight size={16} />
        </button>
        <button onClick={() => navigate('/')} className="flex-1 py-3.5 border border-sand-300 dark:border-sand-700 hover:bg-sand-100 dark:hover:bg-sand-800 text-sand-700 dark:text-sand-300 font-semibold rounded-xl transition-colors btn-press">
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
