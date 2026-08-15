package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID             uint64         `json:"id"              gorm:"primaryKey"`
	Name           string         `json:"name"            gorm:"not null"`
	Email          string         `json:"email"           gorm:"uniqueIndex;not null"`
	PasswordHash   string         `json:"-"               gorm:"column:password_hash;not null"`
	Role           string         `json:"role"            gorm:"not null;default:tourist;check:role IN ('tourist', 'business_destination', 'business_accommodation', 'superadmin')"`
	ApprovalStatus string         `json:"approval_status" gorm:"not null;default:approved;check:approval_status IN ('pending', 'approved', 'rejected')"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `json:"-"               gorm:"index"`

	// Relations
	Trips         []Trip          `json:"trips,omitempty"         gorm:"foreignKey:UserID"`
	Preference    *UserPreference `json:"preference,omitempty"    gorm:"foreignKey:UserID"`
	Notifications []Notification  `json:"notifications,omitempty" gorm:"foreignKey:UserID"`
	Favorites     []UserFavorite  `json:"favorites,omitempty"     gorm:"foreignKey:UserID"`
	Ratings       []Rating        `json:"ratings,omitempty"       gorm:"foreignKey:UserID"`
}
