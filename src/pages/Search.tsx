import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard';
import { AMENITY_LABELS } from '../data/seed';
import { Search as SearchIcon, SlidersHorizontal, X, MapPin, ArrowUpDown, Grid3X3, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '../components/EmptyState';

export function Search() {
  const { properties, searchFilters, setSearchFilters } = useApp();
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [localFilters, setLocalFilters] = useState(searchFilters);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

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

    // Sort
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-sand-900 dark:text-sand-100">
            {localFilters.destination ? `Imóveis em ${localFilters.destination}` : 'Todos os imóveis'}
          </h1>
          <p className="text-sm text-sand-500 dark:text-sand-400 mt-1">{filteredProperties.length} resultados encontrados</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-sand-800 border border-sand-200 dark:border-sand-700 rounded-full text-sm font-medium text-sand-700 dark:text-sand-300 hover:border-terra-400 transition-colors">
            <SlidersHorizontal size={14} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-terra-500 text-white text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
          <select value={localFilters.sortBy} onChange={(e) => setLocalFilters(f => ({ ...f, sortBy: e.target.value as any }))} className="px-3 py-2 bg-white dark:bg-sand-800 border border-sand-200 dark:border-sand-700 rounded-full text-sm text-sand-700 dark:text-sand-300 focus:outline-none focus:ring-2 focus:ring-terra-500/30">
            <option value="relevance">Relevância</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
            <option value="rating">Mais avaliados</option>
          </select>
          <div className="hidden sm:flex items-center border border-sand-200 dark:border-sand-700 rounded-full overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-terra-500 text-white' : 'text-sand-500 hover:text-sand-700'}`}>
              <Grid3X3 size={16} />
            </button>
            <button onClick={() => setViewMode('map')} className={`p-2 ${viewMode === 'map' ? 'bg-terra-500 text-white' : 'text-sand-500 hover:text-sand-700'}`}>
              <Map size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
            <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-sand-700 dark:text-sand-300 mb-2 block">Faixa de preço</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={localFilters.priceMin} onChange={(e) => setLocalFilters(f => ({ ...f, priceMin: Number(e.target.value) }))} placeholder="Min" className="w-full px-3 py-2 bg-sand-50 dark:bg-sand-700 rounded-lg text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30" />
                    <span className="text-sand-400">—</span>
                    <input type="number" value={localFilters.priceMax} onChange={(e) => setLocalFilters(f => ({ ...f, priceMax: Number(e.target.value) }))} placeholder="Max" className="w-full px-3 py-2 bg-sand-50 dark:bg-sand-700 rounded-lg text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30" />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="text-sm font-medium text-sand-700 dark:text-sand-300 mb-2 block">Tipo de imóvel</label>
                  <select value={localFilters.propertyType} onChange={(e) => setLocalFilters(f => ({ ...f, propertyType: e.target.value }))} className="w-full px-3 py-2 bg-sand-50 dark:bg-sand-700 rounded-lg text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30">
                    <option value="">Todos</option>
                    <option value="apartment">Apartamento</option>
                    <option value="house">Casa</option>
                    <option value="cabin">Cabana</option>
                    <option value="studio">Studio</option>
                    <option value="loft">Loft</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-sm font-medium text-sand-700 dark:text-sand-300 mb-2 block">Quartos (mínimo)</label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map(n => (
                      <button key={n} onClick={() => setLocalFilters(f => ({ ...f, bedrooms: n }))} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${localFilters.bedrooms === n ? 'bg-terra-500 text-white' : 'bg-sand-50 dark:bg-sand-700 text-sand-600 dark:text-sand-400 hover:bg-sand-200 dark:hover:bg-sand-600'}`}>
                        {n === 0 ? 'Any' : `${n}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min Rating */}
                <div>
                  <label className="text-sm font-medium text-sand-700 dark:text-sand-300 mb-2 block">Avaliação mínima</label>
                  <div className="flex gap-2">
                    {[0, 4, 4.5, 4.8].map(n => (
                      <button key={n} onClick={() => setLocalFilters(f => ({ ...f, minRating: n }))} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${localFilters.minRating === n ? 'bg-terra-500 text-white' : 'bg-sand-50 dark:bg-sand-700 text-sand-600 dark:text-sand-400 hover:bg-sand-200 dark:hover:bg-sand-600'}`}>
                        {n === 0 ? 'Todas' : `${n}+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6">
                <label className="text-sm font-medium text-sand-700 dark:text-sand-300 mb-3 block">Comodidades</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(AMENITY_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setLocalFilters(f => ({
                        ...f,
                        amenities: f.amenities.includes(key) ? f.amenities.filter(a => a !== key) : [...f.amenities, key]
                      }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${localFilters.amenities.includes(key) ? 'bg-terra-500 text-white' : 'bg-sand-100 dark:bg-sand-700 text-sand-600 dark:text-sand-400 hover:bg-sand-200 dark:hover:bg-sand-600'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter actions */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-sand-200 dark:border-sand-700">
                <button onClick={clearFilters} className="px-4 py-2 text-sm font-medium text-sand-600 dark:text-sand-400 hover:text-sand-800 dark:hover:text-sand-200 transition-colors">
                  Limpar filtros
                </button>
                <button onClick={applyFilters} className="px-6 py-2 bg-terra-500 hover:bg-terra-600 text-white text-sm font-medium rounded-full transition-colors">
                  Aplicar filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
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
      ) : (
        /* Map View */
        <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 overflow-hidden">
          <div className="relative h-[600px] bg-sand-200 dark:bg-sand-700">
            {/* Simple map representation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="mx-auto text-terra-500 mb-4" />
                <p className="text-sand-600 dark:text-sand-400 font-medium">Mapa interativo</p>
                <p className="text-sm text-sand-500 mt-2">{filteredProperties.length} imóveis nesta área</p>
                <div className="mt-4 grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {filteredProperties.slice(0, 4).map(p => (
                    <div key={p.id} className="bg-white dark:bg-sand-800 rounded-lg p-3 shadow-sm border border-sand-200 dark:border-sand-700">
                      <p className="text-xs font-medium text-sand-800 dark:text-sand-200 truncate">{p.title}</p>
                      <p className="text-xs text-terra-600 font-bold mt-1">R$ {p.pricePerNight}/noite</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
