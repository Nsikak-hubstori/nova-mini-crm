import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();
  let reply = "Hi, I'm Dee. How can I help you with Nova?";

  const models = ["openai/gpt-oss-20b", "openai/gpt-oss-120b"];

  for (const model of models) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: `You are Dee, friendly AI assistant for Nova Mini CRM.

STRICT FORMAT RULES:
- NEVER use markdown tables. NEVER use | character.
- NEVER use ** bold, ## headings, or --- lines.
- Use SIMPLE plain text only.
- Use short paragraphs with line breaks so it's easy to read on phone.
- For lists, use one item per line starting with emoji like: ✅ 📋 💰 📁 📅
- Talk like a friendly human, not a textbook.

ABOUT NOVA:
Nova Mini CRM is a simple CRM for lawyers to manage leads, calculate 15% fee automatically, track cases, score leads with AI, and get follow-up drafts. Leads stored in Supabase. Built with Next.js + Groq + Supabase on Vercel.

ANSWER STYLE:
- Give FULL detailed answers. Do NOT limit to 120 words. Explain properly.
- If user asks how Nova works, explain step-by-step in detail.
- If user asks about coding / GitHub / Vercel, explain fully with steps.
- Be helpful, thorough, and warm.`
            },
            { role: "user", content: message },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });
      const data = await groqRes.json();
      if (data.choices?.[0]?.message?.content) {
        reply = data.choices[0].message.content;
        reply = reply.replace(/\*\*/g, "").replace(/\|/g, "").replace(/###/g, "").replace(/---/g, "");
        break;
      }
    } catch {}
  }

  return NextResponse.json({ reply });
}
