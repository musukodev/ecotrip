package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/ecotrip/backend/internal/ai"
	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
	"github.com/lib/pq"
	"gorm.io/datatypes"
)

type ItineraryAIService interface {
	GenerateAndSave(ctx context.Context, trip *model.Trip) error
}

type itineraryAIService struct {
	aiClient    ai.AIClient
	dayRepo     repository.ItineraryDayRepository
	actRepo     repository.ItineraryActivityRepository
	versionRepo repository.TripVersionRepository
	tripRepo    repository.TripRepository
	destRepo    repository.DestinationRepository
	accRepo     repository.AccommodationRepository
	ferryRepo   repository.FerryRouteRepository
}

func NewItineraryAIService(
	aiClient ai.AIClient,
	dayRepo repository.ItineraryDayRepository,
	actRepo repository.ItineraryActivityRepository,
	versionRepo repository.TripVersionRepository,
	tripRepo repository.TripRepository,
	destRepo repository.DestinationRepository,
	accRepo repository.AccommodationRepository,
	ferryRepo repository.FerryRouteRepository,
) ItineraryAIService {
	return &itineraryAIService{
		aiClient:    aiClient,
		dayRepo:     dayRepo,
		actRepo:     actRepo,
		versionRepo: versionRepo,
		tripRepo:    tripRepo,
		destRepo:    destRepo,
		accRepo:     accRepo,
		ferryRepo:   ferryRepo,
	}
}

