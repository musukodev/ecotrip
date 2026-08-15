package model

import "time"

// PasswordReset — token reset kata sandi one-time. F-003.
type PasswordReset struct {
	ID        uint64     `json:"id"         gorm:"primaryKey"`
	UserID    uint64     `json:"user_id"    gorm:"not null;index"`
	Token     string     `json:"token"      gorm:"not null;uniqueIndex"`
	ExpiresAt time.Time  `json:"expires_at" gorm:"not null"`
	UsedAt    *time.Time `json:"used_at"`
	CreatedAt time.Time  `json:"created_at"`

	// Relations
	User User `json:"-" gorm:"foreignKey:UserID"`
}
