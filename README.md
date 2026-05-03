# LetMeCheck - AI Career Guidance Platform

A comprehensive, AI-powered career guidance platform for undergraduate, graduate, and postgraduate students.

## Features

- **Resume Analyzer** - AI-powered resume analysis with 8 scoring dimensions
- **Skill Gap Analysis** - Interactive radar/bar charts showing missing skills
- **Course Recommendations** - 30+ curated courses based on skill gaps
- **AI Mock Interviews** - Practice interviews tailored to your target role
- **Certificate Verification** - Upload certificates and earn verified badges
- **30+ Job Roles** - Comprehensive skill matrices for tech careers

## Tech Stack

- **Frontend:** React 18 + TypeScript + Tailwind CSS + Vite
- **Backend:** Supabase (Auth + PostgreSQL + Storage)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Deployment:** Vercel

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd letmecheck
npm install
```

### 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** → **New Query**
3. Copy the entire contents of `supabase-schema.sql` and run it
4. Go to **Project Settings** → **API** and copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` API key → `VITE_SUPABASE_ANON_KEY`

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Enable Storage Bucket

In Supabase Dashboard:
1. Go to **Storage** → **New Bucket**
2. Name: `resumes`
3. Set to **Public**
4. Go to **Policies** → Add policies for `INSERT`, `SELECT`, `UPDATE`, `DELETE` for authenticated users

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Build Configuration

The `vercel.json` is already configured:
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite
- SPA Routing: Enabled

## Project Structure

```
letmecheck/
├── src/
│   ├── components/       # Sidebar, Layout
│   ├── context/          # AuthContext (Supabase auth)
│   ├── lib/              # Supabase client + types
│   ├── pages/            # All 9 pages
│   ├── App.tsx           # Router setup
│   ├── main.tsx          # Entry point
│   └── index.css         # Tailwind + custom styles
├── supabase-schema.sql   # Complete database schema
├── vercel.json           # Vercel deployment config
├── package.json
└── README.md
```

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Dashboard with example resume |
| Resume Format | `/resume-format` | Resume writing guide |
| Resume Analyzer | `/resume-analyzer` | AI resume analysis |
| Skill Gaps | `/skill-gaps` | Interactive skill charts |
| My Learning | `/my-learning` | Course progress tracking |
| Courses | `/courses` | 30+ curated courses |
| Profile | `/profile` | User profile + badges |
| Interview | `/interview` | AI mock interviews |

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#FFFDF5` | Page backgrounds |
| Primary | `#1E3A8A` | Navigation, buttons |
| Accent | `#10B981` | Success, badges, CTAs |
| Secondary | `#DBEAFE` | Sidebars, hover states |

## Database Schema

### Tables
- `profiles` - User profiles (extends auth.users)
- `resumes` - Uploaded resumes with analysis results
- `skill_gaps` - Missing/present skills per analysis
- `courses` - 30+ curated courses
- `user_courses` - User course access tracking
- `certificates` - Uploaded certificates for verification
- `badges` - Earned verification badges

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Public read access for courses

## Certificate Verification Pipeline

1. File validation (PDF/JPG/PNG, max 10MB)
2. OCR text extraction
3. Student name verification (fuzzy matching)
4. Course name verification
5. Completion status check
6. Date validation
7. Duplicate detection
8. Issuer verification

## Future Enhancements

- [ ] OpenAI/Claude API integration for real resume analysis
- [ ] Google Vision API for certificate OCR
- [ ] LinkedIn profile integration
- [ ] Video resume analysis
- [ ] Peer resume review community
- [ ] Mobile app (React Native)

## License

MIT
