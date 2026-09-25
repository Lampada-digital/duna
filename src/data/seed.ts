import { Property, RealEstate, User, Review, Booking } from '../types';

export const seedRealEstates: RealEstate[] = [
  { id: 're-1', name: 'Costa Norte Imóveis', email: 'contato@costanorte.com', phone: '(11) 99999-1111', city: 'Florianópolis', monthlyFee: 299 },
  { id: 're-2', name: 'Praia Viva Locações', email: 'contato@praiaviva.com', phone: '(21) 98888-2222', city: 'Rio de Janeiro', monthlyFee: 349 },
  { id: 're-3', name: 'Serra & Mar Hospedagens', email: 'contato@serramar.com', phone: '(48) 97777-3333', city: 'Gramado', monthlyFee: 279 },
];

export const seedProperties: Property[] = [
  {
    id: 'prop-1', title: 'Apartamento Vista Mar em Jurerê', description: 'Apartamento moderno com vista panorâmica para o mar. Totalmente mobiliado, com cozinha equipada, ar condicionado em todos os ambientes e vaga de garagem. Perfeito para famílias que buscam conforto e proximidade com a praia.',
    city: 'Florianópolis', neighborhood: 'Jurerê Internacional', state: 'SC', address: 'Rua das Flores, 100', lat: -27.486, lng: -48.425,
    pricePerNight: 450, cleaningFee: 120, type: 'apartment', bedrooms: 3, bathrooms: 2, maxGuests: 6,
    amenities: ['wifi', 'pool', 'parking', 'ac', 'kitchen', 'beach_access', 'pet_friendly', 'workspace'],
    photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'],
    rating: 4.8, reviewCount: 24, isActive: true, realEstateId: 're-1', cancellationPolicy: 'flexible', blockedDates: [], createdAt: '2024-01-15'
  },
  {
    id: 'prop-2', title: 'Cabana Aconchegante na Serra', description: 'Cabana rústica e charmosa no meio da natureza. Lareira, deck com vista para as montanhas e banheira de hidromassagem. Ideal para casais que querem desconectar.',
    city: 'Gramado', neighborhood: 'Centro', state: 'RS', address: 'Estrada da Serra, 45', lat: -29.377, lng: -50.893,
    pricePerNight: 380, cleaningFee: 80, type: 'cabin', bedrooms: 1, bathrooms: 1, maxGuests: 2,
    amenities: ['wifi', 'fireplace', 'hot_tub', 'kitchen', 'mountain_view', 'parking'],
    photos: ['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1595521624992-48a59aef95e1?w=800&h=600&fit=crop'],
    rating: 4.9, reviewCount: 42, isActive: true, realEstateId: 're-3', cancellationPolicy: 'moderate', blockedDates: [], createdAt: '2024-02-20'
  },
  {
    id: 'prop-3', title: 'Loft Design em Copacabana', description: 'Loft moderno e estiloso a 2 quadras da praia de Copacabana. Design contemporâneo, totalmente equipado com smart TV, ar condicionado e cozinha gourmet.',
    city: 'Rio de Janeiro', neighborhood: 'Copacabana', state: 'RJ', address: 'Av. Atlântica, 500', lat: -22.971, lng: -43.183,
    pricePerNight: 320, cleaningFee: 100, type: 'loft', bedrooms: 1, bathrooms: 1, maxGuests: 3,
    amenities: ['wifi', 'ac', 'kitchen', 'beach_access', 'workspace', 'elevator'],
    photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop'],
    rating: 4.6, reviewCount: 18, isActive: true, realEstateId: 're-2', cancellationPolicy: 'strict', blockedDates: [], createdAt: '2024-03-10'
  },
  {
    id: 'prop-4', title: 'Casa com Piscina em Porto de Galinhas', description: 'Casa espaçosa com piscina privativa, jardim tropical e churrasqueira. 3 suítes, sala ampla e cozinha completa. A 5 minutos da praia.',
    city: 'Ipojuca', neighborhood: 'Porto de Galinhas', state: 'PE', address: 'Rua dos Corais, 25', lat: -8.499, lng: -35.002,
    pricePerNight: 580, cleaningFee: 150, type: 'house', bedrooms: 3, bathrooms: 3, maxGuests: 8,
    amenities: ['wifi', 'pool', 'parking', 'ac', 'kitchen', 'bbq', 'garden', 'pet_friendly'],
    photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'],
    rating: 4.7, reviewCount: 31, isActive: true, realEstateId: 're-1', cancellationPolicy: 'moderate', blockedDates: [], createdAt: '2024-01-28'
  },
  {
    id: 'prop-5', title: 'Studio Compacto no Centro Histórico', description: 'Studio charmoso no centro histórico, perfeito para viajantes solo ou casais. Decorado com bom gosto, com tudo que você precisa para uma estadia confortável.',
    city: 'Ouro Preto', neighborhood: 'Centro Histórico', state: 'MG', address: 'Rua Direita, 78', lat: -20.385, lng: -43.503,
    pricePerNight: 180, cleaningFee: 50, type: 'studio', bedrooms: 1, bathrooms: 1, maxGuests: 2,
    amenities: ['wifi', 'kitchen', 'workspace'],
    photos: ['https://images.unsplash.com/photo-1536376072261-38c75010e628?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop'],
    rating: 4.5, reviewCount: 12, isActive: true, realEstateId: 're-3', cancellationPolicy: 'flexible', blockedDates: [], createdAt: '2024-04-05'
  },
  {
    id: 'prop-6', title: 'Penthouse Luxo Barra da Tijuca', description: 'Penthouse de alto padrão na Barra da Tijuca. Vista deslumbrante, 4 suítes, piscina na cobertura, sauna e academia privativa.',
    city: 'Rio de Janeiro', neighborhood: 'Barra da Tijuca', state: 'RJ', address: 'Av. Lúcio Costa, 1200', lat: -23.015, lng: -43.363,
    pricePerNight: 890, cleaningFee: 250, type: 'apartment', bedrooms: 4, bathrooms: 4, maxGuests: 10,
    amenities: ['wifi', 'pool', 'parking', 'ac', 'kitchen', 'gym', 'sauna', 'elevator', 'beach_access', 'workspace'],
    photos: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop'],
    rating: 4.9, reviewCount: 8, isActive: true, realEstateId: 're-2', cancellationPolicy: 'strict', blockedDates: [], createdAt: '2024-02-14'
  },
  {
    id: 'prop-7', title: 'Chalé Romântico em Campos do Jordão', description: 'Chalé com lareira e ofurô privativo. Vista para a serra, café da manhã incluído. Perfeito para lua de mel ou aniversários.',
    city: 'Campos do Jordão', neighborhood: 'Capivari', state: 'SP', address: 'Alameda Portugal, 30', lat: -22.742, lng: -45.591,
    pricePerNight: 520, cleaningFee: 100, type: 'cabin', bedrooms: 1, bathrooms: 1, maxGuests: 2,
    amenities: ['wifi', 'fireplace', 'hot_tub', 'breakfast', 'parking', 'mountain_view'],
    photos: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop'],
    rating: 4.8, reviewCount: 56, isActive: true, realEstateId: 're-3', cancellationPolicy: 'moderate', blockedDates: [], createdAt: '2024-03-22'
  },
  {
    id: 'prop-8', title: 'Apartamento Pé na Areia - Muro Alto', description: 'Apartamento frente mar em Muro Alto, com acesso direto à praia. Condomínio com piscinas, quadra e restaurante. Ideal para famílias com crianças.',
    city: 'Ipojuca', neighborhood: 'Muro Alto', state: 'PE', address: 'Reserva do Paiva, 8', lat: -8.455, lng: -35.055,
    pricePerNight: 420, cleaningFee: 130, type: 'apartment', bedrooms: 2, bathrooms: 2, maxGuests: 5,
    amenities: ['wifi', 'pool', 'parking', 'ac', 'kitchen', 'beach_access', 'kids_friendly'],
    photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop'],
    rating: 4.6, reviewCount: 19, isActive: true, realEstateId: 're-1', cancellationPolicy: 'flexible', blockedDates: [], createdAt: '2024-04-18'
  },
];

