import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();
  let reply = "Hi, I'm Dee. I can help you manage leads, calculate fees, and summarize cases. What do you need?";
  
  // Try models in order – if one is dead, try next one. Dee will NEVER die again.
  const models = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "llama-3.3-70b-versatile"];

  for (const model of models) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: "You are Dee, a friendly professional AI assistant for Nova Mini CRM. Help with leads, fees, and legal case management. Be concise and helpful." },
            { role: "user", content: message },
          ],
          max_tokens: 300,
        }),
      });
      const data = await groqRes.json();
      if (data.choices?.[0]?.message?.content) {
        reply = data.choices[0].message.content;
        break; // Success – stop trying other models
      }
    } catch {}
  }

  return NextResponse.json({ reply });
}
