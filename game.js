/* ═══════════════════════════════════════════════
   예루살렘 미스터리 — Game Logic
═══════════════════════════════════════════════ */

// ── NPC Data ──────────────────────────────────
const NPCS = [
  {
    id: 0,
    name: '마르쿠스',
    role: '로마 병사 · 골고다 목격자',
    avatar: '⚔️',
    image: 'assets/npc_marcus.png',
    bgColor: 'radial-gradient(ellipse at top, #1a1010 0%, #0d0805 60%)',
    openingDialogue: '"나는 그날 십자가 형장에 있었소. 당신, 무엇을 알고 싶은 거요?"',
    trust: 100,
    choices: [
      {
        text: '"그 사람은 어떻게 돌아가셨습니까?"',
        type: 'positive',
        response: '"...우리가 창을 찌를 필요도 없었소. 이미 숨이 끊겼으니. 하지만 마지막 순간 그가 한 말이... 내 머릿속을 떠나지가 않소."',
        clue: '예수는 십자가에 달리셨음',
        trustChange: 0,
      },
      {
        text: '"무덤은 확실히 봉인했습니까?"',
        type: 'positive',
        response: '"물론이오. 돌을 굴려 막고 우리가 직접 지켰소. 그런데... 3일 후 아침, 돌이 옮겨져 있었소. 설명할 수가 없었오."',
        clue: '예수는 장사되셨음',
        trustChange: 0,
      },
      {
        text: '"당신은 그를 두려워합니까?"',
        type: 'negative',
        response: '"...두려워하다니! 나는 로마 병사요. 조심하시오, 탐정. 더 이상 말하지 않겠소."',
        clue: null,
        trustChange: -60,
      },
    ],
  },
  {
    id: 1,
    name: '막달라 마리아',
    role: '빈 무덤의 첫 번째 목격자',
    avatar: '🕯️',
    image: 'assets/npc_maria.png',
    bgColor: 'radial-gradient(ellipse at top, #1a0a10 0%, #0d0805 60%)',
    openingDialogue: '"저는... 그분을 직접 보았어요. 믿기지 않겠지만, 사실이에요."',
    trust: 100,
    choices: [
      {
        text: '"무덤에서 무엇을 보았습니까?"',
        type: 'positive',
        response: '"비어있었어요. 세마포만 가지런히 놓여 있었고, 천사가 말했죠 — \'그분은 여기 계시지 않습니다. 부활하셨습니다.\'"',
        clue: '예수님은 부활하신 분',
        trustChange: 0,
      },
      {
        text: '"당신은 직접 그분의 목소리를 들었습니까?"',
        type: 'positive',
        response: '"원사람이라 생각했는데... 제 이름을 부르셨어요, \'마리아...\' 라고. 그 순간 눈물이 멈추지 않았습니다."',
        clue: '예수님은 부활하신 분',
        trustChange: 0,
      },
      {
        text: '"그냥 꿈을 꾼 것 아닙니까?"',
        type: 'negative',
        response: '"...꿈이라고요? (눈물이 맺힌다) 더 이상 말하지 않겠어요."',
        clue: null,
        trustChange: -70,
      },
    ],
  },
  {
    id: 2,
    name: '요한',
    role: '제자 · 어부의 부두',
    avatar: '🐟',
    image: 'assets/npc_john.png',
    bgColor: 'radial-gradient(ellipse at top, #0a1020 0%, #0d0805 60%)',
    openingDialogue: '"저는 그분 곁을 끝까지 지켰습니다. 모든 것을 목격했어요."',
    trust: 100,
    choices: [
      {
        text: '"예수를 어떤 분이라고 생각하십니까?"',
        type: 'positive',
        response: '"하나님의 아들이십니다. 물이 포도주가 되고, 폭풍이 잠잠해졌어요. 제 눈으로 직접 보았습니다."',
        clue: '예수는 하나님의 아들',
        trustChange: 0,
      },
      {
        text: '"기적을 행하는 것을 보셨습니까?"',
        type: 'positive',
        response: '"나사로가 무덤에서 걸어나올 때... 그 장면은 평생 잊을 수 없습니다. 죽음이 그분 앞에서 물러났어요."',
        clue: '예수는 기적을 일으키신 분',
        trustChange: 0,
      },
      {
        text: '"제자이시니 편들겠지요?"',
        type: 'negative',
        response: '"(한숨) 그런 식으로 물으신다면... 저는 사실만 말했습니다. 더 이상은 어렵겠네요."',
        clue: null,
        trustChange: -60,
      },
    ],
  },
  {
    id: 3,
    name: '엘리에제르',
    role: '바리새인 서기관 · 성전 앞마당',
    avatar: '📜',
    image: 'assets/npc_pharisee.png',
    bgColor: 'radial-gradient(ellipse at top, #101510 0%, #0d0805 60%)',
    openingDialogue: '"흠. 이 소동에 대해 묻고 싶은 거요? 말해보시오, 탐정."',
    trust: 100,
    choices: [
      {
        text: '"제자들이 시신을 훔쳤다고 생각합니까?"',
        type: 'positive',
        response: '"...그렇게 말하고 싶었소. 하지만 무덤을 지키던 병사들의 표정이 심상치 않았오. 뭔가를 두려워하는 듯했소."',
        clue: '예수님은 부활하신 분',
        trustChange: 0,
      },
      {
        text: '"기적이 실제로 있었다고 생각합니까?"',
        type: 'positive',
        response: '"...설명할 수 없는 일들이 있었던 것은 사실이오. 나는 아직... 판단을 보류하겠소."',
        clue: '예수는 기적을 일으키신 분',
        trustChange: 0,
      },
      {
        text: '"당신들이 그를 죽인 것 아닙니까?"',
        type: 'negative',
        response: '"이것 보시오! 말조심 하시오. 이 심문은 여기서 끝이오."',
        clue: null,
        trustChange: -100,
      },
    ],
  },
  {
    id: 4,
    name: '미리암',
    role: '혈루증 여인 · 병자 쉼터',
    avatar: '🤲',
    image: 'assets/npc_miriam.png',
    bgColor: 'radial-gradient(ellipse at top, #101018 0%, #0d0805 60%)',
    openingDialogue: '"저는 12년을 아팠어요. 그런데... 그분의 옷 끝만 만졌는데."',
    trust: 100,
    choices: [
      {
        text: '"정확히 무슨 일이 일어났습니까?"',
        type: 'positive',
        response: '"그 순간 병이 나았어요. 그분이 돌아서며 말씀하셨죠 — \'네 믿음이 너를 구원하였다.\'고. 12년의 아픔이 사라졌어요."',
        clue: '예수는 기적을 일으키신 분',
        trustChange: 0,
      },
      {
        text: '"부활하셨다는 것을 믿으십니까?"',
        type: 'positive',
        response: '"그분이 저를 살리셨는데, 왜 못 믿겠어요? 죽음도 그분 앞에서는 끝이 아닐 거예요. 예수는 죽은 자를 살리시는 분입니다."',
        clue: '예수는 죽은 자를 살리신 분',
        trustChange: 0,
      },
      {
        text: '"우연의 일치 아닐까요?"',
        type: 'negative',
        response: '"(조용히 미소 지으며) ...그렇게 생각하신다면, 직접 확인해 보세요. 저는 더 이상 드릴 말씀이 없네요."',
        clue: null,
        trustChange: -80,
      },
    ],
  },
];

