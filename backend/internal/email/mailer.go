package email

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"net/smtp"
	"os"
)

type MailerService interface {
	SendPasswordResetEmail(toEmail, toName, token string) error
}

type mailerService struct {
	smtpHost    string
	smtpPort    string
	smtpEmail   string
	smtpPass    string
	frontendURL string
}

func NewMailerService() MailerService {
	host := os.Getenv("SMTP_HOST")
	if host == "" {
		host = "smtp.gmail.com"
	}
	port := os.Getenv("SMTP_PORT")
	if port == "" {
		port = "587"
	}
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:8081"
	}

	return &mailerService{
		smtpHost:    host,
		smtpPort:    port,
		smtpEmail:   os.Getenv("SMTP_EMAIL"),
		smtpPass:    os.Getenv("SMTP_PASSWORD"),
		frontendURL: frontendURL,
	}
}

const resetEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7f5; margin: 0; padding: 20px; color: #12312b; }
    .container { max-width: 560px; background-color: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #12312b, #2d6a4f); color: #ffffff; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; letter-spacing: 0.5px; }
    .content { padding: 30px 25px; line-height: 1.6; font-size: 15px; }
    .btn { display: inline-block; background-color: #2d6a4f; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; margin: 20px 0; font-size: 15px; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #888888; background-color: #fafafa; border-top: 1px solid #eeeeee; }
    .note { font-size: 13px; color: #666666; margin-top: 20px; }
    .token-box { background-color: #e8f5e9; padding: 10px; border-radius: 6px; font-family: monospace; word-break: break-all; margin-top: 10px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌿 EcoTour AI</h1>
    </div>
    <div class="content">
      <p>Halo <strong>{{.Name}}</strong>,</p>
      <p>Kami menerima permintaan untuk mereset kata sandi akun EcoTour AI kamu. Klik tombol di bawah ini untuk membuat kata sandi baru:</p>
      
      <div style="text-align: center;">
        <a href="{{.ResetURL}}" class="btn" target="_blank">Reset Kata Sandi</a>
      </div>

      <p class="note">Link di atas berlaku selama <strong>1 jam</strong>. Jika kamu tidak meminta reset kata sandi, abaikan email ini.</p>
      
      <div class="token-box">
        <strong>Atau buka tautan berikut secara manual:</strong><br>
        {{.ResetURL}}
      </div>
    </div>
    <div class="footer">
      &copy; 2026 EcoTour AI — Jelajah Batam Ramah Lingkungan
    </div>
  </div>
</body>
</html>`

func (m *mailerService) SendPasswordResetEmail(toEmail, toName, token string) error {
	if m.smtpEmail == "" || m.smtpPass == "" {
		log.Printf("[MAILER MOCK] SMTP belum dikonfigurasi di .env. Email ke %s tidak dikirim. Token: %s", toEmail, token)
		return nil
	}

	resetURL := fmt.Sprintf("%s/reset-password?token=%s", m.frontendURL, token)

	tmpl, err := template.New("reset_email").Parse(resetEmailTemplate)
	if err != nil {
		return fmt.Errorf("gagal parse template email: %w", err)
	}

	var body bytes.Buffer
	data := struct {
		Name     string
		ResetURL string
	}{
		Name:     toName,
		ResetURL: resetURL,
	}

	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("gagal render template email: %w", err)
	}

	subject := "Subject: Reset Kata Sandi Akun EcoTour AI\r\n"
	from := fmt.Sprintf("From: EcoTour AI <%s>\r\n", m.smtpEmail)
	to := fmt.Sprintf("To: %s\r\n", toEmail)
	mime := "MIME-version: 1.0;\r\nContent-Type: text/html; charset=\"UTF-8\";\r\n\r\n"

	msg := []byte(from + to + subject + mime + body.String())

	auth := smtp.PlainAuth("", m.smtpEmail, m.smtpPass, m.smtpHost)
	addr := fmt.Sprintf("%s:%s", m.smtpHost, m.smtpPort)

	err = smtp.SendMail(addr, auth, m.smtpEmail, []string{toEmail}, msg)
	if err != nil {
		log.Printf("[MAILER ERROR] Gagal mengirim email ke %s: %v", toEmail, err)
		return fmt.Errorf("gagal kirim email: %w", err)
	}

	log.Printf("[MAILER SUCCESS] Email reset kata sandi berhasil dikirim ke %s", toEmail)
	return nil
}
