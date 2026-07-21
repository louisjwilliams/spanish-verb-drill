import { useState, useEffect, useCallback } from "react";

// ── Data ────────────────────────────────────────────────────────────────────

const VC = { ser:"#1D9E75",estar:"#378ADD",ir:"#7F77DD",tener:"#f59e0b",hacer:"#ef4444",poder:"#22c55e",querer:"#ec4899",saber:"#14b8a6",venir:"#f97316",decir:"#8b5cf6" };
const TC = { present:"#1D9E75",preterite:"#f59e0b",imperfect:"#7F77DD",future:"#378ADD",conditional:"#e11d48" };
const TENSES = ["present","preterite","imperfect","future","conditional"];
const TL = { present:"Present",preterite:"Preterite",imperfect:"Imperfect",future:"Future",conditional:"Conditional" };
const SUBJS = ["yo","tú","él","nosotros","ustedes"];
const VERB_KEYS = ["ser","estar","ir","tener","hacer","poder","querer","saber","venir","decir"];

const VERBS = {
  ser:{ en:"to be (permanent)", note:"SER/IR share identical preterite forms (fui, fuiste…). Context tells you which. Imperfect era/eras — one of only 3 irregular imperfect verbs. Conditional: sería (regular -ía endings on full infinitive).",
    present:{yo:"soy",tú:"eres",él:"es",nosotros:"somos",ustedes:"son"},
    preterite:{yo:"fui",tú:"fuiste",él:"fue",nosotros:"fuimos",ustedes:"fueron"},
    imperfect:{yo:"era",tú:"eras",él:"era",nosotros:"éramos",ustedes:"eran"},
    future:{yo:"seré",tú:"serás",él:"será",nosotros:"seremos",ustedes:"serán"},
    conditional:{yo:"sería",tú:"serías",él:"sería",nosotros:"seríamos",ustedes:"serían"}},
  estar:{ en:"to be (temporary/state)", note:"Preterite stem: estuv- (UV group). No accent on estuvo/estuve — common mistake. Imperfect is regular. Conditional is regular: estaría, estarías…",
    present:{yo:"estoy",tú:"estás",él:"está",nosotros:"estamos",ustedes:"están"},
    preterite:{yo:"estuve",tú:"estuviste",él:"estuvo",nosotros:"estuvimos",ustedes:"estuvieron"},
    imperfect:{yo:"estaba",tú:"estabas",él:"estaba",nosotros:"estábamos",ustedes:"estaban"},
    future:{yo:"estaré",tú:"estarás",él:"estará",nosotros:"estaremos",ustedes:"estarán"},
    conditional:{yo:"estaría",tú:"estarías",él:"estaría",nosotros:"estaríamos",ustedes:"estarían"}},
  ir:{ en:"to go", note:"IR/SER share all preterite forms. Imperfect iba/ibas — one of only 3 irregular imperfects (note accent: íbamos). Conditional is regular: iría, irías…",
    present:{yo:"voy",tú:"vas",él:"va",nosotros:"vamos",ustedes:"van"},
    preterite:{yo:"fui",tú:"fuiste",él:"fue",nosotros:"fuimos",ustedes:"fueron"},
    imperfect:{yo:"iba",tú:"ibas",él:"iba",nosotros:"íbamos",ustedes:"iban"},
    future:{yo:"iré",tú:"irás",él:"irá",nosotros:"iremos",ustedes:"irán"},
    conditional:{yo:"iría",tú:"irías",él:"iría",nosotros:"iríamos",ustedes:"irían"}},
  tener:{ en:"to have / to hold", note:"Yo present: tengo (g insertion). Preterite: tuv- (UV group). Future + conditional share the stem tendr-: tendré / tendría. Tener que + inf = to have to.",
    present:{yo:"tengo",tú:"tienes",él:"tiene",nosotros:"tenemos",ustedes:"tienen"},
    preterite:{yo:"tuve",tú:"tuviste",él:"tuvo",nosotros:"tuvimos",ustedes:"tuvieron"},
    imperfect:{yo:"tenía",tú:"tenías",él:"tenía",nosotros:"teníamos",ustedes:"tenían"},
    future:{yo:"tendré",tú:"tendrás",él:"tendrá",nosotros:"tendremos",ustedes:"tendrán"},
    conditional:{yo:"tendría",tú:"tendrías",él:"tendría",nosotros:"tendríamos",ustedes:"tendrían"}},
  hacer:{ en:"to do / to make", note:"Yo present: hago. Preterite él: hizo (c→z). Future + conditional share stem har-: haré / haría. Used in weather (hace calor) and time (hace dos años).",
    present:{yo:"hago",tú:"haces",él:"hace",nosotros:"hacemos",ustedes:"hacen"},
    preterite:{yo:"hice",tú:"hiciste",él:"hizo",nosotros:"hicimos",ustedes:"hicieron"},
    imperfect:{yo:"hacía",tú:"hacías",él:"hacía",nosotros:"hacíamos",ustedes:"hacían"},
    future:{yo:"haré",tú:"harás",él:"hará",nosotros:"haremos",ustedes:"harán"},
    conditional:{yo:"haría",tú:"harías",él:"haría",nosotros:"haríamos",ustedes:"harían"}},
  poder:{ en:"to be able to / can", note:"Present o→ue stem change (except nosotros). Preterite: pud- (U group). Future + conditional: podr-: podré / podría. ¿Podrías ayudarme? — essential for polite requests.",
    present:{yo:"puedo",tú:"puedes",él:"puede",nosotros:"podemos",ustedes:"pueden"},
    preterite:{yo:"pude",tú:"pudiste",él:"pudo",nosotros:"pudimos",ustedes:"pudieron"},
    imperfect:{yo:"podía",tú:"podías",él:"podía",nosotros:"podíamos",ustedes:"podían"},
    future:{yo:"podré",tú:"podrás",él:"podrá",nosotros:"podremos",ustedes:"podrán"},
    conditional:{yo:"podría",tú:"podrías",él:"podría",nosotros:"podríamos",ustedes:"podrían"}},
  querer:{ en:"to want / to love", note:"Present e→ie (except nosotros). Preterite: quis- (I group). Future + conditional: querr- (double r): querré / querría. Querría ir a México — I'd love to go.",
    present:{yo:"quiero",tú:"quieres",él:"quiere",nosotros:"queremos",ustedes:"quieren"},
    preterite:{yo:"quise",tú:"quisiste",él:"quiso",nosotros:"quisimos",ustedes:"quisieron"},
    imperfect:{yo:"quería",tú:"querías",él:"quería",nosotros:"queríamos",ustedes:"querían"},
    future:{yo:"querré",tú:"querrás",él:"querrá",nosotros:"querremos",ustedes:"querrán"},
    conditional:{yo:"querría",tú:"querrías",él:"querría",nosotros:"querríamos",ustedes:"querrían"}},
  saber:{ en:"to know (facts/how)", note:"Yo present: sé (one letter + accent). Preterite: sup- (U group). Supe = I found out. Future + conditional: sabr-: sabré / sabría. ¿Sabrías cómo llegar? — very natural.",
    present:{yo:"sé",tú:"sabes",él:"sabe",nosotros:"sabemos",ustedes:"saben"},
    preterite:{yo:"supe",tú:"supiste",él:"supo",nosotros:"supimos",ustedes:"supieron"},
    imperfect:{yo:"sabía",tú:"sabías",él:"sabía",nosotros:"sabíamos",ustedes:"sabían"},
    future:{yo:"sabré",tú:"sabrás",él:"sabrá",nosotros:"sabremos",ustedes:"sabrán"},
    conditional:{yo:"sabría",tú:"sabrías",él:"sabría",nosotros:"sabríamos",ustedes:"sabrían"}},
  venir:{ en:"to come", note:"Yo present: vengo. Preterite: vin- (I group; no accent on vine/vino). Future + conditional: vendr-: vendré / vendría. ¿Vendrías a la fiesta? — extremely common.",
    present:{yo:"vengo",tú:"vienes",él:"viene",nosotros:"venimos",ustedes:"vienen"},
    preterite:{yo:"vine",tú:"viniste",él:"vino",nosotros:"vinimos",ustedes:"vinieron"},
    imperfect:{yo:"venía",tú:"venías",él:"venía",nosotros:"veníamos",ustedes:"venían"},
    future:{yo:"vendré",tú:"vendrás",él:"vendrá",nosotros:"vendremos",ustedes:"vendrán"},
    conditional:{yo:"vendría",tú:"vendrías",él:"vendría",nosotros:"vendríamos",ustedes:"vendrían"}},
  decir:{ en:"to say / to tell", note:"Yo present: digo. Preterite J group: dij- (dijeron NOT dijieron). Future + conditional: dir-: diré / diría. ¿Qué dirías tú? — key for hypotheticals.",
    present:{yo:"digo",tú:"dices",él:"dice",nosotros:"decimos",ustedes:"dicen"},
    preterite:{yo:"dije",tú:"dijiste",él:"dijo",nosotros:"dijimos",ustedes:"dijeron"},
    imperfect:{yo:"decía",tú:"decías",él:"decía",nosotros:"decíamos",ustedes:"decían"},
    future:{yo:"diré",tú:"dirás",él:"dirá",nosotros:"diremos",ustedes:"dirán"},
    conditional:{yo:"diría",tú:"dirías",él:"diría",nosotros:"diríamos",ustedes:"dirían"}},
};

