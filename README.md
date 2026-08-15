# EcoTour AI (EcoTrip Batam)

> **Smart AI-Driven Eco-Friendly Travel Planner & Sustainable Tourism Ecosystem for Batam Island**

---

## 1. Project Overview

**EcoTour AI (EcoTrip)** is a modern mobile platform and backend ecosystem designed to revolutionize sustainable tourism across Batam Island, Indonesia. The platform combines Large Language Model (LLM) artificial intelligence with an automated **Eco Score** evaluation system, connecting tourists, local eco-friendly business owners, and platform administrators in a single unified architecture.

Key platform highlights:

- **Intelligent Itinerary Generation**: Generates contextual, budget-guarded, day-by-day travel schedules tailored to travel origins (local Batam vs. international arrivals from Singapore/Malaysia via round-trip ferry routes).
- **Conversational AI Trip Revision**: Allows tourists to revise itineraries on the fly (change meals, swap activities, adjust pace) through natural chat interactions.
- **Weighted 3-Aspect Eco Score Algorithm**: Translates tourist ratings into real-time environmental scores (Cleanliness 35%, Environmental Condition 40%, Environmental Care 25%) that directly determine top venue recommendations across Batam.
- **Device-Time Activity Tracker**: Automatically identifies current and passed activities based on device clock, highlighting the active venue and prompting rating modals for completed visits.
- **Role-Based Business & Superadmin Portals**: Dedicated interfaces for business owners to manage single real-world venues and a Superadmin portal to review and approve pending business registrations.

---

## 2. User Roles & Use Cases

| User Role                    | Target Audience                       | Primary Use Cases                                                                                                                                                                                                                                                                                                                                                                  |
| :--------------------------- | :------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`tourist`**                | Domestic & International Travelers    | • Generate customized eco-friendly itineraries using AI.<br>• Chat with the AI Assistant to revise trips in real time.<br>• Track daily schedules with live device-time badges.<br>• Submit 3-aspect eco-ratings for visited destinations & stays.<br>• Browse top-rated eco destinations, restaurants, and hotels.<br>• Check Batam real-time weather forecasts and ferry routes. |
| **`business_destination`**   | Tourist Attractions & Culinary Venues | • Manage 1 registered destination or restaurant venue.<br>• Update operational hours, ticket pricing, photos, and facilities.<br>• Highlight conservation contributions and eco-friendly features.<br>• Monitor customer reviews and live Eco Score standing.                                                                                                                      |
| **`business_accommodation`** | Hotels, Resorts, Homestays & Glamping | • Manage 1 registered lodging venue.<br>• Update room rates, green facilities, and environmental impacts.<br>• Monitor guest ratings and eco-certification badges.                                                                                                                                                                                                                 |
| **`superadmin`**             | Platform Operations & Tourism Board   | • View complete directory of all Batam destinations & stays.<br>• Review pending business owner registrations.<br>• Approve (ACC) or reject business admin access.<br>• Monitor platform-wide sustainability statistics.                                                                                                                                                           |

---

## 3. Architecture & System Design

