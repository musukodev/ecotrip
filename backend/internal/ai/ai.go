package ai

import (
	"context"
	"fmt"
	"strings"
)

// AIClient — interface generik untuk provider LLM
type AIClient interface {
	GenerateItinerary(ctx context.Context, req ItineraryRequest) (*GeneratedItinerary, error)
	ChatRevise(ctx context.Context, userMessage string, currentItineraryJSON string, tripContext string) (*ChatRevisionResult, error)
}

type AvailableDestination struct {
	ID          uint64  `json:"id"`
	Name        string  `json:"name"`
	Category    string  `json:"category"`
	Location    string  `json:"location"`
	TicketPrice float64 `json:"ticket_price"`
	EcoScore    float64 `json:"eco_score"`
}

type AvailableAccommodation struct {
	ID            uint64  `json:"id"`
	Name          string  `json:"name"`
	Category      string  `json:"category"`
	Location      string  `json:"location"`
	PricePerNight float64 `json:"price_per_night"`
	EcoScore      float64 `json:"eco_score"`
}

type ItineraryRequest struct {
	Destination             string
	OriginCountry           string // 'singapore' | 'malaysia' (kosong jika dari dalam Batam / lokal)
	OriginPort              string // 'HarbourFront', 'Stulang Laut', dll (kosong jika lokal)
	DurationDays            int
	Pax                     int
	Budget                  float64
	Interests               []string // 'nature', 'culture', 'culinary', 'shopping', 'adventure', 'relaxation'
	AccommodationPreference string   // 'hotel' | 'resort' | 'homestay' | 'glamping'
	Notes                   string   // Catatan khusus (misal: alergi, preferensi khusus)
	StartDate               string   // YYYY-MM-DD
	AvailableDestinations   []AvailableDestination
	AvailableAccommodations []AvailableAccommodation
}

type GeneratedActivity struct {
	StartTime       string   `json:"start_time"`
	Title           string   `json:"title"`
	Description     string   `json:"description"`
	Category        string   `json:"category"` // nature|culture|culinary|shopping|adventure|relaxation|ferry|accommodation
	Tags            []string `json:"tags"`
	DistanceKm      float64  `json:"distance_km"`
	DurationMinutes int      `json:"duration_minutes"`
	EstimatedCost   float64  `json:"estimated_cost"`
	CarbonKg        float64  `json:"carbon_kg"`
}

type GeneratedDay struct {
	DayNumber  int                 `json:"day_number"`
	Label      string              `json:"label"`
	Activities []GeneratedActivity `json:"activities"`
}

type GeneratedItinerary struct {
	Days                []GeneratedDay `json:"days"`
	TotalEstimatedCost  float64        `json:"total_estimated_cost"`
	TotalCarbonKg       float64        `json:"total_carbon_kg"`
	CarbonTransportPct  float64        `json:"carbon_transport_pct"`
	CarbonAccomPct      float64        `json:"carbon_accom_pct"`
	CarbonActivityPct   float64        `json:"carbon_activity_pct"`
	SustainabilityScore int            `json:"sustainability_score"`
}

type ChatRevisionResult struct {
	IsRevision    bool           `json:"is_revision"`
	AIResponse    string         `json:"ai_response"`
	ChangeSummary string         `json:"change_summary"`
	UpdatedDays   []GeneratedDay `json:"updated_days"`
}