const PROMPTS = {
  ser:{present:{yo:"¿Cómo te describes?",tú:"¿De dónde eres?",él:"Él _____ mi mejor amigo.",nosotros:"Nosotros _____ mexicanos.",ustedes:"¿Ustedes _____ hermanos?"},preterite:{yo:"La fiesta _____ genial.",tú:"¿ _____ tú el primero en llegar?",él:"_____ una noche increíble.",nosotros:"Nosotros _____ los ganadores.",ustedes:"Ustedes _____ muy amables."},imperfect:{yo:"De niño yo _____ muy tímido.",tú:"Tú _____ tan diferente antes.",él:"Él _____ muy alto de joven.",nosotros:"Nosotros _____ muy unidos.",ustedes:"Ustedes _____ muy buenos amigos."},future:{yo:"Algún día _____ famoso.",tú:"Tú _____ un gran médico.",él:"_____ una noche perfecta.",nosotros:"Nosotros _____ los mejores.",ustedes:"Ustedes _____ muy felices."},conditional:{yo:"En tu lugar, yo _____ más cuidadoso.",tú:"¿ _____ tú capaz de hacerlo?",él:"Él _____ un buen líder.",nosotros:"Nosotros _____ perfectos para el trabajo.",ustedes:"Ustedes _____ los mejores candidatos."}},
  estar:{present:{yo:"Hoy yo _____ muy cansado.",tú:"¿Cómo _____ tú?",él:"El café _____ muy caliente.",nosotros:"Nosotros _____ en el mercado.",ustedes:"¿Dónde _____ ustedes ahora?"},preterite:{yo:"Ayer yo _____ en casa todo el día.",tú:"¿Dónde _____ tú anoche?",él:"Él _____ muy ocupado ayer.",nosotros:"Nosotros _____ en Oaxaca.",ustedes:"¿Ustedes _____ en la fiesta?"},imperfect:{yo:"Yo _____ esperando el camión.",tú:"¿ _____ tú bien cuando te llamé?",él:"Él _____ dormido cuando llegué.",nosotros:"Nosotros _____ muy cansados.",ustedes:"Ustedes _____ muy emocionados."},future:{yo:"Mañana _____ en Guadalajara.",tú:"¿Dónde _____ tú el sábado?",él:"Él _____ aquí a las ocho.",nosotros:"Nosotros _____ listos a las diez.",ustedes:"¿Ustedes _____ disponibles?"},conditional:{yo:"Sin el tráfico, ya _____ en casa.",tú:"¿Dónde _____ tú si pudieras vivir en cualquier lugar?",él:"Él _____ más tranquilo con más tiempo.",nosotros:"Nosotros _____ mejor preparados.",ustedes:"Ustedes _____ muy cómodos allá."}},
  ir:{present:{yo:"Los domingos yo _____ al mercado.",tú:"¿A dónde _____ tú ahorita?",él:"Él _____ al trabajo en metro.",nosotros:"Nosotros _____ al partido esta noche.",ustedes:"¿Ustedes _____ a la fiesta?"},preterite:{yo:"Ayer yo _____ al médico.",tú:"¿ _____ tú a la reunión?",él:"Él _____ a Cancún el verano pasado.",nosotros:"Nosotros _____ al cine el viernes.",ustedes:"¿Ustedes _____ juntos?"},imperfect:{yo:"De niño, yo _____ al parque todos los días.",tú:"¿Tú _____ a esa escuela también?",él:"Él _____ al gimnasio cada mañana.",nosotros:"Nosotros _____ a la playa cada verano.",ustedes:"Ustedes siempre _____ juntos."},future:{yo:"El próximo mes _____ a Colombia.",tú:"¿ _____ tú con nosotros?",él:"Él _____ a hablar con el jefe.",nosotros:"Nosotros _____ a Puebla este fin de semana.",ustedes:"¿Ustedes _____ a la conferencia?"},conditional:{yo:"Yo _____ a México si tuviera tiempo.",tú:"¿ _____ tú con nosotros si pudieras?",él:"Él _____ con gusto pero trabaja.",nosotros:"Nosotros _____ más seguido si viviéramos cerca.",ustedes:"¿Ustedes _____ a vivir al extranjero?"}},
  tener:{present:{yo:"Yo _____ que trabajar mañana.",tú:"¿Cuántos años _____ tú?",él:"Él _____ mucha experiencia.",nosotros:"Nosotros _____ una reservación.",ustedes:"¿Ustedes _____ hambre?"},preterite:{yo:"Ayer yo _____ mucho trabajo.",tú:"¿ _____ tú tiempo para llamarme?",él:"Él _____ que cancelar la cita.",nosotros:"Nosotros _____ que esperar dos horas.",ustedes:"¿Ustedes _____ problemas?"},imperfect:{yo:"Cuando era niño, yo _____ un perro.",tú:"Tú _____ mucho talento de joven.",él:"Él _____ miedo de la oscuridad.",nosotros:"Nosotros _____ poco dinero.",ustedes:"Ustedes _____ razón."},future:{yo:"Yo _____ más tiempo libre pronto.",tú:"Tú _____ que estudiar mucho.",él:"Él _____ que tomar una decisión.",nosotros:"Nosotros _____ noticias pronto.",ustedes:"Ustedes _____ que esperar."},conditional:{yo:"Yo _____ más paciencia si durmiera bien.",tú:"¿ _____ tú miedo en esa situación?",él:"Él _____ que renunciar si eso pasara.",nosotros:"Nosotros _____ más tiempo sin tanto tráfico.",ustedes:"¿Ustedes _____ la misma reacción?"}},
  hacer:{present:{yo:"¿Qué _____ yo con tanto tiempo?",tú:"¿Qué _____ tú los fines de semana?",él:"Él _____ ejercicio todos los días.",nosotros:"Nosotros _____ la comida juntos.",ustedes:"¿Qué _____ ustedes esta noche?"},preterite:{yo:"Ayer yo _____ la tarea por la noche.",tú:"¿Qué _____ tú ayer?",él:"Él lo _____ todo solo.",nosotros:"Nosotros _____ una fiesta la semana pasada.",ustedes:"¿Qué _____ ustedes el fin de semana?"},imperfect:{yo:"Yo _____ deporte todos los días.",tú:"¿Qué _____ tú cuando te llamé?",él:"Él siempre _____ lo mismo.",nosotros:"Nosotros _____ todo juntos.",ustedes:"Ustedes _____ mucho ruido."},future:{yo:"Yo _____ todo lo posible.",tú:"¿Qué _____ tú si pudieras?",él:"Él _____ lo necesario.",nosotros:"Nosotros _____ las reservaciones.",ustedes:"¿Qué _____ ustedes?"},conditional:{yo:"Yo _____ lo mismo en tu lugar.",tú:"¿Qué _____ tú con un millón de pesos?",él:"Él _____ cualquier cosa por su familia.",nosotros:"Nosotros _____ lo mismo otra vez.",ustedes:"¿Qué _____ ustedes si pudieran?"}},
  poder:{present:{yo:"No _____ creerlo.",tú:"¿ _____ tú ayudarme?",él:"Él no _____ venir hoy.",nosotros:"Nosotros _____ salir más temprano.",ustedes:"¿Ustedes _____ quedarse?"},preterite:{yo:"No _____ abrir la botella.",tú:"¿ _____ tú hablar con él?",él:"Él no _____ llegar a tiempo.",nosotros:"No _____ terminar el proyecto.",ustedes:"¿Ustedes _____ resolverlo?"},imperfect:{yo:"De joven, yo _____ correr muy rápido.",tú:"Antes tú _____ hacerlo fácilmente.",él:"Él no _____ dormir bien.",nosotros:"Nosotros _____ hablar por horas.",ustedes:"Ustedes _____ trabajar mucho."},future:{yo:"Mañana _____ ayudarte.",tú:"¿ _____ tú venir el martes?",él:"Él _____ salir más temprano.",nosotros:"Nosotros _____ salir antes.",ustedes:"¿Ustedes _____ quedarse?"},conditional:{yo:"¿ _____ yo pedirte un favor?",tú:"¿ _____ tú explicármelo?",él:"Él _____ ayudarnos si quisiera.",nosotros:"Nosotros _____ terminar antes si empezamos ya.",ustedes:"¿Ustedes _____ venir el viernes?"}},
  querer:{present:{yo:"Yo _____ aprender español.",tú:"¿ _____ tú un café?",él:"Él _____ hablar contigo.",nosotros:"Nosotros _____ ir al concierto.",ustedes:"¿Ustedes _____ comer algo?"},preterite:{yo:"Yo _____ llamarte pero no pude.",tú:"¿ _____ tú venir y no pudiste?",él:"Él no _____ escuchar los consejos.",nosotros:"Nosotros _____ ayudar pero era tarde.",ustedes:"¿Ustedes _____ participar?"},imperfect:{yo:"Yo _____ ser astronauta de niño.",tú:"Tú siempre _____ tener un gato.",él:"Él _____ cambiar de trabajo.",nosotros:"Nosotros _____ mudarnos a la ciudad.",ustedes:"Ustedes siempre _____ más."},future:{yo:"Siempre _____ aprender más.",tú:"¿ _____ tú venir con nosotros?",él:"Él _____ hablar mañana.",nosotros:"Nosotros _____ saberlo pronto.",ustedes:"¿Ustedes _____ participar?"},conditional:{yo:"Yo _____ vivir en México si pudiera.",tú:"¿ _____ tú intentarlo de nuevo?",él:"Él _____ cambiar muchas cosas.",nosotros:"Nosotros _____ ir pero no tenemos tiempo.",ustedes:"¿ _____ ustedes repetirlo?"}},
  saber:{present:{yo:"Yo _____ hablar español un poco.",tú:"¿ _____ tú cocinar?",él:"Él _____ la respuesta.",nosotros:"Nosotros no _____ qué pasó.",ustedes:"¿Ustedes _____ dónde está?"},preterite:{yo:"Yo _____ la verdad ayer.",tú:"¿ _____ tú la noticia?",él:"Él _____ que ganó hasta hoy.",nosotros:"Nosotros _____ la verdad después.",ustedes:"¿Cuándo _____ ustedes?"},imperfect:{yo:"Yo no _____ que eras tú.",tú:"¿ _____ tú que iba a pasar esto?",él:"Él _____ mucho sobre historia.",nosotros:"Nosotros _____ que era difícil.",ustedes:"Ustedes _____ la respuesta."},future:{yo:"Pronto _____ si pasé el examen.",tú:"Tú _____ la verdad mañana.",él:"Él _____ los resultados el lunes.",nosotros:"Nosotros _____ la respuesta.",ustedes:"Ustedes _____ todo pronto."},conditional:{yo:"Yo _____ qué hacer en esa situación.",tú:"¿ _____ tú cómo llegar allá?",él:"Él _____ la respuesta si estudiara más.",nosotros:"Nosotros _____ manejarlo mejor.",ustedes:"¿Ustedes _____ qué decirle?"}},
  venir:{present:{yo:"Yo _____ del trabajo ahora.",tú:"¿A qué hora _____ tú?",él:"Él _____ todos los martes.",nosotros:"Nosotros _____ a la reunión juntos.",ustedes:"¿Ustedes _____ al partido?"},preterite:{yo:"Ayer yo _____ directamente de la oficina.",tú:"¿Por qué no _____ tú?",él:"Él no _____ a la fiesta.",nosotros:"Nosotros _____ en avión.",ustedes:"¿Ustedes _____ juntos?"},imperfect:{yo:"Yo _____ a este café todos los días.",tú:"Tú siempre _____ a visitarme.",él:"Él _____ muy seguido.",nosotros:"Nosotros _____ aquí cada semana.",ustedes:"Ustedes _____ muy seguido."},future:{yo:"Yo _____ contigo si puedo.",tú:"¿ _____ tú mañana?",él:"Él _____ en el vuelo de la tarde.",nosotros:"Nosotros _____ el próximo fin de semana.",ustedes:"¿Ustedes _____ a la conferencia?"},conditional:{yo:"Yo _____ si no tuviera tanto trabajo.",tú:"¿ _____ tú a vivir a México?",él:"Él _____ con gusto si lo invitaran.",nosotros:"Nosotros _____ más seguido si pudiéramos.",ustedes:"¿ _____ ustedes a la fiesta el sábado?"}},
  decir:{present:{yo:"Yo le _____ la verdad siempre.",tú:"¿Qué _____ tú cuando te pregunten?",él:"Él _____ que no puede venir.",nosotros:"Nosotros _____ que es buena idea.",ustedes:"¿Qué _____ ustedes?"},preterite:{yo:"Yo le _____ que sí.",tú:"¿Qué _____ tú?",él:"Él me _____ que llegaba tarde.",nosotros:"Nosotros _____ que era imposible.",ustedes:"¿Qué _____ ustedes?"},imperfect:{yo:"Yo siempre _____ la verdad.",tú:"Tú _____ que ibas a cambiar.",él:"Él _____ que sí pero no cumplió.",nosotros:"Nosotros _____ que era tarde.",ustedes:"Ustedes _____ lo mismo siempre."},future:{yo:"Yo le _____ lo que pienso.",tú:"¿Qué _____ tú?",él:"Él _____ lo que sea necesario.",nosotros:"Nosotros _____ la verdad.",ustedes:"¿Ustedes _____ algo?"},conditional:{yo:"Yo le _____ la verdad en tu lugar.",tú:"¿Qué _____ tú si te preguntaran?",él:"Él _____ que sí, pero no lo haría.",nosotros:"Nosotros _____ lo mismo.",ustedes:"¿Qué _____ ustedes en esa situación?"}},
};