export const seedReviews: Review[] = [
  { id: 'rev-1', propertyId: 'prop-1', bookingId: 'b-1', guestName: 'Maria S.', rating: 5, comment: 'Lugar incrível! Vista maravilhosa e apartamento muito bem equipado. Voltaremos com certeza!', createdAt: '2024-05-10' },
  { id: 'rev-2', propertyId: 'prop-1', bookingId: 'b-2', guestName: 'João P.', rating: 4, comment: 'Muito bom, localização perfeita. Apenas o estacionamento poderia ser maior.', createdAt: '2024-05-20' },
  { id: 'rev-3', propertyId: 'prop-2', bookingId: 'b-3', guestName: 'Ana L.', rating: 5, comment: 'A cabana dos sonhos! Super aconchegante e a vista é de tirar o fôlego.', createdAt: '2024-06-01' },
  { id: 'rev-4', propertyId: 'prop-2', bookingId: 'b-4', guestName: 'Carlos M.', rating: 5, comment: 'Perfeito para nosso aniversário de casamento. A hidromassagem com vista para a serra é surreal!', createdAt: '2024-06-15' },
  { id: 'rev-5', propertyId: 'prop-3', bookingId: 'b-5', guestName: 'Fernanda R.', rating: 4, comment: 'Loft muito bonito e bem localizado. A praia é pertinho. Recomendo!', createdAt: '2024-06-20' },
  { id: 'rev-6', propertyId: 'prop-4', bookingId: 'b-6', guestName: 'Roberto K.', rating: 5, comment: 'Casa fantástica! A piscina é maravilhosa e o espaço é enorme. Fomos em 8 pessoas e coube todo mundo com conforto.', createdAt: '2024-07-01' },
  { id: 'rev-7', propertyId: 'prop-7', bookingId: 'b-7', guestName: 'Patrícia V.', rating: 5, comment: 'O chalé mais romântico que já ficamos. O ofurô é divino e o café da manhã é delicioso.', createdAt: '2024-07-10' },
];

