package main

import (
	"log"
	"os"

	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/ai"
	"github.com/ecotrip/backend/internal/email"
	"github.com/ecotrip/backend/internal/handler"
	"github.com/ecotrip/backend/internal/middleware"
	"github.com/ecotrip/backend/internal/repository"
	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	config.ConnectDB()

	// =========================================================================
	// AI Client (OpenAI v1 Chat Completions atau Gemini)
	// =========================================================================
	var aiClient ai.AIClient
	var aiProvider string

	// 1. Cek apakah OpenAI API Key tersedia
	openAIClient, err := ai.NewOpenAIClient()
	if err == nil {
		aiClient = openAIClient
		aiProvider = "openai"
		log.Printf("AI Client aktif menggunakan OpenAI v1 Chat Completions")
	} else {
		// 2. Fallback cek Gemini API Key
		geminiClient, gErr := ai.NewGeminiClient()
		if gErr == nil {
			aiClient = geminiClient
			aiProvider = "gemini"
			log.Printf("AI Client aktif menggunakan Google Gemini")
		} else {
			log.Printf("WARNING: AI client tidak aktif. Set OPENAI_API_KEY atau GEMINI_API_KEY di .env")
		}
	}

	// Email Mailer Service
	mailerSvc := email.NewMailerService()

	// =========================================================================
	// Repositories
	// =========================================================================
	userRepo          := repository.NewUserRepository()
	passwordResetRepo := repository.NewPasswordResetRepository()
	prefRepo          := repository.NewUserPreferenceRepository()
	destRepo          := repository.NewDestinationRepository()
	accRepo           := repository.NewAccommodationRepository()
	ratingRepo        := repository.NewRatingRepository()
	ferryRepo         := repository.NewFerryRouteRepository()
	favRepo           := repository.NewUserFavoriteRepository()
	tripRepo          := repository.NewTripRepository()
	dayRepo           := repository.NewItineraryDayRepository()
	actRepo           := repository.NewItineraryActivityRepository()
	versionRepo       := repository.NewTripVersionRepository()
	chatMsgRepo       := repository.NewChatMessageRepository()
	carbonOffsetRepo  := repository.NewCarbonOffsetRepository()
	collabRepo        := repository.NewTripCollaboratorRepository()
	notifRepo         := repository.NewNotificationRepository()

	// =========================================================================
	// Services
	// =========================================================================
	authSvc         := service.NewAuthService(userRepo, passwordResetRepo, mailerSvc)
	userSvc         := service.NewUserService(userRepo)
	prefSvc         := service.NewPreferenceService(prefRepo)
	destSvc         := service.NewDestinationService(destRepo)
	accSvc          := service.NewAccommodationService(accRepo, favRepo)
	ratingSvc       := service.NewRatingService(ratingRepo, destRepo, accRepo)
	ferrySvc        := service.NewFerryService(ferryRepo)
	weatherSvc      := service.NewWeatherService()
	carbonSvc       := service.NewCarbonService(tripRepo)
	carbonOffsetSvc := service.NewCarbonOffsetService(carbonOffsetRepo, tripRepo)
	collabSvc       := service.NewCollaboratorService(collabRepo, tripRepo, userRepo, notifRepo)
	notifSvc        := service.NewNotificationService(notifRepo)
	versionSvc      := service.NewVersionService(versionRepo, tripRepo, dayRepo, actRepo)
	tripSvc         := service.NewTripService(tripRepo, dayRepo)
	superadminSvc   := service.NewSuperadminService(userRepo, destRepo, accRepo)

	var itineraryAISvc service.ItineraryAIService
	var chatSvc service.ChatService

	if aiClient != nil {
		itineraryAISvc = service.NewItineraryAIService(aiClient, dayRepo, actRepo, versionRepo, tripRepo, destRepo, accRepo, ferryRepo)
		chatSvc = service.NewChatService(aiClient, chatMsgRepo, tripRepo, dayRepo, actRepo, versionRepo, notifRepo)
	}

	// Jalankan cron rating request (MF-007: F-025)
	ratingCron := service.NewRatingCronService(notifRepo, ratingRepo)
	ratingCron.Start()
	defer ratingCron.Stop()

	// =========================================================================
	// Handlers
	// =========================================================================
	authH        := handler.NewAuthHandler(authSvc)
	userH        := handler.NewUserHandler(userSvc)
	prefH        := handler.NewPreferenceHandler(prefSvc)
	destH        := handler.NewDestinationHandler(destSvc)
	accH         := handler.NewAccommodationHandler(accSvc)
	ratingH      := handler.NewRatingHandler(ratingSvc)
	ferryH       := handler.NewFerryHandler(ferrySvc)
	weatherH     := handler.NewWeatherHandler(weatherSvc)
	tripH        := handler.NewTripHandler(tripSvc, itineraryAISvc, carbonSvc)
	offsetH      := handler.NewCarbonOffsetHandler(carbonOffsetSvc)
	collabH      := handler.NewCollaboratorHandler(collabSvc)
	notifH       := handler.NewNotificationHandler(notifSvc)
	chatH        := handler.NewChatHandler(chatSvc)
	versionH     := handler.NewVersionHandler(versionSvc)
	businessH    := handler.NewBusinessAdminHandler(destSvc, accSvc)
	superadminH  := handler.NewSuperadminHandler(superadminSvc)

	// =========================================================================
	// Router
	// =========================================================================
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: false,
	}))

	r.GET("/health", func(c *gin.Context) {
		statusAI := "inactive"
		if aiClient != nil {
			statusAI = aiProvider
		}
		c.JSON(200, gin.H{
			"status":      "ok",
			"service":     "EcoTour AI Backend",
			"ai_provider": statusAI,
		})
	})

	// =========================================================================
	// PUBLIC ROUTES
	// =========================================================================
	auth := r.Group("/auth")
	{
		auth.POST("/register",        authH.Register)        // F-001
		auth.POST("/login",           authH.Login)           // F-002
		auth.POST("/forgot-password", authH.ForgotPassword)  // F-003
		auth.POST("/reset-password",  authH.ResetPassword)   // F-003
	}

	// MF-013: Widget Cuaca
	weather := r.Group("/weather")
	{
		weather.GET("/current",  weatherH.GetCurrent)  // F-036
		weather.GET("/forecast", weatherH.GetForecast) // F-037
	}

	// MF-016: Direktori Destinasi Wisata Batam
	destinations := r.Group("/destinations")
	{
		destinations.GET("",    destH.GetDestinations) // F-043
		destinations.GET("/:id", destH.GetDestination)  // F-044, F-045, F-046
	}

	// MF-015: Direktori Akomodasi
	accommodations := r.Group("/accommodations")
	{
		accommodations.GET("",    accH.GetAccommodations) // F-040
		accommodations.GET("/:id", accH.GetAccommodation)  // F-041
	}

	// MF-017: Estimasi Biaya Feri
	ferry := r.Group("/ferry")
	{
		ferry.GET("/routes",     ferryH.GetRoutes) // F-047
		ferry.GET("/routes/:id", ferryH.GetRoute)
	}

	// Ratings publik (ulasan)
	ratings := r.Group("/ratings")
	{
		ratings.GET("", ratingH.GetRatings) // F-028
	}

	// =========================================================================
	// PROTECTED ROUTES (JWT required)
	// =========================================================================
	api := r.Group("/")
	api.Use(middleware.AuthMiddleware())
	{
		// MF-012: Logout
		api.POST("/auth/logout", authH.Logout) // F-035

		// MF-002: Kelola Akun
		user := api.Group("/user")
		{
			user.GET("/me",          userH.GetProfile)
			user.PUT("/password",    userH.ChangePassword) // F-004
			user.PUT("/email",       userH.ChangeEmail)    // F-005
			user.GET("/preferences", prefH.Get)            // F-006
			user.PUT("/preferences", prefH.Update)         // F-006
		}

		// MF-015: Favorit Akomodasi
		api.POST("/accommodations/:id/favorite", accH.ToggleFavorite) // F-042
		api.GET("/accommodations/favorites",     accH.GetFavorites)

		// MF-007: Kirim Rating
		api.POST("/ratings", ratingH.SubmitRating) // F-026, F-027

		// MF-003 + MF-004: Trips
		trips := api.Group("/trips")
		{
			trips.GET("",                    tripH.GetTrips)
			trips.POST("",                   tripH.CreateTrip)          // F-007, F-008
			trips.GET("/:id",                tripH.GetTrip)
			trips.GET("/:id/full",           tripH.GetTripFull)         // F-011
			trips.POST("/:id/generate",      tripH.RegenerateItinerary) // F-009
			trips.PATCH("/:id/status",       tripH.UpdateStatus)        // Hentikan/arsip status trip
			trips.DELETE("/:id",             tripH.DeleteTrip)

			trips.GET("/:id/carbon",         tripH.GetCarbonReport)     // F-018, F-019
			trips.GET("/:id/score",          tripH.GetScore)            // F-021

			// MF-004: Chat AI
			trips.GET("/:id/chat",       chatH.GetHistory)          // F-012
			trips.POST("/:id/chat",      chatH.SendMessage)         // F-013..F-017

			// F-016: Riwayat versi & rollback
			trips.GET("/:id/versions",          versionH.GetVersions)
			trips.POST("/:id/versions/rollback", versionH.Rollback)

			// MF-010: Trip Sharing & Kolaborasi
			trips.GET("/:id/collaborators",            collabH.GetCollaborators) // F-033
			trips.POST("/:id/collaborators",           collabH.Invite)
			trips.DELETE("/:id/collaborators/:userId", collabH.Remove)
		}

		// MF-005: Carbon Offset
		api.POST("/carbon-offset",              offsetH.Donate)         // F-020
		api.GET("/carbon-offset/my",            offsetH.GetMyOffsets)
		api.GET("/carbon-offset/trip/:id",      offsetH.GetTripOffsets)

		// Notifikasi
		notifs := api.Group("/notifications")
		{
			notifs.GET("",           notifH.GetNotifications)
			notifs.GET("/count",     notifH.CountUnread)
			notifs.PUT("/:id/read",  notifH.MarkRead)
			notifs.PUT("/read-all",  notifH.MarkAllRead)
		}

		// =====================================================================
		// BUSINESS ADMIN ROUTES (Khusus Admin Pelaku Usaha Terpisah)
		// =====================================================================
		businessDest := api.Group("/business/destinations")
		businessDest.Use(middleware.BusinessDestinationMiddleware())
		{
			businessDest.POST("",         businessH.CreateDestination)
			businessDest.GET("/my",       businessH.GetMyDestinations)
			businessDest.PUT("/:id",      businessH.UpdateDestination)
			businessDest.DELETE("/:id",   businessH.DeleteDestination)
		}

		businessAcc := api.Group("/business/accommodations")
		businessAcc.Use(middleware.BusinessAccommodationMiddleware())
		{
			businessAcc.POST("",         businessH.CreateAccommodation)
			businessAcc.GET("/my",       businessH.GetMyAccommodations)
			businessAcc.PUT("/:id",      businessH.UpdateAccommodation)
			businessAcc.DELETE("/:id",   businessH.DeleteAccommodation)
		}

		// =====================================================================
		// SUPERADMIN ROUTES (Approval Akun Pelaku Usaha & Direktori Tempat)
		// =====================================================================
		superadmin := api.Group("/superadmin")
		superadmin.Use(middleware.SuperadminMiddleware())
		{
			superadmin.GET("/stats",                              superadminH.GetStats)
			superadmin.GET("/business-users/pending",             superadminH.GetPendingBusinessUsers)
			superadmin.POST("/business-users/:id/approve",        superadminH.ApproveBusinessUser)
			superadmin.POST("/business-users/:id/reject",         superadminH.RejectBusinessUser)
			superadmin.GET("/destinations",                       superadminH.GetAllDestinations)
			superadmin.GET("/accommodations",                     superadminH.GetAllAccommodations)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("EcoTour AI Backend running on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