// ── Storage helpers (in-memory, no localStorage) ────────────────────────────

function defSaved() {
  const vs = {};
  VERB_KEYS.forEach(v => { vs[v] = { correct: 0, wrong: 0 }; });
  return { activeVerbs: [...VERB_KEYS], activeTenses: ["present","preterite"], allTimeCorrect: 0, allTimeWrong: 0, sessions: 0, bestStreak: 0, verbStats: vs };
}

async function loadFromStorage() {
  try {
    const r = await window.storage.get("spanish-drill-v2");
    if (r && r.value) {
      const p = JSON.parse(r.value);
      const base = defSaved();
      const merged = { ...base, ...p };
      VERB_KEYS.forEach(v => { if (!merged.verbStats[v]) merged.verbStats[v] = { correct: 0, wrong: 0 }; });
      return merged;
    }
  } catch(e) {}
  return defSaved();
}

async function saveToStorage(data) {
  try { await window.storage.set("spanish-drill-v2", JSON.stringify(data)); } catch(e) {}
}

// ── Shuffle ─────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQueue(activeVerbs, activeTenses) {
  const items = [];
  activeVerbs.forEach(v => activeTenses.forEach(t => SUBJS.forEach(s => items.push({ verb: v, tense: t, subject: s }))));
  return shuffle(items);
}

