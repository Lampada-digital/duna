import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard';
import { Search, Calendar, Users, MapPin, ArrowRight, Star, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const POPULAR_DESTINATIONS = ['Florianópolis', 'Rio de Janeiro', 'Gramado', 'Porto de Galinhas', 'Campos do Jordão', 'Ouro Preto'];

export function Home() {
  const { properties, setSearchFilters, searchFilters, getAffiliateByCode, recordAffiliateClick } = useApp();
  const [destination, setDestination] = useState(searchFilters.destination);
  const [checkIn, setCheckIn] = useState(searchFilters.checkIn);
  const [checkOut, setCheckOut] = useState(searchFilters.checkOut);
  const [guests, setGuests] = useState(searchFilters.guests);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { code } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle affiliate link
  useEffect(() => {
    if (code) {
      const affiliate = getAffiliateByCode(code);
      if (affiliate) {
        recordAffiliateClick(affiliate.id, 'B');
        localStorage.setItem('duna_referral', JSON.stringify({ affiliateId: affiliate.id, timestamp: Date.now(), source: 'B' }));
      }
    }
  }, [code, getAffiliateByCode, recordAffiliateClick]);

  const filteredDestinations = POPULAR_DESTINATIONS.filter(d => 
    d.toLowerCase().includes(destination.toLowerCase())
  );

  const handleSearch = () => {
    setSearchFilters({ destination, checkIn, checkOut, guests });
    navigate('/buscar');
  };

  const featuredProperties = properties.filter(p => p.isActive).slice(0, 6);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sand-100 via-sand-50 to-terra-50 dark:from-sand-900 dark:via-sand-800 dark:to-sand-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-terra-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-terra-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-sand-900 dark:text-sand-100 mb-4">
              Encontre seu lugar <span className="text-terra-500">perfeito</span>
            </h1>
            <p className="text-lg md:text-xl text-sand-600 dark:text-sand-400 max-w-2xl mx-auto">
              Imóveis de temporada selecionados pelas melhores imobiliárias do Brasil. Reserve com segurança e transparência.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-sand-800 rounded-2xl shadow-xl border border-sand-200 dark:border-sand-700 p-3 md:p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Destination */}
                <div className="md:col-span-4 relative">
                  <label className="text-xs font-medium text-sand-500 dark:text-sand-400 mb-1 block px-3">Destino</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => { setDestination(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Para onde você vai?"
                      className="w-full pl-9 pr-3 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm text-sand-800 dark:text-sand-200 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-terra-500/30"
                    />
                    {showSuggestions && destination && filteredDestinations.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-sand-700 rounded-xl shadow-lg border border-sand-200 dark:border-sand-600 z-10 overflow-hidden">
                        {filteredDestinations.map(d => (
                          <button key={d} onClick={() => { setDestination(d); setShowSuggestions(false); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-sand-100 dark:hover:bg-sand-600 text-sand-700 dark:text-sand-300 transition-colors">
                            <MapPin size={12} className="inline mr-2 text-terra-500" />{d}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Check-in */}
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-sand-500 dark:text-sand-400 mb-1 block px-3">Check-in</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full pl-9 pr-3 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm text-sand-800 dark:text-sand-200 focus:outline-none focus:ring-2 focus:ring-terra-500/30"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-sand-500 dark:text-sand-400 mb-1 block px-3">Check-out</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || format(new Date(), 'yyyy-MM-dd')}
                      className="w-full pl-9 pr-3 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm text-sand-800 dark:text-sand-200 focus:outline-none focus:ring-2 focus:ring-terra-500/30"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-sand-500 dark:text-sand-400 mb-1 block px-3">Hóspedes</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm text-sand-800 dark:text-sand-200 focus:outline-none focus:ring-2 focus:ring-terra-500/30 appearance-none"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'hóspede' : 'hóspedes'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search button */}
                <div className="md:col-span-2 flex items-end">
                  <button onClick={handleSearch} className="w-full py-2.5 bg-terra-500 hover:bg-terra-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-terra-500/20">
                    <Search size={16} />
                    <span className="hidden sm:inline">Buscar</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Reservas Seguras', desc: 'Pagamento protegido e confirmação instantânea' },
            { icon: Star, title: 'Imóveis Verificados', desc: 'Todas as propriedades são verificadas por imobiliárias cadastradas' },
            { icon: Clock, title: 'Suporte 24h', desc: 'Equipe Duna disponível para ajudar a qualquer momento' },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex items-start gap-4 p-6 bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700">
              <div className="w-12 h-12 bg-terra-100 dark:bg-terra-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <f.icon size={22} className="text-terra-600 dark:text-terra-400" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sand-900 dark:text-sand-100 mb-1">{f.title}</h3>
                <p className="text-sm text-sand-600 dark:text-sand-400">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-sand-900 dark:text-sand-100">Imóveis em Destaque</h2>
            <p className="text-sand-600 dark:text-sand-400 mt-1">Os mais bem avaliados pelos nossos hóspedes</p>
          </div>
          <button onClick={() => navigate('/buscar')} className="hidden md:flex items-center gap-1 text-sm font-medium text-terra-600 dark:text-terra-400 hover:text-terra-700 transition-colors">
            Ver todos <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
          ) : (
            featuredProperties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)
          )}
        </div>

        <div className="mt-8 text-center md:hidden">
          <button onClick={() => navigate('/buscar')} className="inline-flex items-center gap-2 px-6 py-3 bg-terra-500 hover:bg-terra-600 text-white font-medium rounded-full transition-colors">
            Ver todos os imóveis <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="bg-sand-100 dark:bg-sand-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-sand-900 dark:text-sand-100 mb-8 text-center">Destinos Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_DESTINATIONS.map((dest, i) => (
              <motion.button
                key={dest}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                onClick={() => { setDestination(dest); setSearchFilters({ destination: dest }); navigate('/buscar'); }}
                className="p-4 bg-white dark:bg-sand-800 rounded-xl border border-sand-200 dark:border-sand-700 hover:border-terra-400 dark:hover:border-terra-500 hover:shadow-md transition-all text-center group"
              >
                <MapPin size={20} className="mx-auto text-sand-400 group-hover:text-terra-500 transition-colors mb-2" />
                <span className="text-sm font-medium text-sand-700 dark:text-sand-300 group-hover:text-terra-600 dark:group-hover:text-terra-400 transition-colors">{dest}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-terra-500 to-terra-700 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white rounded-full" />
          </div>
          <div className="relative">
            <h2 className="font-heading font-bold text-2xl md:text-4xl mb-4">Tem um imóvel para temporada?</h2>
            <p className="text-terra-100 text-lg mb-8 max-w-xl mx-auto">
              Publique seu imóvel na Duna e alcance milhares de hóspedes. Cadastro gratuito para imobiliárias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/buscar')} className="px-8 py-3 bg-white text-terra-600 font-semibold rounded-full hover:bg-terra-50 transition-colors shadow-lg">
                Publicar Imóvel
              </button>
              <button onClick={() => navigate('/afiliados')} className="px-8 py-3 bg-terra-600 text-white font-semibold rounded-full hover:bg-terra-700 transition-colors border border-terra-400">
                Seja Afiliado
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
