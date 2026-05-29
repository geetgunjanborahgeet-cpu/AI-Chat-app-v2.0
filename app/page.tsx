"use client";

import { useState, useEffect, useRef } from "react";

const TABS = ["Ideas", "Pickup Lines", "Replies", "Icebreakers"];

const staticData = {
  Ideas: [
    "Agar tum kisi movie universe me reh sakte, konsa choose karte? 🎬",
    "Tumhara most random talent kya hai jo log expect nahi karte? 😭",
    "Agar abhi free ticket mile toh kaha travel karoge? ✈️",
    "Ek song jo tum repeat pe sun sakte ho pura week? 🎧",
    "Tum zyada night owl ho ya early bird? 🌙",
    "Agar tum ek superpower choose kar sako, kya hogi? ⚡",
    "Tumhara favorite childhood memory kya hai? 🌟",
    "Agar ghar pe koi khana bana sako toh kya banate? 🍛",
  ],
  "Pickup Lines": [
    "Tumhari vibe WiFi jaisi hai... automatically connect ho gaya 😭",
    "Tum normal insan ho ya Netflix main character? 👀",
    "Tumhari energy coffee se zyada addictive lagti hai ☕",
    "Google bhi tumhare baare me zyada nahi jaanta jitna main jaanna chahta hoon 🔍",
    "Tumhara smile dekh ke mera phone ka brightness 100% ho gaya ✨",
    "Tum art museum me hote toh sabse zyada crowd tumhare aage hoti 🎨",
  ],
  Icebreakers: [
    "Ek unpopular opinion share karo jo tum firmly believe karte ho 🔥",
    "Tumhe kaun sa simple cheez bahut zyada khush karti hai? 🌈",
    "2 truths 1 lie – play karoge? 🎯",
    "Bata do tumhara guilty pleasure show kya hai 📺",
    "Aaj ka mood kaunsi emoji se describe karte ho? 😅",
    "Last book ya podcast jo genuinely enjoy kiya? 📚",
  ],
};

const REPLY_TONES = ["Witty 😏", "Flirty 💘", "Chill 😎", "Sweet 🥺"];

const SYSTEM_PROMPT = `You are ConvoKit, a witty Hindi-English (Hinglish) conversation assistant. You help people have better conversations with their crushes and friends.

Rules:
- Always respond in Hinglish (mix of Hindi and English) unless asked otherwise
- Keep responses SHORT and punchy (1-3 sentences max unless it's a reply suggestion)
- Be fun, relatable, and Gen-Z friendly
- For conversation ideas: give interesting, open-ended questions
- For pickup lines: give clever, non-creepy lines
- For icebreakers: give fun, low-pressure starters
- For reply help: give 2-3 different reply options with different tones
- Always end with a relevant emoji
- Do NOT use markdown formatting, asterisks, or headers in your response`;

