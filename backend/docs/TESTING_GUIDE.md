# Panduan Testing API EcoTour AI

## 1. Setup (lakukan sekali)

### A. Import ke Postman

1. Buka Postman
2. Klik **Import** (kiri atas)
3. Import kedua file ini:
   - `docs/EcoTour_API.postman_collection.json`
   - `docs/EcoTour_DEV.postman_environment.json`
4. Di pojok kanan atas Postman, pilih environment **"EcoTour DEV"**

### B. Jalankan Backend

```bash
# 1. Jalankan PostgreSQL
cd ecotrip
docker compose up postgres -d

# 2. Tunggu 3-5 detik, lalu jalankan backend
cd backend
go run ./cmd/server
```

Server jalan di `http://localhost:8080`

### C. Set GEMINI_API_KEY (opsional, untuk test AI)

Edit `backend/.env`:
```
GEMINI_API_KEY=your-key-from-aistudio.google.com
```

Dapat API key gratis di: https://aistudio.google.com/app/apikey

---

## 2. Urutan Test yang Disarankan

### Step 1 — Cek server hidup
```
GET /health
```
Expected: `{ "status": "ok", "gemini": "active" }`

---

### Step 2 — Register & Login

Jalankan **"Register"** → token otomatis tersimpan ke environment variable `{{token}}`

Atau jalankan **"Login"** jika sudah punya akun.

Setelah ini, semua request lain otomatis pakai token tersebut.

---

### Step 3 — Update Preferensi (F-006)

**"Update Preferences"** → set bahasa dan minat wisata

---

### Step 4 — Buat Trip (F-007, F-008)

**"Create Trip + Generate AI"**

- Jika Gemini aktif: response berisi `trip` + `days` (itinerary lengkap)
- Jika Gemini tidak aktif: response berisi `trip` dengan warning
- `trip_id` otomatis tersimpan ke `{{trip_id}}`

---

### Step 5 — Lihat Itinerary Lengkap (F-010)

**"Trip Full + Itinerary"** → lihat semua hari + aktivitas

---

### Step 6 — Chat AI (F-011–016)

Coba 3 jenis pesan:
1. **"Send Message — Revisi Itinerary"** → `is_revision: true`, itinerary berubah, versi naik
2. **"Send Message — Ganti Tempat"** → minta alternatif aktivitas
3. **"Send Message — Tanya Umum"** → `is_revision: false`, jawaban info saja

---

### Step 7 — Versi & Rollback (F-015)

1. **"List Version History"** → lihat v1, v2, v3...
2. **"Rollback ke Versi Lama"** → kembalikan ke v1

---

### Step 8 — Eco Hub (F-017–024)

1. **"Carbon Report"** → total CO2 + breakdown pie chart
2. **"Sustainability Score"** → skor 0–100
3. **"Eco Places by Category"** → coba `?category=destination`, `?category=transport`, dll
4. **"Donate Carbon Offset"** → nominal 25000 / 50000 / 100000

---

### Step 9 — Badge (F-025–032)

**Sebagai Turis:**
1. **"Submit Badge"** → `submission_id` otomatis tersimpan
2. **"My Badge Submissions"** → cek status `pending`

**Sebagai Admin:**
```sql
-- Buat user admin (jalankan langsung di PostgreSQL):
UPDATE users SET role = 'admin' WHERE email = 'senja@email.com';
```
Lalu Login ulang (role di JWT akan jadi `admin`), kemudian:
1. **"Pending Only"** → lihat submission yang menunggu
2. **"Submission Detail"** → lihat foto & deskripsi
3. **"Approve Badge"** atau **"Reject Badge"**

---

### Step 10 — Kolaborasi (F-037)

1. Register user kedua dengan email berbeda (buka tab baru Postman, register dulu)
2. Balik ke user pertama, jalankan **"Invite Collaborator"** dengan email user kedua
3. Cek **"List Collaborators"**

---

### Step 11 — Notifikasi

**"List Notifications"** → cek notifikasi yang masuk (badge approved/rejected, itinerary updated, dll)

---

## 3. Catatan Penting

### Token expired
JWT berlaku 7 hari. Jika expired (response 401), jalankan Login lagi.

### Variable otomatis tersimpan
| Request | Variable yang di-set |
|---|---|
| Register / Login | `{{token}}` |
| Create Trip | `{{trip_id}}` |
| Submit Badge | `{{submission_id}}` |

### Ganti variable manual
Klik nama environment "EcoTour DEV" → edit nilai variable langsung.

### Test tanpa Gemini API key
Endpoint yang **tidak butuh** Gemini (tetap bisa ditest):
- Semua Auth, User, Preference
- List trips, delete trip
- Eco places, carbon report (jika ada data)
- Badge submit, admin approve/reject
- Collaboration, notification

Endpoint yang **butuh** Gemini:
- `POST /trips` (create + generate)
- `POST /trips/:id/generate` (regenerate)
- `POST /trips/:tripId/chat` (send message)

---

## 4. Seed Data (opsional)

Untuk test endpoint eco places dan badge, perlu ada data di tabel `eco_places`.
Jalankan SQL berikut di PostgreSQL:

```sql
INSERT INTO eco_places (name, description, location, latitude, longitude, category, has_badge, badge_label)
VALUES
  ('Hutan Mangrove Rempang', 'Kawasan konservasi mangrove dengan jalur edukasi', 'Batam', 1.0053, 104.0834, 'destination', false, ''),
  ('Feri Cepat Batam-Singapura', 'Penyeberangan feri rendah emisi Batam Center – HarbourFront', 'Batam', 1.1314, 104.0121, 'transport', false, ''),
  ('Hotel Eco Bay', 'Hotel bersertifikat hijau dekat Marina Bay', 'Singapura', 1.2822, 103.8585, 'accommodation', false, ''),
  ('Warung Mie Sagu Bu Nur', 'UMKM kuliner khas Batam, bahan lokal', 'Nagoya, Batam', 1.1498, 104.0305, 'culinary', false, ''),
  ('Sepeda Listrik Kota Batam', 'Sewa sepeda listrik per jam, 6 titik lokasi', 'Batam', 1.1200, 104.0100, 'transport', false, '');
```