// ── Components ───────────────────────────────────────────────────────────────

function Pill({ label, color, small }) {
  return (
    <span style={{
      display: "inline-block",
      padding: small ? "2px 7px" : "3px 10px",
      borderRadius: 20,
      fontSize: small ? 10 : 11,
      fontWeight: 700,
      color: "#fff",
      background: color,
      lineHeight: 1.5,
    }}>{label}</span>
  );
}

function FilterBtn({ label, color, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      borderRadius: 6, padding: "5px 12px", fontSize: 13, cursor: "pointer",
      border: "none", fontWeight: active ? 700 : 400,
      background: active ? color : "rgba(80,80,100,0.3)",
      color: active ? "#fff" : "#888",
      transition: "all .15s",
    }}>{label}</button>
  );
}

function StatBox({ num, label }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "8px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#f0f0f4" }}>{num}</div>
      <div style={{ fontSize: 10, color: "#8888a0", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ConjTable({ verb }) {
  return (
    <div style={{ overflowX: "auto", marginTop: 8 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ padding: "4px 6px", textAlign: "left", color: "#8888a0", fontWeight: 400, borderBottom: "1px solid rgba(255,255,255,0.08)" }}></th>
            {TENSES.map(t => (
              <th key={t} style={{ padding: "4px 6px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <Pill label={TL[t]} color={TC[t]} small />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SUBJS.map(s => (
            <tr key={s}>
              <td style={{ padding: "5px 6px", color: "#8888a0", fontSize: 11, borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" }}>{s}</td>
              {TENSES.map(t => (
                <td key={t} style={{ padding: "5px 6px", color: "#f0f0f4", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{VERBS[verb][t][s]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [saved, setSaved] = useState(null);
  const [activeVerbs, setActiveVerbs] = useState(new Set(VERB_KEYS));
  const [activeTenses, setActiveTenses] = useState(new Set(["present","preterite"]));
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionWrong, setSessionWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [result, setResult] = useState(null); // null | "correct" | "wrong"
  const [showTable, setShowTable] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [panel, setPanel] = useState("drill"); // "drill" | "stats"
  const [saveMsg, setSaveMsg] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    loadFromStorage().then(data => {
      setSaved(data);
      setActiveVerbs(new Set(data.activeVerbs));
      setActiveTenses(new Set(data.activeTenses));
      setLoaded(true);
    });
  }, []);

  // Rebuild queue when filters or saved data changes
  useEffect(() => {
    if (!loaded) return;
    const q = buildQueue([...activeVerbs], [...activeTenses]);
    setQueue(q);
    setIdx(0);
    setSessionScore(0);
    setSessionWrong(0);
    setStreak(0);
    setAnswered(false);
    setInputVal("");
    setResult(null);
    setShowTable(false);
    setShowNote(false);
  }, [activeVerbs, activeTenses, loaded]);

  const persist = useCallback((newSaved) => {
    saveToStorage(newSaved);
    setSaveMsg("✓ Saved");
    setTimeout(() => setSaveMsg(""), 2000);
  }, []);

  function toggleVerb(v) {
    setActiveVerbs(prev => {
      const next = new Set(prev);
      if (next.has(v)) { if (next.size > 1) next.delete(v); }
      else next.add(v);
      if (saved) {
        const ns = { ...saved, activeVerbs: [...next] };
        setSaved(ns); persist(ns);
      }
      return next;
    });
  }

  function allVerbs() {
    const next = new Set(VERB_KEYS);
    setActiveVerbs(next);
    if (saved) {
      const ns = { ...saved, activeVerbs: [...next] };
      setSaved(ns); persist(ns);
    }
  }

  function toggleTense(t) {
    setActiveTenses(prev => {
      const next = new Set(prev);
      if (next.has(t)) { if (next.size > 1) next.delete(t); }
      else next.add(t);
      if (saved) {
        const ns = { ...saved, activeTenses: [...next] };
        setSaved(ns); persist(ns);
      }
      return next;
    });
  }

  function checkAnswer() {
    if (answered || !inputVal.trim()) return;
    const cur = queue[idx];
    if (!cur) return;
    const answer = VERBS[cur.verb][cur.tense][cur.subject];
    const norm = s => s.toLowerCase().replace(/\s+/g, "");
    const ok = norm(inputVal) === norm(answer);
    setAnswered(true);
    setResult(ok ? "correct" : "wrong");

    setSaved(prev => {
      if (!prev) return prev;
      const vs = { ...prev.verbStats, [cur.verb]: { correct: prev.verbStats[cur.verb].correct + (ok ? 1 : 0), wrong: prev.verbStats[cur.verb].wrong + (ok ? 0 : 1) } };
      const newStreak = ok ? streak + 1 : 0;
      const ns = { ...prev, allTimeCorrect: prev.allTimeCorrect + (ok ? 1 : 0), allTimeWrong: prev.allTimeWrong + (ok ? 0 : 1), bestStreak: Math.max(prev.bestStreak, newStreak), verbStats: vs };
      persist(ns);
      return ns;
    });
    if (ok) { setSessionScore(s => s + 1); setStreak(s => s + 1); }
    else { setSessionWrong(s => s + 1); setStreak(0); }
    setIdx(i => i + 1);
  }

  function nextCard() {
    setAnswered(false);
    setInputVal("");
    setResult(null);
    setShowTable(false);
    setShowNote(false);
  }

  function newRound() {
    const q = buildQueue([...activeVerbs], [...activeTenses]);
    setQueue(q);
    setIdx(0);
    setSessionScore(0);
    setSessionWrong(0);
    setStreak(0);
    setAnswered(false);
    setInputVal("");
    setResult(null);
    setShowTable(false);
    setShowNote(false);
  }

  function finishSession() {
    setSaved(prev => {
      if (!prev) return prev;
      const ns = { ...prev, sessions: prev.sessions + 1 };
      persist(ns);
      return ns;
    });
  }

  const cur = queue[idx - (answered ? 1 : 0)];
  const isComplete = idx >= queue.length && answered;
  const pct = queue.length ? Math.round((Math.min(idx, queue.length) / queue.length) * 100) : 0;
  const totalAnswered = sessionScore + sessionWrong;
  const sessionPct = totalAnswered ? Math.round(sessionScore / totalAnswered * 100) : 0;
  const allTimePct = saved && (saved.allTimeCorrect + saved.allTimeWrong) ? Math.round(saved.allTimeCorrect / (saved.allTimeCorrect + saved.allTimeWrong) * 100) : 0;

  const cardBg = "rgba(255,255,255,0.04)";
  const border = "1px solid rgba(255,255,255,0.08)";

  if (!loaded) return (
    <div style={{ background: "#0f0f13", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#8888a0", fontFamily: "-apple-system, sans-serif" }}>
      Cargando…
    </div>
  );

  return (
    <div style={{ background: "#0f0f13", minHeight: "100vh", color: "#f0f0f4", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 15 }}>

      {/* Header */}
      <div style={{ background: "#1a1a22", borderBottom: border, padding: "14px 16px", position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>
          Spanish <span style={{ color: "#1D9E75" }}>Verb</span> Drill
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["drill","stats"].map((p, i) => (
            <button key={p} onClick={() => setPanel(p)} style={{
              padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: "none", cursor: "pointer",
              background: panel === p ? "#1D9E75" : "rgba(80,80,100,0.4)",
              color: panel === p ? "#fff" : "#888",
            }}>{i === 0 ? "Drill" : "Stats"}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 14px 32px", maxWidth: 620, margin: "0 auto" }}>

        {/* ── DRILL PANEL ── */}
        {panel === "drill" && (
          <>
            {/* Verb filters */}
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#8888a0", marginBottom: 6 }}>Verbs</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
              {VERB_KEYS.map(v => <FilterBtn key={v} label={v} color={VC[v]} active={activeVerbs.has(v)} onClick={() => toggleVerb(v)} />)}
              <button onClick={allVerbs} style={{ borderRadius: 6, padding: "5px 10px", fontSize: 11, cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#8888a0" }}>all</button>
            </div>

            {/* Tense filters */}
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#8888a0", marginBottom: 6 }}>Tenses</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
              {TENSES.map(t => <FilterBtn key={t} label={TL[t]} color={TC[t]} active={activeTenses.has(t)} onClick={() => toggleTense(t)} />)}
            </div>

            {/* Save indicator + welcome banner */}
            <div style={{ fontSize: 11, color: "#8888a0", textAlign: "right", minHeight: 16, marginBottom: 4 }}>{saveMsg}</div>
            {saved && (saved.allTimeCorrect + saved.allTimeWrong) > 0 && (
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#8888a0", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", border }}>
                <span>Welcome back! <strong style={{ color: "#f0f0f4" }}>{allTimePct}%</strong> all-time · {saved.sessions} session{saved.sessions !== 1 ? "s" : ""}</span>
                {saved.bestStreak > 0 && <span style={{ whiteSpace: "nowrap" }}>Best: {saved.bestStreak} 🔥</span>}
              </div>
            )}

            {/* Progress bar */}
            <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "#1D9E75", borderRadius: 2, transition: "width .4s" }} />
            </div>

            {/* Session stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 12 }}>
              <StatBox num={sessionScore} label="correct" />
              <StatBox num={sessionWrong} label="wrong" />
              <StatBox num={streak} label="streak 🔥" />
              <StatBox num={Math.max(0, queue.length - idx)} label="left" />
            </div>

            {/* ── Card ── */}
            {isComplete ? (
              <div style={{ background: cardBg, borderRadius: 14, padding: "2rem 1.25rem", border, textAlign: "center" }} ref={() => finishSession()}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{sessionPct >= 80 ? "🎉" : sessionPct >= 60 ? "💪" : "📚"}</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Round complete!</div>
                <div style={{ fontSize: 14, color: "#8888a0", marginBottom: 4 }}>{sessionScore}/{totalAnswered} correct this session ({sessionPct}%)</div>
                {saved && <div style={{ fontSize: 13, color: "#8888a0", marginBottom: 20 }}>All-time: {saved.allTimeCorrect} correct / {saved.allTimeWrong} wrong</div>}
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={newRound} style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>New round</button>
                  <button onClick={() => setPanel("stats")} style={{ background: "rgba(255,255,255,0.08)", color: "#ccc", border, borderRadius: 10, padding: "10px 16px", fontSize: 13, cursor: "pointer" }}>View stats</button>
                </div>
              </div>
            ) : cur ? (
              <div style={{ background: cardBg, borderRadius: 14, padding: "1.25rem", border }}>
                {/* Verb header */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800 }}>{cur.verb}</span>
                  <Pill label={TL[cur.tense]} color={TC[cur.tense]} />
                </div>
                <div style={{ fontSize: 13, color: "#8888a0", marginBottom: 12 }}>{VERBS[cur.verb].en}</div>

                {/* Prompt */}
                <div style={{ fontSize: 14, color: "#8888a0", lineHeight: 1.6, marginBottom: 12 }}>
                  {(PROMPTS[cur.verb]?.[cur.tense]?.[cur.subject] || `Conjugate ${cur.verb} for ${cur.subject}`).split("_____").map((part, i, arr) => (
                    <span key={i}>{part}{i < arr.length - 1 && <strong style={{ color: "#f0f0f4" }}>_____</strong>}</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "#8888a0", marginBottom: 10 }}>
                  Subject: <strong style={{ color: "#f0f0f4", fontSize: 14 }}>{cur.subject}</strong>
                </div>

                {/* Input */}
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && checkAnswer()}
                    disabled={answered}
                    autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                    placeholder="type conjugation…"
                    style={{
                      flex: 1, fontSize: 17, padding: "10px 12px", borderRadius: 10,
                      border: `1.5px solid ${result === "correct" ? "#22c55e" : result === "wrong" ? "#ef4444" : "rgba(255,255,255,0.15)"}`,
                      background: result === "correct" ? "rgba(34,197,94,0.08)" : result === "wrong" ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)",
                      color: "#f0f0f4", outline: "none",
                    }}
                  />
                  <button onClick={checkAnswer} style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Check</button>
                </div>

                {/* Feedback */}
                {answered && (
                  <div style={{
                    borderRadius: 10, padding: "10px 12px", fontSize: 13, lineHeight: 1.6, marginBottom: 8,
                    background: result === "correct" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                    borderLeft: `3px solid ${result === "correct" ? "#22c55e" : "#ef4444"}`,
                    color: result === "correct" ? "#86efac" : "#fca5a5",
                  }}>
                    {result === "correct"
                      ? <>✓ ¡Correcto! <strong style={{ color: "#fff" }}>{VERBS[cur.verb][cur.tense][cur.subject]}</strong></>
                      : <>✗ Answer: <strong style={{ color: "#fff" }}>{VERBS[cur.verb][cur.tense][cur.subject]}</strong> — you wrote "{inputVal}"</>
                    }
                  </div>
                )}

                {/* Pattern note */}
                {showNote && (
                  <div style={{ background: "rgba(245,158,11,0.08)", borderLeft: "3px solid #f59e0b", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#fcd34d", lineHeight: 1.6, marginBottom: 8 }}>
                    {VERBS[cur.verb].note}
                  </div>
                )}

                {/* Table toggle */}
                <button onClick={() => setShowTable(v => !v)} style={{ background: "none", border: "none", color: "#818cf8", fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: "4px 0", display: "block", marginBottom: 4 }}>
                  {showTable ? "hide table ▴" : "see conjugation table ▾"}
                </button>
                {showTable && <ConjTable verb={cur.verb} />}

                {/* Action row */}
                {answered && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <button onClick={nextCard} style={{ background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Next →</button>
                    <button onClick={() => setShowNote(v => !v)} style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.15)", color: "#8888a0", borderRadius: 10, padding: "10px 14px", fontSize: 13, cursor: "pointer" }}>
                      {showNote ? "hide note" : "why?"}
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </>
        )}

        {/* ── STATS PANEL ── */}
        {panel === "stats" && saved && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#8888a0", marginBottom: 8 }}>Accuracy by verb</div>
            {VERB_KEYS.map(v => {
              const s = saved.verbStats[v];
              const tot = s.correct + s.wrong;
              const p = tot ? Math.round(s.correct / tot * 100) : 0;
              const barColor = p >= 80 ? "#22c55e" : p >= 50 ? "#f59e0b" : "#ef4444";
              return (
                <div key={v} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ width: 62, fontSize: 13, fontWeight: 700, color: VC[v], flexShrink: 0 }}>{v}</span>
                  <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${tot ? p : 0}%`, background: barColor, borderRadius: 3, transition: "width .5s" }} />
                  </div>
                  <span style={{ fontSize: 12, color: "#8888a0", width: 34, textAlign: "right", flexShrink: 0 }}>{tot ? `${p}%` : "—"}</span>
                  <span style={{ fontSize: 11, color: "#8888a0", width: 48, textAlign: "right", flexShrink: 0 }}>{s.correct}/{tot}</span>
                </div>
              );
            })}

            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#8888a0", marginTop: 20, marginBottom: 8 }}>All-time</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 6 }}>
              <StatBox num={saved.allTimeCorrect} label="correct" />
              <StatBox num={saved.allTimeWrong} label="wrong" />
              <StatBox num={saved.sessions} label="sessions" />
              <StatBox num={saved.bestStreak} label="best streak 🔥" />
            </div>

            <button onClick={() => {
              if (confirm("Reset all stats? This cannot be undone.")) {
                const ns = defSaved();
                setSaved(ns); setActiveVerbs(new Set(ns.activeVerbs)); setActiveTenses(new Set(ns.activeTenses));
                saveToStorage(ns); setPanel("drill");
              }
            }} style={{ marginTop: 16, width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "#8888a0", borderRadius: 10, padding: "9px", fontSize: 13, cursor: "pointer" }}>
              Reset all stats
            </button>
          </>
        )}
      </div>
    </div>
  );
}
