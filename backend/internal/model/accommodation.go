package model

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

// Accommodation — MF-015: Direktori Akomodasi Ramah Lingkungan di Batam (Hotel, Resort, Homestay)
type Accommodation struct {
	ID                  uint64         `json:"id"                   gorm:"primaryKey"`
	CreatedBy           *uint64        `json:"created_by"           gorm:"index"`
	Name                string         `json:"name"                 gorm:"not null"`
	Category            string         `json:"category"             gorm:"not null;check:category IN ('hotel', 'resort', 'homestay')"`
	Description         string         `json:"description"          gorm:"type:text"`
	Location            string         `json:"location"             gorm:"type:varchar(255);not null"`
	Latitude            *float64       `json:"latitude"             gorm:"type:numeric(10,7)"`
	Longitude           *float64       `json:"longitude"            gorm:"type:numeric(10,7)"`
	PricePerNight       float64        `json:"price_per_night"      gorm:"type:numeric(15,2);not null;default:0"`
	Facilities          pq.StringArray `json:"facilities"           gorm:"type:text[];default:'{}'"`
	Photos              pq.StringArray `json:"photos"               gorm:"type:text[];default:'{}'"`
	Phone               string         `json:"phone"                gorm:"type:varchar(50)"`
	EnvironmentalImpact string         `json:"environmental_impact" gorm:"type:text"` // e.g. "Panel surya, zero single-use plastic"
	EcoScore            float64        `json:"eco_score"            gorm:"type:numeric(5,2);default:0"` // Skala 0-100 otomatis
	CreatedAt           time.Time      `json:"created_at"`
	UpdatedAt           time.Time      `json:"updated_at"`
	DeletedAt           gorm.DeletedAt `json:"-"                    gorm:"index"`

	// Relations
	Ratings    []Rating            `json:"ratings,omitempty"    gorm:"foreignKey:AccommodationID"`
	Activities []ItineraryActivity `json:"activities,omitempty" gorm:"foreignKey:AccommodationID"`
	Favorites  []UserFavorite      `json:"favorites,omitempty"  gorm:"foreignKey:AccommodationID"`
	Creator    *User               `json:"creator,omitempty"    gorm:"foreignKey:CreatedBy"`
}

func (Accommodation) TableName() string { return "accommodations" }
