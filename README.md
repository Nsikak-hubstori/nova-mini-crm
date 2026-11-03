# Nova Mini CRM v2 – React 19 + TypeScript + Groq Agent

Live: https://nova-mini-crm.vercel.app

**Stack matches Nova Legal Funding job:**
- Next.js 15.3.2 (React 19) + TypeScript – app router
- Supabase Postgres with RLS – `leads` & `agent_logs` (auth.uid() = owner_id)
- Fee math – Math.round(amount * fee_rate * 100)/100 – no floating error
- Groq Agent – llama3-8b-8192 – tool call, writes score to leads, logs to agent_logs with approved=false (human-in-loop)
- Vercel deploy + GitHub Actions ready 

### API
POST /api/groq-agent – { leadId, lead } -> Groq -> score + summary + followUpDraft

### Env
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, GROQ_API_KEY
