import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { message } = await req.json();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  let reply = "Hi, I'm Dee. I can help you manage leads, calculate fees, and summarize cases. What do you need?";

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are Dee, a friendly professional AI assistant for Nova Mini CRM. Help with leads, fees, and legal case management. Be concise and helpful." },
          { role: "user", content: message },
        ],
        max_tokens: 300,
      }),
    });
    const data = await groqRes.json();
    if (data.choices?.[0]?.message?.content) reply = data.choices[0].message.content;
  } catch {}

  // Log to Supabase for Human-in-Loop
  await supabase.from("agent_logs").insert({ action: message, agent: "Dee", approved: false });

  return NextResponse.json({ reply });
      }