```
+---------------------------------------------------------------------------------------+
|                                    MOBILE CLIENT                                      |
|                 React Native (Expo SDK 57) + TypeScript + Expo Router                 |
|                                                                                       |
|   [ Tourist Portal ]           [ Business Portal ]            [ Superadmin Portal ]   |
|   - AI Trip Form & Chat        - Venue CRUD (1:1)             - Business User ACC     |
|   - Live Timeline Tracker      - Eco Score Analytics          - Full Venue Directory  |
|   - 3-Aspect Rating Modal      - Profile Settings             - System Metric Stats   |
+-------------------------------------------+-------------------------------------------+
                                            |
                                  HTTPS / JSON (JWT Auth)
                                            |
+-------------------------------------------v-------------------------------------------+
|                                  BACKEND API GATEWAY                                  |
|                           Go 1.26 + Gin Gonic Web Framework                           |
|                                                                                       |
|   [ Middleware Pipeline ]                                                             |
|   ├── CORS Handler                                                                    |
|   ├── JWT Authentication Middleware                                                   |
|   ├── Business Destination / Accommodation RBAC Guard                                 |
|   └── Superadmin RBAC Guard                                                           |
|                                                                                       |
|   [ Clean Architecture Layers ]                                                       |
|   ├── HTTP Handlers   (Request binding, validation, HTTP response parsing)            |
|   ├── Services        (Core business logic, Budget Guardrails, Eco Score Math)        |
|   └── Repositories    (GORM ORM Queries, Data Aggregation, Indexing)                 |
|                                                                                       |
|   [ Background Workers ]                                                              |
|   └── Robfig Cron v3 (Automated rating reminders & review aggregations)               |
+---------------------+-----------------------------------+-----------------------------+
                      |                                   |
           PostgreSQL Relational DB             External Cloud Services
                      |                                   |
+---------------------v--------------------+      +-------v-----------------------------+
|              POSTGRESQL 16               |      |        EXTERNAL AI & APIS           |
|                                          |      |                                     |
|  • users (RBAC + approval_status)        |      |  • OpenAI v1 / Gemini LLM API       |
|  • destinations & accommodations         |      |    (Structured JSON Itinerary Mode) |
|  • trips, itinerary_days, activities     |      |  • OpenWeatherMap API               |
|  • ratings (3-aspect weights)            |      |    (Current weather & 5-day forecast|
|  • chat_messages & trip_versions         |      |  • SMTP Mailer Service              |
+------------------------------------------+      +-------------------------------------+
```

### 3.1 Backend Clean Layered Architecture

The Go backend adheres strictly to Clean Architecture principles:

- **`cmd/server/main.go`**: Application entrypoint. Loads environment configurations, initializes database pools, wires up dependencies, registers cron background workers, and defines route trees.
- **`internal/model/`**: GORM structural models defining PostgreSQL schemas, check constraints, foreign keys, and indexes.
- **`internal/repository/`**: Database abstraction layer handling CRUD operations, database queries, and SQL aggregations.
- **`internal/service/`**: Domain layer implementing business rules, budget guardrails, rating formulas, and AI prompt engineering.
- **`internal/handler/`**: HTTP transport layer handling request parsing, data validation, status codes, and JSON responses.
- **`internal/middleware/`**: Interceptors for JWT verification, role-based access control (RBAC), and CORS headers.
- **`internal/ai/`**: Generic LLM client interface supporting OpenAI v1 Compatible Chat Completions (`POST /v1/chat/completions`) and Google Gemini (`google.golang.org/genai`).

### 3.2 AI Itinerary Prompting & Strict Budget Guardrails

When a tourist generates an itinerary:

1. **Dynamic Venue Injection**: The service queries top eco-rated destinations and accommodations from the database and injects them into the system prompt.
2. **Contextual Origin Handling**:
   - **Local Batam**: Ferry costs are set to `0`, focusing on domestic transport and local spots.
   - **International (Singapore / Malaysia)**: Injects exact round-trip ferry routes (e.g., HarbourFront $\leftrightarrow$ Batam Centre, Stulang Laut $\leftrightarrow$ Batam Centre) and computes round-trip ferry tickets per pax.
3. **Structured JSON Mode**: The AI outputs valid JSON matching the strict `GeneratedItinerary` schema.
4. **Strict Budget Guardrail**: Total estimated costs are calculated strictly from individual activities + ferry fares. If the AI output exceeds the tourist's stated budget, the backend recalculates and scales activity costs to strictly stay within `budget * 0.95`.

### 3.3 3-Aspect Rating & Real-Time Eco Score Mathematical Model

Tourist evaluations are structured into three distinct environmental aspects:

$$\text{Calculated Score} = (\text{Cleanliness} \times 20 \times 0.35) + (\text{Environmental Condition} \times 20 \times 0.40) + (\text{Environmental Care} \times 20 \times 0.25)$$

