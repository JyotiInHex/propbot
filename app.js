// ============================================================
// PROPBOT — Main Application Logic
// ============================================================

let GEMINI_KEY = "AIzaSyB0556qA6SwQiu5iBq-0FFFmL9PjrBhjH0";
let ELEVEN_KEY = "";
let GEMINI_MODEL = "gemini-2.5-flash";

let history = [];
let isLoading = false;
let recog = null;
let micActive = false;

// ── INIT ────────────────────────────────────────────────────
window.addEventListener("load", () => {
  renderSidebar();
  updateStatus();
  TTS.preloadVoices();

  if (GEMINI_KEY) {
    TTS.elevenKey = ELEVEN_KEY;
    document.getElementById("welcomeScreen")?.remove();
    setTimeout(() => {
      appendMsg(
        "bot",
        "👋 Welcome to **PropBot**! I'm your real estate AI for Guwahati.\n\nI have detailed data on **Ramest Tower** (Panjabari, from ₹53L) and **Discovery Villa** (Beltola, from ₹1.15Cr). Ask me anything — prices, investment potential, floor plans, or click 🎙️ to speak!",
        true,
      );
    }, 450);
  } else {
    setTimeout(openSettings, 700);
  }
});

// ── SETTINGS ────────────────────────────────────────────────
function openSettings() {
  document.getElementById("geminiKey").value = GEMINI_KEY;
  document.getElementById("xiKey").value = ELEVEN_KEY;
  document.getElementById("modelSel").value = GEMINI_MODEL;
  document.getElementById("settingsModal").classList.add("open");
}

function closeSettings() {
  document.getElementById("settingsModal").classList.remove("open");
}

function saveSettings() {
  GEMINI_KEY = document.getElementById("geminiKey").value.trim();
  ELEVEN_KEY = document.getElementById("xiKey").value.trim();
  GEMINI_MODEL = document.getElementById("modelSel").value;
  TTS.elevenKey = ELEVEN_KEY;
  closeSettings();
  updateStatus();

  if (GEMINI_KEY) {
    document.getElementById("welcomeScreen")?.remove();
    const voiceNote = ELEVEN_KEY
      ? " ElevenLabs premium voice is ready 🔊"
      : " (add ElevenLabs key for premium voice)";
    appendMsg(
      "bot",
      `✅ **Connected!**${voiceNote}\n\nAsk me anything about **Ramest Tower** or **Discovery Villa**. Use the 🎙️ mic or type below!`,
      true,
    );
  }
}

function updateStatus() {
  const pill = document.getElementById("statusPill");
  const txt = document.getElementById("statusText");
  if (GEMINI_KEY) {
    pill.classList.add("connected");
    txt.textContent = ELEVEN_KEY ? "AI + Voice Ready" : "AI Ready";
  } else {
    pill.classList.remove("connected");
    txt.textContent = "Not connected";
  }
}

// Close modal on backdrop click
document.getElementById("settingsModal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeSettings();
});

// ── SIDEBAR ─────────────────────────────────────────────────
function renderSidebar() {
  const el = document.getElementById("propList");
  const groups = {};
  PROPS.forEach((p) => {
    if (!groups[p.name]) groups[p.name] = [];
    groups[p.name].push(p);
  });

  el.innerHTML = Object.entries(groups)
    .map(([name, ps]) => {
      const minP = Math.min(...ps.map((p) => p.priceRaw));
      const minFmt = ps.find((p) => p.priceRaw === minP).price;
      const bhks = [...new Set(ps.map((p) => p.bhk))];
      const bhkTxt =
        bhks.length > 1
          ? `${Math.min(...bhks)}–${Math.max(...bhks)} BHK`
          : `${bhks[0]} BHK`;
      const score = ps[0].invest;
      const pct = ((score / 10) * 100).toFixed(0);

      return `<div class="prop-card" onclick="askProp('${name}', this)">
  <div class="pc-name">${name}</div>
  <div class="pc-loc">📍 ${ps[0].area} · ${ps[0].loc}</div>
  <div class="pc-tags">
    <span class="tag tag-bhk">${bhkTxt}</span>
    <span class="tag tag-price">From ${minFmt}</span>
    <span class="tag tag-stat">${ps[0].status}</span>
    ${ps[0].rera ? '<span class="tag tag-rera">RERA ✓</span>' : ""}
  </div>
  <div class="prop-score-bar">
    <span class="score-label">Invest</span>
    <div class="score-track"><div class="score-fill" style="width:${pct}%"></div></div>
    <span class="score-val">${score}/10</span>
  </div>
</div>`;
    })
    .join("");
}

function askProp(name, el) {
  document
    .querySelectorAll(".prop-card")
    .forEach((c) => c.classList.remove("active"));
  el?.classList.add("active");
  quickAsk(
    `Give me a full overview of ${name} — pricing, highlights, investment potential, and why I should buy`,
  );
}

// ── CHAT CORE ────────────────────────────────────────────────
function quickAsk(txt) {
  document.getElementById("chatInput").value = txt;
  sendMsg();
}

function handleEnter(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMsg();
  }
}