// ── Game State ─────────────────────────────────
const state = {
  selectedNpcs: [],
  cluesCollected: [],
  currentNpcId: null,
  currentTrust: 100,
  phase: 'opening', // 'opening' | 'choices' | 'done'
  npcsDismissed: new Set(),
};

// ── DOM refs ───────────────────────────────────
const scenes = {
  intro:         document.getElementById('scene-intro'),
  map:           document.getElementById('scene-map'),
  interrogation: document.getElementById('scene-interrogation'),
  notebook:      document.getElementById('scene-notebook'),
  ending:        document.getElementById('scene-ending'),
};

// ── Helpers ───────────────────────────────────
function showScene(name) {
  Object.values(scenes).forEach(s => s.classList.remove('active'));
  scenes[name].classList.add('active');
}

function typewriter(el, text, speed = 28, cb) {
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) { clearInterval(timer); if (cb) cb(); }
  }, speed);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Star Field ────────────────────────────────
function createStars(containerId, count = 80) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 2.5 + 0.5;
    Object.assign(star.style, {
      position: 'absolute',
      width: size + 'px', height: size + 'px',
      borderRadius: '50%',
      background: '#fff',
      left: Math.random() * 100 + '%',
      top:  Math.random() * 60 + '%',
      opacity: Math.random() * 0.7 + 0.1,
      animation: `starTwinkle ${1.5 + Math.random() * 3}s ease-in-out infinite`,
      animationDelay: Math.random() * 3 + 's',
    });
    container.appendChild(star);
  }
}