- **Scale Conversion**: Star ratings ($1 \dots 5$) map linearly to percentage scores ($20, 40, 60, 80, 100$).
- **Aspect Weights**:
  - **Cleanliness (35%)**: Waste management, litter-free premises, clean sanitation.
  - **Environmental Condition (40%)**: Vegetation preservation, natural ambiance, clean air, minimal noise.
  - **Environmental Care (25%)**: Plastic-free policy, energy/water conservation, local eco-products.
- **Aggregate Recalculation**: Every submitted rating triggers an immediate SQL aggregate computation:
  $$\text{Venue Eco Score} = \frac{1}{N} \sum_{i=1}^{N} \text{Calculated Score}_i$$
  This directly updates `destinations.eco_score` or `accommodations.eco_score`, reordering the tourist recommendation feed (`ORDER BY eco_score DESC`).

### 3.4 Role-Based Access Control (RBAC) & Approval State Machine

```
              [ User Registration ]
                        |
        +---------------+---------------+
        |                               |
  Role: tourist           Role: business_*
        |                               |
Status: 'approved'              Status: 'pending'
  (Immediate Login)             (Login Blocked)
                                        |
                                        v
                            [ Superadmin Review ]
                                        |
                        +---------------+---------------+
                        |                               |
                 Action: Approve                 Action: Reject
                        |                               |
                Status: 'approved'              Status: 'rejected'
                 (Login Allowed)                 (Access Forbidden)
```

---

## 4. Tech Stack & Dependencies

### Frontend (Mobile Client)

- **Framework**: React Native 0.86.2 with **Expo SDK 57**
- **Navigation**: Expo Router v57 (File-based navigation & tab layout)
- **Language**: TypeScript 6.0
- **State & Auth Storage**: `expo-secure-store`, `@react-native-async-storage/async-storage`
- **Networking**: Axios 1.19 (with JWT Interceptors & 60s timeout for AI generation)
- **Icons & UI**: `@expo/vector-icons` (Ionicons), `expo-linear-gradient`, `react-native-safe-area-context`

### Backend (REST API Server)

- **Language**: Go 1.26
- **HTTP Framework**: Gin Gonic v1.12 (`github.com/gin-gonic/gin`)
- **Database ORM**: GORM v1.31 (`gorm.io/gorm`, `gorm.io/driver/postgres`)
- **Authentication**: JWT v5 (`github.com/golang-jwt/jwt/v5`), Bcrypt (`golang.org/x/crypto/bcrypt`)
- **Database Engine**: PostgreSQL 16
- **Task Scheduling**: Robfig Cron v3 (`github.com/robfig/cron/v3`)
- **Environment Management**: Godotenv (`github.com/joho/godotenv`)

### External Services & APIs

- **OpenAI v1 Compatible Chat Completions API**: Custom LLM inference endpoints for itinerary generation and interactive revision chat.
- **Google GenAI SDK**: `google.golang.org/genai`
- **OpenWeatherMap API**: Real-time Batam weather metrics and 5-day forecasts.

---

## 5. API Specification

Base URL: `http://<SERVER_HOST>:8080`

### 5.1 Headers & Authentication

- **Public Endpoints**: No authorization header required.
- **Protected Endpoints**: Requires `Authorization: Bearer <JWT_TOKEN>`.

---

### 5.2 Authentication Endpoints (`/auth`)

#### `POST /auth/register`

Registers a new user account.

**Request Body**:

```json
{
  "name": "Batam Eco Resort Admin",
  "email": "resort@ecotrip.com",
  "password": "password123",
  "role": "business_accommodation"
}
```

_Roles: `tourist`, `business_destination`, `business_accommodation`_

