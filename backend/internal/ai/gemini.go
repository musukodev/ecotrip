package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"google.golang.org/genai"
)

type GeminiClient struct {
	client *genai.Client
	model  string
}

func NewGeminiClient() (*GeminiClient, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY tidak ditemukan di environment")
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		return nil, fmt.Errorf("gagal inisialisasi Gemini client: %w", err)
	}

	return &GeminiClient{
		client: client,
		model:  "gemini-2.0-flash",
	}, nil
}

func (g *GeminiClient) GenerateItinerary(ctx context.Context, req ItineraryRequest) (*GeneratedItinerary, error) {
	prompt := buildItineraryPrompt(req)

	result, err := g.client.Models.GenerateContent(ctx, g.model,
		genai.Text(prompt),
		&genai.GenerateContentConfig{
			ResponseMIMEType: "application/json",
			Temperature:      genai.Ptr[float32](0.7),
		},
	)
	if err != nil {
		return nil, fmt.Errorf("Gemini API error: %w", err)
	}

	raw := extractText(result)
	if raw == "" {
		return nil, fmt.Errorf("Gemini mengembalikan respons kosong")
	}

	var itinerary GeneratedItinerary
	if err := json.Unmarshal([]byte(raw), &itinerary); err != nil {
		return nil, fmt.Errorf("gagal parse JSON itinerary: %w — raw: %s", err, raw)
	}

	return &itinerary, nil
}

func (g *GeminiClient) ChatRevise(ctx context.Context, userMessage string, currentItineraryJSON string, tripContext string) (*ChatRevisionResult, error) {
	prompt := buildChatPrompt(userMessage, currentItineraryJSON, tripContext)

	result, err := g.client.Models.GenerateContent(ctx, g.model,
		genai.Text(prompt),
		&genai.GenerateContentConfig{
			ResponseMIMEType: "application/json",
			Temperature:      genai.Ptr[float32](0.6),
		},
	)
	if err != nil {
		return nil, fmt.Errorf("Gemini API error: %w", err)
	}

	raw := extractText(result)
	if raw == "" {
		return nil, fmt.Errorf("Gemini mengembalikan respons kosong")
	}

	var chatResult ChatRevisionResult
	if err := json.Unmarshal([]byte(raw), &chatResult); err != nil {
		return nil, fmt.Errorf("gagal parse JSON chat result: %w — raw: %s", err, raw)
	}

	return &chatResult, nil
}

func extractText(result *genai.GenerateContentResponse) string {
	if result == nil || len(result.Candidates) == 0 {
		return ""
	}
	candidate := result.Candidates[0]
	if candidate.Content == nil || len(candidate.Content.Parts) == 0 {
		return ""
	}
	for _, part := range candidate.Content.Parts {
		if part.Text != "" {
			return part.Text
		}
	}
	return ""
}
