import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, CreditCard, Shield } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Checkout() {
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12 animate-fade-in">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50 mb-8">Finalizar reserva</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 md:p-8 card-shadow">
            <h2 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100 mb-6">Seus dados</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Nome completo</label>
                <input type="text" defaultValue="Visitante Demo" className="w-full px-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">E-mail</label>
                  <input type="email" defaultValue="demo@duna.com" className="w-full px-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Telefone</label>
                  <input type="tel" placeholder="(00) 00000-0000" className="w-full px-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 md:p-8 card-shadow">
            <h2 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100 mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-terra-500" /> Pagamento
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Número do cartão</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Validade</label>
                  <input type="text" placeholder="MM/AA" className="w-full px-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">CVV</label>
                  <input type="text" placeholder="000" className="w-full px-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5 pt-5 border-t border-sand-200 dark:border-sand-700">
              <Shield size={16} className="text-green-500" />
              <span className="text-xs text-sand-500">Pagamento 100% seguro via Stripe</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 sticky top-28 card-shadow">
            <h2 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100 mb-5">Sua reserva</h2>

            <div className="flex gap-3 mb-5 pb-5 border-b border-sand-200 dark:border-sand-700">
              <img src={property.photos[0]} alt={property.title} className="w-20 h-20 object-cover rounded-xl" />
              <div>
                <p className="text-sm font-semibold text-sand-900 dark:text-sand-100 line-clamp-2">{property.title}</p>
                <div className="flex items-center gap-1 text-xs text-sand-500 mt-1">
                  <span>★ {property.rating.toFixed(2)}</span>
                  <span>·</span>
                  <span>{property.reviewCount} avaliações</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-5 pb-5 border-b border-sand-200 dark:border-sand-700">
              <div className="flex justify-between">
                <span className="text-sand-500">CHECK-IN</span>
                <span className="font-semibold text-sand-900 dark:text-sand-100">{format(parseISO(booking.checkIn), "dd 'de' MMM", { locale: ptBR })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-500">CHECK-OUT</span>
                <span className="font-semibold text-sand-900 dark:text-sand-100">{format(parseISO(booking.checkOut), "dd 'de' MMM", { locale: ptBR })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-500">HÓSPEDES</span>
                <span className="font-semibold text-sand-900 dark:text-sand-100">{booking.guests}</span>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm text-sand-700 dark:text-sand-300">
                <span>R$ {property.pricePerNight} x {Math.round(booking.nightlyTotal / property.pricePerNight)} noites</span>
                <span>R$ {booking.nightlyTotal}</span>
              </div>
              <div className="flex justify-between text-sm text-sand-700 dark:text-sand-300">
                <span>Taxa de limpeza</span>
                <span>R$ {booking.cleaningFee}</span>
              </div>
              <div className="flex justify-between text-sm text-sand-700 dark:text-sand-300">
                <span>Taxa Duna</span>
                <span>R$ {booking.serviceFee}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-sand-900 dark:text-sand-100 pt-4 border-t border-sand-200 dark:border-sand-700">
              <span>Total (BRL)</span>
              <span className="text-lg">R$ {booking.totalPrice}</span>
            </div>

            <button onClick={() => navigate(`/confirmacao/${booking.id}`)} className="w-full mt-6 py-3.5 bg-gradient-to-r from-terra-500 to-terra-600 hover:from-terra-600 hover:to-terra-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-terra-500/20 flex items-center justify-center gap-2 btn-press">
              <CheckCircle size={18} /> Confirmar e pagar
            </button>

            <p className="text-xs text-center text-sand-500 mt-3">Ao confirmar, você concorda com os Termos da Duna.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