**Response (`201 Created` - Tourist)**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 35,
    "name": "John Doe",
    "email": "john@email.com",
    "role": "tourist",
    "approval_status": "approved"
  }
}
```

**Response (`201 Created` - Business Admin)**:

```json
{
  "token": "",
  "user": {
    "id": 36,
    "name": "Batam Eco Resort Admin",
    "email": "resort@ecotrip.com",
    "role": "business_accommodation",
    "approval_status": "pending"
  }
}
```

---

#### `POST /auth/login`

Authenticates a user and issues a JWT token. Checks approval status for business users.

**Request Body**:

```json
{
  "email": "superadmin@superadmin.com",
  "password": "admin123"
}
```

**Response (`200 OK`)**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 100,
    "name": "Super Admin Batam",
    "email": "superadmin@superadmin.com",
    "role": "superadmin",
    "approval_status": "approved"
  }
}
```

**Response (`401 Unauthorized` - Pending Business Account)**:

```json
{
  "error": "Akun Anda sedang dalam proses verifikasi oleh Superadmin. Silakan tunggu persetujuan."
}
```

---

#### `POST /auth/forgot-password` & `POST /auth/reset-password`

Handles password recovery via email tokens.

---

### 5.3 User Account Endpoints (`/user`)

| Method | Endpoint            | Description                                           | Auth Required |
| :----- | :------------------ | :---------------------------------------------------- | :------------ |
| `GET`  | `/user/me`          | Retrieve authenticated user profile                   | Bearer Token  |
| `PUT`  | `/user/password`    | Update user password (`old_password`, `new_password`) | Bearer Token  |
| `PUT`  | `/user/email`       | Update user email address                             | Bearer Token  |
| `GET`  | `/user/preferences` | Get user travel preferences                           | Bearer Token  |
| `PUT`  | `/user/preferences` | Update user travel preferences                        | Bearer Token  |

---

### 5.4 AI Trip Generator & Interactive Chat Endpoints (`/trips`)

#### `POST /trips`

Generates a new multi-day smart itinerary using the LLM engine.

**Request Body**:

```json
{
  "title": "Trip Batam 3D (dari Singapore)",
  "origin_country": "singapore",
  "origin_port": "HarbourFront",
  "duration_days": 3,
  "pax": 2,
  "budget": 4000000,
  "interests": ["nature", "culinary"],
  "accommodation_preference": "hotel",
  "notes": "Prefer quiet nature spots and local seafood."
}
```

**Response (`201 Created`)**:

```json
{
  "trip": {
    "id": 1,
    "user_id": 32,
    "title": "Trip Batam 3D (dari Singapore)",
    "destination": "Batam",
    "origin_country": "singapore",
    "origin_port": "HarbourFront",
    "duration_days": 3,
    "pax": 2,
    "budget": 4000000,
    "ferry_cost_round_trip": 1400000,
    "total_estimated_cost": 3750000,
    "sustainability_score": 94,
    "current_version": 1,
    "status": "active"
  },
  "days": [
    {
      "id": 1,
      "trip_id": 1,
      "day_number": 1,
      "label": "Tiba di Batam & Konservasi Mangrove",
      "activities": [
        {
          "id": 1,
          "start_time": "08:30",
          "title": "Ferry dari HarbourFront ke Batam Centre",
          "category": "transport",
          "duration_minutes": 60,
          "estimated_cost": 700000
        },
        {
          "id": 2,
          "start_time": "10:30",
          "title": "Hutan Mangrove Rempang",
          "category": "nature",
          "duration_minutes": 120,
          "estimated_cost": 50000,
          "destination_id": 1
        }
      ]
    }
  ]
}
```

---

#### `GET /trips` & `GET /trips/:id/full`

- `GET /trips`: Returns all trips belonging to the authenticated user.
- `GET /trips/:id/full`: Returns full day-by-day activities, estimated costs, and metadata.

#### `PATCH /trips/:id/status`

Updates trip status (e.g. archiving an active trip: `{"status": "archived"}`).

#### `POST /trips/:id/chat`