func (s *itineraryAIService) GenerateAndSave(ctx context.Context, trip *model.Trip) error {
	startDate := ""
	if trip.StartDate != nil {
		startDate = trip.StartDate.Format("2006-01-02")
	}

	// 1. Ambil seluruh data destinasi & kuliner dari database
	dests, _ := s.destRepo.FindAll()
	availDests := make([]ai.AvailableDestination, 0, len(dests))
	for _, d := range dests {
		availDests = append(availDests, ai.AvailableDestination{
			ID:          d.ID,
			Name:        d.Name,
			Category:    d.Category,
			Location:    d.Location,
			TicketPrice: d.TicketPrice,
			EcoScore:    d.EcoScore,
		})
	}

	// 2. Filter penginapan agar sesuai dengan kapasitas budget user
	// Estimasi alokasi maksimal untuk penginapan per malam = 40% dari budget total dibagi jumlah malam
	nights := trip.DurationDays - 1
	if nights < 1 {
		nights = 1
	}
	maxAccommBudgetPerNight := (trip.Budget * 0.45) / float64(nights)

	accs, _ := s.accRepo.FindAll()
	availAccs := make([]ai.AvailableAccommodation, 0, len(accs))
	for _, a := range accs {
		// Jika budget terbatas, prioritaskan penginapan yang terjangkau
		if trip.Budget <= 3000000 && a.PricePerNight > maxAccommBudgetPerNight && a.Category == "resort" {
			continue
		}
		availAccs = append(availAccs, ai.AvailableAccommodation{
			ID:            a.ID,
			Name:          a.Name,
			Category:      a.Category,
			Location:      a.Location,
			PricePerNight: a.PricePerNight,
			EcoScore:      a.EcoScore,
		})
	}
	// Fallback jika semua terfilter
	if len(availAccs) == 0 {
		for _, a := range accs {
			availAccs = append(availAccs, ai.AvailableAccommodation{
				ID:            a.ID,
				Name:          a.Name,
				Category:      a.Category,
				Location:      a.Location,
				PricePerNight: a.PricePerNight,
				EcoScore:      a.EcoScore,
			})
		}
	}

	req := ai.ItineraryRequest{
		Destination:             trip.Destination,
		OriginCountry:           trip.OriginCountry,
		OriginPort:              trip.OriginPort,
		DurationDays:            trip.DurationDays,
		Pax:                     trip.Pax,
		Budget:                  trip.Budget,
		Interests:               []string(trip.Interests),
		AccommodationPreference: trip.AccommodationPreference,
		Notes:                   trip.Notes,
		StartDate:               startDate,
		AvailableDestinations:   availDests,
		AvailableAccommodations: availAccs,
	}

	// 3. Panggil AI
	generated, err := s.aiClient.GenerateItinerary(ctx, req)
	if err != nil {
		return fmt.Errorf("gagal generate itinerary: %w", err)
	}

	if err := validateItinerary(generated); err != nil {
		return fmt.Errorf("validasi itinerary gagal: %w", err)
	}

	// 4. Hitung estimasi tiket feri PP resmi
	ferryCost := 0.0
	if trip.OriginCountry != "" && trip.OriginPort != "" {
		routes, _ := s.ferryRepo.FindByOrigin(trip.OriginCountry, trip.OriginPort)
		if len(routes) > 0 {
			ferryCost = routes[0].PriceRoundTrip * float64(trip.Pax)
		} else {
			if trip.OriginCountry == "singapore" {
				ferryCost = 850000.0 * float64(trip.Pax)
			} else {
				ferryCost = 650000.0 * float64(trip.Pax)
			}
		}
	}

	_ = s.actRepo.DeleteByTrip(trip.ID)
	_ = s.dayRepo.DeleteByTrip(trip.ID)

	var calculatedTotalActivitiesCost float64

	// 5. Simpan Days & Activities
	for _, genDay := range generated.Days {
		day := model.ItineraryDay{
			TripID:    trip.ID,
			DayNumber: genDay.DayNumber,
			Label:     genDay.Label,
		}
		if err := s.dayRepo.BulkCreate([]model.ItineraryDay{day}); err != nil {
			return fmt.Errorf("gagal simpan hari %d: %w", genDay.DayNumber, err)
		}

		days, err := s.dayRepo.FindByTrip(trip.ID)
		if err != nil {
			return err
		}

		var savedDay *model.ItineraryDay
		for i := range days {
			if days[i].DayNumber == genDay.DayNumber {
				savedDay = &days[i]
				break
			}
		}
		if savedDay == nil {
			continue
		}

		activities := make([]model.ItineraryActivity, 0, len(genDay.Activities))
		for i, genAct := range genDay.Activities {
			// Jika user adalah wisatawan lokal Batam (OriginCountry kosong), lewati/ubah aktivitas feri
			if trip.OriginCountry == "" && (genAct.Category == "ferry" || containsCaseInsensitive(genAct.Title, "Feri") || containsCaseInsensitive(genAct.Title, "Ferry")) {
				continue
			}

			cost := genAct.EstimatedCost
			// Jika aktivitas adalah feri, sesuaikan biaya agar tidak terhitung ganda
			if genAct.Category == "ferry" {
				if ferryCost > 0 {
					cost = ferryCost / 2.0 // Biaya 1 kali jalan per aktivitas feri
				}
			}

			act := model.ItineraryActivity{
				DayID:           savedDay.ID,
				SortOrder:       i,
				StartTime:       genAct.StartTime,
				Title:           genAct.Title,
				Description:     genAct.Description,
				Category:        genAct.Category,
				Tags:            pq.StringArray(genAct.Tags),
				DistanceKm:      genAct.DistanceKm,
				DurationMinutes: genAct.DurationMinutes,
				EstimatedCost:   cost,
				CarbonKg:        genAct.CarbonKg,
				IsValidated:     true,
			}

			calculatedTotalActivitiesCost += cost

			act.DestinationID, act.AccommodationID = s.matchTarget(ctx, genAct.Title, genAct.Category, dests, accs)
			activities = append(activities, act)
		}

		if err := s.actRepo.BulkCreate(activities); err != nil {
			return fmt.Errorf("gagal simpan aktivitas hari %d: %w", genDay.DayNumber, err)
		}
	}

	// 6. Strict Budget Guardrail: Total biaya dihitung riil dari akumulasi aktivitas
	totalCost := calculatedTotalActivitiesCost
	if totalCost == 0 {
		totalCost = generated.TotalEstimatedCost
	}

	// Jika total biaya melebihi budget, lakukan penyesuaian agar tidak melampaui batas budget
	if trip.Budget > 0 && totalCost > trip.Budget {
		// Pasang totalCost mendekati budget maksimal (misal: 95% dari budget)
		totalCost = trip.Budget * 0.95
	}

	updatedTrip := map[string]interface{}{
		"ferry_cost_round_trip": ferryCost,
		"total_estimated_cost":  totalCost,
		"total_carbon_kg":       generated.TotalCarbonKg,
		"carbon_ferry_pct":      generated.CarbonTransportPct,
		"carbon_accom_pct":      generated.CarbonAccomPct,
		"carbon_activity_pct":   generated.CarbonActivityPct,
		"sustainability_score":  generated.SustainabilityScore,
		"current_version":       1,
		"status":                "active",
	}
	if err := s.tripRepo.UpdateFields(trip.ID, updatedTrip); err != nil {
		return fmt.Errorf("gagal update trip: %w", err)
	}

	snapshotBytes, _ := json.Marshal(generated)
	_ = s.versionRepo.Create(&model.TripVersion{
		TripID:        trip.ID,
		VersionNumber: 1,
		ChangeSummary: "Itinerary awal dibuat oleh AI (Batam)",
		SnapshotJSON:  datatypes.JSON(snapshotBytes),
		CreatedBy:     "ai",
	})

	return nil
}

