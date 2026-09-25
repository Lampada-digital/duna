import { Link } from 'react-router-dom';
import { Property } from '../types';
import { Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/imovel/${property.id}`} className="group block">
        <div className="bg-white dark:bg-sand-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-sand-200 dark:border-sand-700">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={property.photos[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Rating badge */}
            {property.rating > 0 && (
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-sand-800/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-semibold text-sand-800 dark:text-sand-200">{property.rating.toFixed(1)}</span>
                <span className="text-xs text-sand-500">({property.reviewCount})</span>
              </div>
            )}
            {/* Type badge */}
            <div className="absolute top-3 right-3 bg-terra-500/90 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="text-xs font-medium text-white capitalize">{getTypeLabel(property.type)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-heading font-semibold text-sand-900 dark:text-sand-100 text-sm leading-tight line-clamp-1 group-hover:text-terra-600 dark:group-hover:text-terra-400 transition-colors">
                {property.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-sand-500 dark:text-sand-400 mb-3">
              <MapPin size={12} />
              <span className="text-xs">{property.neighborhood}, {property.city}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-sand-500 dark:text-sand-400 mb-3">
              <span>{property.bedrooms} quarto{property.bedrooms > 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{property.bathrooms} ban.{property.bathrooms > 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{property.maxGuests} hóspedes</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-lg font-bold text-terra-600 dark:text-terra-400">
                  R$ {property.pricePerNight}
                </span>
                <span className="text-xs text-sand-500 dark:text-sand-400 ml-1">/noite</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white dark:bg-sand-800 rounded-2xl overflow-hidden shadow-sm border border-sand-200 dark:border-sand-700">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
        <div className="h-3 skeleton rounded w-2/3" />
        <div className="flex justify-between">
          <div className="h-5 skeleton rounded w-20" />
          <div className="h-4 skeleton rounded w-12" />
        </div>
      </div>
    </div>
  );
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: 'Apartamento', house: 'Casa', cabin: 'Cabana', studio: 'Studio', loft: 'Loft'
  };
  return labels[type] || type;
}