Sends a natural language revision message to the AI Assistant.

**Request Body**:

```json
{
  "message": "Ganti makan siang hari ke-2 dengan kuliner khas Melayu dekat Nagoya"
}
```

**Response (`200 OK`)**:

```json
{
  "ai_message": {
    "id": 4,
    "trip_id": 1,
    "sender": "ai",
    "message": "Tentu! Jadwal makan siang hari ke-2 telah diganti ke Mak Usu Warung Nasi Dagang.",
    "created_at": "2026-08-16T10:30:00Z"
  },
  "is_revision": true
}
```

---

### 5.5 Rating & Eco Score Evaluation Endpoints (`/ratings`)

#### `POST /ratings`

Submits a 3-aspect rating for a visited destination or accommodation.

**Request Body**:

```json
{
  "target_type": "destination",
  "target_id": 1,
  "trip_id": 1,
  "cleanliness": 5,
  "environmental_condition": 4,
  "environmental_care": 5,
  "review_comment": "Hutan mangrovenya sangat asri dan perahu listriknya tidak berisik!"
}
```

**Response (`201 Created`)**:

```json
{
  "message": "Terima kasih atas penilaian eco kamu!",
  "rating": {
    "id": 12,
    "user_id": 32,
    "target_type": "destination",
    "destination_id": 1,
    "cleanliness": 5,
    "environmental_condition": 4,
    "environmental_care": 5,
    "calculated_score": 94.0,
    "review_comment": "Hutan mangrovenya sangat asri dan perahu listriknya tidak berisik!"
  }
}
```

#### `GET /ratings?target_type=destination&target_id=1`

Returns all customer reviews and the calculated aggregated Eco Score for a venue.

---

### 5.6 Destinations & Accommodations Directory Endpoints

| Method | Endpoint                       | Description                                                                 | Auth Required |
| :----- | :----------------------------- | :-------------------------------------------------------------------------- | :------------ |
| `GET`  | `/destinations`                | List destinations ordered by `eco_score DESC` (supports `?category=nature`) | Public        |
| `GET`  | `/destinations/:id`            | Get single destination detail by ID                                         | Public        |
| `GET`  | `/accommodations`              | List accommodations ordered by `eco_score DESC`                             | Public        |
| `GET`  | `/accommodations/:id`          | Get single accommodation detail by ID                                       | Public        |
| `POST` | `/accommodations/:id/favorite` | Toggle bookmark accommodation                                               | Bearer Token  |
| `GET`  | `/accommodations/favorites`    | List tourist's bookmarked accommodations                                    | Bearer Token  |

---

### 5.7 Business Admin Management Endpoints (`/business`)

_Restricted to users with role `business_destination` or `business_accommodation`._

```http
# Destination Business Admin
POST   /business/destinations        # Create venue profile
GET    /business/destinations/my     # Get current admin's venue
PUT    /business/destinations/:id    # Update venue profile
DELETE /business/destinations/:id    # Delete venue

# Accommodation Business Admin
POST   /business/accommodations      # Create accommodation profile
GET    /business/accommodations/my   # Get current admin's accommodation
PUT    /business/accommodations/:id  # Update accommodation profile
DELETE /business/accommodations/:id  # Delete accommodation
```

---

### 5.8 Superadmin Portal & Approval Endpoints (`/superadmin`)

_Restricted to users with role `superadmin`._

#### `GET /superadmin/stats`

Returns system metrics across venues and registrations.

**Response (`200 OK`)**:

```json
{
  "total_pending_business_users": 2,
  "total_approved_business": 31,
  "total_destinations": 22,
  "total_accommodations": 9
}
```

#### `GET /superadmin/business-users/pending`

Returns all business admin accounts awaiting verification.

#### `POST /superadmin/business-users/:id/approve`

Approves (ACCs) a pending business admin account.

#### `POST /superadmin/business-users/:id/reject`

Rejects a business admin account registration.