// ── Dust Particles ────────────────────────────
function createDust() {
  const container = document.getElementById('dustParticles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    Object.assign(p.style, {
      position: 'absolute',
      width: size + 'px', height: size + 'px',
      borderRadius: '50%',
      background: 'rgba(212,168,67,0.4)',
      left: Math.random() * 100 + '%',
      bottom: Math.random() * 30 + '%',
      animation: `dustFloat ${2 + Math.random() * 3}s ease-in-out infinite`,
      animationDelay: Math.random() * 4 + 's',
    });
    container.appendChild(p);
  }
}

// ── Light Particles ───────────────────────────
function createLightParticles() {
  const container = document.getElementById('lightParticles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    const angle = (i / 30) * 360;
    const dist = 80 + Math.random() * 200;
    const size = Math.random() * 6 + 3;
    Object.assign(p.style, {
      position: 'absolute',
      width: size + 'px', height: size + 'px',
      borderRadius: '50%',
      background: `hsl(${40 + Math.random() * 20}, 100%, ${70 + Math.random() * 30}%)`,
      left: '50%', top: '50%',
      transform: `translate(-50%,-50%) rotate(${angle}deg) translateX(${dist}px)`,
      opacity: 0,
      animation: `fadeIn 0.3s ${Math.random() * 0.4}s both`,
    });
    container.appendChild(p);
  }
}

// ══════════════════════════════════════════════
// INTRO → MAP
// ══════════════════════════════════════════════
createStars('starField1', 80);

document.getElementById('btnStart').addEventListener('click', () => {
  showScene('map');
  initMap();
});

// ══════════════════════════════════════════════
// MAP
// ══════════════════════════════════════════════
function initMap() {
  updateNpcCounter();
  document.querySelectorAll('.npc-marker').forEach(marker => {
    marker.addEventListener('click', () => {
      const npcId = parseInt(marker.dataset.npc);
      if (state.npcsDismissed.has(npcId)) return;
      if (state.selectedNpcs.length >= 3 && !state.selectedNpcs.includes(npcId)) {
        // can't select more
        marker.animate([
          {transform:'translate(-50%,-50%) scale(1)'},
          {transform:'translate(-50%,-50%) scale(1.05)'},
          {transform:'translate(-50%,-50%) scale(0.95)'},
          {transform:'translate(-50%,-50%) scale(1)'}
        ], {duration:300});
        return;
      }
      startInterrogation(npcId);
    });
  });
}

function updateNpcCounter() {
  document.getElementById('npcCounter').textContent = `${state.selectedNpcs.length}/3명 선택됨`;
  const btn = document.getElementById('btnFinish');
  if (state.selectedNpcs.length >= 1) btn.classList.remove('hidden');

  // update clue preview
  const preview = document.getElementById('cluePreview');
  if (state.cluesCollected.length === 0) {
    preview.innerHTML = '<span class="clue-empty">수사노트가 비어있습니다…</span>';
  } else {
    preview.innerHTML = state.cluesCollected
      .map(c => `<div class="clue-preview-item">✦ ${c}</div>`)
      .join('');
  }
}

document.getElementById('btnFinish').addEventListener('click', () => {
  showScene('notebook');
  renderNotebook();
});

// ══════════════════════════════════════════════
// INTERROGATION
// ══════════════════════════════════════════════
function startInterrogation(npcId) {
  const npc = NPCS[npcId];
  state.currentNpcId = npcId;
  state.currentTrust = npc.trust ?? 100;
  state.phase = 'opening';

  // mark as selected
  if (!state.selectedNpcs.includes(npcId)) {
    state.selectedNpcs.push(npcId);
  }

  // Setup UI
  document.getElementById('npcName').textContent = npc.name;
  document.getElementById('npcRole').textContent = npc.role;

  // Portrait: use image if available, else emoji fallback
  const avatarEl = document.getElementById('npcAvatar');
  if (npc.image) {
    avatarEl.innerHTML = `<img src="${npc.image}" alt="${npc.name}" class="npc-portrait-img" />`;
  } else {
    avatarEl.textContent = npc.avatar;
  }

  document.getElementById('interroBg').style.background = npc.bgColor;

  updateTrustUI();
  document.getElementById('clueReveal').classList.add('hidden');
  document.getElementById('choicesContainer').innerHTML = '';

  showScene('interrogation');

  // Type opening dialogue
  typewriter(
    document.getElementById('dialogueText'),
    npc.openingDialogue,
    30,
    () => {
      setTimeout(() => renderChoices(npc), 400);
    }
  );
}

