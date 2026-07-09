import { useState, useEffect, useMemo, useCallback } from "react";

/* ============================================================
   NOS — NEXVORE OPERATING SYSTEM
   RPG de productividad. XP real, rachas, boss fights.
   Sgore dark system: #08080e / #7B2FFF / #FF2D78 / #A78BFF
   ============================================================ */

const C = {
  bg: "#08080e",
  panel: "#0f0f1a",
  panel2: "#14142200",
  line: "#1e1e30",
  purple: "#7B2FFF",
  magenta: "#FF2D78",
  lavender: "#A78BFF",
  body: "#9999BB",
  white: "#F2F0FF",
  green: "#2ED11E",
  gold: "#FFC93C",
};

const ATTRS = {
  disciplina: { label: "Disciplina", color: "#7B2FFF" },
  ventas: { label: "Ventas", color: "#FF2D78" },
  construccion: { label: "Construcción", color: "#A78BFF" },
  salud: { label: "Salud", color: "#2ED11E" },
  fe: { label: "Fe", color: "#FFC93C" },
  aprendizaje: { label: "Aprendizaje", color: "#4DA6FF" },
};

const BLOCKS = [
  {
    id: "n1",
    n: 1,
    name: "ACTIVACIÓN",
    time: "07:00 – 07:30",
    startH: 7, endH: 7.5,
    mission: "Convertirte en alguien que ejecuta sin negociar.",
    bonus: { xp: 25, label: "Bloque completo" },
    challenges: [
      { id: "n1a", t: "Levantarte antes de la 2ª alarma", xp: 5, attr: "disciplina" },
      { id: "n1b", t: "No mirar el teléfono", xp: 10, attr: "disciplina" },
      { id: "n1c", t: "Tomar un vaso de agua", xp: 5, attr: "salud" },
      { id: "n1d", t: "Hacer la cama", xp: 5, attr: "disciplina" },
      { id: "n1e", t: "30 flexiones", xp: 10, attr: "salud" },
      { id: "n1f", t: "Leer 3 páginas de la Biblia", xp: 15, attr: "fe" },
      { id: "n1g", t: "Ducha menor a 5 minutos", xp: 10, attr: "disciplina" },
      { id: "n1h", t: "Vestirte completamente", xp: 5, attr: "disciplina" },
      { id: "n1i", t: "En el escritorio antes de las 7:30", xp: 15, attr: "disciplina" },
    ],
  },
  {
    id: "n2",
    n: 2,
    name: "MODO CAZADOR",
    time: "07:30 – 09:30",
    startH: 7.5, endH: 9.5,
    mission: "Aquí empieza el dinero. Solo conseguir clientes. Nada más.",
    challenges: [
      { id: "n2a", t: "100 mensajes o 20 llamadas antes de las 9:30", xp: 40, attr: "ventas" },
      { id: "n2b", t: "Conseguir 1 reunión", xp: 50, attr: "ventas" },
      { id: "n2c", t: "Conseguir 2 reuniones", xp: 100, attr: "ventas" },
      { id: "n2d", t: "Conseguir un cliente 🏆", xp: 500, attr: "ventas" },
    ],
  },
  {
    id: "n3",
    n: 3,
    name: "CONSTRUCTOR",
    time: "09:30 – 11:30",
    startH: 9.5, endH: 11.5,
    mission: "Ahora sí puedes construir. Landing, creativos, automatizaciones, prompts.",
    challenges: [
      { id: "n3a", t: "Crear 1 activo reutilizable (prompt, landing, componente, sistema)", xp: 50, attr: "construccion" },
    ],
  },
  {
    id: "n4",
    n: 4,
    name: "CUERPO",
    time: "12:00",
    startH: 12, endH: 13.5,
    mission: "Tu cuerpo es tu herramienta principal.",
    challenges: [
      { id: "n4a", t: "Entrenar", xp: 30, attr: "salud" },
      { id: "n4b", t: "No usar el teléfono entre series", xp: 20, attr: "disciplina" },
      { id: "n4c", t: "Una repetición más que ayer", xp: 25, attr: "salud" },
    ],
  },
  {
    id: "n5",
    n: 5,
    name: "APRENDIZAJE",
    time: "13:30",
    startH: 13.5, endH: 15,
    mission: "IA. Ventas. Psicología. Marketing. Programación.",
    challenges: [
      { id: "n5a", t: "45 minutos sin interrupciones", xp: 40, attr: "aprendizaje" },
    ],
  },
  {
    id: "n6",
    n: 6,
    name: "SEGUNDA CACERÍA",
    time: "15:00",
    startH: 15, endH: 17,
    mission: "Seguimientos. WhatsApp. Clientes. Correos. Reuniones.",
    challenges: [
      { id: "n6a", t: "Responder todos los pendientes", xp: 30, attr: "ventas" },
      { id: "n6b", t: "Cerrar una reunión", xp: 50, attr: "ventas" },
      { id: "n6c", t: "Cerrar una venta 🏆", xp: 500, attr: "ventas" },
    ],
  },
  {
    id: "n7",
    n: 7,
    name: "SISTEMAS",
    time: "17:00",
    startH: 17, endH: 21.5,
    mission: "Todo lo aprendido hoy debe quedar documentado.",
    challenges: [
      { id: "n7a", t: "Crear 1 SOP nuevo", xp: 75, attr: "construccion" },
      { id: "n7b", t: "Actualizar el sistema Nexvore", xp: 50, attr: "construccion" },
    ],
  },
  {
    id: "n8",
    n: 8,
    name: "REFLEXIÓN",
    time: "21:30",
    startH: 21.5, endH: 24,
    mission: "No terminar el día viendo TikTok. Terminarlo construyendo.",
    challenges: [
      { id: "n8a", t: "Responder las 4 preguntas del día", xp: 30, attr: "disciplina" },
      { id: "n8b", t: "Dormir antes de las 00:00", xp: 50, attr: "disciplina" },
    ],
  },
];