#### `GET /superadmin/destinations` & `GET /superadmin/accommodations`

Retrieves full directory listing of all registered Batam venues.

---

### 5.9 Weather & Ferry Utility Endpoints

| Method | Endpoint            | Description                                               | Auth Required |
| :----- | :------------------ | :-------------------------------------------------------- | :------------ |
| `GET`  | `/weather/current`  | Real-time weather temperature & condition in Batam        | Public        |
| `GET`  | `/weather/forecast` | 5-day Batam weather forecast                              | Public        |
| `GET`  | `/ferry/routes`     | Ferry routes and pricing from Singapore/Malaysia to Batam | Public        |

---

## 6. Installation & Getting Started

### 6.1 Prerequisites

- **Go**: Version `1.22+` (Go `1.26` recommended)
- **Node.js**: Version `18+` or `20+` & npm
- **PostgreSQL**: Version `15+` or `16+`
- **Expo CLI**: `npx expo`
- **Android Studio / Physical Android Device** (with Expo Go)

---

### 6.2 Backend Setup

1. **Navigate to the Backend Directory**:

   ```bash
   cd backend
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in `backend/`:

   ```env
   PORT=8080
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=ecotrip
   DB_SSLMODE=disable

   JWT_SECRET=your-secure-jwt-secret-key

   # AI LLM Provider Configuration
   AI_PROVIDER=openai
   OPENAI_API_KEY=your-api-key-here
   OPENAI_BASE_URL=https://openrouter.ai/api/v1
   OPENAI_MODEL=google/gemini-2.5-flash

   # Weather & Mailer (Optional)
   OPENWEATHER_API_KEY=your-openweather-key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. **Initialize Database & Seed Data**:
   Ensure PostgreSQL is running, then execute the seed file:

   ```bash
   PGPASSWORD=postgres psql -h localhost -U postgres -d ecotrip -f db/seed.sql
   ```

4. **Run the Go Server**:
   ```bash
   go run cmd/server/main.go
   ```
   The backend API will start on `http://localhost:8080`.

---

### 6.3 Frontend Setup

1. **Navigate to the Frontend Directory**:

   ```bash
   cd frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure API URL**:
   The app automatically detects `10.0.2.2:8080` for Android Emulators and local LAN IP for physical devices in `frontend/constants/api.ts`.

4. **Start the Expo Development Server**:

   ```bash
   npx expo start
   ```

   - Press `a` to run on Android Emulator.
   - Scan QR code via **Expo Go** on an Android physical device.

---

## 7. Seeded Demo Accounts

All pre-seeded accounts in the database share the password **`password123`**, except the Superadmin which uses **`admin123`**:

| Role                        | Email                             | Password      | Details                           |
| :-------------------------- | :-------------------------------- | :------------ | :-------------------------------- |
| **Superadmin**              | `superadmin@superadmin.com`       | `admin123`    | Master administrator portal       |
| **Tourist**                 | `senja@email.com`                 | `password123` | Demo tourist traveler account     |
| **Business (Destination)**  | `admin.mangrove@ecotrip.com`      | `password123` | Manager of Hutan Mangrove Rempang |
| **Business (Botanical)**    | `admin.botanical@ecotrip.com`     | `password123` | Manager of Kebun Raya Batam       |
| **Business (Culinary)**     | `admin.miesagu@ecotrip.com`       | `password123` | Owner of Warung Mie Sagu Bu Nur   |
| **Business (Hotel/Resort)** | `admin.montigo@ecotrip.com`       | `password123` | Manager of Montigo Resorts Batam  |
| **Business (Homestay)**     | `admin.homestaybambu@ecotrip.com` | `password123` | Owner of Homestay Bambu Barelang  |

---

## 8. License & Contributors

- **Project**: EcoTour AI / EcoTrip Mobile Application
- **Target Region**: Batam Island, Riau Islands Province, Indonesia
- **License**: Proprietary / Educational Project
