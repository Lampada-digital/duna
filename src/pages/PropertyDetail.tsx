import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AMENITY_LABELS, AMENITY_ICONS } from '../data/seed';
import { Star, MapPin, Heart, Share2, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays, eachDayOfInterval, parseISO } from 'date-fns';
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-sand-900 dark:text-sand-100">Imóvel não encontrado</h1>
        <p className="text-sand-500 mt-2">Este imóvel pode ter sido removido ou não está mais disponível.</p>
        <button onClick={() => navigate('/buscar')} className="mt-6 px-6 py-3 bg-terra-500 text-white rounded-xl font-semibold">Voltar à busca</button>
      </div>
    );
  }

  const nights = checkIn && checkOut ? differenceInDays(parseISO(checkOut), parseISO(checkIn)) : 0;
  const nightlyTotal = nights * property.pricePerNight;
  const serviceFee = Math.round(nightlyTotal * 0.06);
  const totalPrice = nightlyTotal + property.cleaningFee + serviceFee;

  const isDateBlocked = (date: string) => property.blockedDates.includes(date);

  const handleBooking = () => {
    if (!checkIn || !checkOut) { setShowBookingError('Selecione as datas de check-in e check-out'); return; }
    if (nights <= 0) { setShowBookingError('Datas inválidas'); return; }

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
      {/* Back button */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-sand-700 dark:text-sand-300 hover:text-sand-900 dark:hover:text-sand-100 transition-colors">
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      {/* Title Section */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-sand-900 dark:text-sand-50">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-sand-600 dark:text-sand-400">
              {property.rating > 0 && (
                <>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-sand-900 dark:text-sand-100 fill-current" />
                    <span className="font-semibold text-sand-900 dark:text-sand-100">{property.rating.toFixed(2)}</span>
                  </div>
                  <span>·</span>
                </>
              )}
              <span className="underline font-medium">{property.reviewCount} avaliações</span>
              <span>·</span>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{property.neighborhood}, {property.city}, {property.state}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-sand-700 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800 rounded-lg transition-colors">
              <Share2 size={16} /> Compartilhar
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-sand-700 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800 rounded-lg transition-colors">
              <Heart size={16} /> Salvar
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery - Airbnb style 1+4 */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pb-6">
        <div className="relative grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[300px] md:h-[460px] rounded-2xl overflow-hidden cursor-pointer" onClick={() => setSelectedPhoto(0)}>
          {/* Main large photo */}
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden">
            <img src={property.photos[0]} alt={property.title} className="w-full h-full object-cover hover:brightness-95 transition-all duration-300" />
          </div>
          {/* 4 smaller photos */}
          {property.photos.slice(1, 5).map((photo, i) => (
            <div key={i} className="hidden md:block relative overflow-hidden" onClick={(e) => { e.stopPropagation(); setSelectedPhoto(i + 1); }}>
              <img src={photo} alt="" className="w-full h-full object-cover hover:brightness-95 transition-all duration-300" />
            </div>
          ))}
          {/* Show more button */}
          {property.photos.length > 5 && (
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto(5); }}
              className="absolute bottom-4 right-4 px-4 py-2 bg-white dark:bg-sand-800 rounded-lg text-sm font-medium text-sand-900 dark:text-sand-100 hover:bg-sand-100 dark:hover:bg-sand-700 transition-colors border border-sand-200 dark:border-sand-700"
            >
              Mostrar todas as {property.photos.length} fotos
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Photo Viewer */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-sand-950 flex flex-col" onClick={() => setSelectedPhoto(null)}>
            <div className="flex items-center justify-between px-4 py-4">
              <button onClick={() => setSelectedPhoto(null)} className="flex items-center gap-2 text-white text-sm font-medium hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                <X size={18} /> Fechar
              </button>
              <span className="text-white text-sm">{selectedPhoto + 1} / {property.photos.length}</span>
              <div className="w-20" />
            </div>
            <div className="flex-1 flex items-center justify-center relative px-4">
              <button onClick={(e) => { e.stopPropagation(); setSelectedPhoto(Math.max(0, selectedPhoto - 1)); }} className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors" disabled={selectedPhoto === 0}>
                <ChevronLeft size={20} />
              </button>
              <img src={property.photos[selectedPhoto]} alt="" className="max-w-full max-h-[80vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
              <button onClick={(e) => { e.stopPropagation(); setSelectedPhoto(Math.min(property.photos.length - 1, selectedPhoto + 1)); }} className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors" disabled={selectedPhoto === property.photos.length - 1}>
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Host info */}
            <div className="flex items-center justify-between pb-6 border-b border-sand-200 dark:border-sand-800">
              <div>
                <h2 className="font-display text-xl md:text-2xl font-semibold text-sand-900 dark:text-sand-100">
                  Imóvel inteiro: {property.type === 'apartment' ? 'apartamento' : property.type === 'house' ? 'casa' : property.type === 'cabin' ? 'cabana' : property.type === 'loft' ? 'loft' : 'studio'}
                </h2>
                <p className="text-sand-600 dark:text-sand-400 mt-1">
                  {property.maxGuests} hóspedes · {property.bedrooms} quarto{property.bedrooms > 1 ? 's' : ''} · {property.bathrooms} banheiro{property.bathrooms > 1 ? 's' : ''}
                </p>
              </div>
              <div className="w-12 h-12 bg-sand-200 dark:bg-sand-700 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-sand-600 dark:text-sand-300">C</span>
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-5 pb-6 border-b border-sand-200 dark:border-sand-800">
              {property.rating >= 4.8 && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sand-900 dark:text-sand-100">Um dos imóveis mais amados</p>
                    <p className="text-sm text-sand-600 dark:text-sand-400">Entre os imóveis mais reservados na Duna este ano.</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-sand-600 dark:text-sand-400" />
                </div>
                <div>
                  <p className="font-semibold text-sand-900 dark:text-sand-100">Localização excelente</p>
                  <p className="text-sm text-sand-600 dark:text-sand-400">95% dos hóspedes recentes deram 5 estrelas à localização.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🔑</span>
                </div>
                <div>
                  <p className="font-semibold text-sand-900 dark:text-sand-100">Check-in por conta própria</p>
                  <p className="text-sm text-sand-600 dark:text-sand-400">Faça check-in sozinho com a fechadura inteligente.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-sand-200 dark:border-sand-800">
              <p className="text-sand-700 dark:text-sand-300 leading-relaxed text-[15px]">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="pb-6 border-b border-sand-200 dark:border-sand-800">
              <h2 className="font-display text-xl md:text-2xl font-semibold text-sand-900 dark:text-sand-100 mb-5">O que este lugar oferece</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.slice(0, 8).map(a => (
                  <div key={a} className="flex items-center gap-4 py-2">
                    <span className="text-xl w-8 text-center">{AMENITY_ICONS[a] || '✓'}</span>
                    <span className="text-[15px] text-sand-700 dark:text-sand-300">{AMENITY_LABELS[a] || a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="pb-6 border-b border-sand-200 dark:border-sand-800">
              <h2 className="font-display text-xl md:text-2xl font-semibold text-sand-900 dark:text-sand-100 mb-5">Disponibilidade</h2>
              <p className="text-sm text-sand-600 dark:text-sand-400 mb-4">
                Selecione as datas no card de reserva para ver a disponibilidade.
              </p>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                  <div key={i} className="text-xs font-medium text-sand-400 py-2">{d}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i);
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const blocked = isDateBlocked(dateStr);
                  return (
                    <div key={i} className={`py-2 text-sm rounded-lg ${blocked ? 'text-sand-300 dark:text-sand-600 line-through' : 'text-sand-700 dark:text-sand-300 hover:bg-terra-50 dark:hover:bg-terra-900/20 cursor-pointer'}`}>
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Star size={20} className="text-sand-900 dark:text-sand-100 fill-current" />
                <h2 className="font-display text-xl md:text-2xl font-semibold text-sand-900 dark:text-sand-100">
                  {property.rating.toFixed(2)} · {property.reviewCount} avaliações
                </h2>
              </div>
              {propertyReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {propertyReviews.slice(0, 6).map(r => (
                    <div key={r.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-terra-400 to-terra-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{r.guestName[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-sand-900 dark:text-sand-100">{r.guestName}</p>
                          <p className="text-xs text-sand-500">{format(parseISO(r.createdAt), "MMMM 'de' yyyy", { locale: ptBR })}</p>
                        </div>
                      </div>
                      <p className="text-sm text-sand-600 dark:text-sand-400 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sand-600 dark:text-sand-400">Este imóvel ainda não possui avaliações.</p>
              )}
            </div>

            {/* Location */}
            <div className="pb-6 border-b border-sand-200 dark:border-sand-800">
              <h2 className="font-display text-xl md:text-2xl font-semibold text-sand-900 dark:text-sand-100 mb-5">Onde você vai ficar</h2>
              <div className="relative h-80 bg-sand-100 dark:bg-sand-800 rounded-2xl overflow-hidden border border-sand-200 dark:border-sand-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-terra-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-terra-500/30">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <p className="font-medium text-sand-800 dark:text-sand-200">{property.neighborhood}</p>
                    <p className="text-sm text-sand-500 mt-1">{property.city}, {property.state}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 card-shadow">
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-2xl font-bold text-sand-900 dark:text-sand-100">R$ {property.pricePerNight}</span>
                  <span className="text-sand-500">/ noite</span>
                </div>

                {/* Date Selection */}
                <div className="border border-sand-300 dark:border-sand-600 rounded-xl overflow-hidden mb-4">
                  <div className="grid grid-cols-2 divide-x divide-sand-300 dark:divide-sand-600">
                    <div className="p-3">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-sand-500 block mb-1">Check-in</label>
                      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={format(new Date(), 'yyyy-MM-dd')} className="w-full text-sm text-sand-800 dark:text-sand-200 bg-transparent focus:outline-none" />
                    </div>
                    <div className="p-3">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-sand-500 block mb-1">Check-out</label>
                      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn || format(new Date(), 'yyyy-MM-dd')} className="w-full text-sm text-sand-800 dark:text-sand-200 bg-transparent focus:outline-none" />
                    </div>
                  </div>
                  <div className="p-3 border-t border-sand-300 dark:border-sand-600">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-sand-500 block mb-1">Hóspedes</label>
                    <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full text-sm text-sand-800 dark:text-sand-200 bg-transparent focus:outline-none">
                      {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} hóspede{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {showBookingError && (
                  <p className="text-sm text-red-500 mb-3 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{showBookingError}</p>
                )}

                <button
                  onClick={handleBooking}
                  className="w-full py-3.5 bg-gradient-to-r from-terra-500 to-terra-600 hover:from-terra-600 hover:to-terra-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-terra-500/20 btn-press text-[15px]"
                >
                  {nights > 0 ? 'Reservar' : 'Verificar disponibilidade'}
                </button>

                {nights > 0 && (
                  <p className="text-center text-sm text-sand-500 mt-3">Você não será cobrado ainda</p>
                )}

                {/* Price Summary */}
                {nights > 0 && (
                  <div className="mt-6 space-y-3 pt-6 border-t border-sand-200 dark:border-sand-700">
                    <div className="flex justify-between text-[15px] text-sand-700 dark:text-sand-300">
                      <span className="underline">R$ {property.pricePerNight} x {nights} noite{nights > 1 ? 's' : ''}</span>
                      <span>R$ {nightlyTotal}</span>
                    </div>
                    <div className="flex justify-between text-[15px] text-sand-700 dark:text-sand-300">
                      <span className="underline">Taxa de limpeza</span>
                      <span>R$ {property.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between text-[15px] text-sand-700 dark:text-sand-300">
                      <span className="underline">Taxa Duna</span>
                      <span>R$ {serviceFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sand-900 dark:text-sand-100 pt-4 border-t border-sand-200 dark:border-sand-700">
                      <span>Total</span>
                      <span>R$ {totalPrice}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Report */}
              <div className="mt-4 text-center">
                <button className="text-sm text-sand-500 underline hover:text-sand-700 dark:hover:text-sand-300 transition-colors">
                  Denunciar este anúncio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
