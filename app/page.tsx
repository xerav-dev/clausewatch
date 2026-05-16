"use client";
import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   CLAUSEWATCH v2 — Enterprise AI Legal Decision Agent
   ═══════════════════════════════════════════════════════════════════════════ */

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --navy:      #060B17;
      --navy-2:    #0A1020;
      --navy-3:    #0E1628;
      --navy-4:    #131E35;
      --navy-5:    #192540;
      --border:    #1A2840;
      --border-2:  #223060;
      --cyan:      #00C8F0;
      --cyan-dim:  rgba(0,200,240,.15);
      --red:       #FF3550;
      --red-glow:  rgba(255,53,80,.2);
      --red-dim:   rgba(255,53,80,.08);
      --amber:     #FFB020;
      --amber-dim: rgba(255,176,32,.08);
      --green:     #00D48A;
      --green-dim: rgba(0,212,138,.08);
      --violet:    #7C5CFC;
      --violet-dim:rgba(124,92,252,.1);
      --slate:     #3A5070;
      --text-1:    #E2E8F4;
      --text-2:    #7A8FA8;
      --text-3:    #3A506A;
      --mono: 'IBM Plex Mono', monospace;
      --serif: 'Playfair Display', serif;
      --sans: 'DM Sans', sans-serif;
    }

    html, body { background: var(--navy); color: var(--text-1); font-family: var(--sans); }

    ::-webkit-scrollbar { width: 3px; height: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 2px; }

    @keyframes fadeUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes slideIn   { from{transform:translateX(100%);opacity:0} to{transform:none;opacity:1} }
    @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes pulse     { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
    @keyframes ring-out  { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
    @keyframes ticker    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    @keyframes bar-fill  { from{width:0} to{width:var(--w,0%)} }
    @keyframes count-in  { from{opacity:0;transform:scale(.6)} to{opacity:1;transform:scale(1)} }
    @keyframes grid-breathe { 0%,100%{opacity:.035} 50%{opacity:.065} }
    @keyframes alert-in  { 0%{transform:scale(.8) translateY(20px);opacity:0} 60%{transform:scale(1.03)} 100%{transform:scale(1);opacity:1} }
    @keyframes exposure-spike { 0%{color:var(--text-1)} 30%{color:var(--red);text-shadow:0 0 20px var(--red)} 100%{color:var(--red)} }
    @keyframes border-alarm { 0%,100%{border-color:rgba(255,53,80,.3)} 50%{border-color:rgba(255,53,80,.9)} }
    @keyframes scan { 0%{top:-4px} 100%{top:100%} }
  `}</style>
);

/* ─── Demo contract ──────────────────────────────────────────────────────────── */
const DEMO_CONTRACT = `MASTER SERVICES AGREEMENT — ENTERPRISE TECHNOLOGY SERVICES

Effective Date: March 1, 2025
Parties: NovaTech Systems LLC ("Vendor") and GlobalEnterprises Corp ("Client")

1. SERVICES & DELIVERABLES
Vendor shall deliver custom enterprise software development, cloud infrastructure management, 
and 24/7 technical support as described in Statements of Work. Client acknowledges that all 
delivery timelines are estimates only and carry no binding commitment.

2. PAYMENT TERMS
Client shall remit full payment within net-90 days of invoice date. Disputed invoices must 
be raised in writing within 5 business days or are deemed accepted. Interest accrues at 
3% per month on overdue balances. Vendor may suspend all services after 30 days overdue 
without liability and may accelerate all remaining contract value immediately.

3. LIMITATION OF LIABILITY
VENDOR'S AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED FIFTEEN THOUSAND DOLLARS 
($15,000) REGARDLESS OF THE NATURE OF THE CLAIM, INCLUDING NEGLIGENCE, BREACH OF CONTRACT, 
OR ANY OTHER LEGAL THEORY. CLIENT WAIVES ALL RIGHTS TO CONSEQUENTIAL, INDIRECT, PUNITIVE, 
OR EXEMPLARY DAMAGES. THIS CAP APPLIES EVEN IF VENDOR HAS BEEN ADVISED OF THE POSSIBILITY 
OF SUCH DAMAGES AND EVEN IF THE REMEDY FAILS OF ITS ESSENTIAL PURPOSE.

4. INTELLECTUAL PROPERTY & OWNERSHIP
All work product, source code, algorithms, methodologies, tools, frameworks, and derivative 
works developed under this Agreement shall remain the sole and exclusive intellectual property 
of Vendor. Client receives a non-exclusive, non-sublicensable, non-transferable license to 
use deliverables solely during the active term of this Agreement. Upon termination for any 
reason, all licenses immediately cease and Client must destroy all copies of deliverables.

5. CONFIDENTIALITY
Confidentiality obligations shall survive termination for a period of twelve (12) months only. 
Vendor reserves the right to reference Client's name and engagement scope in Vendor's marketing 
materials, case studies, and public announcements without further consent.

6. DATA HANDLING & SECURITY
Vendor will implement "commercially reasonable" security measures for Client data. In the event 
of a data breach, Vendor shall notify Client within 72 hours of Vendor becoming aware. Client 
assumes full responsibility for the accuracy and legality of all data provided. Vendor makes no 
representations regarding compliance with any specific data protection regulations.

7. INDEMNIFICATION
Client shall indemnify and hold harmless Vendor from any third-party claims arising from 
Client's use of the deliverables. Vendor's indemnification obligations are limited to direct 
infringement claims only and capped at $5,000 in aggregate.

8. TERMINATION
Either party may terminate for convenience on 90 days written notice. Upon Client-initiated 
termination, Client shall pay all fees for the remaining contract term as a termination penalty. 
Vendor may terminate immediately for any material breach with no cure period.

9. WARRANTIES
VENDOR EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, RELIABILITY, AND NON-INFRINGEMENT. 
SERVICES ARE PROVIDED STRICTLY "AS IS" WITH NO PERFORMANCE GUARANTEES.

10. DISPUTE RESOLUTION
All disputes shall be resolved exclusively through binding arbitration under AAA rules in 
Vendor's home jurisdiction. Each party bears its own legal costs regardless of outcome. 
Class action waiver applies. Injunctive relief is expressly waived.

11. GOVERNING LAW
This Agreement is governed by the laws of the State of Delaware, USA.

12. AMENDMENTS
Vendor reserves the right to amend these terms with 14 days written notice to Client. 
Continued use of services constitutes acceptance of amended terms.`;

/* ─── Enterprise Policy Rules ────────────────────────────────────────────────── */
const ENTERPRISE_POLICIES = [
  { id:"p1",  rule:"Liability cap must equal minimum 12 months contract value", category:"financial"      },
  { id:"p2",  rule:"IP ownership of custom work must transfer to Client",        category:"ip"             },
  { id:"p3",  rule:"Confidentiality period minimum 3 years post-termination",   category:"confidentiality"},
  { id:"p4",  rule:"Data breach notification within 48 hours required",          category:"data"           },
  { id:"p5",  rule:"GDPR/CCPA compliance clause mandatory for all vendors",      category:"data"           },
  { id:"p6",  rule:"Vendor marketing use requires explicit written consent",      category:"confidentiality"},
  { id:"p7",  rule:"Termination for convenience: 30-day notice maximum",         category:"termination"    },
  { id:"p8",  rule:"Payment terms not to exceed net-45 days",                    category:"financial"      },
  { id:"p9",  rule:"Warranty disclaimer must be reviewed by General Counsel",     category:"warranties"     },
  { id:"p10", rule:"Arbitration clause requires Legal VP approval",              category:"dispute"        },
  { id:"p11", rule:"Force majeure clause required for all enterprise contracts",  category:"operations"     },
  { id:"p12", rule:"SLA with uptime guarantees required for technology services", category:"operations"     },
];

/* ─── Design tokens ──────────────────────────────────────────────────────────── */
const MONO  = "'IBM Plex Mono', monospace";
const SERIF = "'Playfair Display', serif";
const SANS  = "'DM Sans', sans-serif";

const CLAUSE_LABELS: Record<string,string> = {
  liability:"Limitation of Liability", termination:"Termination",
  ip_ownership:"IP Ownership",         payment:"Payment Terms",
  governing_law:"Governing Law",       dispute_resolution:"Dispute Resolution",
  indemnification:"Indemnification",   confidentiality:"Confidentiality",
  warranties:"Warranties",             sla:"Service Level Agreement",
  data_privacy:"Data Privacy",         force_majeure:"Force Majeure",
  assignment:"Assignment",             amendment:"Amendment Rights",
};

const riskC = (l: string) => ({
  high:   { bg:"rgba(255,53,80,.1)",  border:"#FF3550", text:"#FF3550" },
  medium: { bg:"rgba(255,176,32,.08)",border:"#FFB020", text:"#FFB020" },
  low:    { bg:"rgba(0,212,138,.07)", border:"#00D48A", text:"#00D48A" },
}[l] ?? { bg:"rgba(58,80,112,.12)", border:"#3A5070", text:"#7A8FA8" });

const DECISION_CONFIG: Record<string,{color:string;glow:string;icon:string;label:string}> = {
  APPROVE:     { color:"#00D48A", glow:"rgba(0,212,138,.3)",  icon:"✓", label:"APPROVED FOR SIGNATURE" },
  REVIEW:      { color:"#FFB020", glow:"rgba(255,176,32,.3)", icon:"◐", label:"REQUIRES LEGAL REVIEW"  },
  RENEGOTIATE: { color:"#FF7A00", glow:"rgba(255,122,0,.3)",  icon:"↺", label:"RENEGOTIATE TERMS"      },
  REJECT:      { color:"#FF3550", glow:"rgba(255,53,80,.35)", icon:"✕", label:"REJECT CONTRACT"        },
};

/* ═══════════════════════════════════════════════════════════════════════════
   API LAYER
   Single function. Accepts either a File (PDF upload) or plain text (demo).
   Always calls /api/analyze — never calls any AI API directly from the browser.
   ═══════════════════════════════════════════════════════════════════════════ */
async function analyzeContract(input: { file: File } | { text: string }): Promise<any> {
  let res: Response;

  if ("file" in input) {
    // ── Real PDF upload ──────────────────────────────────────────────────────
    const formData = new FormData();
    formData.append("file", input.file);
    res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
      // NOTE: Do NOT set Content-Type header manually with FormData.
      //       The browser sets it automatically with the correct multipart boundary.
    });
  } else {
    // ── Demo text (JSON) ─────────────────────────────────────────────────────
    res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input.text }),
    });
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? `Server error ${res.status}`);
  }

  // Backend returns { success: true, analysis: {...} }
  // Gracefully handle if backend returns analysis at root level
  return data.analysis ?? data;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED UI PRIMITIVES
   ═══════════════════════════════════════════════════════════════════════════ */

function GridBg() {
  return (
    <div style={{
      position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
      backgroundImage:`linear-gradient(var(--border) 1px,transparent 1px),
                       linear-gradient(90deg,var(--border) 1px,transparent 1px)`,
      backgroundSize:"52px 52px",
      animation:"grid-breathe 6s ease-in-out infinite",
      maskImage:"radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)",
    }}/>
  );
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{
        width:small?26:32, height:small?26:32,
        border:"1.5px solid var(--cyan)", borderRadius:5,
        background:"rgba(0,200,240,.06)",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 0 12px rgba(0,200,240,.2)",
      }}>
        <span style={{ fontSize:small?13:16 }}>⚖</span>
      </div>
      <div>
        <div style={{ fontFamily:SERIF, fontSize:small?14:17, fontWeight:700, letterSpacing:".5px" }}>
          CLAUSE<span style={{ color:"var(--cyan)" }}>WATCH</span>
        </div>
        <div style={{ fontFamily:MONO, fontSize:8, color:"var(--text-3)", letterSpacing:"2px", lineHeight:1 }}>
          {small ? "AGENT v2.1" : "ENTERPRISE AI AGENT · v2.1"}
        </div>
      </div>
    </div>
  );
}

function Tag({ children, color="var(--cyan)" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontFamily:MONO, fontSize:9, letterSpacing:"2px", color,
      background:`${color}14`, border:`1px solid ${color}40`,
      borderRadius:3, padding:"3px 8px", textTransform:"uppercase",
    }}>{children}</span>
  );
}

function ScoreArc({ score = 0, size = 64, label = "" }: { score?: number; size?: number; label?: string }) {
  const r      = size / 2 - 6;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const col    = score >= 70 ? "#FF3550" : score >= 40 ? "#FFB020" : "#00D48A";
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--navy-5)" strokeWidth={5}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 1s ease" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center", gap:1 }}>
        <span style={{ fontFamily:MONO, fontSize:size > 50 ? 12 : 10, fontWeight:600, color:col }}>{score}</span>
        {label && <span style={{ fontFamily:MONO, fontSize:7, color:"var(--text-3)", letterSpacing:"1px" }}>{label}</span>}
      </div>
    </div>
  );
}

function Bar({ value = 0, max = 100, color = "var(--cyan)", height = 4 }:
             { value?: number; max?: number; color?: string; height?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ width:"100%", height, background:"var(--navy-5)", borderRadius:height/2, overflow:"hidden" }}>
      <div style={{
        height:"100%",
        width:`${pct}%`,
        background:color,
        borderRadius:height/2,
        transition:"width .8s ease",
      }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCREEN 1 — LANDING
   Props: onUpload(file: File) and onDemo()
   Landing owns ONLY local drag state. All app-level state lives in the root.
   ═══════════════════════════════════════════════════════════════════════════ */
function Landing({ onUpload, onDemo }: { onUpload: (f: File) => void; onDemo: () => void }) {
  const [drag, setDrag] = useState(false);
  const fileInputRef    = useRef<HTMLInputElement>(null);

  // Validates and hands the file UP to the root via the onUpload callback.
  // Landing never touches analysis state — that belongs to the root.
  function handleFile(f: File | null | undefined) {
    if (!f) return;
    if (f.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    onUpload(f); // ← hands control to root; Landing is done
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  const ticks = [
    "CONTRACT ANALYZED","IP RISK FLAGGED","POLICY VIOLATION DETECTED","EXPOSURE: $2.4M",
    "VENDOR TERMS REJECTED","RENEGOTIATION ADVISED","AGENT DECISION: RENEGOTIATE","MISSING: FORCE MAJEURE",
  ];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
      <GridBg/>

      {/* Ambient glow */}
      <div style={{
        position:"absolute", top:-100, left:"50%", transform:"translateX(-50%)",
        width:700, height:500,
        background:"radial-gradient(ellipse, rgba(0,200,240,.08) 0%, transparent 65%)",
        pointerEvents:"none",
      }}/>

      {/* Live ticker */}
      <div style={{ background:"var(--navy-2)", borderBottom:"1px solid var(--border)",
                    padding:"7px 0", overflow:"hidden", position:"relative", zIndex:20 }}>
        <div style={{ display:"flex", gap:60, animation:"ticker 22s linear infinite", width:"max-content" }}>
          {[...ticks, ...ticks].map((t, i) => (
            <span key={i} style={{
              fontFamily:MONO, fontSize:10, letterSpacing:"2px", whiteSpace:"nowrap",
              color: i % 3 === 0 ? "var(--red)" : i % 3 === 1 ? "var(--amber)" : "var(--text-3)",
            }}>
              <span style={{ color:"var(--text-3)", marginRight:20 }}>◆</span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"18px 44px", borderBottom:"1px solid var(--border)",
        background:"rgba(6,11,23,.8)", backdropFilter:"blur(16px)",
        position:"relative", zIndex:10,
      }}>
        <Logo/>
        <div style={{ display:"flex", alignItems:"center", gap:24 }}>
          <div style={{ display:"flex", gap:4 }}>
            {["Platform","Integrations","Security","Pricing"].map(l => (
              <button key={l} style={{ background:"none", border:"none", color:"var(--text-3)",
                fontFamily:SANS, fontSize:13, cursor:"pointer", padding:"6px 12px", borderRadius:6 }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
              >{l}</button>
            ))}
          </div>
          <div style={{ width:1, height:20, background:"var(--border)" }}/>
          <button
            onClick={onDemo}
            style={{
              background:"linear-gradient(135deg, var(--cyan), #0090B0)",
              color:"var(--navy)", border:"none",
              fontFamily:MONO, fontSize:10, fontWeight:600, letterSpacing:"2px",
              padding:"9px 20px", borderRadius:6, cursor:"pointer",
              boxShadow:"0 0 20px rgba(0,200,240,.25)", transition:"all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow="0 0 32px rgba(0,200,240,.5)"; e.currentTarget.style.transform="translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow="0 0 20px rgba(0,200,240,.25)"; e.currentTarget.style.transform="none"; }}
          >LIVE DEMO →</button>
        </div>
      </nav>

      {/* Hero */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
                     justifyContent:"center", padding:"48px 40px", position:"relative", zIndex:5 }}>

        <div style={{ animation:"fadeUp .5s ease both", marginBottom:24, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--cyan)", animation:"blink 1.6s infinite" }}/>
          <span style={{ fontFamily:MONO, fontSize:10, color:"var(--cyan)", letterSpacing:"3px" }}>
            AI LEGAL OPERATIONS AGENT · ENTERPRISE EDITION
          </span>
        </div>

        <h1 style={{
          fontFamily:SERIF, fontSize:"clamp(36px,5.5vw,68px)", fontWeight:700,
          textAlign:"center", lineHeight:1.05, marginBottom:16, maxWidth:760,
          animation:"fadeUp .5s .08s ease both", opacity:0,
        }}>
          Your AI Contract<br/>
          <span style={{ color:"var(--cyan)", position:"relative" }}>
            Review Agent
            <span style={{ position:"absolute", bottom:-4, left:0, right:0, height:2,
                           background:"linear-gradient(90deg, var(--cyan), transparent)", borderRadius:2 }}/>
          </span>
          {" "}is Ready.
        </h1>

        <p style={{
          fontFamily:SANS, fontSize:16, color:"var(--text-2)", textAlign:"center",
          maxWidth:540, lineHeight:1.8, marginBottom:44,
          animation:"fadeUp .5s .16s ease both", opacity:0,
        }}>
          Drop any enterprise contract. The agent autonomously reviews every clause,
          validates against your policy framework, calculates financial exposure,
          and delivers an executive decision — in 60 seconds.
        </p>

        {/* Upload zone */}
        <div style={{ width:"100%", maxWidth:580, animation:"fadeUp .5s .24s ease both", opacity:0 }}>
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding:"44px 36px",
              border:`2px dashed ${drag ? "var(--cyan)" : "var(--border-2)"}`,
              borderRadius:12,
              background: drag ? "rgba(0,200,240,.04)" : "rgba(10,16,32,.7)",
              cursor:"pointer", textAlign:"center",
              backdropFilter:"blur(12px)",
              boxShadow: drag ? "0 0 48px rgba(0,200,240,.12)" : "none",
              transition:"all .2s ease",
              position:"relative", overflow:"hidden",
            }}
          >
            {drag && (
              <div style={{
                position:"absolute", top:"-4px", left:0, right:0, height:"3px",
                background:"linear-gradient(90deg,transparent,var(--cyan),transparent)",
                animation:"scan 1.2s linear infinite",
              }}/>
            )}

            {/* Hidden file input — browser file picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display:"none" }}
              onChange={e => handleFile(e.target.files?.[0])}
            />

            <div style={{ fontSize:40, marginBottom:12 }}>{drag ? "⬇" : "📋"}</div>
            <div style={{ fontFamily:SANS, fontSize:16, fontWeight:600, color:"var(--text-1)", marginBottom:8 }}>
              {drag ? "Release to begin agent review" : "Deploy agent on your contract"}
            </div>
            <div style={{ fontFamily:MONO, fontSize:10, color:"var(--text-3)", marginBottom:24, letterSpacing:"1px" }}>
              NDA · MSA · SOW · EMPLOYMENT · VENDOR · SaaS
            </div>
            <div style={{ display:"flex", justifyContent:"center", gap:24, flexWrap:"wrap" }}>
              {[["■","SOC 2 TYPE II","var(--green)"],["■","AES-256 ENCRYPTED","var(--green)"],["■","NO DATA RETAINED","var(--cyan)"]].map(([icon,txt,col]) => (
                <div key={txt} style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)", letterSpacing:"1.5px", display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ color:col }}>{icon}</span>{txt}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:16, justifyContent:"center" }}>
            <div style={{ flex:1, height:1, background:"var(--border)" }}/>
            <span style={{ fontFamily:MONO, fontSize:10, color:"var(--text-3)" }}>OR</span>
            <div style={{ flex:1, height:1, background:"var(--border)" }}/>
          </div>

          <button
            onClick={onDemo}
            style={{
              width:"100%", marginTop:16, padding:"14px",
              background:"var(--navy-3)", border:"1px solid var(--border-2)",
              borderRadius:10, cursor:"pointer",
              fontFamily:MONO, fontSize:11, color:"var(--cyan)", letterSpacing:"2px",
              transition:"all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="var(--cyan)"; e.currentTarget.style.background="rgba(0,200,240,.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border-2)"; e.currentTarget.style.background="var(--navy-3)"; }}
          >▶ RUN DEMO — TechCorp Enterprise MSA (High-Risk)</button>
        </div>

        {/* Stats row */}
        <div style={{
          display:"flex", gap:40, marginTop:52, paddingTop:40,
          borderTop:"1px solid var(--border)",
          animation:"fadeUp .5s .32s ease both", opacity:0,
        }}>
          {[["60s","Agent review time"],["$50B","CLM market addressed"],["23+","Clause types detected"],["4","Decision verdicts"]].map(([n,l]) => (
            <div key={n} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:SERIF, fontSize:26, color:"var(--cyan)", fontWeight:700 }}>{n}</div>
              <div style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)", letterSpacing:"1.5px", marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCREEN 2 — AGENT PROCESSING
   Pure UI theater. Runs independently while the real API call happens in root.
   ═══════════════════════════════════════════════════════════════════════════ */
function AgentProcessing({ filename }: { filename: string }) {
  const [logs, setLogs]               = useState<{ text:string; ts:number; alert:boolean }[]>([]);
  const [stage, setStage]             = useState(0);
  const [pct, setPct]                 = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const logRef                        = useRef<HTMLDivElement>(null);

  const STAGES = [
    { label:"DOCUMENT PARSING",             color:"var(--cyan)"   },
    { label:"OBLIGATION MAPPING",           color:"var(--cyan)"   },
    { label:"LIABILITY EXPOSURE ANALYSIS",  color:"var(--amber)"  },
    { label:"ENTERPRISE POLICY VALIDATION", color:"var(--amber)"  },
    { label:"MISSING PROTECTION SCAN",      color:"var(--red)"    },
    { label:"BENCHMARK COMPARISON",         color:"var(--cyan)"   },
    { label:"NEGOTIATION STRATEGY SYNTHESIS",color:"var(--violet)"},
    { label:"EXECUTIVE DECISION GENERATION",color:"var(--green)"  },
  ];

  const LOG_SEQUENCES = [
    ["Parsing PDF structure…","14 pages detected","Text extraction: 99.2% fidelity","Clause boundary detection active"],
    ["Scanning obligation vectors…","23 potential clauses identified","Cross-referencing obligation types","Obligation graph: complete"],
    ["⚠ HIGH EXPOSURE DETECTED — LIABILITY CAP: $15,000","Calculating enterprise risk delta…","Projected exposure: $8.2M","Risk escalation flag: CRITICAL"],
    ["Loading enterprise policy framework…","Checking 12 procurement rules…","VIOLATION: Liability cap below minimum","VIOLATION: IP ownership non-transferable","VIOLATION: Confidentiality period insufficient"],
    ["Scanning for force majeure… ✕ NOT FOUND","Scanning for SLA guarantees… ✕ NOT FOUND","Scanning for data privacy clause… ⚠ DEFICIENT","Missing clause severity: HIGH"],
    ["Benchmarking against 10,000+ enterprise MSAs…","Liability clause: worse than 94% of market","IP clause: worse than 88% of market","Overall contract: bottom 8 percentile"],
    ["Generating clause counter-positions…","Drafting negotiation alternatives…","Calculating leverage severity…","Negotiation brief: complete"],
    ["Running final decision algorithm…","Weighing 23 risk factors…","Agent verdict: RENEGOTIATE","Generating executive intelligence brief…"],
  ];

  useEffect(() => {
    let s = 0, l = 0, pctVal = 0;

    const pctInterval   = setInterval(() => { pctVal = Math.min(pctVal + Math.random() * 2.2, 97); setPct(Math.round(pctVal)); }, 180);
    const stageInterval = setInterval(() => { if (s < STAGES.length) { setStage(s); s++; } }, 1700);
    const logInterval   = setInterval(() => {
      const seq   = LOG_SEQUENCES[Math.min(Math.floor(l / 4), LOG_SEQUENCES.length - 1)];
      const entry = seq[l % seq.length];
      const isAlert = entry.startsWith("⚠");
      setLogs(prev => [...prev.slice(-24), { text:entry, ts:Date.now(), alert:isAlert }]);
      if (isAlert) setAlertVisible(true);
      l++;
    }, 520);

    return () => { clearInterval(pctInterval); clearInterval(stageInterval); clearInterval(logInterval); };
  }, []);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [logs]);

  const cur = STAGES[Math.min(stage, STAGES.length - 1)];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--navy)", position:"relative", overflow:"hidden" }}>
      <GridBg/>

      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"14px 28px", borderBottom:"1px solid var(--border)",
                    background:"rgba(6,11,23,.9)", zIndex:10, position:"relative" }}>
        <Logo small/>
        <Tag color="var(--amber)">AGENT ACTIVE</Tag>
        <div style={{ fontFamily:MONO, fontSize:10, color:"var(--text-3)" }}>{filename}</div>
      </div>

      <div style={{ flex:1, display:"flex", overflow:"hidden", position:"relative", zIndex:5 }}>

        {/* LEFT: Stage pipeline */}
        <div style={{ width:320, borderRight:"1px solid var(--border)",
                      padding:"28px 24px", display:"flex", flexDirection:"column", gap:8,
                      background:"rgba(10,16,32,.5)" }}>
          <div style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)", letterSpacing:"2px", marginBottom:12 }}>AGENT PIPELINE</div>
          {STAGES.map((st, i) => {
            const done   = i < stage;
            const active = i === stage;
            return (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:8,
                background: active?"rgba(0,200,240,.06)":done?"rgba(0,212,138,.04)":"transparent",
                border:`1px solid ${active?"rgba(0,200,240,.3)":done?"rgba(0,212,138,.2)":"transparent"}`,
                transition:"all .3s ease",
                opacity: i > stage + 1 ? .3 : 1,
              }}>
                <div style={{
                  width:22, height:22, borderRadius:"50%", flexShrink:0,
                  border:`1.5px solid ${active?st.color:done?"var(--green)":"var(--border-2)"}`,
                  background: done?"rgba(0,212,138,.1)":active?`${st.color}18`:"transparent",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:10,
                }}>
                  {done
                    ? <span style={{ color:"var(--green)", fontSize:11 }}>✓</span>
                    : active
                      ? <div style={{ width:6, height:6, borderRadius:"50%", background:st.color, animation:"pulse 1s infinite" }}/>
                      : null}
                </div>
                <div style={{ fontFamily:MONO, fontSize:9, letterSpacing:"1.5px",
                              color:active?st.color:done?"var(--green)":"var(--text-3)" }}>{st.label}</div>
              </div>
            );
          })}
        </div>

        {/* CENTER: Main display */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"28px 32px" }}>

          {/* Agent status card */}
          <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:32,
                        background:"var(--navy-3)", border:"1px solid var(--border)",
                        borderRadius:10, padding:"18px 24px" }}>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", inset:-8, borderRadius:"50%",
                            border:`1.5px solid ${cur.color}`, animation:"ring-out 1.8s ease-out infinite" }}/>
              <div style={{ width:48, height:48, borderRadius:"50%", border:`2px solid ${cur.color}`,
                            background:`${cur.color}12`, display:"flex", alignItems:"center",
                            justifyContent:"center", fontSize:20 }}>⚙</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:MONO, fontSize:10, color:"var(--text-3)", letterSpacing:"2px", marginBottom:4 }}>CURRENT OPERATION</div>
              <div style={{ fontFamily:SERIF, fontSize:18, fontWeight:600, color:cur.color }}>{cur.label}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:SERIF, fontSize:36, fontWeight:700 }}>
                {pct}<span style={{ fontSize:16, color:"var(--text-3)" }}>%</span>
              </div>
              <div style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)", letterSpacing:"1px" }}>COMPLETE</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom:32 }}>
            <div style={{ height:4, background:"var(--navy-5)", borderRadius:2, overflow:"hidden", position:"relative" }}>
              <div style={{ height:"100%", width:`${pct}%`, borderRadius:2,
                            background:"linear-gradient(90deg, var(--cyan-dim), var(--cyan))",
                            transition:"width .3s ease", position:"relative" }}>
                <div style={{ position:"absolute", right:0, top:-2, width:8, height:8, borderRadius:"50%",
                              background:"var(--cyan)", boxShadow:"0 0 10px var(--cyan)" }}/>
              </div>
            </div>
          </div>

          {/* Alert banner — WOW MOMENT */}
          {alertVisible && (
            <div style={{
              background:"linear-gradient(135deg, rgba(255,53,80,.12), rgba(255,53,80,.06))",
              border:"1px solid rgba(255,53,80,.5)",
              borderRadius:10, padding:"16px 20px", marginBottom:24,
              animation:"alert-in .4s ease both, border-alarm 1.5s ease-in-out 3",
              display:"flex", alignItems:"center", gap:16,
            }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"var(--red-dim)",
                            border:"1.5px solid var(--red)", display:"flex", alignItems:"center",
                            justifyContent:"center", fontSize:16, flexShrink:0 }}>⚠</div>
              <div>
                <div style={{ fontFamily:MONO, fontSize:10, color:"var(--red)", letterSpacing:"2px", marginBottom:4 }}>
                  CRITICAL RISK DETECTED — AGENT ESCALATION TRIGGERED
                </div>
                <div style={{ fontFamily:SANS, fontSize:12, color:"var(--text-2)" }}>
                  Liability cap of <strong style={{ color:"var(--red)" }}>$15,000</strong> identified against estimated contract exposure
                  of <strong style={{ color:"var(--red)", animation:"exposure-spike 1.5s ease both" }}>$8.2M</strong>.
                  Agent has flagged for immediate legal review.
                </div>
              </div>
              <div style={{ marginLeft:"auto", fontFamily:MONO, fontSize:9, color:"var(--red)",
                            letterSpacing:"1px", flexShrink:0 }}>ESCALATED →</div>
            </div>
          )}

          {/* Agent reasoning log */}
          <div style={{ flex:1, background:"var(--navy-2)", border:"1px solid var(--border)",
                        borderRadius:10, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"10px 16px", borderBottom:"1px solid var(--border)",
                          display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--green)", animation:"blink 1s infinite" }}/>
              <span style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)", letterSpacing:"2px" }}>AGENT REASONING LOG</span>
            </div>
            <div ref={logRef} style={{ flex:1, overflow:"auto", padding:"12px 16px",
                                       display:"flex", flexDirection:"column", gap:4 }}>
              {logs.map((entry, i) => (
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start",
                                      animation:"fadeIn .2s ease", padding:"3px 0" }}>
                  <span style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)", flexShrink:0, marginTop:1 }}>
                    {new Date(entry.ts).toLocaleTimeString("en",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"})}
                  </span>
                  <span style={{
                    fontFamily:MONO, fontSize:10, lineHeight:1.5,
                    color: entry.alert ? "var(--red)"
                          : entry.text.includes("✕") ? "var(--amber)"
                          : entry.text.includes("✓") ? "var(--green)"
                          : "var(--text-2)",
                  }}>{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCREEN 3 — DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */
function Dashboard({ analysis, filename, onReset }:
                   { analysis: any; filename: string; onReset: () => void }) {
  const [activeClause, setActiveClause]       = useState<any>(null);
  const [view, setView]                       = useState<"clauses"|"ops"|"decision">("clauses");
  const [showDecisionModal, setShowDecisionModal] = useState(true);

  const { clauses = [], missingClauses = [], decision = {} } = analysis;
  const high = clauses.filter((c: any) => c.riskLevel === "high");
  const med  = clauses.filter((c: any) => c.riskLevel === "medium");
  const low  = clauses.filter((c: any) => c.riskLevel === "low");

  const dc = DECISION_CONFIG[decision.verdict] ?? DECISION_CONFIG.REVIEW;

  const violations = ENTERPRISE_POLICIES.map(p => {
    const violated =
      decision.policyViolations?.some((v: string) =>
        v.toLowerCase().includes(p.category) ||
        v.toLowerCase().includes(p.rule.toLowerCase().split(" ").slice(0,3).join(" "))
      ) ||
      (p.category === "financial"      && (high.some((c:any) => c.clauseType==="liability") || high.some((c:any) => c.clauseType==="payment"))) ||
      (p.category === "ip"             && high.some((c:any) => c.clauseType==="ip_ownership")) ||
      (p.category === "data"           && (missingClauses.some((m:any) => m.clauseType==="data_privacy") || high.some((c:any) => c.clauseType==="data_privacy"))) ||
      (p.category === "operations"     && missingClauses.some((m:any) => m.clauseType==="sla" || m.clauseType==="force_majeure")) ||
      (p.category === "termination"    && high.some((c:any) => c.clauseType==="termination")) ||
      (p.category === "confidentiality"&& (high.some((c:any) => c.clauseType==="confidentiality") || med.some((c:any) => c.clauseType==="confidentiality")));
    return { ...p, violated };
  });
  const violatedCount = violations.filter(v => v.violated).length;
  const passedCount   = violations.length - violatedCount;

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--navy)" }}>

      {/* Decision Modal — WOW MOMENT */}
      {showDecisionModal && (
        <div
          style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(6,11,23,.92)",
                   backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={() => setShowDecisionModal(false)}
        >
          <div
            style={{
              background:"var(--navy-2)", border:`1.5px solid ${dc.color}`,
              borderRadius:16, padding:"48px 56px", maxWidth:560,
              textAlign:"center", position:"relative", overflow:"hidden",
              animation:"alert-in .5s ease both",
              boxShadow:`0 0 80px ${dc.glow}, 0 0 20px ${dc.glow}`,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position:"absolute", top:-100, left:"50%", transform:"translateX(-50%)",
                          width:400, height:300,
                          background:`radial-gradient(ellipse, ${dc.glow} 0%, transparent 70%)`,
                          pointerEvents:"none" }}/>

            <div style={{ position:"relative" }}>
              <div style={{ fontFamily:MONO, fontSize:10, color:"var(--text-3)", letterSpacing:"3px", marginBottom:24 }}>
                AGENT DECISION · CLAUSEWATCH v2.1
              </div>

              <div style={{
                width:100, height:100, borderRadius:"50%", border:`3px solid ${dc.color}`,
                background:`${dc.color}12`, margin:"0 auto 24px",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:40, color:dc.color, boxShadow:`0 0 30px ${dc.glow}`,
              }}>{dc.icon}</div>

              <div style={{ fontFamily:MONO, fontSize:11, letterSpacing:"4px", color:dc.color, marginBottom:8 }}>
                {decision.verdict}
              </div>
              <div style={{ fontFamily:SERIF, fontSize:26, fontWeight:700, marginBottom:24, lineHeight:1.2 }}>
                {dc.label}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:28 }}>
                {([
                  ["EXPOSURE",   decision.estimatedTotalExposure ?? "N/A", "var(--red)"],
                  ["CONFIDENCE", `${decision.confidenceScore ?? 0}%`,      "var(--cyan)"],
                  ["HEALTH",     `${decision.contractHealthScore ?? 0}`,    "var(--amber)"],
                ] as const).map(([l, v, c]) => (
                  <div key={l} style={{ background:"var(--navy-4)", border:"1px solid var(--border)",
                                        borderRadius:8, padding:"10px 6px" }}>
                    <div style={{ fontFamily:MONO, fontSize:7, color:"var(--text-3)", letterSpacing:"1.5px", marginBottom:4 }}>{l}</div>
                    <div style={{ fontFamily:SERIF, fontSize:16, fontWeight:700, color:c }}>{v}</div>
                  </div>
                ))}
              </div>

              <p style={{
                fontFamily:SANS, fontSize:12, color:"var(--text-2)", lineHeight:1.7,
                marginBottom:28, textAlign:"left",
                background:"var(--navy-4)", border:"1px solid var(--border)",
                borderRadius:8, padding:"14px 16px", fontStyle:"italic",
              }}>"{decision.reasoning}"</p>

              {decision.urgency === "IMMEDIATE" && (
                <div style={{ background:"var(--red-dim)", border:"1px solid rgba(255,53,80,.4)",
                              borderRadius:6, padding:"8px 14px", marginBottom:20,
                              fontFamily:MONO, fontSize:10, color:"var(--red)", letterSpacing:"1.5px" }}>
                  ⚠ IMMEDIATE ACTION REQUIRED — DO NOT SIGN
                </div>
              )}

              <button
                onClick={() => setShowDecisionModal(false)}
                style={{
                  width:"100%", padding:"14px",
                  background:`linear-gradient(135deg, ${dc.color}22, ${dc.color}0a)`,
                  border:`1px solid ${dc.color}60`, borderRadius:8,
                  fontFamily:MONO, fontSize:11, color:dc.color, letterSpacing:"2px", cursor:"pointer",
                }}
              >VIEW FULL ANALYSIS →</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"14px 28px", borderBottom:"1px solid var(--border)",
        background:"rgba(6,11,23,.95)", backdropFilter:"blur(16px)",
        position:"sticky", top:0, zIndex:100, gap:16,
      }}>
        <Logo small/>

        <div style={{ display:"flex", alignItems:"center", gap:8, background:`${dc.color}12`,
                      border:`1px solid ${dc.color}50`, borderRadius:6, padding:"6px 14px", cursor:"pointer" }}
             onClick={() => setShowDecisionModal(true)}>
          <span style={{ color:dc.color, fontSize:12 }}>{dc.icon}</span>
          <span style={{ fontFamily:MONO, fontSize:10, color:dc.color, letterSpacing:"1.5px" }}>
            {decision.verdict ?? "REVIEW"}
          </span>
        </div>

        <div style={{ display:"flex", gap:2, background:"var(--navy-3)", borderRadius:8, padding:3, border:"1px solid var(--border)" }}>
          {([["clauses","CLAUSE ANALYSIS"],["ops","LEGAL OPS"],["decision","DECISION ENGINE"]] as const).map(([v,l]) => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view===v ? "var(--navy-5)" : "transparent",
              border: view===v ? "1px solid var(--border)" : "1px solid transparent",
              borderRadius:6, padding:"6px 14px",
              fontFamily:MONO, fontSize:9, letterSpacing:"1.5px",
              color: view===v ? "var(--text-1)" : "var(--text-3)",
              cursor:"pointer", transition:"all .2s",
            }}>{l}</button>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10, marginLeft:"auto" }}>
          <div style={{ fontFamily:MONO, fontSize:10, color:"var(--text-3)",
                        background:"var(--navy-3)", border:"1px solid var(--border)",
                        borderRadius:5, padding:"5px 12px" }}>{filename || "contract.pdf"}</div>
          <button onClick={onReset} style={{
            background:"none", border:"1px solid var(--border)", color:"var(--text-3)",
            fontFamily:MONO, fontSize:9, letterSpacing:"1.5px",
            padding:"7px 14px", borderRadius:6, cursor:"pointer", transition:"all .2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor="var(--cyan)"; e.currentTarget.style.color="var(--cyan)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-3)"; }}
          >← NEW</button>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex:1, overflow:"hidden", display:"flex" }}>
        {view === "clauses" && (
          <ClauseView clauses={clauses} missingClauses={missingClauses}
            decision={decision} high={high} med={med} low={low}
            activeClause={activeClause} setActiveClause={setActiveClause}/>
        )}
        {view === "ops" && (
          <LegalOpsPanel clauses={clauses} missingClauses={missingClauses}
            decision={decision} violations={violations}
            violatedCount={violatedCount} passedCount={passedCount}/>
        )}
        {view === "decision" && (
          <DecisionEngine decision={decision} dc={dc} clauses={clauses} missingClauses={missingClauses}/>
        )}
      </div>
    </div>
  );
}

/* ─── CLAUSE VIEW ─────────────────────────────────────────────────────────── */
function ClauseView({ clauses, missingClauses, decision, high, med, low, activeClause, setActiveClause }: any) {
  const [filter, setFilter] = useState("all");

  const filtered   = filter === "all" ? clauses : filter === "missing" ? [] : clauses.filter((c: any) => c.riskLevel === filter);
  const showMissing = filter === "all" || filter === "missing";

  return (
    <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
      <div style={{ flex:1, overflow:"auto", padding:"24px 28px", transition:"all .3s" }}>

        {/* Summary row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:24 }}>
          {[
            { label:"CONTRACT HEALTH", value:decision.contractHealthScore??0, type:"score" },
            { label:"HIGH RISK",  value:high.length,            color:"var(--red)",   filter:"high",   bg:"rgba(255,53,80,.06)",  border:"rgba(255,53,80,.2)"  },
            { label:"MEDIUM",     value:med.length,             color:"var(--amber)", filter:"medium", bg:"rgba(255,176,32,.06)", border:"rgba(255,176,32,.2)" },
            { label:"LOW RISK",   value:low.length,             color:"var(--green)", filter:"low",    bg:"rgba(0,212,138,.06)",  border:"rgba(0,212,138,.2)"  },
            { label:"MISSING",    value:missingClauses.length,  color:"var(--slate)", filter:"missing",bg:"rgba(58,80,112,.1)",   border:"rgba(58,80,112,.3)"  },
          ].map((item, i) => {
            if (item.type === "score") return (
              <div key={i} style={{ background:"var(--navy-3)", border:"1px solid var(--border)",
                                    borderRadius:10, padding:"16px", display:"flex", flexDirection:"column",
                                    alignItems:"center", gap:6, position:"relative", overflow:"hidden" }}>
                <div style={{ fontFamily:MONO, fontSize:8, color:"var(--text-3)", letterSpacing:"2px" }}>CONTRACT HEALTH</div>
                <ScoreArc score={item.value} size={56}/>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2,
                              background:"linear-gradient(90deg,var(--green),var(--amber),var(--red))", opacity:.5 }}/>
              </div>
            );
            return (
              <div key={i}
                onClick={() => setFilter(filter === item.filter ? "all" : item.filter!)}
                style={{
                  background: filter===item.filter ? item.bg : "var(--navy-3)",
                  border:`1px solid ${filter===item.filter ? item.border : "var(--border)"}`,
                  borderRadius:10, padding:"16px", cursor:"pointer",
                  transform: filter===item.filter ? "translateY(-2px)" : "none",
                  boxShadow: filter===item.filter ? `0 4px 20px ${item.color}18` : "none",
                  transition:"all .2s", display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                }}>
                <div style={{ fontFamily:MONO, fontSize:8, letterSpacing:"2px",
                              color: filter===item.filter ? item.color : "var(--text-3)" }}>{item.label}</div>
                <div style={{ fontFamily:SERIF, fontSize:30, fontWeight:700, color:item.color,
                              animation:"count-in .5s ease both" }}>{item.value}</div>
              </div>
            );
          })}
        </div>

        {/* Executive brief */}
        {decision.executiveNarrative && (
          <div style={{ background:"linear-gradient(135deg,rgba(0,200,240,.05),rgba(0,200,240,.02))",
                        border:"1px solid rgba(0,200,240,.2)", borderRadius:10,
                        padding:"18px 22px", marginBottom:24,
                        animation:"fadeUp .4s .1s ease both", opacity:0 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--cyan)", animation:"blink 2s infinite" }}/>
              <span style={{ fontFamily:MONO, fontSize:9, color:"var(--cyan)", letterSpacing:"2px" }}>EXECUTIVE INTELLIGENCE BRIEF</span>
            </div>
            <p style={{ fontFamily:SANS, fontSize:13, color:"var(--text-1)", lineHeight:1.8, fontStyle:"italic" }}>
              "{decision.executiveNarrative}"
            </p>
          </div>
        )}

        {/* Filter bar */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <span style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)", letterSpacing:"2px" }}>CLAUSE REVIEW</span>
          {filter !== "all" && (
            <button onClick={() => setFilter("all")} style={{
              background:"rgba(0,200,240,.08)", border:"1px solid rgba(0,200,240,.3)",
              color:"var(--cyan)", fontFamily:MONO, fontSize:8, letterSpacing:"1px",
              padding:"3px 10px", borderRadius:4, cursor:"pointer",
            }}>✕ CLEAR</button>
          )}
        </div>

        {/* Clause list */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map((c: any, i: number) => (
            <ClauseRow key={c.id ?? i} clause={c} index={i}
              active={activeClause?.id === c.id}
              onClick={() => setActiveClause(activeClause?.id === c.id ? null : c)}/>
          ))}
          {showMissing && missingClauses.map((m: any, i: number) => (
            <MissingRow key={m.id ?? `m${i}`} clause={m} index={filtered.length + i}
              active={activeClause?.id === m.id}
              onClick={() => setActiveClause(activeClause?.id === m.id ? null : { ...m, _missing:true })}/>
          ))}
        </div>
      </div>

      {/* Detail drawer */}
      {activeClause && (
        <div style={{ width:420, borderLeft:"1px solid var(--border)", background:"var(--navy-2)",
                      overflow:"auto", flexShrink:0, animation:"slideIn .25s ease" }}>
          <ClauseDetail clause={activeClause} onClose={() => setActiveClause(null)}/>
        </div>
      )}
    </div>
  );
}

function ClauseRow({ clause, index, active, onClick }: any) {
  const c     = riskC(clause.riskLevel);
  const label = CLAUSE_LABELS[clause.clauseType] ?? clause.clauseType;
  return (
    <div onClick={onClick} style={{
      background: active ? "var(--navy-3)" : "var(--navy-2)",
      border:`1px solid ${active ? c.border : "var(--border)"}`,
      borderRadius:10, padding:"14px 18px", cursor:"pointer",
      animation:`fadeUp .3s ${index * .04}s ease both`, opacity:0,
      transition:"all .2s", display:"flex", alignItems:"center", gap:14,
      transform: active ? "translateX(3px)" : "none",
      boxShadow: active ? `0 0 16px ${c.border}18` : "none",
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor=c.border; e.currentTarget.style.background="var(--navy-3)"; }}}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.background="var(--navy-2)"; }}}>
      <ScoreArc score={clause.riskScore} size={50}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
          <span style={{ fontFamily:SANS, fontSize:13, fontWeight:600 }}>{label}</span>
          <span style={{ fontFamily:MONO, fontSize:8, letterSpacing:"1.5px", color:c.text,
                         background:c.bg, border:`1px solid ${c.border}40`, borderRadius:3, padding:"2px 7px" }}>
            {clause.riskLevel?.toUpperCase()} RISK
          </span>
          {clause.leverageSeverity === "critical" && (
            <span style={{ fontFamily:MONO, fontSize:8, letterSpacing:"1px", color:"var(--red)",
                           background:"var(--red-dim)", border:"1px solid rgba(255,53,80,.3)",
                           borderRadius:3, padding:"2px 7px", animation:"blink 2s infinite" }}>⚠ CRITICAL</span>
          )}
        </div>
        <p style={{ fontFamily:SANS, fontSize:11, color:"var(--text-2)", lineHeight:1.5,
                    overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box",
                    WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{clause.plainEnglish}</p>
        <div style={{ display:"flex", gap:16, marginTop:6, alignItems:"center" }}>
          {clause.estimatedExposure && (
            <span style={{ fontFamily:MONO, fontSize:9, color:"var(--red)" }}>EXPOSURE: {clause.estimatedExposure}</span>
          )}
          <span style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)" }}>
            PAGE {clause.pageEstimate} · {clause.confidenceScore}% CONFIDENCE
          </span>
        </div>
      </div>
      <div style={{ flexShrink:0, color:active?c.text:"var(--text-3)", fontSize:16,
                    transition:"transform .2s", transform:active?"rotate(180deg)":"none" }}>›</div>
    </div>
  );
}

function MissingRow({ clause, index, active, onClick }: any) {
  const label = CLAUSE_LABELS[clause.clauseType] ?? clause.clauseType;
  return (
    <div onClick={onClick} style={{
      background:"rgba(58,80,112,.06)", border:"1px solid var(--border)",
      borderRadius:10, padding:"14px 18px", cursor:"pointer",
      animation:`fadeUp .3s ${index * .04}s ease both`, opacity:0,
      display:"flex", alignItems:"center", gap:14, transition:"all .2s",
    }}>
      <div style={{ width:50, height:50, borderRadius:"50%", border:"2px dashed var(--slate)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    flexShrink:0, fontFamily:MONO, fontSize:16, color:"var(--slate)" }}>✕</div>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
          <span style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:"var(--text-2)" }}>{label}</span>
          <span style={{ fontFamily:MONO, fontSize:8, letterSpacing:"1.5px", color:"var(--slate)",
                         background:"rgba(58,80,112,.15)", border:"1px solid rgba(58,80,112,.3)",
                         borderRadius:3, padding:"2px 7px" }}>NOT FOUND</span>
        </div>
        <p style={{ fontFamily:SANS, fontSize:11, color:"var(--text-3)", lineHeight:1.5 }}>{clause.description}</p>
        {clause.estimatedExposure && (
          <span style={{ fontFamily:MONO, fontSize:9, color:"var(--amber)", marginTop:4, display:"block" }}>
            RISK IF ABSENT: {clause.estimatedExposure}
          </span>
        )}
      </div>
      <div style={{ flexShrink:0, color:"var(--text-3)", fontSize:16 }}>›</div>
    </div>
  );
}

function ClauseDetail({ clause, onClose }: any) {
  const isMissing = clause._missing;
  const c         = isMissing ? { bg:"rgba(58,80,112,.12)", border:"#3A5070", text:"#7A8FA8" } : riskC(clause.riskLevel);
  const label     = CLAUSE_LABELS[clause.clauseType] ?? clause.clauseType;

  const S = ({ title, children, color = "var(--text-3)" }: any) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontFamily:MONO, fontSize:8, color, letterSpacing:"2px", marginBottom:8, textTransform:"uppercase" }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div style={{ padding:"24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:SERIF, fontSize:18, fontWeight:700, marginBottom:8 }}>{label}</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {!isMissing && (
              <span style={{ fontFamily:MONO, fontSize:8, letterSpacing:"1.5px", color:c.text,
                             background:c.bg, border:`1px solid ${c.border}50`, borderRadius:3, padding:"3px 10px" }}>
                {clause.riskLevel?.toUpperCase()} RISK
              </span>
            )}
            {clause.leverageSeverity && !isMissing && (
              <span style={{ fontFamily:MONO, fontSize:8, letterSpacing:"1px", color:"var(--violet)",
                             background:"var(--violet-dim)", border:"1px solid rgba(124,92,252,.3)",
                             borderRadius:3, padding:"3px 10px" }}>
                LEVERAGE: {clause.leverageSeverity?.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <button onClick={onClose} style={{ background:"var(--navy-3)", border:"1px solid var(--border)",
                                           color:"var(--text-2)", width:30, height:30, borderRadius:6,
                                           cursor:"pointer", fontSize:14, display:"flex",
                                           alignItems:"center", justifyContent:"center" }}>✕</button>
      </div>

      {!isMissing && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:20 }}>
          {([["RISK SCORE", clause.riskScore, c.text], ["CONFIDENCE", `${clause.confidenceScore}%`, "var(--cyan)"], ["EXPOSURE", clause.estimatedExposure ?? "—", "var(--red)"]] as const).map(([l,v,col]) => (
            <div key={l} style={{ background:"var(--navy-4)", border:"1px solid var(--border)",
                                  borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
              <div style={{ fontFamily:MONO, fontSize:7, color:"var(--text-3)", letterSpacing:"1.5px", marginBottom:4 }}>{l}</div>
              <div style={{ fontFamily:SERIF, fontSize:16, fontWeight:700, color:col }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {!isMissing && clause.benchmarkPercentile !== undefined && (
        <div style={{ background:"var(--navy-4)", border:"1px solid var(--border)",
                      borderRadius:8, padding:"12px 14px", marginBottom:20 }}>
          <div style={{ fontFamily:MONO, fontSize:8, color:"var(--text-3)", letterSpacing:"2px", marginBottom:8 }}>MARKET BENCHMARK</div>
          <Bar value={clause.benchmarkPercentile} color="linear-gradient(90deg,var(--green),var(--amber),var(--red))" height={5}/>
          <div style={{ fontFamily:MONO, fontSize:9, color:c.text, marginTop:6 }}>
            Riskier than {clause.benchmarkPercentile}% of comparable enterprise contracts
          </div>
        </div>
      )}

      {!isMissing && clause.originalText && (
        <S title="Original Contract Language">
          <div style={{ background:"var(--navy)", border:"1px solid var(--border)",
                        borderLeft:`3px solid ${c.border}`, borderRadius:"0 8px 8px 0",
                        padding:"12px 14px", fontFamily:MONO, fontSize:10,
                        color:"var(--text-2)", lineHeight:1.7, fontStyle:"italic" }}>
            "{clause.originalText}"
          </div>
        </S>
      )}

      <S title="Plain English">
        <p style={{ fontFamily:SANS, fontSize:12, color:"var(--text-1)", lineHeight:1.75 }}>
          {clause.plainEnglish ?? clause.description}
        </p>
      </S>

      <S title="Risk Rationale" color="var(--red)">
        <div style={{ background:"rgba(255,53,80,.05)", border:"1px solid rgba(255,53,80,.15)",
                      borderRadius:8, padding:"12px 14px" }}>
          <p style={{ fontFamily:SANS, fontSize:12, color:"var(--text-1)", lineHeight:1.75 }}>{clause.riskRationale}</p>
        </div>
      </S>

      {!isMissing && (
        <>
          <S title="Negotiation Counter-Position" color="var(--green)">
            <div style={{ background:"rgba(0,212,138,.05)", border:"1px solid rgba(0,212,138,.2)",
                          borderRadius:8, padding:"12px 14px" }}>
              <p style={{ fontFamily:SANS, fontSize:12, color:"var(--text-1)", lineHeight:1.75 }}>{clause.recommendation}</p>
            </div>
          </S>
          {clause.marketStandardText && (
            <S title="Market-Standard Language" color="var(--violet)">
              <div style={{ background:"var(--violet-dim)", border:"1px solid rgba(124,92,252,.2)",
                            borderRadius:8, padding:"12px 14px" }}>
                <p style={{ fontFamily:SANS, fontSize:12, color:"var(--text-2)", lineHeight:1.75, fontStyle:"italic" }}>
                  {clause.marketStandardText}
                </p>
              </div>
            </S>
          )}
        </>
      )}

      {isMissing && (
        <S title="Recommended Addition" color="var(--green)">
          <div style={{ background:"rgba(0,212,138,.05)", border:"1px solid rgba(0,212,138,.2)",
                        borderRadius:8, padding:"12px 14px" }}>
            <p style={{ fontFamily:SANS, fontSize:12, color:"var(--text-1)", lineHeight:1.75 }}>{clause.recommendation}</p>
          </div>
        </S>
      )}
    </div>
  );
}

/* ─── LEGAL OPS PANEL ─────────────────────────────────────────────────────── */
function LegalOpsPanel({ clauses, missingClauses, decision, violations, violatedCount, passedCount }: any) {
  const metrics = [
    { label:"TOTAL EXPOSURE",       value:decision.estimatedTotalExposure ?? "—",       color:"var(--red)",    icon:"$" },
    { label:"CONTRACT HEALTH",      value:`${decision.contractHealthScore ?? 0}/100`,    color:"var(--amber)",  icon:"◈" },
    { label:"NEGOTIATION PRIORITY", value:decision.negotiationPriority ?? "HIGH",        color:"var(--violet)", icon:"↑" },
    { label:"REVIEW ESCALATION",    value:decision.escalationRequired ? "REQUIRED":"CLEAR", color:decision.escalationRequired?"var(--red)":"var(--green)", icon:"⚡" },
    { label:"LEGAL RECOMMENDATION", value:decision.verdict ?? "REVIEW",                  color:"var(--cyan)",   icon:"⚖" },
    { label:"PROCUREMENT STATUS",   value:decision.procurementRisk ?? "CONDITIONAL",     color:decision.procurementRisk==="BLOCKED"?"var(--red)":decision.procurementRisk==="CLEARED"?"var(--green)":"var(--amber)", icon:"◐" },
  ];

  return (
    <div style={{ flex:1, overflow:"auto", padding:"24px 28px" }}>
      <div style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)", letterSpacing:"3px", marginBottom:20 }}>
        LEGAL OPERATIONS INTELLIGENCE CENTER
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:28 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background:"var(--navy-3)", border:"1px solid var(--border)",
                                borderRadius:10, padding:"18px 20px",
                                animation:`fadeUp .3s ${i * .06}s ease both`, opacity:0,
                                position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:12, right:14, fontFamily:MONO, fontSize:22,
                          color:`${m.color}20` }}>{m.icon}</div>
            <div style={{ fontFamily:MONO, fontSize:8, color:"var(--text-3)", letterSpacing:"2px", marginBottom:10 }}>{m.label}</div>
            <div style={{ fontFamily:SERIF, fontSize:22, fontWeight:700, color:m.color, lineHeight:1.1 }}>{m.value}</div>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:m.color, opacity:.4 }}/>
          </div>
        ))}
      </div>

      {decision.primaryRisk && (
        <div style={{ background:"rgba(255,53,80,.06)", border:"1px solid rgba(255,53,80,.25)",
                      borderRadius:10, padding:"16px 20px", marginBottom:24,
                      display:"flex", gap:14, alignItems:"flex-start",
                      animation:"fadeUp .3s .2s ease both", opacity:0 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"var(--red-dim)",
                        border:"1px solid rgba(255,53,80,.4)", display:"flex", alignItems:"center",
                        justifyContent:"center", flexShrink:0, fontSize:16 }}>⚠</div>
          <div>
            <div style={{ fontFamily:MONO, fontSize:8, color:"var(--red)", letterSpacing:"2px", marginBottom:6 }}>PRIMARY RISK VECTOR</div>
            <p style={{ fontFamily:SANS, fontSize:13, color:"var(--text-1)", lineHeight:1.7 }}>{decision.primaryRisk}</p>
          </div>
        </div>
      )}

      {/* Policy compliance */}
      <div style={{ background:"var(--navy-3)", border:"1px solid var(--border)",
                    borderRadius:10, overflow:"hidden", marginBottom:24,
                    animation:"fadeUp .3s .28s ease both", opacity:0 }}>
        <div style={{ padding:"14px 20px", borderBottom:"1px solid var(--border)",
                      display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)", letterSpacing:"2px", marginBottom:4 }}>
              ENTERPRISE POLICY COMPLIANCE
            </div>
            <div style={{ fontFamily:SANS, fontSize:12, color:"var(--text-2)" }}>Internal procurement policy validation</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:SERIF, fontSize:24, fontWeight:700, color:"var(--red)" }}>
              {violatedCount}<span style={{ fontSize:14, color:"var(--text-3)" }}>/{ENTERPRISE_POLICIES.length}</span>
            </div>
            <div style={{ fontFamily:MONO, fontSize:8, color:"var(--red)", letterSpacing:"1.5px" }}>VIOLATIONS</div>
          </div>
        </div>

        <div style={{ padding:"14px 20px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", gap:3, marginBottom:8 }}>
            {violations.map((p: any, i: number) => (
              <div key={i} style={{ flex:1, height:8, borderRadius:2,
                                    background: p.violated ? "var(--red)" : "var(--green)",
                                    boxShadow: p.violated ? "0 0 4px var(--red)" : "none" }}/>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontFamily:MONO, fontSize:9, color:"var(--green)" }}>✓ {passedCount} PASSED</span>
            <span style={{ fontFamily:MONO, fontSize:9, color:"var(--red)" }}>✕ {violatedCount} VIOLATIONS</span>
          </div>
        </div>

        <div style={{ maxHeight:340, overflow:"auto" }}>
          {violations.map((p: any, i: number) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12,
                                  padding:"10px 20px",
                                  borderBottom: i < violations.length-1 ? "1px solid rgba(26,40,64,.5)" : "none",
                                  background: p.violated ? "rgba(255,53,80,.03)" : "transparent" }}>
              <div style={{ width:18, height:18, borderRadius:"50%", flexShrink:0, marginTop:1,
                            background: p.violated ? "var(--red-dim)" : "rgba(0,212,138,.1)",
                            border:`1px solid ${p.violated ? "rgba(255,53,80,.4)" : "rgba(0,212,138,.3)"}`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:9, color: p.violated ? "var(--red)" : "var(--green)" }}>
                {p.violated ? "✕" : "✓"}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:SANS, fontSize:11, lineHeight:1.5,
                              color: p.violated ? "var(--text-1)" : "var(--text-3)" }}>{p.rule}</div>
                <div style={{ fontFamily:MONO, fontSize:8, color:"var(--text-3)", letterSpacing:"1px", marginTop:2 }}>
                  {p.category.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exposure breakdown */}
      <div style={{ background:"var(--navy-3)", border:"1px solid var(--border)",
                    borderRadius:10, padding:"18px 20px",
                    animation:"fadeUp .3s .36s ease both", opacity:0 }}>
        <div style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)", letterSpacing:"2px", marginBottom:16 }}>
          FINANCIAL EXPOSURE BREAKDOWN
        </div>
        {clauses.filter((c: any) => c.estimatedExposure && c.estimatedExposure !== "—").slice(0, 6).map((c: any, i: number) => {
          const label = CLAUSE_LABELS[c.clauseType] ?? c.clauseType;
          const col   = c.riskLevel==="high" ? "var(--red)" : c.riskLevel==="medium" ? "var(--amber)" : "var(--green)";
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ width:130, fontFamily:MONO, fontSize:9, color:"var(--text-2)" }}>{label}</div>
              <div style={{ flex:1 }}><Bar value={c.riskScore} color={col} height={4}/></div>
              <div style={{ width:70, fontFamily:MONO, fontSize:9, color:col, textAlign:"right" }}>
                {c.estimatedExposure}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── DECISION ENGINE ─────────────────────────────────────────────────────── */
function DecisionEngine({ decision, dc, clauses, missingClauses }: any) {
  const high = clauses.filter((c: any) => c.riskLevel === "high");

  return (
    <div style={{ flex:1, overflow:"auto", padding:"24px 28px" }}>
      <div style={{ fontFamily:MONO, fontSize:9, color:"var(--text-3)", letterSpacing:"3px", marginBottom:20 }}>
        AI AGENT DECISION ENGINE
      </div>

      {/* Main verdict */}
      <div style={{
        background:`linear-gradient(135deg, ${dc.color}10, ${dc.color}04)`,
        border:`1.5px solid ${dc.color}50`, borderRadius:14, padding:"32px 36px", marginBottom:24,
        display:"flex", gap:28, alignItems:"center",
        animation:"fadeUp .4s ease both", opacity:0,
        boxShadow:`0 0 40px ${dc.glow}`,
      }}>
        <div style={{ width:80, height:80, borderRadius:"50%", flexShrink:0,
                      border:`2.5px solid ${dc.color}`, background:`${dc.color}12`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:32, color:dc.color, boxShadow:`0 0 20px ${dc.glow}` }}>{dc.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:MONO, fontSize:9, color:dc.color, letterSpacing:"3px", marginBottom:6 }}>AGENT VERDICT</div>
          <div style={{ fontFamily:SERIF, fontSize:30, fontWeight:700, marginBottom:8, lineHeight:1.1 }}>{dc.label}</div>
          <p style={{ fontFamily:SANS, fontSize:13, color:"var(--text-2)", lineHeight:1.75 }}>{decision.reasoning}</p>
        </div>
        <ScoreArc score={decision.confidenceScore ?? 0} size={72} label="CONFIDENCE"/>
      </div>

      {/* Decision metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24,
                    animation:"fadeUp .4s .1s ease both", opacity:0 }}>
        {([
          ["TOTAL EXPOSURE",  decision.estimatedTotalExposure ?? "—", "var(--red)"],
          ["URGENCY",         decision.urgency ?? "HIGH",              decision.urgency==="IMMEDIATE"?"var(--red)":"var(--amber)"],
          ["HEALTH SCORE",    decision.contractHealthScore ?? 0,       "var(--amber)"],
          ["PROCUREMENT",     decision.procurementRisk ?? "—",         decision.procurementRisk==="BLOCKED"?"var(--red)":decision.procurementRisk==="CLEARED"?"var(--green)":"var(--amber)"],
        ] as const).map(([l, v, c]) => (
          <div key={l} style={{ background:"var(--navy-3)", border:"1px solid var(--border)",
                                borderRadius:10, padding:"16px", textAlign:"center" }}>
            <div style={{ fontFamily:MONO, fontSize:8, color:"var(--text-3)", letterSpacing:"2px", marginBottom:8 }}>{l}</div>
            <div style={{ fontFamily:SERIF, fontSize:20, fontWeight:700, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Critical findings */}
      {high.length > 0 && (
        <div style={{ background:"var(--navy-3)", border:"1px solid var(--border)",
                      borderRadius:10, overflow:"hidden", marginBottom:24,
                      animation:"fadeUp .4s .2s ease both", opacity:0 }}>
          <div style={{ padding:"12px 20px", borderBottom:"1px solid var(--border)",
                        background:"rgba(255,53,80,.04)" }}>
            <div style={{ fontFamily:MONO, fontSize:9, color:"var(--red)", letterSpacing:"2px" }}>
              CRITICAL FINDINGS — AGENT ACTION ITEMS
            </div>
          </div>
          {high.slice(0, 4).map((c: any, i: number) => (
            <div key={i} style={{ display:"flex", gap:14, padding:"14px 20px",
                                  borderBottom: i < Math.min(high.length,4)-1 ? "1px solid rgba(26,40,64,.6)" : "none" }}>
              <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0,
                            background:"var(--red-dim)", border:"1px solid rgba(255,53,80,.3)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontFamily:MONO, fontSize:10, color:"var(--red)", fontWeight:600 }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:"var(--text-1)", marginBottom:4 }}>
                  {CLAUSE_LABELS[c.clauseType] ?? c.clauseType}
                  {c.estimatedExposure && (
                    <span style={{ fontFamily:MONO, fontSize:10, color:"var(--red)", marginLeft:10 }}>
                      {c.estimatedExposure}
                    </span>
                  )}
                </div>
                <p style={{ fontFamily:SANS, fontSize:11, color:"var(--text-2)", lineHeight:1.6 }}>{c.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Policy violations */}
      {decision.policyViolations?.length > 0 && (
        <div style={{ background:"var(--navy-3)", border:"1px solid var(--border)",
                      borderRadius:10, overflow:"hidden",
                      animation:"fadeUp .4s .3s ease both", opacity:0 }}>
          <div style={{ padding:"12px 20px", borderBottom:"1px solid var(--border)" }}>
            <div style={{ fontFamily:MONO, fontSize:9, color:"var(--amber)", letterSpacing:"2px" }}>POLICY VIOLATIONS DETECTED</div>
          </div>
          {decision.policyViolations.slice(0, 6).map((v: string, i: number) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"10px 20px",
                                  borderBottom: i < decision.policyViolations.length-1 ? "1px solid rgba(26,40,64,.5)" : "none",
                                  alignItems:"flex-start" }}>
              <span style={{ color:"var(--amber)", fontFamily:MONO, fontSize:11, flexShrink:0, marginTop:1 }}>▸</span>
              <span style={{ fontFamily:SANS, fontSize:12, color:"var(--text-2)", lineHeight:1.6 }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT COMPONENT — ClauseWatchV2
   ───────────────────────────────────────────────────────────────────────────
   ARCHITECTURE RULES:
   1. ALL app-level state lives here. Child components receive only what they need.
   2. analyzeContract() is called here only. Children never call AI APIs.
   3. Landing receives onUpload(file) and onDemo() — pure callbacks, no state setters.
   4. Screen routing is a simple string enum: "landing" | "processing" | "dashboard" | "error"
   ═══════════════════════════════════════════════════════════════════════════ */
export default function ClauseWatchV2() {
  // ── All state declared at the top — no early returns before this ──────────
  const [screen,   setScreen]   = useState<"landing"|"processing"|"dashboard"|"error">("landing");
  const [analysis, setAnalysis] = useState<any>(null);
  const [filename, setFilename] = useState("");
  const [error,    setError]    = useState("");

  // ── Core analyze flow ─────────────────────────────────────────────────────
  // Called by both handleUpload (real PDF) and handleDemo (text).
  // Shows processing screen immediately; awaits API; routes to dashboard or error.
  async function runAnalysis(input: { file: File } | { text: string }, name: string) {
    setFilename(name);
    setScreen("processing"); // show agent theater immediately

    try {
      const result = await analyzeContract(input); // calls /api/analyze
      setAnalysis(result);
      setScreen("dashboard");
    } catch (e: any) {
      setError(e.message ?? "Agent analysis failed. Please try again.");
      setScreen("error");
    }
  }

  // ── Handlers passed down as props ─────────────────────────────────────────
  function handleUpload(file: File) {
    runAnalysis({ file }, file.name);
  }

  function handleDemo() {
    runAnalysis({ text: DEMO_CONTRACT }, "TechCorp_Enterprise_MSA.pdf");
  }

  function handleReset() {
    setScreen("landing");
    setAnalysis(null);
    setFilename("");
    setError("");
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Fonts/>

      {screen === "landing" && (
        <Landing onUpload={handleUpload} onDemo={handleDemo}/>
      )}

      {screen === "processing" && (
        <AgentProcessing filename={filename}/>
      )}

      {screen === "dashboard" && analysis && (
        <Dashboard analysis={analysis} filename={filename} onReset={handleReset}/>
      )}

      {screen === "error" && (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
                      alignItems:"center", justifyContent:"center", gap:20, background:"var(--navy)" }}>
          <GridBg/>
          <div style={{ fontSize:48, position:"relative", zIndex:1 }}>⚠</div>
          <div style={{ fontFamily:SERIF, fontSize:24, color:"var(--red)", position:"relative", zIndex:1 }}>
            Agent Error
          </div>
          <div style={{ fontFamily:MONO, fontSize:11, color:"var(--text-2)", maxWidth:440,
                        textAlign:"center", lineHeight:1.7, position:"relative", zIndex:1 }}>
            {error}
          </div>
          <button onClick={handleReset} style={{
            background:"var(--cyan)", color:"var(--navy)", border:"none",
            fontFamily:MONO, fontSize:11, fontWeight:600, letterSpacing:"2px",
            padding:"12px 28px", borderRadius:8, cursor:"pointer",
            position:"relative", zIndex:1,
          }}>← RESTART AGENT</button>
        </div>
      )}
    </>
  );
}
