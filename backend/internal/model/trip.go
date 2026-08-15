package model

import (
	"time"

	"gorm.io/gorm"
)

type Trip struct {
	ID             uint           `json:"id" gorm:"primaryKey"`
	UserID         uint           `json:"user_id" gorm:"not null;index"`
	Title          string         `json:"title" gorm:"not null"`
	Description    string         `json:"description"`
	Destination    string         `json:"destination" gorm:"not null"`
	StartDate      string         `json:"start_date" gorm:"not null"`
	EndDate        string         `json:"end_date" gorm:"not null"`
	CarbonFootprint float64       `json:"carbon_footprint" gorm:"default:0"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `json:"-" gorm:"index"`
}
