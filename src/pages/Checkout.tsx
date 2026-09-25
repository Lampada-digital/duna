import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, CreditCard, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-sand-800 dark:text-sand-200">Reserva não encontrada</h1>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-terra-500 text-white rounded-full">Voltar ao início</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="font-heading font-bold text-2xl text-sand-900 dark:text-sand-100 mb-8">Finalizar Reserva</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6">
            <h2 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100 mb-4">Dados do Hóspede</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-sand-700 dark:text-sand-300 block mb-1">Nome completo</label>
                <input type="text" defaultValue="Visitante Demo" className="w-full px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-sand-700 dark:text-sand-300 block mb-1">E-mail</label>
                <input type="email" defaultValue="demo@duna.com" className="w-full px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-sand-700 dark:text-sand-300 block mb-1">Telefone</label>
                <input type="tel" placeholder="(00) 00000-0000" className="w-full px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-sand-700 dark:text-sand-300 block mb-1">CPF</label>
                <input type="text" placeholder="000.000.000-00" className="w-full px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6">
            <h2 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-terra-500" /> Pagamento
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-sand-700 dark:text-sand-300 block mb-1">Número do cartão</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-sand-700 dark:text-sand-300 block mb-1">Validade</label>
                  <input type="text" placeholder="MM/AA" className="w-full px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-sand-700 dark:text-sand-300 block mb-1">CVV</label>
                  <input type="text" placeholder="000" className="w-full px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-sand-500">
              <Shield size={14} className="text-green-500" />
              <span>Pagamento seguro processado via Stripe</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 sticky top-24">
            <h2 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100 mb-4">Resumo da Reserva</h2>
            
            <div className="flex gap-3 mb-4 pb-4 border-b border-sand-200 dark:border-sand-700">
              <img src={property.photos[0]} alt={property.title} className="w-20 h-16 object-cover rounded-lg" />
              <div>
                <p className="text-sm font-medium text-sand-800 dark:text-sand-200">{property.title}</p>
                <p className="text-xs text-sand-500">{property.neighborhood}, {property.city}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-sand-600 dark:text-sand-400">
                <span>Check-in</span>
                <span className="font-medium text-sand-800 dark:text-sand-200">{format(parseISO(booking.checkIn), "dd 'de' MMM", { locale: ptBR })}</span>
              </div>
              <div className="flex justify-between text-sand-600 dark:text-sand-400">
                <span>Check-out</span>
                <span className="font-medium text-sand-800 dark:text-sand-200">{format(parseISO(booking.checkOut), "dd 'de' MMM", { locale: ptBR })}</span>
              </div>
              <div className="flex justify-between text-sand-600 dark:text-sand-400">
                <span>Hóspedes</span>
                <span className="font-medium text-sand-800 dark:text-sand-200">{booking.guests}</span>
              </div>
            </div>

            <div className="space-y-2 py-4 border-t border-sand-200 dark:border-sand-700">
              <div className="flex justify-between text-sm text-sand-600 dark:text-sand-400">
                <span>Diárias</span>
                <span>R$ {booking.nightlyTotal}</span>
              </div>
              <div className="flex justify-between text-sm text-sand-600 dark:text-sand-400">
                <span>Taxa de limpeza</span>
                <span>R$ {booking.cleaningFee}</span>
              </div>
              <div className="flex justify-between text-sm text-sand-600 dark:text-sand-400">
                <span>Taxa Duna (6%)</span>
                <span>R$ {booking.serviceFee}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-sand-900 dark:text-sand-100 pt-2 border-t border-sand-200 dark:border-sand-700">
                <span>Total</span>
                <span className="text-terra-600 dark:text-terra-400">R$ {booking.totalPrice}</span>
              </div>
            </div>

            <button onClick={() => navigate(`/confirmacao/${booking.id}`)} className="w-full mt-4 py-3 bg-gradient-to-r from-terra-500 to-terra-600 hover:from-terra-600 hover:to-terra-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-terra-500/20 flex items-center justify-center gap-2">
              <CheckCircle size={18} /> Confirmar e Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
