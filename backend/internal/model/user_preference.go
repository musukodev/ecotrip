package model

import (
	"time"

	"github.com/lib/pq"
)

// UserPreference — preferensi bahasa & minat wisata per user. F-006.
type UserPreference struct {
	ID        uint64         `json:"id"         gorm:"primaryKey"`
	UserID    uint64         `json:"user_id"    gorm:"not null;uniqueIndex"`
	// 'id' | 'en' | 'zh'
	Language  string         `json:"language"   gorm:"not null;default:id"`
	// valid values: 'nature', 'culture', 'culinary', 'shopping', 'adventure', 'relaxation'
	Interests pq.StringArray `json:"interests"  gorm:"type:text[];not null;default:'{}'"`
	UpdatedAt time.Time      `json:"updated_at"`

	// Relations
	User User `json:"-" gorm:"foreignKey:UserID"`
}
