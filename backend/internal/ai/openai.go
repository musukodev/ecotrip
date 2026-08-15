package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

type OpenAIClient struct {
	apiKey  string
	baseURL string
	model   string
	http    *http.Client
}

// Structs untuk Request & Response OpenAI v1 Chat Completions
type openAIChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type openAIChatRequest struct {
	Model          string              `json:"model"`
	Messages       []openAIChatMessage `json:"messages"`
	ResponseFormat map[string]string   `json:"response_format,omitempty"`
	Temperature    float64             `json:"temperature"`
	Stream         bool                `json:"stream"`
}

type openAIChatResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
		Type    string `json:"type"`
	} `json:"error,omitempty"`
}

func NewOpenAIClient() (*OpenAIClient, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("OPENAI_API_KEY tidak ditemukan di environment")
	}

	baseURL := os.Getenv("OPENAI_BASE_URL")
	if baseURL == "" {
		baseURL = "https://api.openai.com/v1"
	}
	baseURL = strings.TrimRight(baseURL, "/")
	baseURL = strings.TrimSuffix(baseURL, "/chat/completions")

	model := os.Getenv("OPENAI_MODEL")
	if model == "" {
		model = "gpt-4o-mini"
	}

	return &OpenAIClient{
		apiKey:  apiKey,
		baseURL: baseURL,
		model:   model,
		http: &http.Client{
			Timeout: 60 * time.Second,
		},
	}, nil
}

func (c *OpenAIClient) GenerateItinerary(ctx context.Context, req ItineraryRequest) (*GeneratedItinerary, error) {
	prompt := buildItineraryPrompt(req)

	rawJSON, err := c.callChatCompletions(ctx, prompt, 0.7)
	if err != nil {
		return nil, fmt.Errorf("OpenAI API error: %w", err)
	}

	cleanJSON := cleanJSONMarkdown(rawJSON)

	var itinerary GeneratedItinerary
	if err := json.Unmarshal([]byte(cleanJSON), &itinerary); err != nil {
		return nil, fmt.Errorf("gagal parse JSON itinerary: %w — raw: %s", err, cleanJSON)
	}

	return &itinerary, nil
}

func (c *OpenAIClient) ChatRevise(ctx context.Context, userMessage string, currentItineraryJSON string, tripContext string) (*ChatRevisionResult, error) {
	prompt := buildChatPrompt(userMessage, currentItineraryJSON, tripContext)

	rawJSON, err := c.callChatCompletions(ctx, prompt, 0.6)
	if err != nil {
		return nil, fmt.Errorf("OpenAI API error: %w", err)
	}

	cleanJSON := cleanJSONMarkdown(rawJSON)

	var chatResult ChatRevisionResult
	if err := json.Unmarshal([]byte(cleanJSON), &chatResult); err != nil {
		return nil, fmt.Errorf("gagal parse JSON chat result: %w — raw: %s", err, cleanJSON)
	}

	return &chatResult, nil
}

func (c *OpenAIClient) callChatCompletions(ctx context.Context, prompt string, temperature float64) (string, error) {
	reqBody := openAIChatRequest{
		Model: c.model,
		Messages: []openAIChatMessage{
			{
				Role:    "user",
				Content: prompt,
			},
		},
		ResponseFormat: map[string]string{
			"type": "json_object",
		},
		Temperature: temperature,
		Stream:      false,
	}

	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	url := fmt.Sprintf("%s/chat/completions", c.baseURL)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return "", err
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))

	resp, err := c.http.Do(httpReq)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("status %d: %s", resp.StatusCode, string(respBytes))
	}

	var openAIResp openAIChatResponse
	if err := json.Unmarshal(respBytes, &openAIResp); err != nil {
		return "", fmt.Errorf("gagal unmarshal OpenAI response: %w — response: %s", err, string(respBytes))
	}

	if openAIResp.Error != nil {
		return "", fmt.Errorf("OpenAI error: %s", openAIResp.Error.Message)
	}

	if len(openAIResp.Choices) == 0 {
		return "", fmt.Errorf("OpenAI mengembalikan choices kosong")
	}

	content := openAIResp.Choices[0].Message.Content
	if content == "" {
		return "", fmt.Errorf("OpenAI mengembalikan content kosong")
	}

	return content, nil
}

// cleanJSONMarkdown membersihkan pembungkus ```json ... ``` jika model LLM menyertakannya
func cleanJSONMarkdown(s string) string {
	s = strings.TrimSpace(s)
	if strings.HasPrefix(s, "```json") {
		s = strings.TrimPrefix(s, "```json")
	} else if strings.HasPrefix(s, "```") {
		s = strings.TrimPrefix(s, "```")
	}
	if strings.HasSuffix(s, "```") {
		s = strings.TrimSuffix(s, "```")
	}
	return strings.TrimSpace(s)
}