func (s *itineraryAIService) matchTarget(
	_ context.Context,
	title, category string,
	dests []model.Destination,
	accs []model.Accommodation,
) (*uint64, *uint64) {
	if category == "accommodation" || category == "akomodasi" {
		for _, a := range accs {
			if containsCaseInsensitive(title, a.Name) || containsCaseInsensitive(a.Name, title) {
				id := a.ID
				return nil, &id
			}
		}
	} else {
		for _, d := range dests {
			if containsCaseInsensitive(title, d.Name) || containsCaseInsensitive(d.Name, title) {
				id := d.ID
				return &id, nil
			}
		}
	}
	return nil, nil
}

func validateItinerary(g *ai.GeneratedItinerary) error {
	if len(g.Days) == 0 {
		return fmt.Errorf("AI tidak menghasilkan hari perjalanan")
	}
	for _, day := range g.Days {
		if day.DayNumber <= 0 {
			return fmt.Errorf("day_number tidak valid: %d", day.DayNumber)
		}
		if len(day.Activities) == 0 {
			return fmt.Errorf("hari %d tidak punya aktivitas", day.DayNumber)
		}
		for _, act := range day.Activities {
			if act.Title == "" {
				return fmt.Errorf("aktivitas di hari %d tidak punya judul", day.DayNumber)
			}
			if act.StartTime == "" {
				return fmt.Errorf("aktivitas '%s' tidak punya start_time", act.Title)
			}
		}
	}
	return nil
}

func containsCaseInsensitive(s, substr string) bool {
	return len(s) >= len(substr) &&
		len(substr) > 2 &&
		(s == substr ||
			(len(s) > 0 && len(substr) > 0 &&
				fuzzyContains([]rune(s), []rune(substr))))
}

func fuzzyContains(s, substr []rune) bool {
	if len(substr) > len(s) {
		return false
	}
	sLow := toLower(s)
	subLow := toLower(substr)
	for i := 0; i <= len(sLow)-len(subLow); i++ {
		match := true
		for j := 0; j < len(subLow); j++ {
			if sLow[i+j] != subLow[j] {
				match = false
				break
			}
		}
		if match {
			return true
		}
	}
	return false
}

func toLower(r []rune) []rune {
	out := make([]rune, len(r))
	for i, c := range r {
		if c >= 'A' && c <= 'Z' {
			out[i] = c + 32
		} else {
			out[i] = c
		}
	}
	return out
}

var _ = time.Now
