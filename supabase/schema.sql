-- ==================================================
-- DUNA - Schema Completo para Supabase
-- ==================================================
-- Execute este SQL no Supabase SQL Editor
-- https://supabase.com/dashboard > SQL Editor > New Query

-- ==================================================
-- EXTENSIONS
-- ==================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================
-- ENUMS
-- ==================================================
CREATE TYPE user_role AS ENUM ('guest', 'host', 'admin');
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'cabin', 'studio', 'loft');
CREATE TYPE property_status AS ENUM ('draft', 'pending', 'published', 'suspended');
CREATE TYPE reservation_status AS ENUM ('pending', 'payment_pending', 'confirmed', 'cancelled', 'completed', 'refunded', 'expired', 'failed');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE cancellation_policy AS ENUM ('flexible', 'moderate', 'strict');
CREATE TYPE commission_status AS ENUM ('pending', 'released', 'paid');
CREATE TYPE withdrawal_status AS ENUM ('requested', 'processing', 'paid', 'rejected');
CREATE TYPE notification_type AS ENUM ('reservation_created', 'reservation_confirmed', 'payment_succeeded', 'payment_failed', 'reservation_cancelled', 'new_message', 'checkin_reminder', 'checkout_reminder', 'new_review', 'host_application');

-- ==================================================
-- USERS (extends Supabase auth.users)
-- ==================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'guest',
  host_approved BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  identity_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- LOCATIONS
-- ==================================================
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'Brasil',
  neighborhood TEXT,
  address TEXT,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- AMENITIES
-- ==================================================
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- PROPERTIES
-- ==================================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id),
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type NOT NULL,
  status property_status DEFAULT 'draft',
  price_per_night DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2) DEFAULT 0,
  max_guests INTEGER NOT NULL DEFAULT 1,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  cancellation_policy cancellation_policy DEFAULT 'flexible',
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- PROPERTY IMAGES
-- ==================================================
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  order_index INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- PROPERTY AMENITIES (many-to-many)
-- ==================================================
CREATE TABLE property_amenities (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);

-- ==================================================
-- AVAILABILITY (blocked dates)
-- ==================================================
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  reason TEXT, -- 'reservation', 'maintenance', 'manual'
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, blocked_date)
);

-- ==================================================
-- RESERVATIONS
-- ==================================================
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  guest_id UUID NOT NULL REFERENCES profiles(id),
  host_id UUID NOT NULL REFERENCES profiles(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  nightly_total DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2) DEFAULT 0,
  service_fee DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status reservation_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- ==================================================
-- PAYMENTS
-- ==================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status payment_status NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  payment_method TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- COMMISSIONS
-- ==================================================
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id),
  host_id UUID NOT NULL REFERENCES profiles(id),
  percentage DECIMAL(5, 2) NOT NULL,
  gross_amount DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  host_amount DECIMAL(10, 2) NOT NULL,
  status commission_status DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- REVIEWS
-- ==================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  guest_id UUID NOT NULL REFERENCES profiles(id),
  host_id UUID NOT NULL REFERENCES profiles(id),
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating BETWEEN 1 AND 5),
  location_rating INTEGER CHECK (location_rating BETWEEN 1 AND 5),
  checkin_rating INTEGER CHECK (checkin_rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  comfort_rating INTEGER CHECK (comfort_rating BETWEEN 1 AND 5),
  value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reservation_id, guest_id)
);

-- ==================================================
-- FAVORITES
-- ==================================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- ==================================================
-- WISHLISTS
-- ==================================================
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wishlist_id, property_id)
);

-- ==================================================
-- MESSAGES
-- ==================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID REFERENCES reservations(id),
  property_id UUID REFERENCES properties(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- NOTIFICATIONS
-- ==================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- AFFILIATES
-- ==================================================
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  program_a BOOLEAN DEFAULT TRUE,
  program_b BOOLEAN DEFAULT TRUE,
  commission_a DECIMAL(5, 2) DEFAULT 20,
  commission_b DECIMAL(5, 2) DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id),
  source TEXT NOT NULL, -- 'A' or 'B'
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id),
  type TEXT NOT NULL, -- 'realEstate_signup' or 'booking'
  reference_id UUID,
  amount DECIMAL(10, 2) NOT NULL,
  status commission_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id),
  amount DECIMAL(10, 2) NOT NULL,
  status withdrawal_status DEFAULT 'requested',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- AUDIT LOGS
-- ==================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- SYSTEM CONFIG (admin configurable)
-- ==================================================
CREATE TABLE system_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- Insert default config
INSERT INTO system_config (key, value) VALUES
  ('guest_service_fee', '{"percentage": 6, "description": "Taxa de serviço do hóspede"}'),
  ('host_fee', '{"percentage": 2, "description": "Taxa da imobiliária/anfitrião"}'),
  ('cancellation_flexible', '{"refund_percentage": 100, "deadline_hours": 24}'),
  ('cancellation_moderate', '{"refund_percentage": 50, "deadline_days": 5}'),
  ('cancellation_strict', '{"refund_percentage": 0, "deadline_days": 0}');

