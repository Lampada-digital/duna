import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard';
import { AMENITY_LABELS } from '../data/seed';
import { SlidersHorizontal, X, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '../components/EmptyState';

export function Search() {
  const { properties, searchFilters, setSearchFilters } = useApp();
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(searchFilters);

  useState(() => {
    setTimeout(() => setLoading(false), 500);
  });

  const filteredProperties = useMemo(() => {
    let result = properties.filter(p => p.isActive);

    if (localFilters.destination) {
      const dest = localFilters.destination.toLowerCase();
      result = result.filter(p =>
        p.city.toLowerCase().includes(dest) ||
        p.neighborhood.toLowerCase().includes(dest) ||
        p.state.toLowerCase().includes(dest)
      );
    }
    if (localFilters.priceMin > 0) result = result.filter(p => p.pricePerNight >= localFilters.priceMin);
    if (localFilters.priceMax < 2000) result = result.filter(p => p.pricePerNight <= localFilters.priceMax);
    if (localFilters.propertyType) result = result.filter(p => p.type === localFilters.propertyType);
    if (localFilters.bedrooms > 0) result = result.filter(p => p.bedrooms >= localFilters.bedrooms);
    if (localFilters.minRating > 0) result = result.filter(p => p.rating >= localFilters.minRating);
    if (localFilters.amenities.length > 0) {
      result = result.filter(p => localFilters.amenities.every(a => p.amenities.includes(a)));
    }
    if (localFilters.guests > 1) result = result.filter(p => p.maxGuests >= localFilters.guests);

    switch (localFilters.sortBy) {
      case 'price_asc': result.sort((a, b) => a.pricePerNight - b.pricePerNight); break;
      case 'price_desc': result.sort((a, b) => b.pricePerNight - a.pricePerNight); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
    }
    return result;
  }, [properties, localFilters]);

  const applyFilters = () => {
    setSearchFilters(localFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const cleared = { ...searchFilters, priceMin: 0, priceMax: 2000, propertyType: '', bedrooms: 0, amenities: [], minRating: 0 };
    setLocalFilters(cleared);
    setSearchFilters(cleared);
  };

  const activeFilterCount = [
    localFilters.propertyType,
    localFilters.bedrooms > 0,
    localFilters.minRating > 0,
    localFilters.amenities.length > 0,
    localFilters.priceMin > 0 || localFilters.priceMax < 2000,
  ].filter(Boolean).length;

  return (
    <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-6 animate-fade-in">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-sand-900 dark:text-sand-50">
            {localFilters.destination ? `${localFilters.destination}` : 'Todos os imóveis'}
          </h1>
          <p className="text-sm text-sand-500 dark:text-sand-400 mt-1">Mais de {filteredProperties.length} opções</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all btn-press ${showFilters ? 'bg-sand-900 dark:bg-sand-100 text-white dark:text-sand-900 border-sand-900 dark:border-sand-100' : 'bg-white dark:bg-sand-800 border-sand-200 dark:border-sand-700 text-sand-700 dark:text-sand-300 hover:border-sand-900 dark:hover:border-sand-100'}`}>
            <SlidersHorizontal size={14} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-terra-500 text-white text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
          <select value={localFilters.sortBy} onChange={(e) => setLocalFilters(f => ({ ...f, sortBy: e.target.value as any }))} className="px-4 py-2.5 bg-white dark:bg-sand-800 border border-sand-200 dark:border-sand-700 rounded-xl text-sm text-sand-700 dark:text-sand-300 focus:outline-none focus:ring-2 focus:ring-terra-500/30 font-medium">
            <option value="relevance">Ordenar: Relevância</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
            <option value="rating">Melhor avaliação</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
            <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 md:p-8 card-shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sand-500 mb-3 block">Preço por noite</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input type="number" value={localFilters.priceMin || ''} onChange={(e) => setLocalFilters(f => ({ ...f, priceMin: Number(e.target.value) }))} placeholder="Min" className="w-full px-3 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30" />
                    </div>
                    <span className="text-sand-400">—</span>
                    <div className="flex-1">
                      <input type="number" value={localFilters.priceMax === 2000 ? '' : localFilters.priceMax} onChange={(e) => setLocalFilters(f => ({ ...f, priceMax: Number(e.target.value) || 2000 }))} placeholder="Max" className="w-full px-3 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30" />
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sand-500 mb-3 block">Tipo de imóvel</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: '', label: 'Todos' },
                      { value: 'apartment', label: 'Apto' },
                      { value: 'house', label: 'Casa' },
                      { value: 'cabin', label: 'Cabana' },
                      { value: 'studio', label: 'Studio' },
                      { value: 'loft', label: 'Loft' },
                    ].map(t => (
                      <button key={t.value} onClick={() => setLocalFilters(f => ({ ...f, propertyType: t.value }))} className={`py-2 rounded-xl text-xs font-medium transition-all ${localFilters.propertyType === t.value ? 'bg-sand-900 dark:bg-sand-100 text-white dark:text-sand-900' : 'bg-sand-50 dark:bg-sand-700 text-sand-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-sand-600'}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sand-500 mb-3 block">Quartos</label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map(n => (
                      <button key={n} onClick={() => setLocalFilters(f => ({ ...f, bedrooms: n }))} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${localFilters.bedrooms === n ? 'bg-sand-900 dark:bg-sand-100 text-white dark:text-sand-900' : 'bg-sand-50 dark:bg-sand-700 text-sand-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-sand-600'}`}>
                        {n === 0 ? '✓' : `${n}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min Rating */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sand-500 mb-3 block">Avaliação</label>
                  <div className="flex gap-2">
                    {[0, 4, 4.5, 4.8].map(n => (
                      <button key={n} onClick={() => setLocalFilters(f => ({ ...f, minRating: n }))} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${localFilters.minRating === n ? 'bg-sand-900 dark:bg-sand-100 text-white dark:text-sand-900' : 'bg-sand-50 dark:bg-sand-700 text-sand-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-sand-600'}`}>
                        {n === 0 ? '✓' : `${n}★`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6 pt-6 border-t border-sand-200 dark:border-sand-700">
                <label className="text-xs font-bold uppercase tracking-wider text-sand-500 mb-3 block">Comodidades</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(AMENITY_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setLocalFilters(f => ({
                        ...f,
                        amenities: f.amenities.includes(key) ? f.amenities.filter(a => a !== key) : [...f.amenities, key]
                      }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${localFilters.amenities.includes(key) ? 'bg-sand-900 dark:bg-sand-100 text-white dark:text-sand-900' : 'bg-sand-50 dark:bg-sand-700 text-sand-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-sand-600 border border-sand-200 dark:border-sand-600'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter actions */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-sand-200 dark:border-sand-700">
                <button onClick={clearFilters} className="px-5 py-2.5 text-sm font-semibold underline text-sand-700 dark:text-sand-300 hover:text-sand-900 dark:hover:text-sand-100 transition-colors">
                  Limpar tudo
                </button>
                <button onClick={applyFilters} className="px-6 py-2.5 bg-sand-900 dark:bg-sand-100 hover:bg-sand-800 dark:hover:bg-sand-200 text-white dark:text-sand-900 text-sm font-semibold rounded-xl transition-colors btn-press">
                  Mostrar {filteredProperties.length} imóveis
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => <PropertyCardSkeleton key={i} />)
        ) : filteredProperties.length > 0 ? (
          filteredProperties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)
        ) : (
          <div className="col-span-full">
            <EmptyState
              icon={SearchIcon}
              title="Nenhum imóvel encontrado"
              description="Tente ajustar os filtros ou buscar por outro destino."
              action={{ label: 'Limpar filtros', onClick: clearFilters }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