function renderChoices(npc) {
  const container = document.getElementById('choicesContainer');
  container.innerHTML = '';
  npc.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = `choice-btn ${choice.type === 'negative' ? 'negative' : ''}`;
    btn.textContent = choice.text;
    btn.style.animationDelay = idx * 0.12 + 's';
    btn.style.animation = 'fadeUp 0.4s ease both';
    btn.style.animationDelay = (idx * 0.15) + 's';
    btn.addEventListener('click', () => handleChoice(choice, npc));
    container.appendChild(btn);
  });
}

function handleChoice(choice, npc) {
  document.getElementById('choicesContainer').innerHTML = '';

  if (choice.trustChange < 0) {
    // Bad choice - trust drops, NPC closes
    state.currentTrust = Math.max(0, state.currentTrust + choice.trustChange);
    updateTrustUI();

    typewriter(
      document.getElementById('dialogueText'),
      choice.response,
      30,
      async () => {
        await sleep(1800);
        // NPC dismissed - mark and go back
        state.npcsDismissed.add(npc.id);
        document.getElementById(`npc-${npc.id}`).classList.add('used');
        showScene('map');
        updateNpcCounter();
      }
    );
  } else {
    // Good choice - get clue
    typewriter(
      document.getElementById('dialogueText'),
      choice.response,
      30,
      async () => {
        await sleep(600);
        if (choice.clue && !state.cluesCollected.includes(choice.clue)) {
          state.cluesCollected.push(choice.clue);
        }
        showClueReveal(choice.clue);
        // Mark npc fully visited
        state.npcsDismissed.add(npc.id);
        document.getElementById(`npc-${npc.id}`).classList.add('used');
        document.getElementById(`npc-${npc.id}`).classList.add('selected');
      }
    );
  }
}

function updateTrustUI() {
  const bar = document.getElementById('trustBar');
  const val = document.getElementById('trustValue');
  bar.style.width = state.currentTrust + '%';
  val.textContent = state.currentTrust + '%';
  // color shifts from green to red
  const g = Math.round((state.currentTrust / 100) * 255);
  const r = Math.round(((100 - state.currentTrust) / 100) * 255);
  bar.style.background = `linear-gradient(90deg, rgb(${r},${g*0.6},50), rgb(${r*0.7},${g},70))`;
}

function showClueReveal(clueText) {
  const el = document.getElementById('clueReveal');
  document.getElementById('clueCardText').textContent = clueText || '—';
  el.classList.remove('hidden');
}

document.getElementById('btnNextNpc').addEventListener('click', () => {
  document.getElementById('clueReveal').classList.add('hidden');
  showScene('map');
  updateNpcCounter();
});

document.getElementById('btnBack').addEventListener('click', () => {
  state.npcsDismissed.add(state.currentNpcId);
  document.getElementById(`npc-${state.currentNpcId}`).classList.add('used');
  showScene('map');
  updateNpcCounter();
});

// ══════════════════════════════════════════════
// NOTEBOOK
// ══════════════════════════════════════════════
function renderNotebook() {
  createDust();
  const list = document.getElementById('cluesList');
  list.innerHTML = '';

  const clues = state.cluesCollected;
  const total = clues.length;

  clues.forEach((clue, i) => {
    const item = document.createElement('div');
    item.className = 'clue-list-item';
    item.style.animationDelay = (i * 0.35 + 0.3) + 's';

    const parts = clue.split(' ');
    const prefix = parts.slice(0, 2).join(' ') + ' ';
    const main = parts.slice(2).join(' ');

    item.innerHTML = `
      <div class="clue-bullet">${i + 1}</div>
      <p class="clue-text">
        <span class="clue-prefix">${prefix}</span><span class="clue-main">${main}</span>
      </p>
    `;
    list.appendChild(item);
  });

  // Empty slots if less than 3
  for (let i = total; i < 3; i++) {
    const item = document.createElement('div');
    item.className = 'clue-list-item';
    item.style.animationDelay = (i * 0.35 + 0.3) + 's';
    item.innerHTML = `
      <div class="clue-bullet" style="background:#999;">?</div>
      <p class="clue-text" style="color:#aaa;font-style:italic;">단서를 찾지 못했습니다…</p>
    `;
    list.appendChild(item);
  }

  // Stamp
  setTimeout(() => {
    const stamp = document.getElementById('notebookStamp');
    stamp.classList.add('stamped');
  }, total * 350 + 900);
}

