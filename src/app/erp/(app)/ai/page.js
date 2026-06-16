"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Calculator, TrendingUp, Clock, Recycle, ShieldAlert, FileText, Search, Bot, X } from "lucide-react";
import { PageHeader, Panel, Badge, Btn } from "@/components/erp/ui";
import { useAiInsightsStore } from "@/erp/stores/useAiInsightsStore";
import grid from "@/components/erp/layout.module.css";
import styles from "./ai.module.css";

const SUGGESTIONS = [
  "Which project has the highest cost risk?",
  "Generate a BOQ for a 3BHK premium interior",
  "Summarise this week's site delays",
  "Predict June cash flow",
];

const CANNED = {
  default: "Based on live Studio II data: Vertex Office carries the highest risk — civil actuals are 8.2% above BOQ, threatening margin (now ~14.8%). I'd recommend freezing scope changes and renegotiating the SteelLine fabrication rate. Want me to draft a vendor renegotiation note?",
};

const FEATURES = [
  { icon: Calculator, name: "AI BOQ Generation", desc: "Draft area-wise BOQs from a brief" },
  { icon: TrendingUp, name: "Cost Prediction", desc: "Forecast final cost vs budget" },
  { icon: Clock, name: "Delay Prediction", desc: "Flag at-risk timelines early" },
  { icon: Recycle, name: "Material Optimization", desc: "Cut waste with smart cutting plans" },
  { icon: ShieldAlert, name: "Risk Analysis", desc: "Surface project & cash risks" },
  { icon: FileText, name: "Meeting Summaries", desc: "Auto-summarise calls & notes" },
  { icon: Search, name: "Smart Search", desc: "Natural-language across modules" },
  { icon: Bot, name: "Assistant", desc: "Ask anything about your business" },
];

export default function AiPage() {
  const [messages, setMessages] = useState([
    { who: "ai", text: "Hello Aarav. I'm your Studio OS copilot. Ask me about profitability, risks, vendors, or generate a BOQ." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  const allInsights = useAiInsightsStore((s) => s.insights);
  const insights = allInsights.filter((i) => !i.dismissed);
  const hydrate = useAiInsightsStore((s) => s.hydrate);
  const dismiss = useAiInsightsStore((s) => s.dismiss);
  const generate = useAiInsightsStore((s) => s.generate);
  const restoreAll = useAiInsightsStore((s) => s.restoreAll);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { who: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { who: "ai", text: CANNED.default, typing: true }]);
    }, 500);
  };

  return (
    <div className={grid.stack}>
      <PageHeader title="AI Engine" subtitle="Operational intelligence & assistant copilot" icon={Sparkles}>
        <Badge tone="success" dot>Online</Badge>
        <Btn variant="primary" icon={Sparkles} onClick={() => generate()}>Generate</Btn>
      </PageHeader>

      <div className={grid.split}>
        <Panel title={<span className={styles.title}><Bot size={16} /> Studio OS Copilot</span>} subtitle="Grounded in your live data" padded={false}>
          <div className={styles.chat}>
            <div className={styles.messages}>
              {messages.map((m, i) => (
                <div key={i} className={`${styles.msg} ${m.who === "user" ? styles.user : styles.ai}`}>
                  {m.who === "ai" && <span className={styles.aiAvatar}><Sparkles size={14} /></span>}
                  <div className={styles.bubble}>{m.text}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className={styles.suggestion}>{s}</button>
              ))}
            </div>
            <div className={styles.inputRow}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask your copilot…"
              />
              <button onClick={() => send()}><Send size={16} /></button>
            </div>
          </div>
        </Panel>

        <Panel title="AI insights" subtitle="Auto-generated from operations">
          {insights.length === 0 ? (
            <div className={styles.emptyInsights}>
              <Sparkles size={22} />
              <strong>All insights dismissed</strong>
              <p>Generate fresh signals from live data, or restore the ones you cleared.</p>
              <div className={styles.emptyActions}>
                <Btn variant="ghost" onClick={() => restoreAll()}>Restore all</Btn>
                <Btn variant="primary" icon={Sparkles} onClick={() => generate()}>Generate</Btn>
              </div>
            </div>
          ) : (
            <div className={styles.insights}>
              {insights.map((ai) => (
                <div className={styles.insight} key={ai.id}>
                  <button
                    type="button"
                    className={styles.dismissBtn}
                    onClick={() => dismiss(ai.id)}
                    aria-label="Dismiss insight"
                  >
                    <X size={14} />
                  </button>
                  <div className={styles.iHead}>
                    <strong>{ai.title}</strong>
                    <span className={styles.conf}>{ai.confidence}%</span>
                  </div>
                  <p>{ai.body}</p>
                  <div className={styles.iFoot}>
                    {ai.type ? (
                      <Badge tone={ai.type === "risk" ? "danger" : ai.type === "finance" ? "warn" : "success"}>{ai.type}</Badge>
                    ) : (
                      <Badge tone="info">new</Badge>
                    )}
                    <span>{ai.module}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <Panel title="AI capabilities" subtitle="Future-ready, modular intelligence">
        <div className={styles.features}>
          {FEATURES.map((f) => (
            <div className={styles.feature} key={f.name}>
              <span className={styles.fIcon}><f.icon size={18} /></span>
              <strong>{f.name}</strong>
              <span>{f.desc}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
