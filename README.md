# Driving School Management System - Phase 1 MVP

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Docker (for database) or PostgreSQL
- Git

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd driving-school-mvp
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up database:

**Option A: Using Docker (Recommended)**
\`\`\`bash
docker-compose up -d
\`\`\`

**Option B: Using external PostgreSQL**
Update DATABASE_URL in .env.local

4. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your database credentials
\`\`\`

5. Run database migrations:
\`\`\`bash
npm run db:push
\`\`\`

6. Seed the database:
\`\`\`bash
npm run db:seed
\`\`\`

7. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## 📝 Test Credentials

| Role | Email | Password |
|------|-------|----------|
  Test accounts:
  -------------------------
  Admin:       admin@test.com / Test123!
  Instructor1: instructor1@test.com / Test123!
  Instructor2: instructor2@test.com / Test123!
  Student:     student@test.com / Test123!
  Student2:    student2@test.com / Test123!
  -------------------------
  `
## 🎯 Features (Phase 1 - MVP)

### Implemented ✅
- User registration and login
- Role-based access (Student, Instructor, Admin)
- Instructor schedule management
- Lesson booking system
- Booking cancellation
- Student dashboard
- Instructor dashboard
- Admin dashboard
- Basic user management

### Not Implemented in MVP ❌
- Real payments (mock only)
- Chat system
- Geolocation
- Mobile app
- Analytics
- External integrations

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, tRPC
- **Database**: PostgreSQL, Prisma ORM
- **Auth**: NextAuth.js
- **Deployment**: Vercel (app), Docker (database)

## 📂 Project Structure

\`\`\`
driving-school-mvp/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utilities and configurations
├── prisma/          # Database schema and migrations
├── types/           # TypeScript type definitions
└── public/          # Static assets
\`\`\`

## 🔧 Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with test data
npm run db:studio    # Open Prisma Studio
\`\`\`

## 🚢 Deployment

### Vercel
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker
\`\`\`bash
docker-compose up -d
\`\`\`

## 📄 License

MIT

## 👥 Support

For issues and questions, please create an issue in the repository.






Instrukcja konfiguracji Przelewy24
1. Konfiguracja w panelu Przelewy24
Sandbox (środowisko testowe)

Zaloguj się do panelu sandbox: https://sandbox.przelewy24.pl/panel
Przejdź do Ustawienia → Dane dostępowe API
Skopiuj:

Merchant ID
CRC key
Wygeneruj API Key



Produkcja

Zaloguj się do panelu: https://panel.przelewy24.pl
Przejdź do Ustawienia → Dane dostępowe API
Skopiuj dane jak wyżej

2. Konfiguracja URL-i powrotnych
W panelu Przelewy24 ustaw:
URL statusu (webhook):
https://twoja-domena.pl/api/webhooks/p24
URL powrotu:
https://twoja-domena.pl/api/payments/p24/return
Dla developmentu (ngrok):
Jeśli testujesz lokalnie, użyj ngrok:
bashngrok http 3000
Następnie użyj URL z ngrok:

Status URL: https://xxx.ngrok.io/api/webhooks/p24
Return URL: https://xxx.ngrok.io/api/payments/p24/return

3. Zmienne środowiskowe
W pliku .env.local:
env# Przelewy24 - SANDBOX
P24_MERCHANT_ID=27290
P24_POS_ID=27290
P24_CRC=b36103b3f74181c8
P24_API_KEY=test
P24_SANDBOX=true

# Przelewy24 - PRODUKCJA (odkomentuj gdy będziesz gotowy)
# P24_MERCHANT_ID=twój_merchant_id
# P24_POS_ID=twój_pos_id
# P24_CRC=twój_crc
# P24_API_KEY=twój_api_key
# P24_SANDBOX=false
4. Testowanie
Karty testowe (sandbox):

Karta sukces: 4444 3333 2222 1111
CVV: 123
Data: dowolna przyszła

Test flow:

Utwórz rezerwację
Kliknij "Zapłać"
Zostaniesz przekierowany do Przelewy24
Użyj karty testowej
Po płatności wrócisz na stronę sukcesu

5. Weryfikacja webhooka
Przelewy24 wysyła webhook na URL statusu. Upewnij się że:

URL jest publiczny (nie localhost)
Endpoint zwraca status 200 OK
Weryfikujesz podpis (sign)

6. Logi i debugowanie
Sprawdzaj logi w:

Konsoli przeglądarki
Konsoli serwera (terminal)
Panelu Przelewy24 → Historia transakcji

7. Częste problemy
"Invalid CRC"

Sprawdź czy CRC w .env zgadza się z panelem P24
Upewnij się że nie ma spacji na końcu

"Merchant not found"

Sprawdź Merchant ID
Upewnij się że używasz właściwego środowiska (sandbox/prod)

Webhook nie działa

URL musi być publiczny
Sprawdź logi w panelu P24
Użyj ngrok dla lokalnego testowania

8. Wsparcie

Dokumentacja API: https://developers.przelewy24.pl
Wsparcie techniczne: tech@przelewy24.pl
Panel sandbox: https://sandbox.przelewy24.pl