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
  const [deeChat, setDeeChat] = useState([{ role: "dee", text: "Hi, I'm Dee, your AI assistant. How can I be of help?" }]);
  const [deeLoading, setDeeLoading] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [side, setSide] = useState("right");
  const [nName, setNName] = useState(""); const [nEmail, setNEmail] = useState(""); const [nAmount, setNAmount] = useState("");
  const heroRef = useRef(null); const heroBg = useRef(null); const netRef = useRef(null); const netBg = useRef(null); const hintRef = useRef(null);
  useEffect(() => {
    fetch("/api/leads").then(r => r.json()).then(d => setLeads(d.leads || [])).catch(() => setLeads([{ id: "1", name: "John Plaintiff", email: "john@test.com", status: "stalled", score: null, amount: 5000, fee_rate: 0.15 }]));
    gsap.fromTo(heroRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.to(heroBg.current, { yPercent: 18, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(netBg.current, { yPercent: -12, ease: "none", scrollTrigger: { trigger: netRef.current, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.utils.toArray(".reveal").forEach((el: any) => { gsap.fromTo(el, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, scrollTrigger: { trigger: el, start: "top 88%" } }); });
    gsap.utils.toArray(".happy").forEach((el: any) => { gsap.fromTo(el, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, scrollTrigger: { trigger: el, start: "top 88%" } }); });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    tl.fromTo(hintRef.current, { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, onStart: () => setSide("left") }).to(hintRef.current, { opacity: 1, duration: 2 }).to(hintRef.current, { opacity: 0, duration: 0.6 }).fromTo(hintRef.current, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, onStart: () => setSide("right") }).to(hintRef.current, { opacity: 1, duration: 2 }).to(hintRef.current, { opacity: 0, duration: 0.6 });
    ScrollTrigger.create({ trigger: "#why", start: "top 80%", onEnter: () => setShowHint(true) });
  }, []);
  const sendDee = async () => {
    if (!deeMsg.trim()) return; const t = deeMsg; setDeeChat(p => [...p, { role: "user", text: t }]); setDeeMsg(""); setDeeLoading(true);
    try { const r = await fetch("/api/dee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: t }) }); const d = await r.json(); setDeeChat(p => [...p, { role: "dee", text: d.reply }]); } catch { setDeeChat(p => [...p, { role: "dee", text: "Trouble connecting." }]); }
    setDeeLoading(false);
  };
  const join = async () => {
    if (!nName || !nEmail) return alert("Add name + email");
    const nl: Lead = { id: Date.now().toString(), name: nName, email: nEmail, status: "new", score: null, amount: Number(nAmount || 0), fee_rate: 0.15 };
    setLeads(p => [nl, ...p]); setShowJoin(false); setNName(""); setNEmail(""); setNAmount("");
    try { await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: nl.name, email: nl.email, amount: nl.amount, status: "new" }) }); } catch {}
    alert("Welcome " + nl.name + "! Fee: $" + Math.round(Number(nAmount || 0) * 0.15));
    document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <main style={{ background: "#0a0a0f", color: "#fff", fontFamily: "Inter,sans-serif", overflowX: "hidden" }}>
      <section ref={heroRef} style={{ position: "relative", minHeight: "95vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", padding: "40px 20px" }}>
        <div ref={heroBg} style={{ position: "absolute", inset: "-20% 0", backgroundImage: "url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.35 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,15,0.5), #0a0a0f)" }} />
        <div style={{ position: "relative", maxWidth: 800 }}>
          <div style={{ display: "inline-block", background: "#1a1a2e", padding: "8px 16px", borderRadius: 20, fontSize: 12, color: "#a78bfa" }}>✦ AI-POWERED CRM • FOR LAWYERS</div>
          <h1 style={{ fontSize: 56, lineHeight: 1.1, margin: "20px 0 12px", fontWeight: 800 }}>Nova Mini CRM <span style={{ color: "#a78bfa" }}>v2</span></h1>
          <p style={{ color: "#ddd", fontSize: 18, lineHeight: 1.6 }}>Manage leads, calculate fees automatically, and let Dee do the heavy lifting.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            <button onClick={() => setDeeOpen(true)} style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "14px 26px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>💬 Ask Dee</button>
            <button onClick={() => setShowJoin(true)} style={{ background: "#fff", color: "#000", border: "none", padding: "14px 26px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>🚀 Join Nova</button>
            <button onClick={() => document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "#1f1f2e", color: "#fff", border: "1px solid #444", padding: "14px 26px", borderRadius: 12, cursor: "pointer" }}>View Pipeline ↓</button>
          </div>
        </div>
      </section>
      <section id="why" className="reveal" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: 34, fontWeight: 800 }}>Why Do You Need Nova?</h2>
        <p style={{ color: "#aaa", fontSize: 18, maxWidth: 700, margin: "16px auto", lineHeight: 1.7 }}>Losing clients because you forget follow-ups? Wasting hours calculating fees? Nova fixes all that in one place.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, textAlign: "left", marginTop: 24 }}>
          <div style={{ background: "#15151f", border: "1px solid #2a2a3a", borderRadius: 16, padding: 20 }}><b>😩 Problem</b><p style={{ color: "#aaa", lineHeight: 1.6 }}>Missed follow-ups, lost clients.</p></div>
          <div style={{ background: "#15151f", border: "1px solid #2a2a3a", borderRadius: 16, padding: 20 }}><b>💰 Lost Money</b><p style={{ color: "#aaa", lineHeight: 1.6 }}>Wrong fee, forgotten payments.</p></div>
          <div style={{ background: "#15151f", border: "1px solid #2a2a3a", borderRadius: 16, padding: 20 }}><b>✅ Nova Solution</b><p style={{ color: "#aaa", lineHeight: 1.6 }}>One dashboard. Dee reminds, calculates, drafts.</p></div>
        </div>
      </section>
      <section ref={netRef} style={{ position: "relative", overflow: "hidden", padding: "90px 20px" }}>
        <div ref={netBg} style={{ position: "absolute", inset: "-20% 0", backgroundImage: "url(https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.25 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,#0a0a0f,rgba(10,10,15,0.7),#0a0a0f)" }} />
        <div className="reveal" style={{ position: "relative", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 34, fontWeight: 800 }}>What Is Nova & Who Is It Built For?</h2>
          <p style={{ color: "#ddd", fontSize: 18, lineHeight: 1.8, maxWidth: 750, margin: "16px auto" }}>Nova is a simple, smart CRM built for lawyers and law firms. It turns strangers into clients, and clients into paid cases.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16, textAlign: "left", marginTop: 20 }}>
            <div style={{ background: "rgba(21,21,31,0.9)", border: "1px solid #333", borderRadius: 16, padding: 20 }}><b>📋 Leads</b><p style={{ color: "#bbb" }}>Track every client from first message.</p></div>
            <div style={{ background: "rgba(21,21,31,0.9)", border: "1px solid #333", borderRadius: 16, padding: 20 }}><b>💰 Auto Fee 15%</b><p style={{ color: "#bbb" }}>No calculator, no mistakes.</p></div>
            <div style={{ background: "rgba(21,21,31,0.9)", border: "1px solid #333", borderRadius: 16, padding: 20 }}><b>🤖 Dee AI Score</b><p style={{ color: "#bbb" }}>Score 1-100, know who is serious.</p></div>
            <div style={{ background: "rgba(21,21,31,0.9)", border: "1px solid #333", borderRadius: 16, padding: 20 }}><b>✉️ Follow-ups</b><p style={{ color: "#bbb" }}>Dee writes the message for you.</p></div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <h2 className="reveal" style={{ fontSize: 34, fontWeight: 800 }}>After Using Nova, Life Changes</h2>
        <p className="reveal" style={{ color: "#aaa", fontSize: 18, margin: "14px auto 28px" }}>Lawyers smile more. Clients feel cared for. Cases close faster.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
          <div className="happy" style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 380 }}><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="happy" /><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, background: "linear-gradient(transparent,rgba(0,0,0,0.85))", textAlign: "left" }}><b style={{ fontSize: 20 }}>😊 When They Find Nova</b><p>Finally! A CRM that understands lawyers.</p></div></div>
          <div className="happy" style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 380 }}><img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1000&q=80" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="celebrate" /><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, background: "linear-gradient(transparent,rgba(0,0,0,0.85))", textAlign: "left" }}><b style={{ fontSize: 20 }}>🎉 After Using Nova</b><p>More clients, more money, less stress.</p></div></div>
        </div>
        <button onClick={() => setShowJoin(true)} className="reveal" style={{ marginTop: 30, background: "#7c3aed", color: "#fff", border: "none", padding: "16px 34px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>🚀 Join Nova Now</button>
      </section>
      <section id="pipeline" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 100px" }}>
        <h2>Pipeline – {leads.length} Leads</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16, marginTop: 16 }}>
          {leads.map(l => { const amt = Number(l.amount) || 0; const fee = Math.round(amt * 0.15 * 100) / 100; return (<div key={l.id} style={{ background: "#15151f", border: "1px solid #2a2a3a", borderRadius: 16, padding: 18 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b>{l.name}</b><span style={{ background: l.status === "new" ? "#22c55e" : "#f59e0b", color: "#000", fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>{l.status}</span></div><p style={{ color: "#999", fontSize: 13 }}>{l.email}</p><div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, background: "#0f0f18", padding: 12, borderRadius: 10 }}><div><div style={{ fontSize: 11, color: "#888" }}>AMOUNT</div><b>${amt.toLocaleString()}</b></div><div><div style={{ fontSize: 11, color: "#888" }}>FEE 15%</div><b style={{ color: "#a78bfa" }}>${fee.toLocaleString()}</b></div><div><div style={{ fontSize: 11, color: "#888" }}>SCORE</div><b>{l.score ?? "-"}</b></div></div></div>); })}
        </div>
      </section>
      {showHint && !deeOpen && (<div ref={hintRef} onClick={() => setDeeOpen(true)} style={{ position: "fixed", bottom: 100, [side]: 20, background: "#fff", color: "#000", padding: "12px 16px", borderRadius: 16, fontSize: 14, fontWeight: 600, cursor: "pointer", zIndex: 99, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>💬 Need help? Chat with Dee →</div>)}
      {!deeOpen && (<button onClick={() => setDeeOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", fontSize: 28, cursor: "pointer", zIndex: 100 }}>🤖</button>)}
      {deeOpen && (<div style={{ position: "fixed", bottom: 20, right: 20, width: "min(380px,calc(100vw - 40px))", height: 520, background: "#14141f", border: "1px solid #333", borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 101 }}><div style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", padding: 16, display: "flex", gap: 12, alignItems: "center" }}><b style={{ flex: 1 }}>Dee – AI Assistant</b><button onClick={() => setDeeOpen(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer" }}>✕</button></div><div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>{deeChat.map((m, i) => (<div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#7c3aed" : "#1f1f2e", padding: "10px 14px", borderRadius: 14, maxWidth: "85%", fontSize: 14 }}>{m.text}</div>))}{deeLoading && <div style={{ color: "#aaa", fontSize: 13 }}>Dee is typing...</div>}</div><div style={{ padding: 12, display: "flex", gap: 8, borderTop: "1px solid #2a2a3a" }}><input value={deeMsg} onChange={e => setDeeMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendDee()} placeholder="Ask Dee..." style={{ flex: 1, background: "#0f0f18", border: "1px solid #333", color: "#fff", padding: "10px 14px", borderRadius: 12 }} /><button onClick={sendDee} style={{ background: "#7c3aed", border: "none", color: "#fff", padding: "10px 16px", borderRadius: 12, cursor: "pointer" }}>Send</button></div></div>)}
      {showJoin && (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}><div style={{ background: "#14141f", border: "1px solid #333", borderRadius: 20, padding: 24, width: "100%", maxWidth: 400 }}><h3>🚀 Join Nova</h3><input value={nName} onChange={e => setNName(e.target.value)} placeholder="Client Name" style={{ width: "100%", background: "#0f0f18", border: "1px solid #333", color: "#fff", padding: 12, borderRadius: 10, marginBottom: 10, boxSizing: "border-box" }} /><input value={nEmail} onChange={e => setNEmail(e.target.value)} placeholder="Email" style={{ width: "100%", background: "#0f0f18", border: "1px solid #333", color: "#fff", padding: 12, borderRadius: 10, marginBottom: 10, boxSizing: "border-box" }} /><input value={nAmount} onChange={e => setNAmount(e.target.value)} type="number" placeholder="Amount e.g. 5000" style={{ width: "100%", background: "#0f0f18", border: "1px solid #333", color: "#fff", padding: 12, borderRadius: 10, marginBottom: 16, boxSizing: "border-box" }} /><button onClick={join} style={{ width: "100%", background: "#7c3aed", color: "#fff", border: "none", padding: 14, borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Join Nova →</button><button onClick={() => setShowJoin(false)} style={{ width: "100%", background: "transparent", color: "#aaa", border: "none", padding: 12, cursor: "pointer" }}>Cancel</button></div></div>)}
    </main>
  );
                                                                                                 }
