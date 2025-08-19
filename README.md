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
| Admin | admin@driving-school.com | admin123 |
| Instructor | john.instructor@driving-school.com | instructor123 |
| Student | alice.student@example.com | student123 |

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