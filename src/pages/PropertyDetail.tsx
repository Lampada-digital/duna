import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AMENITY_LABELS, AMENITY_ICONS } from '../data/seed';
import { Star, MapPin, Calendar, Users, X, ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays, eachDayOfInterval, parseISO, isBefore, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function PropertyDetail() {
  const { id } = useParams();
  const { properties, reviews, createBooking, currentUser, login } = useApp();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === id);
  const propertyReviews = reviews.filter(r => r.propertyId === id);

  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showBookingError, setShowBookingError] = useState('');

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-sand-800 dark:text-sand-200">Imóvel não encontrado</h1>
        <p className="text-sand-500 mt-2">Este imóvel pode ter sido removido ou não está mais disponível.</p>
        <button onClick={() => navigate('/buscar')} className="mt-6 px-6 py-2 bg-terra-500 text-white rounded-full">Voltar à busca</button>
      </div>
    );
  }

  const nights = checkIn && checkOut ? differenceInDays(parseISO(checkOut), parseISO(checkIn)) : 0;
  const nightlyTotal = nights * property.pricePerNight;
  const serviceFee = Math.round(nightlyTotal * 0.06);
  const totalPrice = nightlyTotal + property.cleaningFee + serviceFee;

  // Check available dates
  const isDateBlocked = (date: string) => property.blockedDates.includes(date);

  const handleBooking = () => {
    if (!checkIn || !checkOut) { setShowBookingError('Selecione as datas de check-in e check-out'); return; }
    if (nights <= 0) { setShowBookingError('Datas inválidas'); return; }

    // Check for blocked dates in range
    const days = eachDayOfInterval({ start: parseISO(checkIn), end: parseISO(checkOut) });
    const blocked = days.filter(d => isDateBlocked(format(d, 'yyyy-MM-dd')));
    if (blocked.length > 0) { setShowBookingError('Existem datas bloqueadas no período selecionado'); return; }

    if (!currentUser) {
      login('demo@duna.com', 'guest');
    }

    const booking = createBooking({
      propertyId: property.id,
      guestId: currentUser?.id || 'user-1',
      checkIn, checkOut, guests,
      totalPrice, nightlyTotal,
      cleaningFee: property.cleaningFee,
      serviceFee,
      realEstateFee: Math.round(nightlyTotal * 0.02),
      status: 'confirmed',
      paymentStatus: 'paid',
    });

    // Check affiliate referral
    const referral = localStorage.getItem('duna_referral');
    if (referral) {
      const ref = JSON.parse(referral);
      const fifteenDays = 15 * 24 * 60 * 60 * 1000;
      if (Date.now() - ref.timestamp < fifteenDays) {
        booking.affiliateId = ref.affiliateId;
      }
      localStorage.removeItem('duna_referral');
    }

    navigate(`/confirmacao/${booking.id}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Photo Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[300px] md:h-[400px]">
          <div className="md:col-span-2 md:row-span-2 relative cursor-pointer" onClick={() => setSelectedPhoto(0)}>
            <img src={property.photos[0]} alt={property.title} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
          </div>
          {property.photos.slice(1, 5).map((photo, i) => (
            <div key={i} className="hidden md:block relative cursor-pointer" onClick={() => setSelectedPhoto(i + 1)}>
              <img src={photo} alt="" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
              {i === 3 && property.photos.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">+{property.photos.length - 5} fotos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Photo Viewer */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setSelectedPhoto(null)}>
            <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            <button onClick={(e) => { e.stopPropagation(); setSelectedPhoto(Math.max(0, selectedPhoto - 1)); }} className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full"><ChevronLeft size={24} /></button>
            <button onClick={(e) => { e.stopPropagation(); setSelectedPhoto(Math.min(property.photos.length - 1, selectedPhoto + 1)); }} className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full"><ChevronRight size={24} /></button>
            <img src={property.photos[selectedPhoto]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
            <div className="absolute bottom-4 text-white text-sm">{selectedPhoto + 1} / {property.photos.length}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Info */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-heading font-bold text-2xl md:text-3xl text-sand-900 dark:text-sand-100">{property.title}</h1>
                  <div className="flex items-center gap-3 mt-2 text-sm text-sand-600 dark:text-sand-400">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      <span className="font-medium">{property.rating.toFixed(1)}</span>
                      <span>({property.reviewCount} avaliações)</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{property.neighborhood}, {property.city} - {property.state}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors"><Heart size={20} className="text-sand-600 dark:text-sand-400" /></button>
                  <button className="p-2 rounded-full hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors"><Share2 size={20} className="text-sand-600 dark:text-sand-400" /></button>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 py-4 border-y border-sand-200 dark:border-sand-700">
                <div className="text-center">
                  <Users size={20} className="mx-auto text-sand-500 mb-1" />
                  <span className="text-sm font-medium text-sand-700 dark:text-sand-300">{property.maxGuests} hóspedes</span>
                </div>
                <div className="text-center">
                  <span className="text-xl">🛏️</span>
                  <p className="text-sm font-medium text-sand-700 dark:text-sand-300 mt-1">{property.bedrooms} quarto{property.bedrooms > 1 ? 's' : ''}</p>
                </div>
                <div className="text-center">
                  <span className="text-xl">🚿</span>
                  <p className="text-sm font-medium text-sand-700 dark:text-sand-300 mt-1">{property.bathrooms} banheiro{property.bathrooms > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100 mb-3">Sobre este imóvel</h2>
              <p className="text-sand-600 dark:text-sand-400 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100 mb-4">Comodidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map(a => (
                  <div key={a} className="flex items-center gap-3 p-3 bg-sand-50 dark:bg-sand-800 rounded-xl">
                    <span className="text-lg">{AMENITY_ICONS[a] || '✓'}</span>
                    <span className="text-sm text-sand-700 dark:text-sand-300">{AMENITY_LABELS[a] || a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar / Availability */}
            <div>
              <h2 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100 mb-4">Disponibilidade</h2>
              <div className="bg-sand-50 dark:bg-sand-800 rounded-xl p-4">
                <p className="text-sm text-sand-600 dark:text-sand-400 mb-3">
                  {property.blockedDates.length > 0 
                    ? `${property.blockedDates.length} data(s) já reservada(s) ou bloqueada(s)`
                    : 'Todas as datas estão disponíveis!'}
                </p>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                    <div key={d} className="font-medium text-sand-500 py-1">{d}</div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const blocked = isDateBlocked(dateStr);
                    return (
                      <div key={i} className={`py-1.5 rounded text-xs ${blocked ? 'bg-red-100 dark:bg-red-900/30 text-red-500 line-through' : 'text-sand-700 dark:text-sand-300'}`}>
                        {date.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100 mb-4">
                Avaliações ({propertyReviews.length})
              </h2>
              {propertyReviews.length > 0 ? (
                <div className="space-y-4">
                  {propertyReviews.map(r => (
                    <div key={r.id} className="bg-white dark:bg-sand-800 rounded-xl p-4 border border-sand-200 dark:border-sand-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-terra-100 dark:bg-terra-900/50 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-terra-600 dark:text-terra-400">{r.guestName[0]}</span>
                          </div>
                          <span className="text-sm font-medium text-sand-800 dark:text-sand-200">{r.guestName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          <span className="text-sm font-medium">{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-sand-600 dark:text-sand-400">{r.comment}</p>
                      <p className="text-xs text-sand-400 mt-2">{format(parseISO(r.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-sand-500 dark:text-sand-400">Este imóvel ainda não possui avaliações. Seja o primeiro!</p>
              )}
            </div>

            {/* Location */}
            <div>
              <h2 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100 mb-4">Localização</h2>
              <div className="bg-sand-100 dark:bg-sand-800 rounded-xl p-8 text-center">
                <MapPin size={32} className="mx-auto text-terra-500 mb-2" />
                <p className="text-sm font-medium text-sand-700 dark:text-sand-300">{property.address}</p>
                <p className="text-xs text-sand-500 mt-1">{property.neighborhood}, {property.city} - {property.state}</p>
                <p className="text-xs text-sand-400 mt-2">Localização aproximada (mostrada após a reserva)</p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 shadow-lg">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-terra-600 dark:text-terra-400">R$ {property.pricePerNight}</span>
                <span className="text-sm text-sand-500">/noite</span>
              </div>

              {/* Date Selection */}
              <div className="space-y-3 mb-4">
                <div className="border border-sand-200 dark:border-sand-700 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-sand-200 dark:divide-sand-700">
                    <div className="p-3">
                      <label className="text-[10px] font-bold uppercase text-sand-500 block">Check-in</label>
                      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={format(new Date(), 'yyyy-MM-dd')} className="w-full text-sm text-sand-800 dark:text-sand-200 bg-transparent focus:outline-none" />
                    </div>
                    <div className="p-3">
                      <label className="text-[10px] font-bold uppercase text-sand-500 block">Check-out</label>
                      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn || format(new Date(), 'yyyy-MM-dd')} className="w-full text-sm text-sand-800 dark:text-sand-200 bg-transparent focus:outline-none" />
                    </div>
                  </div>
                </div>
                <div className="border border-sand-200 dark:border-sand-700 rounded-xl p-3">
                  <label className="text-[10px] font-bold uppercase text-sand-500 block mb-1">Hóspedes</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full text-sm text-sand-800 dark:text-sand-200 bg-transparent focus:outline-none">
                    {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} hóspede{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {showBookingError && (
                <p className="text-sm text-red-500 mb-3 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{showBookingError}</p>
              )}

              {/* Price Summary */}
              {nights > 0 && (
                <div className="space-y-2 py-4 border-t border-sand-200 dark:border-sand-700">
                  <div className="flex justify-between text-sm text-sand-600 dark:text-sand-400">
                    <span>R$ {property.pricePerNight} x {nights} noite{nights > 1 ? 's' : ''}</span>
                    <span>R$ {nightlyTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-sand-600 dark:text-sand-400">
                    <span>Taxa de limpeza</span>
                    <span>R$ {property.cleaningFee}</span>
                  </div>
                  <div className="flex justify-between text-sm text-sand-600 dark:text-sand-400">
                    <span>Taxa Duna</span>
                    <span>R$ {serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sand-900 dark:text-sand-100 pt-2 border-t border-sand-200 dark:border-sand-700">
                    <span>Total</span>
                    <span className="text-terra-600 dark:text-terra-400">R$ {totalPrice}</span>
                  </div>
                </div>
              )}

              <button onClick={handleBooking} className="w-full mt-4 py-3 bg-gradient-to-r from-terra-500 to-terra-600 hover:from-terra-600 hover:to-terra-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-terra-500/20">
                {nights > 0 ? 'Reservar agora' : 'Selecione as datas'}
              </button>

              <p className="text-xs text-center text-sand-400 mt-3">Você não será cobrado ainda</p>

              {/* Cancellation Policy */}
              <div className="mt-4 pt-4 border-t border-sand-200 dark:border-sand-700">
                <p className="text-xs text-sand-500">
                  <span className="font-medium">Política de cancelamento: </span>
                  {property.cancellationPolicy === 'flexible' && 'Cancelamento gratuito até 24h antes do check-in.'}
                  {property.cancellationPolicy === 'moderate' && 'Reembolso de 50% se cancelado até 5 dias antes do check-in.'}
                  {property.cancellationPolicy === 'strict' && 'Sem reembolso. Cancelamentos não são permitidos.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
