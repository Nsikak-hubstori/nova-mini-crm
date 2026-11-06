"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Lead = {
  id: string;
  name: string;
  email: string;
  status: string;
  score: number | null;
  amount: number | null;
  fee_rate: number | null;
};

export default function Page() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deeOpen, setDeeOpen] = useState(false);
  const [deeMsg, setDeeMsg] = useState("");
  const [deeChat, setDeeChat] = useState<{ role: string; text: string }[]>([
    { role: "dee", text: "Hi, I'm Dee, your AI assistant. How can I be of help?" },
  ]);
  const [deeLoading, setDeeLoading] = useState(false);
  const heroRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    // GSAP Hero animation - appears smoothly
    gsap.fromTo(heroRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    // GSAP Scroll animation - cards move on scroll
    gsap.fromTo(".lead-card",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: cardsRef.current, start: "top 80%" }
      }
    );
    // Load leads from API
    fetch("/api/leads").then(r => r.json()).then(d => setLeads(d.leads || [])).catch(() => {
      // Fallback sample if API fails
      setLeads([
        { id: "1", name: "John Plaintiff", email: "john@test.com", status: "stalled", score: null, amount: 5000, fee_rate: 0.15 },
        { id: "2", name: "Sarah Case", email: "sarah@test.com", status: "new", score: null, amount: 2500, fee_rate: 0.15 },
      ]);
    });
  }, []);

  const sendToDee = async () => {
    if (!deeMsg.trim()) return;
    const userText = deeMsg;
    setDeeChat(prev => [...prev, { role: "user", text: userText }]);
    setDeeMsg("");
    setDeeLoading(true);
    try {
      const res = await fetch("/api/dee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      setDeeChat(prev => [...prev, { role: "dee", text: data.reply || "I can help you manage leads, calculate fees, and summarize cases." }]);
    } catch {
      setDeeChat(prev => [...prev, { role: "dee", text: "I'm having trouble connecting, but I can still help you organize your pipeline." }]);
    }
    setDeeLoading(false);
  };

  return (
    <main style={{ background: "#0a0a0f", color: "#fff", minHeight: "100vh", fontFamily: "Inter, sans-serif", overflowX: "hidden" }}>
      {/* HERO */}
      <section ref={heroRef} style={{ padding: "60px 24px 20px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#1a1a2e", padding: "6px 14px", borderRadius: 20, fontSize: 12, color: "#a78bfa" }}>✦ AI-POWERED CRM • GROQ + SUPABASE</div>
        <h1 style={{ fontSize: 48, lineHeight: 1.1, margin: "20px 0 10px", fontWeight: 800 }}>Nova Mini CRM <span style={{ color: "#a78bfa" }}>v2</span></h1>
        <p style={{ color: "#aaa", fontSize: 17, maxWidth: 600, margin: "0 auto" }}>Manage leads, calculate fees automatically, and let Dee – your AI assistant – do the heavy lifting.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <button onClick={() => setDeeOpen(true)} style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>💬 Ask Dee</button>
          <button onClick={() => document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "#1f1f2e", color: "#fff", border: "1px solid #333", padding: "12px 24px", borderRadius: 12, cursor: "pointer" }}>View Pipeline ↓</button>
        </div>
      </section>

      {/* PIPELINE CARDS */}
      <section id="pipeline" ref={cardsRef} style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
        <h2 style={{ fontSize: 24 }}>Pipeline – {leads.length} Leads</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 16 }}>
          {leads.map((l) => {
            const amountNum = Number(l.amount) || 0;
            const fee = Math.round(amountNum * (Number(l.fee_rate) || 0.15) * 100) / 100;
            return (
              <div key={l.id} className="lead-card" style={{ background: "#15151f", border: "1px solid #2a2a3a", borderRadius: 16, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <b style={{ fontSize: 17 }}>{l.name}</b>
                  <span style={{ background: l.status === "new" ? "#22c55e" : "#f59e0b", color: "#000", fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>{l.status}</span>
                </div>
                <p style={{ color: "#999", fontSize: 13, margin: "8px 0" }}>{l.email}</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, background: "#0f0f18", padding: 12, borderRadius: 10 }}>
                  <div><div style={{ fontSize: 11, color: "#888" }}>AMOUNT</div><b>${amountNum.toLocaleString()}</b></div>
                  <div><div style={{ fontSize: 11, color: "#888" }}>FEE 15%</div><b style={{ color: "#a78bfa" }}>${fee.toLocaleString()}</b></div>
                  <div><div style={{ fontSize: 11, color: "#888" }}>SCORE</div><b>{l.score ?? "-"}</b></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DEE FLOATING BUTTON */}
      {!deeOpen && (
        <button onClick={() => setDeeOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", fontSize: 28, cursor: "pointer", boxShadow: "0 10px 30px rgba(124,58,237,0.5)", zIndex: 100 }}>🤖</button>
      )}

      {/* DEE PANEL - Slides from side */}
      {deeOpen && (
        <div style={{ position: "fixed", bottom: 20, right: 20, width: "min(380px, calc(100vw - 40px))", height: 520, background: "#14141f", border: "1px solid #333", borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 101, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", animation: "slideIn 0.4s ease" }}>
          <div style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
            <div style={{ flex: 1 }}><b>Dee – AI Assistant</b><div style={{ fontSize: 12, opacity: 0.9 }}>● Online • Powered by Groq</div></div>
            <button onClick={() => setDeeOpen(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {deeChat.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#7c3aed" : "#1f1f2e", padding: "10px 14px", borderRadius: 14, maxWidth: "85%", fontSize: 14, lineHeight: 1.4 }}>{m.text}</div>
            ))}
            {deeLoading && <div style={{ fontSize: 13, color: "#aaa" }}>Dee is typing...</div>}
          </div>
          <div style={{ padding: 12, display: "flex", gap: 8, borderTop: "1px solid #2a2a3a" }}>
            <input value={deeMsg} onChange={e => setDeeMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendToDee()} placeholder="Ask Dee anything..." style={{ flex: 1, background: "#0f0f18", border: "1px solid #333", color: "#fff", padding: "10px 14px", borderRadius: 12, outline: "none" }} />
            <button onClick={sendToDee} style={{ background: "#7c3aed", border: "none", color: "#fff", padding: "10px 16px", borderRadius: 12, cursor: "pointer" }}>Send</button>
          </div>
        </div>
      )}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </main>
  );
  }
