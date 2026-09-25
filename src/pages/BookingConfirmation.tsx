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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-sand-800 dark:text-sand-200">Reserva não encontrada</h1>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-terra-500 text-white rounded-full">Voltar ao início</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }} className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="font-heading font-bold text-3xl text-sand-900 dark:text-sand-100 mb-2">Reserva Confirmada!</h1>
        <p className="text-sand-600 dark:text-sand-400">Sua reserva foi processada com sucesso. Um e-mail de confirmação foi enviado.</p>
      </motion.div>

      <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 overflow-hidden">
        {/* Property info */}
        <div className="relative h-48">
          <img src={property.photos[0]} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="font-heading font-bold text-xl">{property.title}</h2>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <MapPin size={14} /> {property.neighborhood}, {property.city}
            </div>
          </div>
        </div>

        {/* Booking details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sand-50 dark:bg-sand-700 rounded-xl p-3">
              <div className="flex items-center gap-2 text-sand-500 text-xs mb-1">
                <Calendar size={12} /> Check-in
              </div>
              <p className="font-semibold text-sand-800 dark:text-sand-200">{format(parseISO(booking.checkIn), "dd 'de' MMM, yyyy", { locale: ptBR })}</p>
            </div>
            <div className="bg-sand-50 dark:bg-sand-700 rounded-xl p-3">
              <div className="flex items-center gap-2 text-sand-500 text-xs mb-1">
                <Calendar size={12} /> Check-out
              </div>
              <p className="font-semibold text-sand-800 dark:text-sand-200">{format(parseISO(booking.checkOut), "dd 'de' MMM, yyyy", { locale: ptBR })}</p>
            </div>
          </div>

          <div className="border-t border-sand-200 dark:border-sand-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sand-500">Código da reserva</span>
              <span className="font-mono font-medium text-sand-800 dark:text-sand-200">{booking.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sand-500">Hóspedes</span>
              <span className="font-medium text-sand-800 dark:text-sand-200">{booking.guests}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sand-500">Status do pagamento</span>
              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">Pago</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-sand-200 dark:border-sand-700">
              <span className="text-sand-700 dark:text-sand-300">Total pago</span>
              <span className="text-terra-600 dark:text-terra-400">R$ {booking.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email notification */}
      <div className="mt-6 bg-terra-50 dark:bg-terra-900/20 rounded-xl p-4 flex items-start gap-3">
        <Mail size={20} className="text-terra-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-sand-800 dark:text-sand-200">Confirmação enviada por e-mail</p>
          <p className="text-xs text-sand-600 dark:text-sand-400 mt-1">
            Um e-mail com todos os detalhes da sua reserva foi enviado pela Duna. Verifique sua caixa de entrada (e spam).
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button onClick={() => navigate('/minhas-reservas')} className="flex-1 py-3 bg-terra-500 hover:bg-terra-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
          Ver minhas reservas <ArrowRight size={16} />
        </button>
        <button onClick={() => navigate('/')} className="flex-1 py-3 bg-sand-100 dark:bg-sand-800 hover:bg-sand-200 dark:hover:bg-sand-700 text-sand-700 dark:text-sand-300 font-medium rounded-xl transition-colors">
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