const SPECIAL_MISSIONS = [
  "Haz una llamada que normalmente evitarías.",
  "Publica un video aunque no quede perfecto.",
  "Lee un capítulo completo.",
  "Escribe una idea de negocio.",
  "Habla con un cliente potencial cara a cara.",
  "Haz 100 flexiones durante el día.",
  "No consumas azúcar hoy.",
  "No escuches música mientras trabajas.",
  "Haz una hora completa de Deep Work.",
];

const BOSSES = [
  { icon: "📞", t: "100 llamadas en un día" },
  { icon: "🎥", t: "Grabar 10 anuncios" },
  { icon: "🧠", t: "Construir una automatización completa" },
  { icon: "💻", t: "Terminar una landing en menos de 4 horas" },
  { icon: "📚", t: "Leer un libro completo durante la semana" },
  { icon: "💰", t: "Conseguir un cliente" },
];

const STREAK_RANKS = [
  { days: 365, label: "Operador Nexvore", icon: "👑" },
  { days: 180, label: "Leyenda", icon: "🔥" },
  { days: 90, label: "Diamante", icon: "💎" },
  { days: 30, label: "Oro", icon: "🥇" },
  { days: 14, label: "Plata", icon: "🥈" },
  { days: 7, label: "Bronce", icon: "🥉" },
];

const REFLECT_QS = [
  "¿Qué gané hoy?",
  "¿Qué perdí hoy?",
  "¿Qué aprendí?",
  "¿Qué mejoraré mañana?",
];

const DAY_WON_XP = 300;
const MISSION_XP = 40;
const BOSS_XP = 300;

/* ---------- helpers ---------- */
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const dayOfYear = () => {
  const d = new Date();
  return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
};
const weekOfYear = () => Math.floor(dayOfYear() / 7);
const isSunday = () => new Date().getDay() === 0;

const levelFromXP = (xp) => {
  let lvl = 1, need = 500, rem = xp;
  while (rem >= need) { rem -= need; lvl++; need = 500 + (lvl - 1) * 250; }
  return { lvl, into: rem, need };
};

const streakFrom = (wonDates) => {
  const set = new Set(wonDates);
  let count = 0;
  const d = new Date();
  // today counts if won; if today not won yet, streak still alive from yesterday
  if (!set.has(todayKey())) d.setDate(d.getDate() - 1);
  while (true) {
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (set.has(k)) { count++; d.setDate(d.getDate() - 1); } else break;
  }
  return count;
};

const emptyDay = () => ({ done: {}, reflections: ["", "", "", ""], missionDone: false, bossDone: false });

