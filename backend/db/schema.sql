-- =============================================================================
-- EcoTour AI — PostgreSQL Database Schema (Role: Tourist & Business Admin)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. USERS
CREATE TABLE users (
    id            BIGSERIAL       PRIMARY KEY,
    name          VARCHAR(100)    NOT NULL,
    email         VARCHAR(255)    NOT NULL,
    password_hash VARCHAR(255)    NOT NULL,
    role          VARCHAR(30)     NOT NULL DEFAULT 'tourist' CHECK (role IN ('tourist', 'business_destination', 'business_accommodation')),
    created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_users_email_unique ON users (email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_deleted_at ON users (deleted_at);

-- 2. PASSWORD RESETS
CREATE TABLE password_resets (
    id         BIGSERIAL       PRIMARY KEY,
    user_id    BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(128)    NOT NULL,
    expires_at TIMESTAMPTZ     NOT NULL,
    used_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_password_resets_token ON password_resets (token) WHERE used_at IS NULL;

-- 3. USER PREFERENCES
CREATE TABLE user_preferences (
    id         BIGSERIAL       PRIMARY KEY,
    user_id    BIGINT          NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    language   VARCHAR(10)     NOT NULL DEFAULT 'id' CHECK (language IN ('id', 'en', 'zh')),
    interests  TEXT[]          NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- 4. DESTINATIONS (MF-016: nature, culture, culinary, shopping, adventure, relaxation di Batam)
CREATE TABLE destinations (
    id                         BIGSERIAL       PRIMARY KEY,
    created_by                 BIGINT          REFERENCES users(id) ON DELETE SET NULL,
    name                       VARCHAR(255)    NOT NULL,
    category                   VARCHAR(30)     NOT NULL CHECK (category IN ('nature', 'culture', 'culinary', 'shopping', 'adventure', 'relaxation')),
    description                TEXT,
    location                   VARCHAR(255)    NOT NULL,
    latitude                   NUMERIC(10,7),
    longitude                  NUMERIC(10,7),
    opening_hours              VARCHAR(100),
    ticket_price               NUMERIC(15,2)   NOT NULL DEFAULT 0,
    best_visit_time            VARCHAR(100),
    facilities                 TEXT[]          NOT NULL DEFAULT '{}',
    photos                     TEXT[]          NOT NULL DEFAULT '{}',
    phone                      VARCHAR(50),
    eco_score                  NUMERIC(5,2)    NOT NULL DEFAULT 0,
    conservation_contribution_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
    created_at                 TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                 TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at                 TIMESTAMPTZ
);

CREATE INDEX idx_destinations_category ON destinations (category) WHERE deleted_at IS NULL;
CREATE INDEX idx_destinations_eco_score ON destinations (eco_score DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_destinations_created_by ON destinations (created_by) WHERE deleted_at IS NULL;

-- 5. ACCOMMODATIONS (MF-015: Hotel, Resort, Homestay di Batam)
CREATE TABLE accommodations (
    id                   BIGSERIAL       PRIMARY KEY,
    created_by           BIGINT          REFERENCES users(id) ON DELETE SET NULL,
    name                 VARCHAR(255)    NOT NULL,
    category             VARCHAR(30)     NOT NULL CHECK (category IN ('hotel', 'resort', 'homestay')),
    description          TEXT,
    location             VARCHAR(255)    NOT NULL,
    latitude             NUMERIC(10,7),
    longitude            NUMERIC(10,7),
    price_per_night      NUMERIC(15,2)   NOT NULL DEFAULT 0,
    facilities           TEXT[]          NOT NULL DEFAULT '{}',
    photos               TEXT[]          NOT NULL DEFAULT '{}',
    phone                VARCHAR(50),
    environmental_impact TEXT,
    eco_score            NUMERIC(5,2)    NOT NULL DEFAULT 0,
    created_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at           TIMESTAMPTZ
);

CREATE INDEX idx_accommodations_category ON accommodations (category) WHERE deleted_at IS NULL;
CREATE INDEX idx_accommodations_eco_score ON accommodations (eco_score DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_accommodations_created_by ON accommodations (created_by) WHERE deleted_at IS NULL;

-- 6. FERRY ROUTES (MF-017: Estimasi Tiket Feri Keberangkatan)
CREATE TABLE ferry_routes (
    id                BIGSERIAL       PRIMARY KEY,
    created_by        BIGINT          REFERENCES users(id) ON DELETE SET NULL,
    origin_country    VARCHAR(50)     NOT NULL CHECK (origin_country IN ('singapore', 'malaysia')),
    origin_port       VARCHAR(255)    NOT NULL,
    destination_port  VARCHAR(255)    NOT NULL,
    operator_name     VARCHAR(255),
    price_one_way     NUMERIC(15,2)   NOT NULL,
    price_round_trip  NUMERIC(15,2)   NOT NULL,
    currency          VARCHAR(10)     NOT NULL DEFAULT 'IDR',
    duration_minutes  INT             NOT NULL DEFAULT 50,
    source_url        VARCHAR(500),
    last_scraped_at   TIMESTAMPTZ,
    updated_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- 7. USER FAVORITES (MF-015)
CREATE TABLE user_favorites (
    id               BIGSERIAL       PRIMARY KEY,
    user_id          BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accommodation_id BIGINT          NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
    created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_favorites UNIQUE (user_id, accommodation_id)
);

-- 8. TRIPS (MF-003)
CREATE TABLE trips (
    id                      BIGSERIAL       PRIMARY KEY,
    user_id                 BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title                   VARCHAR(255)    NOT NULL,
    destination             VARCHAR(255)    NOT NULL DEFAULT 'Batam',
    origin_country          VARCHAR(50)     DEFAULT 'singapore',
    origin_port             VARCHAR(255)    DEFAULT 'HarbourFront',
    duration_days           INT             NOT NULL CHECK (duration_days >= 1),
    pax                     INT             NOT NULL DEFAULT 1 CHECK (pax >= 1),
    budget                  NUMERIC(15,2)   NOT NULL DEFAULT 0,
    interests               TEXT[]          NOT NULL DEFAULT '{}',
    accommodation_preference VARCHAR(50)    DEFAULT 'hotel',
    notes                   TEXT,
    start_date              DATE,
    end_date                DATE,
    ferry_cost_round_trip   NUMERIC(15,2)   NOT NULL DEFAULT 0,
    total_estimated_cost    NUMERIC(15,2)   NOT NULL DEFAULT 0,
    total_carbon_kg         NUMERIC(10,2)   NOT NULL DEFAULT 0,
    sustainability_score    INT             NOT NULL DEFAULT 0 CHECK (sustainability_score BETWEEN 0 AND 100),
    carbon_ferry_pct        NUMERIC(5,2)    NOT NULL DEFAULT 0,
    carbon_accom_pct        NUMERIC(5,2)    NOT NULL DEFAULT 0,
    carbon_activity_pct     NUMERIC(5,2)    NOT NULL DEFAULT 0,
    current_version         INT             NOT NULL DEFAULT 1,
    status                  VARCHAR(20)     NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'archived', 'cancelled')),
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_trips_user_id ON trips (user_id) WHERE deleted_at IS NULL;

-- 10. TRIP VERSIONS (F-016)
CREATE TABLE trip_versions (
    id             BIGSERIAL       PRIMARY KEY,
    trip_id        BIGINT          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    version_number INT             NOT NULL,
    change_summary VARCHAR(255),
    snapshot_json  JSONB           NOT NULL,
    created_by     VARCHAR(20)     NOT NULL DEFAULT 'ai',
    created_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_trip_versions UNIQUE (trip_id, version_number)
);

-- 11. ITINERARY DAYS
CREATE TABLE itinerary_days (
    id              BIGSERIAL       PRIMARY KEY,
    trip_id         BIGINT          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number      INT             NOT NULL CHECK (day_number >= 1),
    label           VARCHAR(100),
    weather_summary VARCHAR(100),
    weather_temp_c  NUMERIC(4,1),
    weather_icon    VARCHAR(50),
    crowd_density   VARCHAR(20),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT uq_itinerary_days UNIQUE (trip_id, day_number)
);

-- 12. ITINERARY ACTIVITIES
CREATE TABLE itinerary_activities (
    id               BIGSERIAL       PRIMARY KEY,
    day_id           BIGINT          NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    sort_order       INT             NOT NULL DEFAULT 0,
    start_time       VARCHAR(20)     NOT NULL DEFAULT '08:00',
    title            VARCHAR(255)    NOT NULL,
    description      TEXT,
    category         VARCHAR(50)     NOT NULL,
    tags             TEXT[]          NOT NULL DEFAULT '{}',
    distance_km      NUMERIC(8,2)    NOT NULL DEFAULT 0,
    duration_minutes INT             NOT NULL DEFAULT 0,
    estimated_cost   NUMERIC(15,2)   NOT NULL DEFAULT 0,
    carbon_kg        NUMERIC(8,2)    NOT NULL DEFAULT 0,
    is_validated     BOOLEAN         NOT NULL DEFAULT FALSE,
    destination_id   BIGINT          REFERENCES destinations(id) ON DELETE SET NULL,
    accommodation_id BIGINT          REFERENCES accommodations(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

-- 13. CHAT MESSAGES (MF-004)
CREATE TABLE chat_messages (
    id               BIGSERIAL       PRIMARY KEY,
    trip_id          BIGINT          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    sender           VARCHAR(20)     NOT NULL CHECK (sender IN ('user', 'ai', 'system')),
    message          TEXT            NOT NULL,
    resulted_version INT,
    created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- 14. RATINGS (MF-007)
CREATE TABLE ratings (
    id                     BIGSERIAL       PRIMARY KEY,
    user_id                BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type            VARCHAR(30)     NOT NULL CHECK (target_type IN ('destination', 'accommodation')),
    destination_id         BIGINT          REFERENCES destinations(id) ON DELETE CASCADE,
    accommodation_id       BIGINT          REFERENCES accommodations(id) ON DELETE CASCADE,
    trip_id                BIGINT          REFERENCES trips(id) ON DELETE SET NULL,
    cleanliness            INT             NOT NULL CHECK (cleanliness BETWEEN 1 AND 5),
    environmental_condition INT            NOT NULL CHECK (environmental_condition BETWEEN 1 AND 5),
    environmental_care     INT             NOT NULL CHECK (environmental_care BETWEEN 1 AND 5),
    calculated_score       NUMERIC(5,2)    NOT NULL,
    review_comment         TEXT,
    created_at             TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- 15. CARBON OFFSETS (F-020)
CREATE TABLE carbon_offsets (
    id           BIGSERIAL       PRIMARY KEY,
    user_id      BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trip_id      BIGINT          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    amount_idr   NUMERIC(15,2)   NOT NULL CHECK (amount_idr > 0),
    carbon_kg    NUMERIC(8,2)    NOT NULL CHECK (carbon_kg > 0),
    program_name VARCHAR(255)    NOT NULL DEFAULT 'Penanaman Mangrove Batam',
    status       VARCHAR(20)     NOT NULL DEFAULT 'completed',
    created_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- 16. TRIP COLLABORATORS (MF-010)
CREATE TABLE trip_collaborators (
    id         BIGSERIAL       PRIMARY KEY,
    trip_id    BIGINT          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id    BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role       VARCHAR(20)     NOT NULL DEFAULT 'viewer' CHECK (role IN ('editor', 'viewer')),
    invited_at TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_trip_collaborators UNIQUE (trip_id, user_id)
);

-- 17. NOTIFICATIONS
CREATE TABLE notifications (
    id         BIGSERIAL       PRIMARY KEY,
    user_id    BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(50)     NOT NULL,
    title      VARCHAR(255)    NOT NULL,
    message    TEXT            NOT NULL,
    ref_type   VARCHAR(30),
    ref_id     BIGINT,
    is_read    BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_unread ON notifications (user_id) WHERE is_read = FALSE;
