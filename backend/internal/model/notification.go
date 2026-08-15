package model

import "time"

// Notification — notifikasi in-app untuk Turis.
// Tipe sesuai prototype: badge, itinerary, cuaca, kolaborator, sharing.
type Notification struct {
	ID      uint64 `json:"id"      gorm:"primaryKey"`
	UserID  uint64 `json:"user_id" gorm:"not null;index"`
	// tipe notifikasi:
	// 'badge_approved' | 'badge_rejected'          — F-030, F-031
	// 'itinerary_updated'                          — F-014
	// 'weather_alert'                              — F-033
	// 'collaborator_joined' | 'collaborator_removed' | 'trip_shared' — F-037
	// 'system'
	Type    string `json:"type"    gorm:"not null"`
	Title   string `json:"title"   gorm:"type:varchar(255);not null"`
	Message string `json:"message" gorm:"type:text;not null"`
	// ref untuk deep-link ke entitas terkait
	// RefType: 'trip' | 'badge_submission' | 'eco_place' | 'chat'
	RefType *string `json:"ref_type"`
	RefID   *uint64 `json:"ref_id"`
	// FALSE = belum dibaca (badge dot merah di ikon notifikasi)
	IsRead    bool      `json:"is_read"    gorm:"not null;default:false"`
	CreatedAt time.Time `json:"created_at"`

	// Relations
	User User `json:"-" gorm:"foreignKey:UserID"`
}
