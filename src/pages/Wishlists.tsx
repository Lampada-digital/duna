import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Heart, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyCard } from '../components/PropertyCard';
import { EmptyState } from '../components/EmptyState';

export function Wishlists() {
  const { getUserWishlists, createWishlist, removeFromWishlist, properties } = useApp();
  const navigate = useNavigate();
  const [selectedWishlist, setSelectedWishlist] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  const wishlists = getUserWishlists();
  const currentWishlist = wishlists.find(wl => wl.id === selectedWishlist);
  const savedProperties = currentWishlist 
    ? properties.filter(p => currentWishlist.propertyIds.includes(p.id))
    : [];

  const handleCreate = () => {
    if (!newListName.trim()) return;
    const newList = createWishlist(newListName.trim());
    setSelectedWishlist(newList.id);
    setNewListName('');
    setShowCreateModal(false);
  };

  const handleRemoveProperty = (propertyId: string) => {
    if (currentWishlist) {
      removeFromWishlist(currentWishlist.id, propertyId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50">Favoritos</h1>
          <p className="text-sand-500 mt-1">Salve imóveis para mais tarde</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-sand-900 dark:bg-sand-100 hover:bg-sand-800 dark:hover:bg-sand-200 text-white dark:text-sand-900 font-semibold rounded-xl transition-colors flex items-center gap-2 btn-press"
        >
          <Plus size={16} /> Nova lista
        </button>
      </div>

      {wishlists.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nenhuma lista criada"
          description="Crie listas para salvar seus imóveis favoritos"
          action={{ label: 'Criar primeira lista', onClick: () => setShowCreateModal(true) }}
        />
      ) : !selectedWishlist ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((wl, i) => (
            <motion.button
              key={wl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedWishlist(wl.id)}
              className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 text-left hover:shadow-lg transition-all card-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <Heart size={24} className="text-terra-500 fill-terra-500" />
                <span className="text-sm text-sand-500">{wl.propertyIds.length} imóvel(is)</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100 group-hover:text-terra-600 dark:group-hover:text-terra-400 transition-colors">
                {wl.name}
              </h3>
              <p className="text-xs text-sand-500 mt-1">
                Criada em {new Date(wl.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setSelectedWishlist(null)}
              className="px-4 py-2 text-sm font-medium text-sand-700 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800 rounded-lg transition-colors"
            >
              ← Voltar
            </button>
            <h2 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100">
              {currentWishlist?.name}
            </h2>
          </div>

          {savedProperties.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Lista vazia"
              description="Adicione imóveis aos seus favoritos clicando no coração"
              action={{ label: 'Explorar imóveis', onClick: () => navigate('/buscar') }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedProperties.map((p, i) => (
                <div key={p.id} className="relative">
                  <PropertyCard property={p} index={i} />
                  <button
                    onClick={() => handleRemoveProperty(p.id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/90 dark:bg-sand-800/90 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCreateModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-sand-800 rounded-2xl p-6 md:p-8 w-full max-w-md card-shadow"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-sand-900 dark:text-sand-100">Criar nova lista</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-sand-100 dark:hover:bg-sand-700 rounded-lg transition-colors">
                  <X size={20} className="text-sand-500" />
                </button>
              </div>
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Nome da lista</label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="Ex: Viagem de férias"
                  className="w-full px-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 border border-sand-300 dark:border-sand-600 text-sand-700 dark:text-sand-300 font-semibold rounded-xl hover:bg-sand-50 dark:hover:bg-sand-700 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleCreate} disabled={!newListName.trim()} className="flex-1 py-3 bg-terra-500 hover:bg-terra-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors btn-press">
                  Criar lista
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
