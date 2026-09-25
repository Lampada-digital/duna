import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard';
import { Search, MapPin, ArrowRight, Umbrella, Mountain, Waves, TreePine, Building2, Castle, Tent, Ship, Wine, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { icon: Waves, label: 'Praia' },
  { icon: Mountain, label: 'Montanha' },
  { icon: TreePine, label: 'Campo' },
  { icon: Building2, label: 'Cidade' },
  { icon: Castle, label: 'Histórico' },
  { icon: Tent, label: 'Aventura' },
  { icon: Ship, label: 'Lago' },
  { icon: Wine, label: 'Vinhedo' },
  { icon: Coffee, label: 'Fazenda' },
  { icon: Umbrella, label: 'Tropical' },
];

const DESTINATIONS = [
  { city: 'Florianópolis', state: 'SC', img: 'https://images.unsplash.com/photo-1589912487932-a176d0220589?w=600&h=400&fit=crop', properties: 234 },
  { city: 'Rio de Janeiro', state: 'RJ', img: 'https://images.unsplash.com/photo-1483729558449-9c27a7c07fed?w=600&h=400&fit=crop', properties: 412 },
  { city: 'Gramado', state: 'RS', img: 'https://images.unsplash.com/photo-1518669016139-42b2d3be0a06?w=600&h=400&fit=crop', properties: 156 },
  { city: 'Porto de Galinhas', state: 'PE', img: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop', properties: 189 },
  { city: 'Campos do Jordão', state: 'SP', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop', properties: 98 },
  { city: 'Jericoacoara', state: 'CE', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop', properties: 145 },
];

export function Home() {
  const { properties, setSearchFilters, getAffiliateByCode, recordAffiliateClick } = useApp();
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const navigate = useNavigate();
  const { code } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (code) {
      const affiliate = getAffiliateByCode(code);
      if (affiliate) {
        recordAffiliateClick(affiliate.id, 'B');
        localStorage.setItem('duna_referral', JSON.stringify({ affiliateId: affiliate.id, timestamp: Date.now(), source: 'B' }));
      }
    }
  }, [code, getAffiliateByCode, recordAffiliateClick]);

  const handleSearch = () => {
    if (destination.trim()) {
      setSearchFilters({ destination });
    }
    navigate('/buscar');
  };

  const featuredProperties = properties.filter(p => p.isActive).sort((a, b) => b.rating - a.rating).slice(0, 12);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-sand-100 via-sand-50 to-sand-50 dark:from-sand-950 dark:via-sand-950 dark:to-sand-950" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-terra-200/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-duna-200/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="relative max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 md:pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-sand-900 dark:text-sand-50 leading-[1.05] tracking-tight">
              Lugares para ficar que vão além do
              <span className="italic text-terra-500"> comum</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-sand-600 dark:text-sand-400 max-w-xl leading-relaxed">
              Descubra imóveis extraordinários selecionados pelas melhores imobiliárias do Brasil. Sua próxima história começa aqui.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 md:mt-12"
          >
            <div className="bg-white dark:bg-sand-800 rounded-full shadow-xl shadow-sand-900/5 dark:shadow-black/20 border border-sand-200/80 dark:border-sand-700 p-2 md:p-2.5 flex items-center gap-2 max-w-3xl">
              <div className="flex-1 flex items-center gap-3 pl-5">
                <MapPin size={20} className="text-terra-500 flex-shrink-0" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Para onde você vai?"
                  className="w-full py-3 text-base text-sand-900 dark:text-sand-100 placeholder:text-sand-400 bg-transparent focus:outline-none"
                />
              </div>
              <button
                onClick={handleSearch}
                className="h-12 md:h-14 px-5 md:px-7 bg-gradient-to-r from-terra-500 to-terra-600 hover:from-terra-600 hover:to-terra-700 text-white font-semibold rounded-full transition-all duration-200 flex items-center gap-2 shadow-lg shadow-terra-500/25 btn-press"
              >
                <Search size={18} />
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="sticky top-[72px] z-30 bg-white/95 dark:bg-sand-950/95 backdrop-blur-md border-b border-sand-200/60 dark:border-sand-800/60">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex gap-6 md:gap-8 py-4 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => { setActiveCategory(cat.label === activeCategory ? '' : cat.label); }}
                className={`flex flex-col items-center gap-1.5 min-w-fit pb-2 pt-1 border-b-2 transition-all duration-200 ${
                  activeCategory === cat.label
                    ? 'border-sand-900 dark:border-sand-100 text-sand-900 dark:text-sand-100'
                    : 'border-transparent text-sand-500 hover:text-sand-700 dark:hover:text-sand-300 hover:border-sand-300'
                }`}
              >
                <cat.icon size={22} strokeWidth={activeCategory === cat.label ? 2.5 : 1.5} />
                <span className="text-[11px] font-medium whitespace-nowrap">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => <PropertyCardSkeleton key={i} />)
          ) : (
            featuredProperties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)
          )}
        </div>

        {!loading && (
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/buscar')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-sand-900 dark:border-sand-100 text-sand-900 dark:text-sand-100 font-semibold rounded-xl hover:bg-sand-900 hover:text-white dark:hover:bg-sand-100 dark:hover:text-sand-900 transition-all duration-200 btn-press"
            >
              Mostrar mais imóveis
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>

      {/* Destinations */}
      <section className="bg-sand-100/50 dark:bg-sand-900/50 py-16 md:py-20">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50">
                Inspire-se por destino
              </h2>
              <p className="mt-2 text-sand-600 dark:text-sand-400">Os lugares mais buscados pelos viajantes da Duna</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {DESTINATIONS.map((dest, i) => (
              <motion.button
                key={dest.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
                onClick={() => { setSearchFilters({ destination: dest.city }); navigate('/buscar'); }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={dest.img}
                  alt={dest.city}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-white">{dest.city}</h3>
                  <p className="text-sm text-white/80 mt-0.5">{dest.state} • {dest.properties} imóveis</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Duna */}
      <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50">
            Por que escolher a <span className="italic text-terra-500">Duna</span>?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              title: 'Imóveis verificados',
              desc: 'Cada propriedade é cadastrada por imobiliárias profissionais. Sem surpresas, sem fotos enganosas.',
              icon: '🏡'
            },
            {
              title: 'Preço transparente',
              desc: 'Sem taxas escondidas. O preço que você vê é o preço que você paga. Simples assim.',
              icon: '💎'
            },
            {
              title: 'Suporte humano',
              desc: 'Nossos atendentes são reais e estão disponíveis para ajudar antes, durante e depois da sua viagem.',
              icon: '☀️'
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100 mb-2">{item.title}</h3>
              <p className="text-sand-600 dark:text-sand-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 md:pb-24">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-terra-500 via-terra-600 to-terra-800" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-terra-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          </div>
          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
              Tem um imóvel para <br className="hidden md:block" />temporada?
            </h2>
            <p className="mt-4 text-lg text-terra-100 max-w-xl mx-auto">
              Publique na Duna e alcance milhares de hóspedes. Cadastro gratuito para imobiliárias.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/painel')} className="px-8 py-3.5 bg-white text-terra-600 font-semibold rounded-full hover:bg-terra-50 transition-colors shadow-xl btn-press">
                Publicar meu imóvel
              </button>
              <button onClick={() => navigate('/afiliados')} className="px-8 py-3.5 bg-terra-700/50 text-white font-semibold rounded-full hover:bg-terra-700/70 transition-colors border border-white/20 btn-press">
                Ganhe como afiliado
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