/* ---------- component ---------- */
export default function NexvoreOS() {
  const [day, setDay] = useState(emptyDay());
  const [profile, setProfile] = useState({ totalXP: 0, attrs: {}, wonDates: [] });
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(null);
  const [tab, setTab] = useState("hoy"); // hoy | stats
  const [now, setNow] = useState(new Date());
  const dkey = todayKey();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const p = await window.storage.get("nos-profile");
        if (p) setProfile(JSON.parse(p.value));
      } catch (e) {}
      try {
        const d = await window.storage.get(`nos-day:${dkey}`);
        if (d) setDay(JSON.parse(d.value));
      } catch (e) {}
      setLoaded(true);
      // auto-open current block
      const h = new Date().getHours() + new Date().getMinutes() / 60;
      const cur = BLOCKS.find((b) => h >= b.startH && h < b.endH);
      setOpen(cur ? cur.id : "n1");
    })();
  }, []);

  const persist = useCallback(async (newDay, newProfile) => {
    try { await window.storage.set(`nos-day:${dkey}`, JSON.stringify(newDay)); } catch (e) {}
    try { await window.storage.set("nos-profile", JSON.stringify(newProfile)); } catch (e) {}
  }, [dkey]);

  /* XP del día */
  const dayXP = useMemo(() => {
    let xp = 0;
    BLOCKS.forEach((b) => {
      const allDone = b.challenges.every((c) => day.done[c.id]);
      b.challenges.forEach((c) => { if (day.done[c.id]) xp += c.xp; });
      if (b.bonus && allDone) xp += b.bonus.xp;
    });
    if (day.missionDone) xp += MISSION_XP;
    if (day.bossDone) xp += BOSS_XP;
    return xp;
  }, [day]);

  const applyChange = (mutator) => {
    setDay((prev) => {
      const next = mutator(structuredClone(prev));
      setProfile((prof) => {
        const oldXP = calcXP(prev);
        const newXP = calcXP(next);
        const delta = newXP - oldXP;
        const np = structuredClone(prof);
        np.totalXP = Math.max(0, np.totalXP + delta);
        // attrs
        const attrDelta = calcAttrDelta(prev, next);
        Object.entries(attrDelta).forEach(([k, v]) => {
          np.attrs[k] = Math.max(0, (np.attrs[k] || 0) + v);
        });
        // día ganado
        const won = np.wonDates.includes(dkey);
        if (newXP >= DAY_WON_XP && !won) np.wonDates = [...np.wonDates, dkey];
        if (newXP < DAY_WON_XP && won) np.wonDates = np.wonDates.filter((x) => x !== dkey);
        persist(next, np);
        return np;
      });
      return next;
    });
  };

  const calcXP = (d) => {
    let xp = 0;
    BLOCKS.forEach((b) => {
      const allDone = b.challenges.every((c) => d.done[c.id]);
      b.challenges.forEach((c) => { if (d.done[c.id]) xp += c.xp; });
      if (b.bonus && allDone) xp += b.bonus.xp;
    });
    if (d.missionDone) xp += MISSION_XP;
    if (d.bossDone) xp += BOSS_XP;
    return xp;
  };

  const calcAttrDelta = (a, b) => {
    const delta = {};
    BLOCKS.forEach((bl) =>
      bl.challenges.forEach((c) => {
        const was = !!a.done[c.id], is = !!b.done[c.id];
        if (was !== is) delta[c.attr] = (delta[c.attr] || 0) + (is ? c.xp : -c.xp);
      })
    );
    if (a.missionDone !== b.missionDone) delta.disciplina = (delta.disciplina || 0) + (b.missionDone ? MISSION_XP : -MISSION_XP);
    if (a.bossDone !== b.bossDone) delta.disciplina = (delta.disciplina || 0) + (b.bossDone ? BOSS_XP : -BOSS_XP);
    return delta;
  };

  const toggle = (cid) => applyChange((d) => { d.done[cid] = !d.done[cid]; return d; });
  const setReflection = (i, val) =>
    setDay((prev) => {
      const next = { ...prev, reflections: prev.reflections.map((r, j) => (j === i ? val : r)) };
      persist(next, profile);
      return next;
    });

  const { lvl, into, need } = levelFromXP(profile.totalXP);
  const streak = streakFrom(profile.wonDates);
  const rank = STREAK_RANKS.find((r) => streak >= r.days);
  const nextRank = [...STREAK_RANKS].reverse().find((r) => streak < r.days);
  const mission = SPECIAL_MISSIONS[dayOfYear() % SPECIAL_MISSIONS.length];
  const boss = BOSSES[weekOfYear() % BOSSES.length];
  const hourNow = now.getHours() + now.getMinutes() / 60;
  const currentBlock = BLOCKS.find((b) => hourNow >= b.startH && hourNow < b.endH);
  const dayWon = dayXP >= DAY_WON_XP;
  const ringPct = Math.min(1, into / need);

  if (!loaded)
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.body, fontFamily: "Inter, sans-serif", fontSize: 13, letterSpacing: 2 }}>
        CARGANDO NOS…
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, fontFamily: "'Inter', sans-serif", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        textarea { resize: none; }
        textarea:focus, button:focus-visible { outline: 2px solid ${C.purple}; outline-offset: 1px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.55} }
        @keyframes pop { 0%{transform:scale(.9)} 60%{transform:scale(1.05)} 100%{transform:scale(1)} }
      `}</style>

      {/* ===== HEADER ===== */}
      <div style={{ padding: "26px 20px 18px", background: `linear-gradient(180deg, #0d0d1c 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 560, margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: 1 }}>
              N<span style={{ color: C.purple }}>O</span>S
            </div>
            <div style={{ fontSize: 10, color: C.body, letterSpacing: 3, marginTop: 2 }}>NEXVORE OPERATING SYSTEM</div>
          </div>
          {/* Level ring */}
          <div style={{ position: "relative", width: 72, height: 72 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="31" fill="none" stroke={C.line} strokeWidth="5" />
              <circle
                cx="36" cy="36" r="31" fill="none"
                stroke="url(#g1)" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${ringPct * 194.8} 194.8`}
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dasharray .5s ease" }}
              />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={C.purple} />
                  <stop offset="100%" stopColor={C.magenta} />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>{lvl}</div>
              <div style={{ fontSize: 8, color: C.body, letterSpacing: 1 }}>NIVEL</div>
            </div>
          </div>
        </div>

        {/* stats row */}
        <div style={{ display: "flex", gap: 10, maxWidth: 560, margin: "16px auto 0" }}>
          <Stat label="XP HOY" value={dayXP} accent={dayWon ? C.green : C.white} />
          <Stat label="XP TOTAL" value={profile.totalXP.toLocaleString("es-CL")} />
          <Stat label="RACHA" value={`${streak}${rank ? " " + rank.icon : ""}`} accent={streak > 0 ? C.gold : C.body} />
        </div>

        {/* día ganado bar */}
        <div style={{ maxWidth: 560, margin: "14px auto 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, letterSpacing: 1.5, color: C.body, marginBottom: 5 }}>
            <span>{dayWon ? "✅ DÍA GANADO" : "DÍA GANADO A LOS " + DAY_WON_XP + " XP"}</span>
            <span style={{ color: dayWon ? C.green : C.body }}>{Math.min(100, Math.round((dayXP / DAY_WON_XP) * 100))}%</span>
          </div>
          <div style={{ height: 6, background: C.line, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (dayXP / DAY_WON_XP) * 100)}%`, background: dayWon ? C.green : `linear-gradient(90deg, ${C.purple}, ${C.magenta})`, borderRadius: 3, transition: "width .4s ease" }} />
          </div>
          {nextRank && (
            <div style={{ fontSize: 10, color: C.body, marginTop: 6, letterSpacing: 0.5 }}>
              {nextRank.icon} {nextRank.label} a {nextRank.days - streak} día{nextRank.days - streak !== 1 ? "s" : ""} de racha
            </div>
          )}
        </div>

        {/* tabs */}
        <div style={{ display: "flex", gap: 8, maxWidth: 560, margin: "16px auto 0" }}>
          {["hoy", "stats"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "9px 0", borderRadius: 8, border: `1px solid ${tab === t ? C.purple : C.line}`,
              background: tab === t ? "rgba(123,47,255,.15)" : "transparent",
              color: tab === t ? C.white : C.body, fontSize: 11, letterSpacing: 2, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif",
            }}>
              {t === "hoy" ? "HOY" : "ATRIBUTOS"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 16px 0" }}>
        {tab === "stats" ? (
          <AttrPanel profile={profile} />
        ) : (
          <>
            {/* MISIÓN ESPECIAL */}
            <Card border={C.gold}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.gold, fontWeight: 700, marginBottom: 6 }}>⚡ MISIÓN ESPECIAL DEL DÍA · +{MISSION_XP} XP</div>
                  <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{mission}</div>
                </div>
                <Check checked={day.missionDone} color={C.gold} onClick={() => applyChange((d) => { d.missionDone = !d.missionDone; return d; })} />
              </div>
            </Card>

            {/* BOSS FIGHT (domingo) */}
            {isSunday() && (
              <Card border={C.magenta}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.magenta, fontWeight: 700, marginBottom: 6, animation: "pulse 2s infinite" }}>
                      ⚔️ BOSS FIGHT · +{BOSS_XP} XP
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{boss.icon} {boss.t}</div>
                  </div>
                  <Check checked={day.bossDone} color={C.magenta} onClick={() => applyChange((d) => { d.bossDone = !d.bossDone; return d; })} />
                </div>
              </Card>
            )}

            {/* BLOQUES */}
            {BLOCKS.map((b) => {
              const doneCount = b.challenges.filter((c) => day.done[c.id]).length;
              const allDone = doneCount === b.challenges.length;
              const isOpen = open === b.id;
              const isCurrent = currentBlock?.id === b.id;
              const blockXP = b.challenges.reduce((s, c) => s + (day.done[c.id] ? c.xp : 0), 0) + (b.bonus && allDone ? b.bonus.xp : 0);
              return (
                <div key={b.id} style={{
                  background: C.panel, border: `1px solid ${isCurrent ? C.purple : allDone ? "rgba(46,209,30,.4)" : C.line}`,
                  borderRadius: 14, marginBottom: 10, overflow: "hidden",
                  boxShadow: isCurrent ? `0 0 24px rgba(123,47,255,.15)` : "none",
                }}>
                  <button onClick={() => setOpen(isOpen ? null : b.id)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                    background: "transparent", border: "none", cursor: "pointer", color: C.white, textAlign: "left", fontFamily: "'Inter', sans-serif",
                  }}>
                    <div style={{
                      fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 13, width: 34, height: 34, borderRadius: 9,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      background: allDone ? "rgba(46,209,30,.12)" : "rgba(123,47,255,.12)",
                      color: allDone ? C.green : C.lavender, border: `1px solid ${allDone ? "rgba(46,209,30,.35)" : "rgba(123,47,255,.3)"}`,
                    }}>
                      {allDone ? "✓" : b.n}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1.5 }}>{b.name}</span>
                        {isCurrent && <span style={{ fontSize: 9, color: C.purple, letterSpacing: 1, fontWeight: 700, animation: "pulse 2s infinite" }}>● AHORA</span>}
                      </div>
                      <div style={{ fontSize: 11, color: C.body, marginTop: 2 }}>{b.time} · {doneCount}/{b.challenges.length}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: blockXP > 0 ? C.green : C.body, flexShrink: 0 }}>+{blockXP}</div>
                    <div style={{ color: C.body, fontSize: 11, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▼</div>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 16px 16px" }}>
                      <div style={{ fontSize: 12, color: C.lavender, fontStyle: "italic", marginBottom: 12, lineHeight: 1.45, paddingLeft: 2 }}>
                        🎯 {b.mission}
                      </div>
                      {b.challenges.map((c) => (
                        <button key={c.id} onClick={() => toggle(c.id)} style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px",
                          background: day.done[c.id] ? "rgba(46,209,30,.06)" : "rgba(255,255,255,.02)",
                          border: `1px solid ${day.done[c.id] ? "rgba(46,209,30,.25)" : C.line}`,
                          borderRadius: 10, marginBottom: 7, cursor: "pointer", color: C.white, textAlign: "left", fontFamily: "'Inter', sans-serif",
                        }}>
                          <Check checked={!!day.done[c.id]} color={C.green} small />
                          <span style={{ flex: 1, fontSize: 13, lineHeight: 1.35, textDecoration: day.done[c.id] ? "line-through" : "none", opacity: day.done[c.id] ? 0.6 : 1 }}>
                            {c.t}
                          </span>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, flexShrink: 0,
                            background: `${ATTRS[c.attr].color}18`, color: ATTRS[c.attr].color, border: `1px solid ${ATTRS[c.attr].color}35`,
                          }}>
                            +{c.xp}
                          </span>
                        </button>
                      ))}
                      {b.bonus && (
                        <div style={{
                          fontSize: 11, letterSpacing: 1, fontWeight: 700, textAlign: "center", padding: "8px 0", borderRadius: 8, marginTop: 4,
                          color: allDone ? C.green : C.body,
                          background: allDone ? "rgba(46,209,30,.08)" : "transparent",
                          border: `1px dashed ${allDone ? "rgba(46,209,30,.4)" : C.line}`,
                          animation: allDone ? "pop .3s ease" : "none",
                        }}>
                          {allDone ? `🏅 BONUS DESBLOQUEADO +${b.bonus.xp} XP` : `BONUS BLOQUE COMPLETO · +${b.bonus.xp} XP`}
                        </div>
                      )}
                      {b.id === "n8" && (
                        <div style={{ marginTop: 12 }}>
                          {REFLECT_QS.map((q, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                              <div style={{ fontSize: 11, color: C.lavender, fontWeight: 600, marginBottom: 5 }}>{q}</div>
                              <textarea
                                value={day.reflections[i]}
                                onChange={(e) => setReflection(i, e.target.value)}
                                rows={2}
                                placeholder="Escribe aquí…"
                                style={{
                                  width: "100%", background: "rgba(255,255,255,.03)", border: `1px solid ${C.line}`, borderRadius: 8,
                                  padding: "9px 11px", color: C.white, fontSize: 13, fontFamily: "'Inter', sans-serif", lineHeight: 1.4,
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ textAlign: "center", fontSize: 10, color: C.body, letterSpacing: 2, margin: "24px 0 10px", lineHeight: 1.8 }}>
              CADA DÍA ES UNA PARTIDA QUE PUEDES GANAR<br />
              <span style={{ color: C.lavender }}>NEXVORE · {dkey}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- subcomponents ---------- */
function Stat({ label, value, accent }) {
  return (
    <div style={{ flex: 1, background: "#0f0f1a", border: `1px solid #1e1e30`, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 16, color: accent || "#F2F0FF" }}>{value}</div>
      <div style={{ fontSize: 9, color: "#9999BB", letterSpacing: 2, marginTop: 3 }}>{label}</div>
    </div>
  );
}

function Check({ checked, onClick, color, small }) {
  const size = small ? 20 : 26;
  const inner = (
    <div style={{
      width: size, height: size, borderRadius: small ? 6 : 8, flexShrink: 0,
      border: `2px solid ${checked ? color : "#33334d"}`,
      background: checked ? color : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#08080e", fontWeight: 900, fontSize: small ? 12 : 15,
      transition: "all .15s ease",
      animation: checked ? "pop .25s ease" : "none",
    }}>
      {checked ? "✓" : ""}
    </div>
  );
  if (!onClick) return inner;
  return (
    <button onClick={onClick} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>
      {inner}
    </button>
  );
}

function Card({ children, border }) {
  return (
    <div style={{ background: "#0f0f1a", border: `1px solid ${border}40`, borderLeft: `3px solid ${border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
      {children}
    </div>
  );
}

function AttrPanel({ profile }) {
  const max = Math.max(100, ...Object.values(profile.attrs || {}));
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 2.5, color: "#9999BB", fontWeight: 700, margin: "6px 0 16px" }}>
        ATRIBUTOS DEL OPERADOR
      </div>
      {Object.entries(ATTRS).map(([k, a]) => {
        const val = profile.attrs?.[k] || 0;
        return (
          <div key={k} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{a.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: a.color }}>{val.toLocaleString("es-CL")} XP</span>
            </div>
            <div style={{ height: 8, background: "#1e1e30", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, (val / max) * 100)}%`, background: a.color, borderRadius: 4, transition: "width .5s ease" }} />
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 28, fontSize: 10, letterSpacing: 2.5, color: "#9999BB", fontWeight: 700, marginBottom: 14 }}>
        SISTEMA DE RACHAS
      </div>
      {[
        { days: 7, label: "Bronce", icon: "🥉" },
        { days: 14, label: "Plata", icon: "🥈" },
        { days: 30, label: "Oro", icon: "🥇" },
        { days: 90, label: "Diamante", icon: "💎" },
        { days: 180, label: "Leyenda", icon: "🔥" },
        { days: 365, label: "Operador Nexvore", icon: "👑" },
      ].map((r) => {
        const unlocked = streakFrom(profile.wonDates || []) >= r.days;
        return (
          <div key={r.days} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, marginBottom: 8,
            background: unlocked ? "rgba(255,201,60,.07)" : "#0f0f1a",
            border: `1px solid ${unlocked ? "rgba(255,201,60,.35)" : "#1e1e30"}`,
            opacity: unlocked ? 1 : 0.55,
          }}>
            <span style={{ fontSize: 18 }}>{r.icon}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{r.label}</span>
            <span style={{ fontSize: 11, color: "#9999BB" }}>{r.days} días</span>
          </div>
        );
      })}
    </div>
  );
}