-- ==================================================
-- INDEXES
-- ==================================================
CREATE INDEX idx_properties_host ON properties(host_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(location_id);
CREATE INDEX idx_reservations_guest ON reservations(guest_id);
CREATE INDEX idx_reservations_host ON reservations(host_id);
CREATE INDEX idx_reservations_property ON reservations(property_id);
CREATE INDEX idx_reservations_dates ON reservations(check_in, check_out);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, read_at);
CREATE INDEX idx_availability_property_date ON availability(property_id, blocked_date);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at);

-- ==================================================
-- ROW LEVEL SECURITY (RLS)
-- ==================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Properties: published are public, hosts see their own
CREATE POLICY "Published properties are viewable" ON properties FOR SELECT USING (status = 'published' OR host_id = auth.uid());
CREATE POLICY "Hosts can insert own properties" ON properties FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update own properties" ON properties FOR UPDATE USING (host_id = auth.uid());
CREATE POLICY "Hosts can delete own properties" ON properties FOR DELETE USING (host_id = auth.uid());

-- Reservations: guests see their own, hosts see theirs
CREATE POLICY "Users see own reservations" ON reservations FOR SELECT USING (guest_id = auth.uid() OR host_id = auth.uid());
CREATE POLICY "Guests can create reservations" ON reservations FOR INSERT WITH CHECK (guest_id = auth.uid());

-- Payments: only involved parties
CREATE POLICY "Users see own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM reservations WHERE id = reservation_id AND (guest_id = auth.uid() OR host_id = auth.uid()))
);

-- Reviews: public read, users write own
CREATE POLICY "Reviews are public" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users create own reviews" ON reviews FOR INSERT WITH CHECK (guest_id = auth.uid());

-- Favorites: users manage own
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (user_id = auth.uid());

-- Messages: participants only
CREATE POLICY "Participants see messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Participants send messages" ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

-- Notifications: users see own
CREATE POLICY "Users see own notifications" ON notifications FOR ALL USING (user_id = auth.uid());

-- ==================================================
-- FUNCTIONS
-- ==================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update property rating when review is added
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties SET
    rating = (SELECT AVG(overall_rating) FROM reviews WHERE property_id = NEW.property_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE property_id = NEW.property_id)
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_after_review AFTER INSERT ON reviews FOR EACH ROW EXECUTE FUNCTION update_property_rating();

-- Block dates when reservation is confirmed
CREATE OR REPLACE FUNCTION block_reservation_dates()
RETURNS TRIGGER AS $$
DECLARE
  d DATE;
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    d := NEW.check_in;
    WHILE d < NEW.check_out LOOP
      INSERT INTO availability (property_id, blocked_date, reason, reservation_id)
      VALUES (NEW.property_id, d, 'reservation', NEW.id)
      ON CONFLICT (property_id, blocked_date) DO NOTHING;
      d := d + INTERVAL '1 day';
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER block_dates_on_confirm AFTER UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION block_reservation_dates();

-- Create commission when payment succeeds
CREATE OR REPLACE FUNCTION create_commission()
RETURNS TRIGGER AS $$
DECLARE
  config JSONB;
  commission_pct DECIMAL;
  commission_amt DECIMAL;
  host_amt DECIMAL;
BEGIN
  IF NEW.status = 'succeeded' AND (OLD.status IS NULL OR OLD.status != 'succeeded') THEN
    SELECT value INTO config FROM system_config WHERE key = 'host_fee';
    commission_pct := (config->>'percentage')::DECIMAL;
    commission_amt := NEW.amount * (commission_pct / 100);
    host_amt := NEW.amount - commission_amt;
    
    INSERT INTO commissions (reservation_id, host_id, percentage, gross_amount, commission_amount, host_amount)
    SELECT NEW.reservation_id, r.host_id, commission_pct, NEW.amount, commission_amt, host_amt
    FROM reservations r WHERE r.id = NEW.reservation_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_commission_on_payment AFTER INSERT OR UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION create_commission();

-- ==================================================
-- SEED DATA
-- ==================================================
INSERT INTO amenities (name, icon, category) VALUES
  ('Wi-Fi', '📶', 'connectivity'),
  ('Piscina', '🏊', 'leisure'),
  ('Estacionamento', '🅿️', 'parking'),
  ('Ar condicionado', '❄️', 'climate'),
  ('Cozinha equipada', '🍳', 'kitchen'),
  ('Acesso à praia', '🏖️', 'location'),
  ('Pet-friendly', '🐾', 'policy'),
  ('Espaço de trabalho', '💻', 'work'),
  ('Lareira', '🔥', 'leisure'),
  ('Hidromassagem', '🛁', 'leisure'),
  ('Vista para montanha', '🏔️', 'view'),
  ('Churrasqueira', '🥩', 'kitchen'),
  ('Jardim', '🌿', 'outdoor'),
  ('Academia', '🏋️', 'leisure'),
  ('Sauna', '🧖', 'leisure'),
  ('Elevador', '🛗', 'accessibility'),
  ('Café da manhã', '☕', 'food'),
  ('Kids-friendly', '👶', 'family');
