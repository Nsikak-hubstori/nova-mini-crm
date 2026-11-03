# 🚀 Nova Mini CRM

> Lightweight, fast, and secure Lead Management & Agent Performance dashboard.

Built for **Nova** — to track leads, scores, status, and agent activity in real-time.

Live Demo: `https://nova-mini-crm.vercel.app` (after deploy)

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Supabase](https://img.shields.io/badge/Supabase-RLS-green) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

### ✨ Features
- **Lead Pipeline** - Name, email, status (new/contacted/qualified/closed), score
- **Real-time Data** - Powered by Supabase Postgres with Row Level Security (RLS)
- **Agent Logs** - Track every agent action with timestamps
- **Secure** - Anon + Service Role keys, RLS policies on `leads` & `agent_logs`
- **Fast** - Next.js 14 App Router, SSR, Mobile-first
- **Zero Setup CRM** - Works directly on Infinix Smart 7 HD & any device

### 🛠 Tech Stack
- **Frontend:** Next.js 14, React 18
- **Backend:** Supabase (Postgres, Auth, RLS)
- **Deploy:** Vercel
- **Style:** Inline System UI (lightweight, no Tailwind overhead)

### 📦 Database Schema
**Supabase Project:** `dunievanwwendykrseir.supabase.co`

**Tables:**
- `leads` (id, name, email, status, score, created_at) - RLS Enabled
- `agent_logs` (id, action, agent_id, created_at) - RLS Enabled

### 🔐 Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://dunievanwwendykrseir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