function autoGrow(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

async function sendMsg() {
  const inp = document.getElementById("chatInput");
  const txt = inp.value.trim();
  if (!txt || isLoading) return;

  if (!GEMINI_KEY) {
    openSettings();
    return;
  }

  document.getElementById("welcomeScreen")?.remove();
  isLoading = true;
  document.getElementById("sendBtn").disabled = true;

  appendMsg("user", txt);
  inp.value = "";
  autoGrow(inp);

  history.push({ role: "user", parts: [{ text: txt }] });
  const typId = showTyping();

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: history,
          generationConfig: { temperature: 0.75, maxOutputTokens: 1200 },
        }),
      },
    );

    const data = await res.json();
    removeTyping(typId);

    if (data.error) {
      appendMsg(
        "bot",
        `❌ **API Error:** ${data.error.message}\n\nCheck your API key in ⚙️ Settings.`,
        false,
        true,
      );
      history.pop();
    } else {
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      history.push({ role: "model", parts: [{ text: reply }] });
      appendMsg("bot", reply, true);
    }
  } catch (err) {
    removeTyping(typId);
    appendMsg("bot", `❌ **Network error:** ${err.message}`, false, true);
    history.pop();
  }

  isLoading = false;
  document.getElementById("sendBtn").disabled = false;
}

// ── MESSAGE RENDERING ────────────────────────────────────────
function appendMsg(role, md, enableTTS = false, isErr = false) {
  const wrap = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = `msg ${role}`;

  const av = document.createElement("div");
  av.className = `av ${role}`;
  av.textContent = role === "bot" ? "🏡" : "👤";

  const bub = document.createElement("div");
  bub.className = `bubble ${role}${isErr ? " err" : ""}`;
  bub.innerHTML = mdToHtml(md);

  if (role === "bot" && enableTTS) {
    const acts = document.createElement("div");
    acts.className = "msg-actions";
    const speakBtn = document.createElement("button");
    speakBtn.className = "act-btn";
    speakBtn.innerHTML = "🔊 Speak";
    speakBtn.onclick = () => TTS.speakText(md, speakBtn);
    acts.appendChild(speakBtn);
    bub.appendChild(acts);
  }

  div.appendChild(av);
  div.appendChild(bub);
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
}

function mdToHtml(t) {
  return t
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^#{1,3}\s(.+)$/gm, "<h3>$1</h3>")
    .replace(/^[-•]\s(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br>");
}

function showTyping() {
  const id = "typ" + Date.now();
  const wrap = document.getElementById("messages");
  wrap.insertAdjacentHTML(
    "beforeend",
    `
<div class="msg bot" id="${id}">
  <div class="av bot">🏡</div>
  <div class="bubble bot">
    <div class="typing"><span></span><span></span><span></span></div>
  </div>
</div>`,
  );
  wrap.scrollTop = wrap.scrollHeight;
  return id;
}

function removeTyping(id) {
  document.getElementById(id)?.remove();
}

// ── MIC / VOICE INPUT ────────────────────────────────────────
function toggleMic() {
  if (micActive) {
    stopMic();
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    setVoiceHint("❌ Voice not supported. Use Chrome or Edge.", true);
    return;
  }

  try {
    recog = new SR();
    recog.lang = "en-IN";
    recog.continuous = false;
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    recog.onstart = () => {
      micActive = true;
      const btn = document.getElementById("micBtn");
      btn.classList.add("recording");
      btn.innerHTML = '<div class="mic-ripple"></div>⏹';
      setVoiceHint("🔴 Listening… speak now, click ⏹ to stop", true);
    };

    recog.onresult = (e) => {
      let interim = "",
        final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      const inp = document.getElementById("chatInput");
      inp.value = final || interim;
      autoGrow(inp);
    };

    recog.onerror = (e) => {
      const msgs = {
        "not-allowed": "❌ Mic permission denied. Allow in browser settings.",
        "no-speech": "💬 No speech detected. Try again.",
        network: "❌ Network error for speech recognition.",
        aborted: "",
      };
      if (e.error !== "aborted")
        setVoiceHint(msgs[e.error] || `❌ Error: ${e.error}`, true);
      stopMic();
    };

    recog.onend = () => {
      stopMic();
      const txt = document.getElementById("chatInput").value.trim();
      if (txt) {
        setVoiceHint("✅ Got it! Sending…");
        setTimeout(sendMsg, 200);
      } else setVoiceHint("");
    };

    recog.start();
  } catch (err) {
    setVoiceHint(`❌ Could not start mic: ${err.message}`, true);
  }
}

function stopMic() {
  micActive = false;
  try {
    recog?.stop();
  } catch (e) {}
  const btn = document.getElementById("micBtn");
  btn.classList.remove("recording");
  btn.innerHTML = '<div class="mic-ripple"></div>🎙️';
}

function setVoiceHint(msg, isRec = false) {
  const el = document.getElementById("voiceHint");
  el.textContent = msg;
  el.className = "voice-hint" + (isRec ? " rec" : "");
  if (!isRec && msg) {
    setTimeout(() => {
      el.textContent =
        "🎙️ Click mic or press Enter to send · 🔊 Tap Speak on any reply";
      el.className = "voice-hint";
    }, 3500);
  }
}

window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;
window.sendMsg = sendMsg;
window.toggleMic = toggleMic;
window.quickAsk = quickAsk;
window.handleEnter = handleEnter;
window.autoGrow = autoGrow;
