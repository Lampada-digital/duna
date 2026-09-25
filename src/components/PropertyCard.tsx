import { Link } from 'react-router-dom';
import { Property } from '../types';
import { Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev + 1) % property.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev - 1 + property.photos.length) % property.photos.length);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const distance = Math.floor(Math.random() * 50) + 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link to={`/imovel/${property.id}`} className="group block">
        <div className="space-y-3">
          {/* Image Carousel */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand-200 dark:bg-sand-800">
            <img
              src={property.photos[currentPhoto]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />

            {/* Like button */}
            <button
              onClick={toggleLike}
              className="absolute top-3 right-3 z-10 btn-press"
            >
              <Heart
                size={24}
                className={`drop-shadow-md transition-colors ${isLiked ? 'fill-terra-500 text-terra-500' : 'fill-black/30 text-white hover:fill-black/50'}`}
                strokeWidth={1.5}
              />
            </button>

            {/* Guest favorite badge */}
            {property.rating >= 4.8 && (
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-white dark:bg-sand-800 rounded-full px-3 py-1.5 shadow-sm">
                  <span className="text-xs font-semibold text-sand-900 dark:text-sand-100">Favorito dos hóspedes</span>
                </div>
              </div>
            )}

            {/* Navigation arrows */}
            {property.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 dark:bg-sand-800/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 shadow-sm btn-press"
                >
                  <ChevronLeft size={16} className="text-sand-800 dark:text-sand-200" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 dark:bg-sand-800/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 shadow-sm btn-press"
                >
                  <ChevronRight size={16} className="text-sand-800 dark:text-sand-200" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {property.photos.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        i === currentPhoto ? 'bg-white w-2' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-[15px] text-sand-900 dark:text-sand-100 truncate">
                {property.city}, {property.state}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star size={13} className="text-sand-900 dark:text-sand-100 fill-current" />
                <span className="text-sm text-sand-900 dark:text-sand-100">{property.rating.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-sm text-sand-500 dark:text-sand-400 truncate">{property.neighborhood}</p>
            <p className="text-sm text-sand-500 dark:text-sand-400">
              A {distance} quilômetros de distância
            </p>
            <p className="mt-1.5">
              <span className="text-[15px] font-semibold text-sand-900 dark:text-sand-100">R$ {property.pricePerNight}</span>
              <span className="text-sm text-sand-600 dark:text-sand-400"> noite</span>
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-square skeleton rounded-2xl" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 skeleton w-32" />
          <div className="h-4 skeleton w-10" />
        </div>
        <div className="h-3 skeleton w-24" />
        <div className="h-3 skeleton w-28" />
        <div className="h-4 skeleton w-20 mt-2" />
      </div>
    </div>
  );
}
