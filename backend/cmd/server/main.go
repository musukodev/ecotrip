package main

import (
	"log"
	"os"

	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/handler"
	"github.com/ecotrip/backend/internal/middleware"
	"github.com/ecotrip/backend/internal/repository"
	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env (ignore error in production)
	_ = godotenv.Load()

	// Connect DB
	config.ConnectDB()

	// Init dependencies
	userRepo := repository.NewUserRepository()
	tripRepo := repository.NewTripRepository()

	authSvc := service.NewAuthService(userRepo)
	tripSvc := service.NewTripService(tripRepo)

	authH := handler.NewAuthHandler(authSvc)
	tripH := handler.NewTripHandler(tripSvc)

	// Gin router
	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: false,
	}))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Auth routes (public)
	auth := r.Group("/auth")
	{
		auth.POST("/register", authH.Register)
		auth.POST("/login", authH.Login)
	}

	// Protected routes
	api := r.Group("/")
	api.Use(middleware.AuthMiddleware())
	{
		trips := api.Group("/trips")
		{
			trips.GET("", tripH.GetTrips)
			trips.GET("/:id", tripH.GetTrip)
			trips.POST("", tripH.CreateTrip)
			trips.DELETE("/:id", tripH.DeleteTrip)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
