package model

import "time"

// Rating — MF-007: Rating dan Eco Score otomatis (3 aspek × skala 1-5)
type Rating struct {
	ID                     uint64    `json:"id"                      gorm:"primaryKey"`
	UserID                 uint64    `json:"user_id"                 gorm:"not null;index"`
	TargetType             string    `json:"target_type"             gorm:"not null;check:target_type IN ('destination', 'accommodation')"`
	DestinationID          *uint64   `json:"destination_id"          gorm:"index"`
	AccommodationID        *uint64   `json:"accommodation_id"        gorm:"index"`
	TripID                 *uint64   `json:"trip_id"                 gorm:"index"`

	// 3 Aspek skala 1 s.d. 5:
	// Bobot: Kebersihan 35%, Kondisi Lingkungan 40%, Kepedulian Lingkungan 25%
	Cleanliness            int       `json:"cleanliness"             gorm:"not null;check:cleanliness >= 1 AND cleanliness <= 5"`
	EnvironmentalCondition int       `json:"environmental_condition" gorm:"not null;check:environmental_condition >= 1 AND environmental_condition <= 5"`
	EnvironmentalCare      int       `json:"environmental_care"      gorm:"not null;check:environmental_care >= 1 AND environmental_care <= 5"`

	// Nilai terhitung dari 3 aspek (skala 20-100)
	CalculatedScore        float64   `json:"calculated_score"        gorm:"type:numeric(5,2);not null"`
	ReviewComment          string    `json:"review_comment"          gorm:"type:text"`
	CreatedAt              time.Time `json:"created_at"`

	// Relations
	User          User           `json:"user,omitempty"          gorm:"foreignKey:UserID"`
	Destination   *Destination   `json:"destination,omitempty"   gorm:"foreignKey:DestinationID"`
	Accommodation *Accommodation `json:"accommodation,omitempty" gorm:"foreignKey:AccommodationID"`
}

func (Rating) TableName() string { return "ratings" }