// "결론 확인하기" 버튼이 제거되었으므로 해당 이벤트 리스너도 제거합니다.

// ══════════════════════════════════════════════
// ENDING SEQUENCE
// ══════════════════════════════════════════════
async function runEndingSequence() {
  const tombEl       = document.getElementById('endingTomb');
  const explosionEl  = document.getElementById('lightExplosion');
  const starsEl      = document.getElementById('endingStars');
  const ctaEl        = document.getElementById('ctaCard');

  // Phase 1: Tomb visible
  tombEl.style.display = 'flex';
  await sleep(3000);

  // Phase 2: Crack animation
  document.getElementById('tombCrack').classList.add('active');
  document.getElementById('crackGlow').classList.add('active');
  await sleep(2200);

  // Phase 3: White explosion
  tombEl.style.opacity = '0';
  tombEl.style.transition = 'opacity 0.3s';
  explosionEl.classList.remove('hidden');
  createLightParticles();
  await sleep(1200);

  // Phase 4: Stars + message
  explosionEl.classList.add('hidden');
  starsEl.classList.remove('hidden');
  createStars('starField2', 120);
  await sleep(5500); // wait for all text animations

  // Phase 5: CTA
  ctaEl.classList.remove('hidden');
}

// ── Poster Modal ──────────────────────────────
document.getElementById('btnRevealPoster').addEventListener('click', () => {
  const modal = document.getElementById('posterModal');
  modal.classList.remove('hidden');
});

document.getElementById('btnPosterClose').addEventListener('click', () => {
  document.getElementById('posterModal').classList.add('hidden');
});

document.getElementById('posterBackdrop').addEventListener('click', () => {
  document.getElementById('posterModal').classList.add('hidden');
});

document.getElementById('btnPosterShare').addEventListener('click', async () => {
  const shareText = `🔍 예루살렘 시신도난 사건!\n\n4월 4일(토) 오후 1시\n서울-안디옥교회에서 이 미스터리를 풀어보세요!\n\n#예루살렘미스터리 #탈출방`;
  if (navigator.share) {
    try { await navigator.share({ title: '예루살렘 미스터리', text: shareText }); } catch {}
  } else {
    try {
      await navigator.clipboard.writeText(shareText);
      alert('공유 텍스트가 복사되었습니다!');
    } catch { alert(shareText); }
  }
});

// ── Replay & Share ─────────────────────────────
document.getElementById('btnReplay').addEventListener('click', () => {
  // Reset state
  state.selectedNpcs = [];
  state.cluesCollected = [];
  state.currentNpcId = null;
  state.currentTrust = 100;
  state.npcsDismissed = new Set();

  // Reset markers
  document.querySelectorAll('.npc-marker').forEach(m => {
    m.classList.remove('used', 'selected');
  });

  // Reset ending
  ['endingTomb','lightExplosion','endingStars','ctaCard'].forEach(id => {
    const el = document.getElementById(id);
    el.style.opacity = '';
    el.style.transition = '';
    if (id !== 'endingTomb') el.classList.add('hidden');
  });
  document.getElementById('tombCrack').classList.remove('active');
  document.getElementById('crackGlow').classList.remove('active');
  document.getElementById('lightParticles').innerHTML = '';
  document.getElementById('starField2').innerHTML = '';
  document.getElementById('dustParticles').innerHTML = '';

  document.getElementById('btnFinish').classList.add('hidden');
  updateNpcCounter();
  showScene('intro');
});

document.getElementById('btnShare').addEventListener('click', async () => {
  const clueCount = state.cluesCollected.length;
  const shareText = `🕵️ 예루살렘 미스터리 수사 완료!\n${clueCount}개의 단서를 모았습니다.\n\n진짜 답은 4월 4일 현장에서— 당신도 수사관이 되어보세요!`;
  if (navigator.share) {
    try {
      await navigator.share({ title: '예루살렘 미스터리', text: shareText });
    } catch {}
  } else {
    try {
      await navigator.clipboard.writeText(shareText);
      alert('공유 텍스트가 복사되었습니다!');
    } catch {
      alert(shareText);
    }
  }
});