export const seedUsers: User[] = [
  { id: 'user-1', name: 'Visitante Demo', email: 'demo@duna.com', role: 'guest' },
  { id: 'user-2', name: 'Costa Norte Imóveis', email: 'contato@costanorte.com', role: 'realEstate' },
  { id: 'user-3', name: 'Admin Duna', email: 'admin@duna.com', role: 'admin' },
];

export const AMENITY_LABELS: Record<string, string> = {
  wifi: 'Wi-Fi',
  pool: 'Piscina',
  parking: 'Estacionamento',
  ac: 'Ar condicionado',
  kitchen: 'Cozinha equipada',
  beach_access: 'Acesso à praia',
  pet_friendly: 'Pet-friendly',
  workspace: 'Espaço de trabalho',
  fireplace: 'Lareira',
  hot_tub: 'Hidromassagem',
  mountain_view: 'Vista para montanha',
  bbq: 'Churrasqueira',
  garden: 'Jardim',
  gym: 'Academia',
  sauna: 'Sauna',
  elevator: 'Elevador',
  breakfast: 'Café da manhã',
  kids_friendly: 'Kids-friendly',
};

export const AMENITY_ICONS: Record<string, string> = {
  wifi: '📶',
  pool: '🏊',
  parking: '🅿️',
  ac: '❄️',
  kitchen: '🍳',
  beach_access: '🏖️',
  pet_friendly: '🐾',
  workspace: '💻',
  fireplace: '🔥',
  hot_tub: '🛁',
  mountain_view: '🏔️',
  bbq: '🥩',
  garden: '🌿',
  gym: '🏋️',
  sauna: '🧖',
  elevator: '🛗',
  breakfast: '☕',
  kids_friendly: '👶',
};
