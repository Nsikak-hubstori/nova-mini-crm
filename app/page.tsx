"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Lead = { id: string; name: string; email: string; status: string; score: number | null; amount: number | null; fee_rate: number | null; };

export default function Page() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deeOpen, setDeeOpen] = useState(false);
  const [deeMsg, setDeeMsg] = useState("");
  const [deeChat, setDeeChat] = useState<{ role: string; text: string }[]>([{ role: "dee", text: "Hi, I'm Dee, your AI assistant. How can I be of help?" }]);
  const [deeLoading, setDeeLoading] = useState(false);
  const [deeSide, setDeeSide] = useState<"left" | "right">("right");
  const [showDeeHint, setShowDeeHint] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const heroRef = useRef(null);
  const heroBgRef = useRef(null);
  const networkRef = useRef(null);
  const networkBgRef = useRef(null);
  const happyRef = useRef(null);
  const deeHintRef = useRef(null);

  useEffect(() => {
    fetch("/api/leads").then(r => r.json()).then(d => setLeads(d.leads || [])).catch(() => {
      setLeads([
        { id: "1", name: "John Plaintiff", email: "john@test.com", status: "stalled", score: null, amount: 5000, fee_rate: 0.15 },
        { id: "2", name: "Sarah Case", email: "sarah@test.com", status: "new", score: null, amount: 2500, fee_rate: 0.15 },
      ]);
    });

    // HERO – fade in
    gsap.fromTo(heroRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" });
    // HERO BG – parallax slowly moves on scroll
    gsap.to(heroBgRef.current, { yPercent: 20, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } });
    // NETWORK BG – parallax
    gsap.to(networkBgRef.current, { yPercent: -15, ease: "none", scrollTrigger: { trigger: networkRef.current, start: "top bottom", end: "bottom top", scrub: true } });
    // CARDS + SECTIONS – smooth reveal
    gsap.utils.toArray(".reveal").forEach((el: any) => {
      gsap.fromTo(el, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });
    // HAPPY IMAGES – scale in
    gsap.utils.toArray(".happy-img").forEach((el: any) => {
      gsap.fromTo(el, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });

    // DEE HINT – pop from LEFT then RIGHT, fade while scrolling
    const hintTl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
    hintTl.fromTo(deeHintRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", onStart: () => setDeeSide("left") })
      .to(deeHintRef.current, { opacity: 1, duration: 2 })
      .to(deeHintRef.current, { x: 100, opacity: 0, duration: 0.8, ease: "power3.in", onComplete: () => setDeeSide("right") })
      .fromTo(deeHintRef.current, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
      .to(deeHintRef.current, { opacity: 1, duration: 2 })
      .to(deeHintRef.current, { x: -100, opacity: 0, duration: 0.8 });

    // Show hint only after scrolling a bit
    ScrollTrigger.create({ trigger: "#why", start: "top 80%", onEnter: () => setShowDeeHint(true) });
  }, []);

  const sendToDee = async () => {
    if (!deeMsg.trim()) return;
    const userText = deeMsg;
    setDeeChat(prev => [...prev, { role: "user", text: userText }]);
    setDeeMsg(""); setDeeLoading(true);
    try {
      const res = await fetch("/api/dee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: userText }) });
      const data = await res.json();
      setDeeChat(prev => [...prev, { role: "dee", text: data.reply || "I can help you manage leads." }]);
    } catch { setDeeChat(prev => [...prev, { role: "dee", text: "I'm having trouble connecting." }]); }
    setDeeLoading(false);
  };

  const joinNova = async () => {
    if (!newName || !newEmail) return alert("Please add name and email");
    const fee = Math.round(Number(newAmount || 0) * 0.15);
    const newLead: Lead = { id: Date.now().toString(), name: newName, email: newEmail, status: "new", score: null, amount: Number(newAmount || 0), fee_rate: 0.15 };
    setLeads(prev => [newLead, ...prev]);
    setShowJoin(false); setNewName(""); setNewEmail(""); setNewAmount("");
    try { await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newLead.name, email: newLead.email, amount: newLead.amount, status: "new" }) }); } catch {}
    alert(`Welcome ${newName}! Your fee is $${fee}. Dee will help you follow up.`);
    document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main style={{ background: "#0a0a0f", color: "#fff", fontFamily: "Inter, sans-serif", overflowX: "hidden" }}>

      {/* ===== 1. HERO – PEOPLE THANKING / CELEBRATING ===== */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "95vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", textAlign: "center", padding: "40px 20px" }}>
        <div ref={heroBgRef} style={{ position: "absolute", inset: "-20% 0", backgroundImage: "url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.35 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,15,0.6), #0a0a0f)" }} />
        <div style={{ position: "relative", maxWidth: 800 }}>
          <div style={{ display: "inline-block", background: "#1a1a2e", padding: "8px 16px", borderRadius: 20, fontSize: 12, color: "#a78bfa" }}>✦ AI-POWERED CRM • FOR LAWYERS</div>
          <h1 style={{ fontSize: "clamp(38, 8vw, 68)", lineHeight: 1.05, margin: "20px 0 12px", fontWeight: 800 }}>Nova Mini CRM <span style={{ color: "#a78bfa" }}>v2</span></h1>
          <p style={{ color: "#ddd", fontSize: 18, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>Manage leads, calculate fees automatically, and let Dee – your AI assistant – do the heavy lifting. So you can focus on winning cases, not paperwork.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <button onClick={() => setDeeOpen(true)} style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "14px 28px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 16 }}>💬 Ask Dee</button>
            <button onClick={() => setShowJoin(true)} style={{ background: "#fff", color: "#000", border: "none", padding: "14px 28px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 16 }}>🚀 Join Nova – It's Free</button>
            <button onClick={() => document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "#1f1f2e", color: "#fff", border: "1px solid #444", padding: "14px 28px", borderRadius: 12, cursor: "pointer", fontSize: 16 }}>View Pipeline ↓</button>
          </div>
          <p style={{ marginTop: 20, color: "#aaa", fontSize: 14 }}>⭐ Trusted by lawyers who want more clients, less stress</p>
        </div>
      </section>

      {/* ===== 2. WHY YOU NEED NOVA ===== */}
      <section id="why" className="reveal" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800 }}>Why Do You Need Nova?</h2>
        <p style={{ color: "#aaa", fontSize: 18, maxWidth: 700, margin: "16px auto", lineHeight: 1.7 }}>Are you losing clients because you forget to follow up? Are you wasting hours calculating fees by hand? Are your cases scattered in WhatsApp, notebooks, and Excel? <b style={{ color: "#fff" }}>Nova fixes all of that in one place.</b></p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16, marginTop: 32, textAlign: "left" }}>
          {[
            ["😩 The Problem", "You miss follow-ups, lose clients, and waste time on paperwork."],
            ["💰 Lost Money", "You forget to charge the right fee or forget a client owes you."],
            ["😵 Stress", "Too many apps, too many messages, no clear view of your business."],
            ["✅ Nova Solution", "One dashboard. Dee reminds you, calculates fees, drafts messages."],
          ].map(([t, d]) => (
            <div key={t} style={{ background: "#15151f", border: "1px solid #2a2a3a", borderRadius: 16, padding: 20 }}><b style={{ fontSize: 18 }}>{t}</b><p style={{ color: "#aaa", marginTop: 10, lineHeight: 1.6 }}>{d}</p></div>
          ))}
        </div>
      </section>

      {/* ===== 3. WHAT IS NOVA – NETWORK SYSTEM BG ===== */}
      <section ref={networkRef} style={{ position: "relative", overflow: "hidden", padding: "90px 20px" }}>
        <div ref={networkBgRef} style={{ position: "absolute", inset: "-20% 0", backgroundImage: "url(https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.25 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #0a0a0f, rgba(10,10,15,0.7), #0a0a0f)" }} />
        <div className="reveal" style={{ position: "relative", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800 }}>What Is Nova & Who Is It Built For?</h2>
          <p style={{ color: "#ddd", fontSize: 18, lineHeight: 1.8, maxWidth: 750, margin: "16px auto" }}>Nova is a simple, smart CRM built for <b>lawyers, law firms, and legal professionals</b>. Whether you are a solo lawyer or a growing firm, Nova helps you turn strangers into clients, and clients into paid cases.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginTop: 30, textAlign: "left" }}>
            {[
              ["📋 Lead Management", "Capture every new client, track them from first message to case start."],
              ["💰 Automatic Fee", "Nova calculates your 15% fee instantly. No calculator, no mistakes."],
              ["🤖 AI Scoring by Dee", "Dee scores each lead 1-100 so you know who is serious."],
              ["✉️ Follow-Up Drafts", "Dee writes the message for you. You just send it."],
            ].map(([t, d]) => (
              <div key={t} style={{ background: "rgba(21,21,31,0.9)", border: "1px solid #333", borderRadius: 16, padding: 20 }}><b>{t}</b><p style={{ color: "#bbb", marginTop: 8, lineHeight: 1.6 }}>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. HAPPY PEOPLE – AFTER USING NOVA ===== */}
      <section ref={happyRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <h2 className="reveal" style={{ fontSize: 36, fontWeight: 800 }}>After Using Nova, Life Changes</h2>
        <p className="reveal" style={{ color: "#aaa", fontSize: 18, margin: "14px auto 30px", maxWidth: 700 }}>Lawyers smile more. Clients feel cared for. Cases close faster. This is what happens when Dee handles the boring work for you.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <div className="happy-img" style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 380 }}>
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80" alt="Happy team celebrating" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, background: "linear-gradient(transparent, rgba(0,0,0,0.85))", textAlign: "left" }}><b style={{ fontSize: 20 }}>😊 When They Find Nova</b><p style={{ color: "#ddd", margin: "6px 0 0" }}>“Finally! A CRM that understands lawyers.”</p></div>
          </div>
          <div className="happy-img" style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 380 }}>
            <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1000&q=80" alt="People celebrating success" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, background: "linear-gradient(transparent, rgba(0,0,0,0.85))", textAlign: "left" }}><b style={{ fontSize: 20 }}>🎉 After Using Nova</b><p style={{ color: "#ddd", margin: "6px 0 0" }}>More clients, more money, less stress. Dee does the work.</p></div>
          </div>
        </div>
        <button onClick={() => setShowJoin(true)} className="reveal" style={{ marginTop: 32, background: "#7c3aed", color: "#fff", border: "none", padding: "16px 36px", borderRadius: 12, fontWeight: 700, fontSize: 17, cursor: "pointer" }}>🚀 Join Nova Now – Start Free</button>
      </section>

      {/* ===== 5. PIPELINE ===== */}
      <section id="pipeline" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px 100px" }}>
        <h2 style={{ fontSize: 28 }}>Pipeline – {leads.length} Leads</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 16 }}>
          {leads.map((l) => {
            const amountNum = Number(l.amount) || 0;
            const fee = Math.round(amountNum * (Number(l.fee_rate) || 0.15) * 100) / 100;
            return (
              <div key={l.id} className="lead-card" style={{ background: "#15151f", border: "1px solid #2a2a3a", borderRadius: 16, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: 17 }}>{l.name}</b><span style={{ background: l.status === "new" ? "#22c55e" : "#f59e0b", color: "#000", fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>{l.status}</span></div>
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

      {/* ===== DEE HINT – Slides Left / Right ===== */}
      {showDeeHint && !deeOpen && (
        <div ref={deeHintRef} onClick={() => setDeeOpen(true)} style={{ position: "fixed", bottom: 100, [deeSide]: 20, background: "#fff", color: "#000", padding: "12px 16px", borderRadius: 16, fontSize: 14, fontWeight: 600, cursor: "pointer", zIndex: 99, boxShadow: "0 10px 30px rgba(0,0,0,0.4)", maxWidth: 260 }}>
          💬 Need help? Chat with Dee, your AI assistant →
        </div>
      )}

      {/* ===== DEE FLOATING BUTTON ===== */}
      {!deeOpen && (
        <button onClick={() => setDeeOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", fontSize: 28, cursor: "pointer", boxShadow: "0 10px 30px rgba(124,58,237,0.5)", zIndex: 100 }}>🤖</button>
      )}

      {/* ===== DEE PANEL ===== */}
      {deeOpen && (
        <div style={{ position: "fixed", bottom: 20, right: 20, width: "min(380px, calc(100vw - 40px))", height: 520, background: "#14141f", border: "1px solid #333", borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 101, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
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

      {/* ===== JOIN MODAL – NOW WORKS! ===== */}
      {showJoin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: "#14141f", border: "1px solid #333", borderRadius: 20, padding: 24, width: "100%", maxWidth: 400 }}>
            <h3 style={{ fontSize: 22, margin: "0 0 8px" }}>🚀 Join Nova</h3>
            <p style={{ color: "#aaa", fontSize: 14, margin: "0 0 16px" }}>Add your first lead – Dee will calculate your fee.</p>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Client Name – e.g. John Plaintiff" style={{ width: "100%", background: "#0f0f18", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: 10, marginBottom: 10, boxSizing: "border-box" }} />
            <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email – e.g. john@test.com" style={{ width: "100%", background: "#0f0f18", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: 10, marginBottom: 10, boxSizing: "border-box" }} />
            <input value={newAmount} onChange={e => setNewAmount(e.target.value)} type="number" placeholder="Case Amount – e.g. 5000" style={{ width: "100%", background: "#0f0f18", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: 10, marginBottom: 16, boxSizing: "border-box" }} />
            <button onClick={joinNova} style={{ width: "100%", background: "#7c3aed", color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Join Nova →</button>
            <button onClick={() => setShowJoin(false)} style={{ width: "100%", background: "transparent", color: "#aaa", border: "none", padding: "12px", cursor: "pointer",
