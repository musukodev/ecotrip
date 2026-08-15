package service

import (
	"fmt"
	"log"

	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
	"github.com/robfig/cron/v3"
)

// RatingCronService — F-025: background scheduler untuk kirim notifikasi minta rating
type RatingCronService struct {
	cron       *cron.Cron
	notifRepo  repository.NotificationRepository
	ratingRepo repository.RatingRepository
}

func NewRatingCronService(
	notifRepo repository.NotificationRepository,
	ratingRepo repository.RatingRepository,
) *RatingCronService {
	return &RatingCronService{
		cron:       cron.New(cron.WithSeconds()),
		notifRepo:  notifRepo,
		ratingRepo: ratingRepo,
	}
}

// Start — jalankan cron job setiap 5 menit untuk mengecek aktivitas/trip selesai
func (s *RatingCronService) Start() {
	_, err := s.cron.AddFunc("0 */5 * * * *", s.checkAndSendRatingRequests)
	if err != nil {
		log.Printf("Gagal mendaftarkan cron rating: %v", err)
		return
	}
	s.cron.Start()
	log.Println("Rating notification cron started (runs every 5m)")
}

func (s *RatingCronService) Stop() {
	s.cron.Stop()
}

func (s *RatingCronService) checkAndSendRatingRequests() {
	// Query aktivitas destinasi pada trip aktif
	type activityCheck struct {
		TripID        uint64
		UserID        uint64
		DestinationID *uint64
		DestName      string
	}

	var actResults []activityCheck
	_ = config.DB.
		Table("itinerary_activities ia").
		Select("t.id as trip_id, t.user_id, ia.destination_id, d.name as dest_name").
		Joins("JOIN itinerary_days id ON id.id = ia.day_id").
		Joins("JOIN trips t ON t.id = id.trip_id").
		Joins("JOIN destinations d ON d.id = ia.destination_id").
		Where("t.status = 'active' AND ia.destination_id IS NOT NULL").
		Scan(&actResults).Error

	for _, act := range actResults {
		if act.DestinationID == nil {
			continue
		}
		// Cek apakah user sudah memberikan rating
		if !s.ratingRepo.HasRated(act.UserID, "destination", *act.DestinationID, &act.TripID) {
			refType := "destination"
			refID := *act.DestinationID
			_ = s.notifRepo.Create(&model.Notification{
				UserID:  act.UserID,
				Type:    "rating_request",
				Title:   "Bagikan Pengalaman Eco Kamu!",
				Message: fmt.Sprintf("Bagaimana pengalaman kunjunganmu di %s? Berikan rating untuk mendukung Eco Score!", act.DestName),
				RefType: &refType,
				RefID:   &refID,
			})
		}
	}
}
