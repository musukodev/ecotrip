package model

import (
	"time"

	"gorm.io/datatypes"
)

// TripVersion — snapshot itinerary per versi untuk rollback. F-015.
type TripVersion struct {
	ID            uint64         `json:"id"             gorm:"primaryKey"`
	TripID        uint64         `json:"trip_id"        gorm:"not null;index"`
	VersionNumber int            `json:"version_number" gorm:"not null"`
	// ringkasan perubahan, contoh: "Makan siang diganti (hari 2)"
	ChangeSummary string         `json:"change_summary" gorm:"type:varchar(255)"`
	// snapshot JSONB lengkap itinerary untuk rollback
	SnapshotJSON  datatypes.JSON `json:"snapshot_json"  gorm:"type:jsonb;not null"`
	// 'ai' | 'user' | 'collaborator'
	CreatedBy     string         `json:"created_by"     gorm:"not null;default:ai"`
	CreatedAt     time.Time      `json:"created_at"`

	// Relations
	Trip Trip `json:"-" gorm:"foreignKey:TripID"`
}

func (TripVersion) TableName() string { return "trip_versions" }
