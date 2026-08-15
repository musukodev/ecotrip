package config

import (
	"fmt"
	"log"
	"os"

	"github.com/ecotrip/backend/internal/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "postgres"),
		getEnv("DB_NAME", "ecotrip"),
		getEnv("DB_PORT", "5432"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connected")

	// AutoMigrate model-model baru sesuai arsitektur revisi
	if err := DB.AutoMigrate(
		&model.User{},
		&model.PasswordReset{},
		&model.UserPreference{},
		&model.Destination{},
		&model.Accommodation{},
		&model.FerryRoute{},
		&model.UserFavorite{},
		&model.Trip{},
		&model.TripVersion{},
		&model.ItineraryDay{},
		&model.ItineraryActivity{},
		&model.ChatMessage{},
		&model.CarbonOffset{},
		&model.TripCollaborator{},
		&model.Notification{},
		&model.Rating{},
	); err != nil {
		log.Fatalf("Auto migrate failed: %v", err)
	}

	log.Println("Auto migrate done — models ready")
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