func buildItineraryPrompt(req ItineraryRequest) string {
	interestsStr := "nature, culinary"
	if len(req.Interests) > 0 {
		interestsStr = strings.Join(req.Interests, ", ")
	}

	var departureInstruction string
	var ferryRule string

	if req.OriginCountry != "" && req.OriginPort != "" {
		departureInstruction = fmt.Sprintf("Wisatawan berangkat dari luar Batam: Pelabuhan %s (%s).", req.OriginPort, req.OriginCountry)
		ferryRule = fmt.Sprintf("Hari 1 HARUS dimulai dengan aktivitas penyeberangan feri (%s ke Batam Center/Harbour Bay, category: 'ferry'). Hari terakhir HARUS diakhiri dengan feri kepulangan ke %s (category: 'ferry').", req.OriginPort, req.OriginPort)
	} else {
		departureInstruction = "Wisatawan adalah warga lokal / sudah berada di dalam Pulau Batam."
		ferryRule = "DILARANG MEMASUKKAN AKTIVITAS FERI / KAPAL PENYEBERANGAN. Hari 1 LANGSUNG dimulai dengan aktivitas pagi di Batam (misal sarapan kuliner lokal atau kunjungan wisata). Category 'ferry' TIDAK BOLEH DIGUNAKAN."
	}

	accommPref := req.AccommodationPreference
	if accommPref == "" {
		accommPref = "hotel / resort ramah lingkungan"
	}

	notesStr := "Tidak ada catatan khusus."
	if req.Notes != "" {
		notesStr = req.Notes
	}

	// Format daftar tempat nyata dari database admin usaha
	destinationsList := "Belum ada destinasi khusus terdaftar, rekomendasikan destinasi wisata/kuliner nyata di Batam."
	if len(req.AvailableDestinations) > 0 {
		var b strings.Builder
		b.WriteString("DAFTAR DESTINASI & KULINER BATAM TERVERIFIKASI DARI MITRA USAHA (WAJIB PILIH DARI DAFTAR INI):\n")
		for _, d := range req.AvailableDestinations {
			b.WriteString(fmt.Sprintf("- [%s | Eco Score %.1f | Tiket: Rp %.0f | Lokasi: %s] %s\n", d.Category, d.EcoScore, d.TicketPrice, d.Location, d.Name))
		}
		destinationsList = b.String()
	}

	accommodationsList := "Rekomendasikan hotel/resort/homestay ramah lingkungan di Batam."
	if len(req.AvailableAccommodations) > 0 {
		var b strings.Builder
		b.WriteString("DAFTAR PENGINAPAN BATAM TERVERIFIKASI DARI MITRA USAHA (WAJIB PILIH DARI DAFTAR INI):\n")
		for _, a := range req.AvailableAccommodations {
			b.WriteString(fmt.Sprintf("- [%s | Eco Score %.1f | Tarif: Rp %.0f/malam | Lokasi: %s] %s\n", a.Category, a.EcoScore, a.PricePerNight, a.Location, a.Name))
		}
		accommodationsList = b.String()
	}

	return fmt.Sprintf(`Kamu adalah AI perencana perjalanan wisata ramah lingkungan (eco-friendly) KHUSUS pulau Batam, Indonesia.

Rancang rencana perjalanan cerdas dan efisien dengan ketentuan berikut:
- Destinasi: Pulau Batam
- Asal Wisatawan: %s
- Durasi: %d hari
- Jumlah orang: %d pax
- Budget Maksimal Wisatawan: Rp %.0f (TOTAL KESELURUHAN)
- Minat Wisatawan: %s
- Preferensi Penginapan: %s
- Catatan Khusus Wisatawan (Alergi / Permintaan): %s
- Tanggal mulai: %s

%s

%s

ATURAN WAJIB & PEMBATASAN BIAYA (STRICT BUDGET):
1. ATURAN KEBERANGKATAN: %s
2. TOTAL ESTIMASI BIAYA KESELURUHAN (total_estimated_cost) HARUS REALISTIS DAN TIDAK BOLEH MELEBIHI BUDGET WISATAWAN SEBESAR Rp %.0f. Pilihkan kombinasi penginapan, tiket masuk, makan, dan aktivitas yang total biayanya pas di dalam batas budget tersebut.
3. UTAMAKAN MEMILIH TEMPAT DAN PENGINAPAN DARI DAFTAR MITRA USAHA DI ATAS. Gunakan nama tempat yang persis sama dengan yang ada di daftar.
4. Seluruh aktivitas, tempat makan, dan penginapan HANYA berada di Pulau Batam.
5. Pertimbangkan catatan khusus wisatawan (misal: jika ada alergi seafood, jangan jadwalkan ke restoran seafood).
6. Gunakan penginapan yang sesuai dengan preferensi (%s) dan harganya terjangkau dalam budget.
7. Format start_time: "HH:MM". Kategori aktivitas valid: "nature", "culture", "culinary", "shopping", "adventure", "relaxation", "accommodation", "ferry".
8. Sustainability score 0-100 (berikan skor tinggi bila mengutamakan tempat ber-Eco Score tinggi dari daftar).

Kembalikan HANYA JSON valid dengan struktur PERSIS seperti ini:
{
  "days": [
    {
      "day_number": 1,
      "label": "Hari 1 - Eksplorasi Batam",
      "activities": [
        {
          "start_time": "08:00",
          "title": "Nama Tempat Wisata / Kuliner",
          "description": "Deskripsi singkat aktivitas",
          "category": "culinary",
          "tags": ["umkm_lokal"],
          "distance_km": 5,
          "duration_minutes": 60,
          "estimated_cost": 35000,
          "carbon_kg": 0.5
        }
      ]
    }
  ],
  "total_estimated_cost": 1800000,
  "total_carbon_kg": 10.5,
  "carbon_transport_pct": 20,
  "carbon_accom_pct": 50,
  "carbon_activity_pct": 30,
  "sustainability_score": 92
}`,
		departureInstruction,
		req.DurationDays,
		req.Pax,
		req.Budget,
		interestsStr,
		accommPref,
		notesStr,
		req.StartDate,
		destinationsList,
		accommodationsList,
		ferryRule,
		req.Budget,
		accommPref,
	)
}

func buildChatPrompt(userMessage, currentItineraryJSON, tripContext string) string {
	return fmt.Sprintf(`Kamu adalah asisten AI ramah lingkungan untuk trip Batam.

Konteks trip (termasuk budget & pax):
%s

Itinerary saat ini (JSON):
%s

Pesan wisatawan: "%s"

TUGASMU:
1. Tentukan apakah pesan wisatawan adalah REVISI itinerary Batam atau PERTANYAAN UMUM.
2. Jika REVISI:
   - Pastikan tempat pengganti biayanya hemat dan TIDAK menyebabkan total biaya melebihi budget wisatawan yang ada di konteks trip.
   - Buat ulang HANYA hari yang berubah dengan format JSON yang sesuai (kategori: nature, culture, culinary, shopping, adventure, relaxation, accommodation, ferry).
   - Buat ringkasan singkat perubahan (maks 60 karakter).
   - Tulis pesan balasan ramah dalam bahasa Indonesia menjelaskan penyesuaian biaya/tempatnya.
3. Jika PERTANYAAN UMUM (soal cuaca, lokasi ATM di Batam, kuliner halal/hemat, feri, dll):
   - Jawab pertanyaan secara informatif, ramah, dan ringkas.
   - JANGAN ubah itinerary (is_revision = false).

Kembalikan HANYA JSON valid:
{
  "is_revision": true,
  "ai_response": "Pesan balasan AI dalam bahasa Indonesia",
  "change_summary": "Makan siang hari 2 diganti Mie Sagu",
  "updated_days": []
}`,
		tripContext,
		currentItineraryJSON,
		userMessage,
	)
}