export default function ConvoKit() {
  const [activeTab, setActiveTab] = useState("Ideas");
  const [output, setOutput] = useState("Tap karo aur convo game strong karo 🔥");
  const [loading, setLoading] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [selectedTone, setSelectedTone] = useState("Witty 😏");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedItems, setSavedItems] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const outputRef = useRef(null);
  const textareaRef = useRef(null);

  const callClaude = async (prompt) => {
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b) => b.text || "").join("") || "Kuch toh gadbad hai, dobara try karo 😅";
      setOutput(text);
      setHistory((prev) => [{ tab: activeTab, text }, ...prev.slice(0, 19)]);
      setIsSaved(false);
    } catch {
      setOutput("Network error! Dobara try karo 😬");
    } finally {
      setLoading(false);
    }
  };

  const generate = () => {
    if (activeTab === "Replies") {
      if (!replyInput.trim()) {
        setOutput("Pehle koi message paste karo jiska reply chahiye 👆");
        return;
      }
      callClaude(
        `Mere crush/friend ne yeh message bheja: "${replyInput}"\n\nMujhe ${selectedTone.replace(/[^\w\s]/g, "").trim()} tone mein 2-3 alag reply options do. Har option ek line mein rakh.`
      );
    } else {
      const prompts = {
        Ideas: "Ek fresh, interesting conversation starter idea do jo kisi crush ya naye dost se baat shuru karne mein help kare.",
        "Pickup Lines": "Ek clever aur cute pickup line do jo creepy na lage, relatable aur fun ho.",
        Icebreakers: "Ek fun icebreaker question do jo anxiety-free ho aur genuine conversation start kare.",
      };
      callClaude(prompts[activeTab]);
    }
  };

  const getStatic = () => {
    const pool = staticData[activeTab] || staticData["Ideas"];
    const item = pool[Math.floor(Math.random() * pool.length)];
    setOutput(item);
    setHistory((prev) => [{ tab: activeTab, text: item }, ...prev.slice(0, 19)]);
    setIsSaved(false);
  };

  const copy = () => {
    if (!output || loading) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const save = () => {
    if (!output || loading) return;
    setSavedItems((prev) => [{ tab: activeTab, text: output, id: Date.now() }, ...prev]);
    setIsSaved(true);
  };

  const removeFromSaved = (id) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const tabColors = {
    Ideas: "#7C3AED",
    "Pickup Lines": "#DB2777",
    Icebreakers: "#0891B2",
    Replies: "#059669",
  };
  const accent = tabColors[activeTab];

  return (
    <div style={styles.shell}>
      {/* BG noise texture */}
      <div style={styles.noiseBg} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.pill}>✨ Beta</div>
        <h1 style={styles.title}>ConvoKit</h1>
        <p style={styles.subtitle}>Hinglish Convo Assistant — powered by Claude AI</p>
        <button style={styles.savedBtn} onClick={() => setShowSaved((s) => !s)}>
          {showSaved ? "← Back" : `Saved (${savedItems.length}) 🔖`}
        </button>
      </div>

      {showSaved ? (
        <div style={styles.savedPanel}>
          <h3 style={{ color: "#fff", marginBottom: 12, fontSize: 18 }}>Saved Items 🔖</h3>
          {savedItems.length === 0 ? (
            <p style={{ color: "#888" }}>Abhi kuch saved nahi hai 😅</p>
          ) : (
            savedItems.map((item) => (
              <div key={item.id} style={styles.savedCard}>
                <span style={{ ...styles.historyBadge, background: tabColors[item.tab] + "33", color: tabColors[item.tab] }}>{item.tab}</span>
                <p style={{ color: "#e2e8f0", margin: "8px 0", fontSize: 15, lineHeight: 1.5 }}>{item.text}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={styles.smallBtn} onClick={() => navigator.clipboard.writeText(item.text)}>Copy</button>
                  <button style={{ ...styles.smallBtn, background: "#7f1d1d" }} onClick={() => removeFromSaved(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div style={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab ? { background: tabColors[tab], color: "#fff", boxShadow: `0 0 18px ${tabColors[tab]}55` } : {}),
                }}
                onClick={() => { setActiveTab(tab); setOutput("Tap karo aur convo game strong karo 🔥"); }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Reply input */}
          {activeTab === "Replies" && (
            <div style={styles.inputArea}>
              <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>Paste karo woh message jiska reply chahiye:</p>
              <textarea
                ref={textareaRef}
                style={styles.textarea}
                rows={3}
                placeholder="e.g. 'Hey! Kya kar rahe ho aajkal?' 💬"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
              />
              <div style={styles.toneRow}>
                {REPLY_TONES.map((tone) => (
                  <button
                    key={tone}
                    style={{
                      ...styles.tonePill,
                      ...(selectedTone === tone ? { background: accent, color: "#fff", boxShadow: `0 0 12px ${accent}66` } : {}),
                    }}
                    onClick={() => setSelectedTone(tone)}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Output card */}
          <div
            ref={outputRef}
            style={{
              ...styles.outputCard,
              borderColor: loading ? accent : "#2d2d2d",
              boxShadow: loading ? `0 0 24px ${accent}33` : "none",
              transition: "all 0.4s ease",
            }}
          >
            {loading ? (
              <div style={styles.loadingRow}>
                <span style={{ ...styles.dot, animationDelay: "0s", background: accent }} />
                <span style={{ ...styles.dot, animationDelay: "0.15s", background: accent }} />
                <span style={{ ...styles.dot, animationDelay: "0.3s", background: accent }} />
                <span style={{ color: "#94a3b8", fontSize: 14, marginLeft: 6 }}>Thinking...</span>
              </div>
            ) : (
              <p style={styles.outputText}>{output}</p>
            )}
          </div>

          {/* Action buttons */}
          <div style={styles.actions}>
            <button
              style={{ ...styles.mainBtn, background: accent, boxShadow: `0 0 20px ${accent}44` }}
              onClick={generate}
              disabled={loading}
            >
              {loading ? "Generating..." : "✨ AI Generate"}
            </button>
            <button style={styles.ghostBtn} onClick={getStatic} disabled={loading}>
              🎲 Quick Pick
            </button>
          </div>

          {/* Utility row */}
          <div style={styles.utilRow}>
            <button style={styles.utilBtn} onClick={copy} disabled={!output || loading}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
            <button
              style={{ ...styles.utilBtn, ...(isSaved ? { color: "#facc15" } : {}) }}
              onClick={save}
              disabled={!output || loading || isSaved}
            >
              {isSaved ? "⭐ Saved!" : "🔖 Save"}
            </button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div style={styles.historySection}>
              <p style={styles.historyLabel}>Recent ⏱</p>
              <div style={styles.historyScroll}>
                {history.slice(0, 5).map((h, i) => (
                  <div
                    key={i}
                    style={styles.historyCard}
                    onClick={() => { setOutput(h.text); setActiveTab(h.tab); setIsSaved(false); }}
                  >
                    <span style={{ ...styles.historyBadge, background: tabColors[h.tab] + "33", color: tabColors[h.tab] }}>{h.tab}</span>
                    <p style={styles.historyText}>{h.text.slice(0, 80)}{h.text.length > 80 ? "..." : ""}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    padding: "24px 16px 48px",
    maxWidth: 540,
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
  },
  noiseBg: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E\")",
    pointerEvents: "none", zIndex: 0,
  },
  header: { textAlign: "center", marginBottom: 28, position: "relative", zIndex: 1 },
  pill: {
    display: "inline-block", background: "#1e1e1e", border: "1px solid #333",
    color: "#94a3b8", fontSize: 11, padding: "3px 10px", borderRadius: 20, marginBottom: 10,
    letterSpacing: "0.08em", textTransform: "uppercase",
  },
  title: {
    fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800,
    margin: "0 0 6px", letterSpacing: "-1px",
    background: "linear-gradient(135deg, #fff 40%, #888)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  subtitle: { color: "#64748b", fontSize: 14, margin: "0 0 14px" },
  savedBtn: {
    background: "transparent", border: "1px solid #333", color: "#94a3b8",
    padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
  },
  tabs: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", position: "relative", zIndex: 1 },
  tab: {
    flex: 1, minWidth: 80, padding: "9px 8px", borderRadius: 12, border: "1px solid #2a2a2a",
    background: "#141414", color: "#64748b", fontSize: 13, fontWeight: 600,
    cursor: "pointer", transition: "all 0.2s ease", fontFamily: "'DM Sans', sans-serif",
  },
  inputArea: { background: "#111", border: "1px solid #222", borderRadius: 16, padding: 16, marginBottom: 16, position: "relative", zIndex: 1 },
  textarea: {
    width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10,
    color: "#e2e8f0", padding: "10px 12px", fontSize: 14, resize: "none",
    fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
  },
  toneRow: { display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" },
  tonePill: {
    padding: "5px 12px", borderRadius: 20, border: "1px solid #2a2a2a",
    background: "#1a1a1a", color: "#64748b", fontSize: 12, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease",
  },
  outputCard: {
    background: "#111", border: "1px solid #2d2d2d", borderRadius: 20,
    padding: "24px 20px", minHeight: 100, display: "flex", alignItems: "center",
    justifyContent: "center", marginBottom: 18, position: "relative", zIndex: 1,
  },
  outputText: { color: "#e2e8f0", fontSize: 16, lineHeight: 1.65, textAlign: "center", margin: 0 },
  loadingRow: { display: "flex", alignItems: "center", gap: 4 },
  dot: {
    width: 8, height: 8, borderRadius: "50%",
    animation: "bounce 1.2s infinite ease-in-out",
    display: "inline-block",
  },
  actions: { display: "flex", gap: 10, marginBottom: 12, position: "relative", zIndex: 1 },
  mainBtn: {
    flex: 2, padding: "14px", borderRadius: 14, border: "none",
    color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", transition: "opacity 0.2s",
  },
  ghostBtn: {
    flex: 1, padding: "14px", borderRadius: 14, border: "1px solid #2a2a2a",
    background: "#141414", color: "#94a3b8", fontSize: 14, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  utilRow: { display: "flex", gap: 10, marginBottom: 24, position: "relative", zIndex: 1 },
  utilBtn: {
    flex: 1, padding: "10px", borderRadius: 12, border: "1px solid #222",
    background: "#111", color: "#64748b", fontSize: 13, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s",
  },
  historySection: { position: "relative", zIndex: 1 },
  historyLabel: { color: "#475569", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 },
  historyScroll: { display: "flex", flexDirection: "column", gap: 8 },
  historyCard: {
    background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 12,
    padding: "10px 14px", cursor: "pointer", transition: "border-color 0.2s",
  },
  historyBadge: {
    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
    textTransform: "uppercase", letterSpacing: "0.07em",
  },
  historyText: { color: "#64748b", fontSize: 13, margin: "4px 0 0", lineHeight: 1.4 },
  savedPanel: { position: "relative", zIndex: 1 },
  savedCard: {
    background: "#111", border: "1px solid #222", borderRadius: 14,
    padding: 14, marginBottom: 10,
  },
  smallBtn: {
    background: "#1e293b", border: "none", color: "#94a3b8",
    padding: "5px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
};
