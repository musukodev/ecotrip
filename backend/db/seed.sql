-- =============================================================================
-- EcoTour AI — Seed Data: 1 Akun Admin Pelaku Usaha = 1 Tempat Nyata Batam
-- Password untuk semua akun: password123
-- =============================================================================

-- 1. Bersihkan seluruh data tabel
TRUNCATE TABLE user_favorites, ratings, itinerary_activities, itinerary_days, trip_versions, chat_messages, carbon_offsets, trip_collaborators, trips, destinations, accommodations, ferry_routes, users RESTART IDENTITY CASCADE;

-- 2. SEED USERS (1 Superadmin + 31 Admin Pelaku Usaha + 1 Turis Demo)
-- Password hash untuk "password123": $2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi
-- Password hash untuk "admin123":    $2a$10$wE9K2s.y4rLwLh07n84mruK5x1E.N2h/c4N9sF3dZg3s2zK6aQ7C. (atau gunakan bcrypt standar)

INSERT INTO users (id, name, email, password_hash, role, approval_status) VALUES
  -- === 1 AKUN SUPERADMIN (ID: 100) ===
  (100, 'Super Admin Batam',                'superadmin@superadmin.com',      '$2a$10$q84I6XN0z7HUuRqHpxbDiuaqMwHQzSOR4biY8PT8ep8fOiJqc8EgO', 'superadmin', 'approved'),

  -- === 22 ADMIN DESTINASI & KULINER (ID: 1 - 22) ===
  (1,  'Pengelola Mangrove Rempang',        'admin.mangrove@ecotrip.com',     '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (2,  'Manajemen Kebun Raya Batam',        'admin.botanical@ecotrip.com',    '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (3,  'Pengelola Pantai Viovio',           'admin.viovio@ecotrip.com',       '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (4,  'Pengelola Pantai Melur',            'admin.melur@ecotrip.com',        '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (5,  'Pengelola Mata Kucing Sanctuary',   'admin.matakucing@ecotrip.com',   '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (6,  'Pengelola Pantai Mirota',           'admin.mirota@ecotrip.com',       '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (7,  'Komunitas Puncak Beliung',          'admin.beliung@ecotrip.com',      '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (8,  'Pengelola Pantai Marina',           'admin.marina@ecotrip.com',       '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (9,  'Pengelola Situs Kampung Vietnam',   'admin.vietnam@ecotrip.com',      '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (10, 'Pengelola Rumah Adat Melayu',       'admin.adamelayu@ecotrip.com',    '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (11, 'Pengelola Maha Vihara Maitreya',    'admin.vihara@ecotrip.com',       '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (12, 'Pengelola Masjid Sultan Mahmud',    'admin.masjidagung@ecotrip.com',  '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (13, 'Pengelola Jembatan Barelang',       'admin.barelang@ecotrip.com',     '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (14, 'Pengelola Museum Raja Ali Haji',    'admin.museum@ecotrip.com',       '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (15, 'Bu Nur (Warung Mie Sagu)',          'admin.miesagu@ecotrip.com',      '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (16, 'Pemilik Kedai Kopi Nagoya Hijau',   'admin.kopinagoya@ecotrip.com',   '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (17, 'Pengelola Seafood Piayu Laut',      'admin.piayuseafood@ecotrip.com', '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (18, 'Sentra UMKM Gonggong Batu Besar',   'admin.gonggong@ecotrip.com',     '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (19, 'Manajemen Sup Ikan Yong Kee',       'admin.supikan@ecotrip.com',      '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (20, 'Pengelola Luti Gendang Harbour Bay','admin.lutigendang@ecotrip.com',  '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (21, 'Pengelola Kelong Golden Prawn',     'admin.goldenprawn@ecotrip.com',  '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),
  (22, 'Mak Usu (Warung Nasi Dagang)',      'admin.nasidagang@ecotrip.com',   '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_destination', 'approved'),

  -- === 9 ADMIN PENGINAPAN & HOTEL (ID: 23 - 31) ===
  (23, 'Manajemen Montigo Resorts',         'admin.montigo@ecotrip.com',      '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_accommodation', 'approved'),
  (24, 'Manajemen Nongsa Point Marina',     'admin.nongsapoint@ecotrip.com',  '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_accommodation', 'approved'),
  (25, 'Manajemen Turi Beach',              'admin.turibeach@ecotrip.com',    '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_accommodation', 'approved'),
  (26, 'Manajemen Radisson Batam',          'admin.radisson@ecotrip.com',     '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_accommodation', 'approved'),
  (27, 'Manajemen Marriott Harbour Bay',    'admin.marriott@ecotrip.com',     '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_accommodation', 'approved'),
  (28, 'Manajemen ASTON Batam',             'admin.aston@ecotrip.com',        '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_accommodation', 'approved'),
  (29, 'Pak Budi (Homestay Bambu)',         'admin.homestaybambu@ecotrip.com','$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_accommodation', 'approved'),
  (30, 'Pengelola Barelang Eco Homestay',   'admin.barelangstay@ecotrip.com', '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_accommodation', 'approved'),
  (31, 'Manajemen Nongsa Village',          'admin.nongsavillage@ecotrip.com','$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'business_accommodation', 'approved'),

  -- === 1 AKUN TURIS DEMO (ID: 32) ===
  (32, 'Senja Pratiwi',                     'senja@email.com',                '$2a$10$IyANnpJfk/aaOXHLWRqauevwxLbrWOMS3M0cL.CCtU1UIq5t9/BSi', 'tourist', 'approved');

-- Sesuaikan sequence ID users
SELECT setval('users_id_seq', 101, true);

-- 3. DESTINATIONS (22 Tempat Nyata Batam dengan created_by mengarah ke masing-masing admin)
INSERT INTO destinations (created_by, name, category, description, location, latitude, longitude, opening_hours, ticket_price, best_visit_time, facilities, photos, phone, eco_score, conservation_contribution_pct) VALUES
  -- === NATURE ===
  (
    1, 'Hutan Mangrove Rempang', 'nature',
    'Kawasan konservasi mangrove terpadu dengan jalur edukasi susur hutan menggunakan perahu listrik ramah lingkungan dan pembibitan mangrove.',
    'Jembatan 4 Barelang, Rempang, Batam', 1.0053, 104.0834,
    '08:00 - 17:00', 25000, 'Pagi hari (08:00 - 10:00)',
    ARRAY['Toilet', 'Musholla', 'Pemandu Edukasi', 'Jalur Kayu', 'Dermaga Perahu Listrik'],
    ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000'],
    '+62 812-7001-2345', 92.5, 20.0
  ),
  (
    2, 'Kebun Raya Batam (Batam Botanical Garden)', 'nature',
    'Kawasan konservasi tumbuhan pesisir pulau-pulau kecil Indonesia seluas 86 hektar dengan jalur jogging dan taman tematik.',
    'Jl. Hang Lekiu, Sambau, Nongsa, Batam', 1.1738, 104.1022,
    '08:00 - 18:00', 10000, 'Pagi atau sore hari',
    ARRAY['Jalur Sepeda', 'Danau Konservasi', 'Toilet Ramah Difabel', 'Pusat Informasi'],
    ARRAY['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000'],
    '+62 778-761-123', 95.0, 25.0
  ),
  (
    3, 'Pantai Viovio Galang', 'nature',
    'Pantai pasir putih alami dengan ayunan laut ikonik dan program perlindungan pesisir serta pembersihan pantai swadaya.',
    'Jembatan 5 Barelang, Sijantung, Galang, Batam', 0.9412, 104.1685,
    '06:00 - 19:00', 15000, 'Sore menjelang sunset',
    ARRAY['Gazebo Bambu', 'Kantin Lokal', 'Toilet', 'Area Berkemah'],
    ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000'],
    '+62 813-7223-4455', 85.0, 10.0
  ),
  (
    4, 'Pantai Melur Galang', 'nature',
    'Pantai teduh berpasir putih luas dengan deretan pohon kelapa dan inisiatif pelestarian terumbu karang lokal.',
    'Tanjung Kertang, Sijantung, Galang, Batam', 0.9850, 104.1800,
    '07:00 - 18:00', 15000, 'Pagi hingga siang',
    ARRAY['Toilet', 'Pondok Wisata', 'Penyewaan Kano', 'Tempat Sampah Terpilah'],
    ARRAY['https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1000'],
    '+62 813-7112-3344', 84.0, 10.0
  ),
  (
    5, 'Mata Kucing Nature Sanctuary', 'nature',
    'Cagar alam dan pusat penyelamatan satwa lokal di tengah hutan lindung alami dengan jalur trekking kanopi.',
    'Jl. Diponegoro, Kibing, Batu Aji, Batam', 1.0825, 103.9782,
    '08:30 - 17:30', 20000, 'Pagi hari',
    ARRAY['Trekking Trail', 'Kolam Ikan Alami', 'Area Edukasi Satwa', 'Kantin Tradisional'],
    ARRAY['https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000'],
    '+62 812-7788-1122', 88.0, 15.0
  ),
  (
    6, 'Pantai Mirota Barelang', 'nature',
    'Pantai asri berpasir putih lembut dengan pondok-pondok kayu dan kebijakan bebas sampah plastik sekali pakai.',
    'Pulau Setokok, Galang, Batam', 0.9632, 104.1481,
    '07:00 - 18:30', 20000, 'Sore hari',
    ARRAY['Pondok Kayu', 'Wahana Banana Boat Ramah Laut', 'Kamar Bilas'],
    ARRAY['https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1000'],
    '+62 852-9900-1122', 86.0, 10.0
  ),
  (
    7, 'Puncak Beliung Sekupang', 'nature',
    'Titik trekking perbukitan hijau alami dengan pemandangan lanskap Selat Singapura dan hutan lindung Sekupang.',
    'Tanjung Pinggir, Sekupang, Batam', 1.1215, 103.9350,
    '06:00 - 18:00', 10000, 'Subuh (Sunrise) / Pagi',
    ARRAY['Jalur Pendakian Alami', 'Spot Foto Panorama', 'Pos Istirahat'],
    ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000'],
    '+62 811-6677-8899', 90.0, 15.0
  ),
  (
    8, 'Pantai Marina Batam', 'nature',
    'Kawasan pesisir hijau dengan taman tepi laut, dermaga kapal, dan jalur jogging yang tertata rapi.',
    'Waterfront City, Tanjung Riau, Sekupang, Batam', 1.0920, 103.9320,
    '06:00 - 20:00', 15000, 'Sore hari',
    ARRAY['Jogging Track', 'Taman Hijau', 'Dermaga Kapal', 'Area Duduk'],
    ARRAY['https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1000'],
    '+62 778-381-234', 83.0, 5.0
  ),

  -- === CULTURE ===
  (
    9, 'Kampung Vietnam (Galang Refugee Camp)', 'culture',
    'Situs peninggalan sejarah kemanusiaan pengungsi manusia perahu Vietnam (1979-1996) di bawah perlindungan PBB UNHCR.',
    'Sinar Jantung, Pulau Galang, Batam', 1.0420, 104.2100,
    '08:30 - 16:30', 20000, 'Pagi atau siang hari',
    ARRAY['Museum Sejarah', 'Gereja Tua', 'Vihara Quan Am Tu', 'Pemandu Sejarah', 'Kios UMKM'],
    ARRAY['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000'],
    '+62 811-7788-9900', 82.0, 15.0
  ),
  (
    10, 'Rumah Adat Melayu Nongsa', 'culture',
    'Pusat kebudayaan Melayu Kepulauan Riau dengan pameran arsitektur tradisional panggung kayu dan kerajinan tenun.',
    'Kampung Nongsa Pantai, Sambau, Batam', 1.1820, 104.0950,
    '09:00 - 17:00', 20000, 'Siang hingga sore',
    ARRAY['Galeri Seni Tradisional', 'Workshop Tenun', 'Toilet', 'Pondok Belajar'],
    ARRAY['https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1000'],
    '+62 812-8899-0011', 89.0, 12.0
  ),
  (
    11, 'Maha Vihara Duta Maitreya', 'culture',
    'Vihara terbesar di Asia Tenggara dengan filosofi cinta alam semesta dan restoran vegetarian zero-waste berkapasitas besar.',
    'Jl. Bukit Beruntung, Sei Panas, Batam Kota', 1.1332, 104.0321,
    '07:00 - 20:00', 0, 'Sepanjang hari',
    ARRAY['Restoran Vegetarian', 'Taman Meditasi', 'Toko Buku', 'Toilet Ramah Lingkungan'],
    ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000'],
    '+62 778-463-888', 94.0, 0.0
  ),
  (
    12, 'Masjid Sultan Mahmud Riayat Syah', 'culture',
    'Masjid megah berarsitektur perpaduan Melayu, Arab, dan Turki dengan sistem pendinginan alami hemat energi dan payung membran.',
    'Tanjung Uncang, Batu Aji, Batam', 1.0610, 103.9510,
    '04:00 - 22:00', 0, 'Waktu shalat & pagi/sore',
    ARRAY['Menara Pandang 99M', 'Taman Luas', 'Tempat Wudhu Hemat Air', 'Parkir Terpadu'],
    ARRAY['https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1000'],
    '+62 813-6450-0011', 88.0, 0.0
  ),
  (
    13, 'Jembatan Barelang I (Tengku Fisabilillah)', 'culture',
    'Mahakarya arsitektur jembatan kabel pancang ikonik Batam yang menghubungkan Pulau Batam dengan pulau-pulau di sekitarnya.',
    'Jl. Trans Barelang, Tembesi, Batam', 1.0022, 104.0410,
    'Buka 24 Jam', 0, 'Sore menjelang malam (Sunset)',
    ARRAY['Spot Foto Laut', 'Penjual Jagung Bakar Lokal', 'Area Parkir'],
    ARRAY['https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1000'],
    '+62 812-7000-8888', 80.0, 0.0
  ),
  (
    14, 'Museum Batam Raja Ali Haji', 'culture',
    'Museum resmi peradaban Batam mulai dari era Kerajaan Riau-Lingga, masa kemerdekaan, hingga pembangunan modern.',
    'Dataran Engku Putri, Batam Center, Batam', 1.1290, 104.0535,
    '09:00 - 17:00 (Senin Tutup)', 0, 'Pagi atau siang hari',
    ARRAY['Ruang Edukasi AC Hemat Energi', 'Pemandu Digital', 'Toilet Bersih'],
    ARRAY['https://images.unsplash.com/photo-1565034946487-077786996e27?q=80&w=1000'],
    '+62 778-472-888', 86.0, 0.0
  ),

  -- === CULINARY ===
  (
    15, 'Warung Mie Sagu Bu Nur', 'culinary',
    'Kuliner tradisional khas Melayu Batam dengan mie sagu kenyal zero-waste tanpa MSG, dibungkus daun simpur.',
    'Komp. Nagoya Citywalk Blok A No. 12, Lubuk Baja, Batam', 1.1498, 104.0305,
    '07:30 - 21:00', 35000, 'Sarapan & Makan Siang',
    ARRAY['Dine-in Bebas Plastik', 'Refill Air', 'Toilet'],
    ARRAY['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000'],
    '+62 852-6677-8899', 93.0, 5.0
  ),
  (
    16, 'Kedai Kopi Nagoya Hijau', 'culinary',
    'Kafe komunitas ramah lingkungan dengan biji kopi langsung dari petani lokal Sumatera tanpa kemasan plastik sekali pakai.',
    'Jl. Imam Bonjol No. 45, Nagoya, Batam', 1.1480, 104.0290,
    '08:00 - 22:00', 25000, 'Sepanjang hari',
    ARRAY['Wi-Fi Cepat', 'Area Non-Merokok', 'Refill Air Minum Gratis'],
    ARRAY['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000'],
    '+62 821-3344-5566', 90.0, 5.0
  ),
  (
    17, 'Restoran Seafood Piayu Laut', 'culinary',
    'Restoran panggung kayu terapung menyajikan olahan laut segar harian tangkapan nelayan pesisir Tanjung Piayu (Gonggong & Ketam).',
    'Kampung Piayu Laut, Sei Beduk, Batam', 1.0450, 104.0720,
    '10:00 - 20:00', 95000, 'Makan siang / sore',
    ARRAY['Pondok Laut Tradisional', 'Musholla Apung', 'Toilet'],
    ARRAY['https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1000'],
    '+62 812-7002-3344', 87.0, 5.0
  ),
  (
    18, 'Sentra Gonggong & Otak-otak Batu Besar', 'culinary',
    'Sentra kuliner UMKM khas Kepri dengan olahan siput gonggong rebus dan otak-otak panggang arang kelapa.',
    'Jl. Pantai Batu Besar, Nongsa, Batam', 1.1550, 104.1120,
    '11:00 - 22:00', 40000, 'Sore hingga malam',
    ARRAY['Dine-in Tepi Pantai', 'Pusat Oleh-oleh UMKM', 'Parkir'],
    ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000'],
    '+62 813-6440-1122', 91.0, 5.0
  ),
  (
    19, 'Sup Ikan Batam Yong Kee', 'culinary',
    'Kuliner legendaris Batam dengan kuah bening gurih berbahan ikan tenggiri segar lokal, sawi asin, dan tomat hijau.',
    'Komp. Nagoya Commercial Centre Blok A No. 1, Nagoya', 1.1445, 104.0150,
    '09:00 - 21:30', 55000, 'Makan Siang & Malam',
    ARRAY['AC', 'Dapur Bersih Terbuka', 'Toilet'],
    ARRAY['https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1000'],
    '+62 778-458-777', 88.0, 0.0
  ),
  (
    20, 'Luti Gendang & Kopi Harbour Bay', 'culinary',
    'Kudapan roti khas Kepri isi abon ikan tuna bumbu rempah tradisional yang disajikan hangat bersama kopi O lokal.',
    'Harbour Bay Promenade, Batu Ampar, Batam', 1.1540, 103.9980,
    '07:00 - 22:00', 20000, 'Pagi hari / santai sore',
    ARRAY['Pemandangan Laut Feri', 'Area Luar Ruangan', 'Toilet'],
    ARRAY['https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000'],
    '+62 812-7711-2233', 89.0, 5.0
  ),
  (
    21, 'Kelong Seafood Golden Prawn 933', 'culinary',
    'Restoran kelong panggung laut legendaris Batam yang memberdayakan nelayan lokal pesisir Bengkong.',
    'Jl. Bengkong Laut, Bengkong, Batam', 1.1610, 104.0390,
    '10:00 - 22:00', 120000, 'Makan Siang & Malam',
    ARRAY['Tempat Duduk Apung', 'Musholla', 'Toilet', 'Area Parkir Luas'],
    ARRAY['https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1000'],
    '+62 778-442-123', 84.0, 3.0
  ),
  (
    22, 'Warung Nasi Dagang Mak Usu', 'culinary',
    'Sajian otentik nasi dagang Melayu berbahan beras santan rempah ikan tongkol yang dibungkus rapi daun pisang.',
    'Komp. Batam Center Point Blok B No. 4, Batam Center', 1.1270, 104.0480,
    '06:30 - 14:00', 20000, 'Sarapan & Makan Siang',
    ARRAY['Bebas Styrofoam', 'Dine-in Sederhana', 'Toilet'],
    ARRAY['https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1000'],
    '+62 813-7220-9988', 95.0, 5.0
  );

-- 4. ACCOMMODATIONS (9 Penginapan Ramah Lingkungan dengan created_by mengarah ke masing-masing admin hotel)
INSERT INTO accommodations (created_by, name, category, description, location, latitude, longitude, price_per_night, facilities, photos, phone, environmental_impact, eco_score) VALUES
  (
    23, 'Montigo Resorts Nongsa', 'resort',
    'Resort vila tepi pantai berbintang lima dengan komitmen pengurangan limbah plastik, konservasi air laut, dan proteksi terumbu karang.',
    'Jl. Hang Lekiu, Sambau, Nongsa, Batam', 1.1890, 104.1020,
    2400000,
    ARRAY['Kolam Renang Privat', 'Restoran Organik Tepi Laut', 'Spa Tradisional', 'Wi-Fi 100 Mbps', 'Panel Surya Air Hangat'],
    ARRAY['https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000'],
    '+62 778-776-8888',
    'Menggunakan sistem solar water heating, zero single-use plastic di seluruh vila, dan pengelolaan air desalinasi ramah lingkungan.',
    92.0
  ),
  (
    24, 'Nongsa Point Marina & Resort', 'resort',
    'Resort bergaya Mediterania internasional yang dikelilingi taman tropis asri dan kawasan perlindungan hutan mangrove pesisir.',
    'Jl. Hang Lekiu, Nongsa, Batam', 1.1920, 104.1080,
    1350000,
    ARRAY['Dermaga Kapal Marina', 'Kolam Renang Lagoon', 'Restoran Pantai', 'Fasilitas Olahraga Air Bebas Polusi'],
    ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000'],
    '+62 778-761-333',
    'Pelestarian zona hijau bakau di area marina, audit efisiensi listrik bulanan, dan program pembersihan pantai terpadu.',
    90.0
  ),
  (
    25, 'Turi Beach Resort', 'resort',
    'Resort tepi laut bertema perkampungan Melayu modern dengan material kayu alami lokal dan program transplantasi karang.',
    'Jl. Hang Lekiu, Nongsa Pantai, Batam', 1.1935, 104.1110,
    1200000,
    ARRAY['Kolam Renang Pasir Alami', 'Jembatan Dermaga Panjang', 'Spa Hijau', 'Restoran Tepi Tebing'],
    ARRAY['https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000'],
    '+62 778-761-080',
    'Program adopsi karang laut untuk setiap tamu dan pemanfaatan pencahayaan alami di seluruh kamar bungalow.',
    88.0
  ),
  (
    26, 'Radisson Golf & Convention Center Batam', 'hotel',
    'Hotel bisnis dan liburan bersertifikasi Green Building dengan teknologi sensor hemat energi cerdas dan pemilahan sampah organik.',
    'Jl. Jendral Sudirman, Sukajadi, Batam Kota', 1.1160, 104.0340,
    1100000,
    ARRAY['Kolam Renang Infinity', 'Lapangan Golf Hijau', 'Pusat Kebugaran', 'Restoran Internasional Organik', 'EV Charging Station'],
    ARRAY['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000'],
    '+62 778-480-0888',
    'Tersertifikasi Green Building Council, 100% lampu LED sensor gerak, dan stasiun pengisian daya kendaraan listrik (EV).',
    91.0
  ),
  (
    27, 'Batam Marriott Hotel Harbour Bay', 'hotel',
    'Hotel bintang lima tepi laut terintegrasi dengan Terminal Feri Harbour Bay, menggunakan sistem pendinginan daur ulang canggih.',
    'Harbour Bay Downtown, Jl. Duyung, Batu Ampar, Batam', 1.1550, 103.9960,
    1900000,
    ARRAY['Lounge Tepi Laut', 'Kolam Renang Rooftop', 'Akses Langsung Terminal Feri', 'Restoran Ramah Lingkungan'],
    ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000'],
    '+62 778-570-7999',
    'Pengelolaan limbah makanan terpadu bekerja sama dengan pengolah kompos lokal serta sistem konservasi air pendingin AC.',
    89.0
  ),
  (
    28, 'ASTON Batam Hotel & Residence', 'hotel',
    'Hotel modern di pusat kota Nagoya dengan implementasi efisiensi energi terpadu dan fasilitas tanpa plastik sekali pakai.',
    'Jl. Sriwijaya No. 1, Pelita, Lubuk Baja, Batam', 1.1390, 104.0180,
    750000,
    ARRAY['Kolam Renang', 'Gym', 'Restoran Halal', 'Ruang Rapat Hemat Energi'],
    ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000'],
    '+62 778-488-1888',
    'Pengurangan penggunaan kertas 90% (Paperless Check-in), perlengkapan mandi berbahan jerami gandum, dan lampu hemat energi.',
    86.0
  ),
  (
    29, 'Homestay Bambu Sekupang', 'homestay',
    'Penginapan pedesaan ramah lingkungan dengan konstruksi 100% bambu lestari lokal, pemanenan air hujan, dan kebun organik mandiri.',
    'Jl. Wisata Tanjung Pinggir, Sekupang, Batam', 1.0950, 104.0140,
    280000,
    ARRAY['Dapur Bersama Organik', 'Taman Edukasi Bambu', 'Penyewaan Sepeda Bambu', 'Kipas Angin Alam'],
    ARRAY['https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1000'],
    '+62 813-9988-7766',
    'Konstruksi 100% bahan alami bambu lokal, toilet kompos kering ramah tanah, dan pasokan sayuran segar dari kebun sendiri.',
    96.0
  ),
  (
    30, 'Barelang Eco Homestay', 'homestay',
    'Penginapan berbasis komunitas warga pesisir Jembatan 1 Barelang bertenaga surya dengan suguhan teh herbal pekarangan.',
    'Tembesi, Jembatan 1 Barelang, Sagulung, Batam', 1.0150, 104.0380,
    320000,
    ARRAY['Balkon Pemandangan Jembatan', 'Sarapan Masakan Rumah Lokal', 'Perahu Kayuh'],
    ARRAY['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000'],
    '+62 812-6655-4433',
    'Dikelola 100% oleh keluarga nelayan lokal, mengandalkan penerangan panel surya dan tanpa sampah anorganik.',
    94.0
  ),
  (
    31, 'Nongsa Village Villa', 'homestay',
    'Vila kayu tradisional panggung Melayu di bawah kanopi pepohonan tropis asri dengan sirkulasi udara alami tanpa AC berlebih.',
    'Jl. Hang Lekiu, Nongsa Pantai, Batam', 1.1850, 104.0980,
    850000,
    ARRAY['Dapur Lengkap', 'Akses Pantai Privat', 'Area Bersepeda', 'Wi-Fi'],
    ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000'],
    '+62 778-761-555',
    'Pemanfaatan ventilasi silang alami arsitektur tradisional Melayu untuk menghemat energi listrik dan pelestarian pohon tua.',
    90.0
  );

-- 5. FERRY ROUTES (Rute Feri SG & MY -> Batam)
INSERT INTO ferry_routes (origin_country, origin_port, destination_port, operator_name, price_one_way, price_round_trip, currency, duration_minutes, source_url) VALUES
  (
    'singapore', 'HarbourFront', 'Batam Center', 'Batam Fast Ferry',
    425000, 850000, 'IDR', 50, 'https://www.batamfast.com'
  ),
  (
    'singapore', 'HarbourFront', 'Harbour Bay Batam', 'Horizon Fast Ferry',
    440000, 880000, 'IDR', 45, 'https://www.horizonferry.com'
  ),
  (
    'singapore', 'Tanah Merah', 'Nongsapura Batam', 'Batam Fast Ferry',
    425000, 850000, 'IDR', 40, 'https://www.batamfast.com'
  ),
  (
    'singapore', 'Tanah Merah', 'Batam Center', 'Majestic Fast Ferry',
    425000, 850000, 'IDR', 45, 'https://www.majesticfastferry.com.sg'
  ),
  (
    'malaysia', 'Stulang Laut (Johor)', 'Batam Center', 'Indomas Ferry',
    325000, 650000, 'IDR', 90, 'https://www.indomasferry.com'
  ),
  (
    'malaysia', 'Pasir Gudang (Johor)', 'Batam Center', 'Batam Fast Ferry',
    310000, 620000, 'IDR', 85, 'https://www.batamfast.com'
  );
