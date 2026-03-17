/* ═══════════════════════════════════════════════
   예루살렘 미스터리 — Game Logic (Teaser Version)
═══════════════════════════════════════════════ */

const NPCS = [
  {
    id: 0,
    name: '무덤을 지키던 병사',
    role: '빈 무덤 목격자',
    avatar: '⚔️',
    image: 'assets/npc_marcus.png',
    bgColor: 'radial-gradient(ellipse at top, #1a1010 0%, #0d0805 60%)',
    openingDialogue: '"당신도 그 사건을 조사하러 온 겐가? 나는 그날 밤 무덤을 지키던 경비병이오. 하지만... 내가 본 것을 지금 여기서 다 말해줄 수는 없소."',
    choices: [
      {
        text: '"대체 무엇을 본 겁니까?"',
        response: '"내 입으론 결코 말할 수 없소. 예루살렘의 높으신 분들이 내 입을 막으려 했으니... 그날 밤의 진실이 정 궁금하다면, 4월 4일 사건 현장으로 직접 와보시오."'
      }
    ]
  },
  {
    id: 1,
    name: '막달라 마리아',
    role: '마리아의 집',
    avatar: '🕯️',
    image: 'assets/npc_maria.png',
    bgColor: 'radial-gradient(ellipse at top, #1a0a10 0%, #0d0805 60%)',
    openingDialogue: '"아까부터 누군가를 찾고 계신 것 같군요. 저 역시... 어두운 동산에서 스승님을 뵙고 급히 발걸음을 옮기는 중입니다."',
    choices: [
      {
        text: '"무슨 급한 소식을 전하러 가시는 길입니까?"',
        response: '"지금은 지체할 시간이 없어요! 제 입으로 함부로 발설할 수 없는 너무도 놀라운 일입니다. 이 모든 것의 전말은 4월 4일, 그분과 함께했던 현장에서 직접 확인하세요!"'
      }
    ]
  },
  {
    id: 2,
    name: '요한',
    role: '요한의 집',
    avatar: '🐟',
    image: 'assets/npc_john.png',
    bgColor: 'radial-gradient(ellipse at top, #0a1020 0%, #0d0805 60%)',
    openingDialogue: '"지금 이 무덤에는 시신이 없습니다.. 사실은.."',
    choices: [
      {
        text: '"제자들이 훔쳐간 것이라는 소문이 있던데?"',
        response: '"이상한 소문에는 더 이상 대답하고 싶지 않소. 당신이 진정으로 진실을 추구하는 자라면, 4월 4일 우리가 모이는 그곳에서 직접 증거를 찾아보시오."'
      }
    ]
  },
  {
    id: 3,
    name: '혈루증 여인',
    role: '많은 무리가 모여있는 거리',
    avatar: '🤲',
    image: 'assets/npc_miriam.png',
    bgColor: 'radial-gradient(ellipse at top, #101018 0%, #0d0805 60%)',
    openingDialogue: '"저는 12년 동안이나 피를 흘리며 앓았어요. 용한 의사들에게 재산만 다 날리고 절망에 빠져 있었지요."',
    choices: [
      {
        text: '"하지만 지금은 완전히 건강해 보이는걸요"',
        response: '"아마 듣더라도 믿지 못하실 수 있어요.. 자세한 이야기는 4월 4일에 당신의 눈으로 직접 확인해 보세요."'
      }
    ]
  },
  {
    id: 4,
    name: '나사로',
    role: '나사로의 집',
    avatar: '⚰️',
    image: 'assets/npc_lazarus.png',
    bgColor: 'radial-gradient(ellipse at top, #101510 0%, #0d0805 60%)',
    openingDialogue: '"예루살렘 사람들의 표정이 심상치 않군요. 하지만 저 역시... 한때 무덤 속에 있었던 몸으로서 두려움보다는 깊은 평안을 느낍니다."',
    choices: [
      {
        text: '"무덤 속에 있었다니, 그게 무슨 말씀이십니까?"',
        response: '"말하자면 긴데.. 당신이 정말 궁금하시다면 답은 4월 4일 현장에 있습니다. 그곳에서 기다리지요."'
      }
    ]
  }
];

const state = {
  selectedNpcs: [],
  npcsDismissed: new Set(),
  currentNpcId: null,
  phase: 'opening'
};

function showScene(sceneId) {
  document.querySelectorAll('.scene').forEach(sc => sc.classList.remove('active'));
  document.getElementById(`scene-${sceneId}`).classList.add('active');
}

document.getElementById('btnStart').addEventListener('click', () => {
  showScene('map');
  setTimeout(() => {
    document.querySelector('.map-header').style.opacity = '1';
    document.querySelector('.map-header').style.transform = 'translateY(0)';
    document.querySelectorAll('.npc-marker').forEach((m, i) => {
      setTimeout(() => {
        m.style.opacity = '1';
        m.style.transform = 'translate(-50%, -50%) scale(1)';
      }, i * 200 + 400);
    });
    
    // Ensure player is visible if not already
    const playerMarker = document.getElementById('playerMarker');
    if (playerMarker) {
      playerMarker.classList.remove('hidden');
    }
    
  }, 100);
});

function openInterrogation(npcId) {
  document.getElementById('choicesContainer').innerHTML = '';
  document.getElementById('dialogueText').textContent = '';
  document.getElementById('dialogueBox').classList.add('hidden');
  document.getElementById('choicesContainer').classList.add('hidden');

  const npc = NPCS.find(n => n.id === npcId);
  state.currentNpcId = npcId;

  if (!state.selectedNpcs.includes(npcId)) {
    state.selectedNpcs.push(npcId);
  }

  state.phase = 'opening';

  document.getElementById('interroBg').style.background = npc.bgColor;
  document.getElementById('npcAvatar').textContent = '';
  const avatarEl = document.getElementById('npcAvatar');
  avatarEl.style.backgroundImage = `url('${npc.image}')`;
  avatarEl.style.backgroundSize = 'cover';
  avatarEl.style.backgroundPosition = 'center';

  document.getElementById('npcName').textContent = npc.name;
  document.getElementById('npcRole').textContent = npc.role;
  document.getElementById('npcName').style.opacity = '0';
  document.getElementById('npcRole').style.opacity = '0';

  showScene('interrogation');

  const portrait = document.getElementById('npcPortrait');
  portrait.style.opacity = '0';
  portrait.style.transform = 'scale(0.8)';

  setTimeout(() => {
    portrait.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    portrait.style.opacity = '1';
    portrait.style.transform = 'scale(1)';
    document.getElementById('portraitGlow').style.opacity = '1';
  }, 300);

  setTimeout(() => {
    document.getElementById('npcName').style.animation = 'fadeUp 0.6s ease both';
    setTimeout(() => {
      document.getElementById('npcRole').style.animation = 'fadeUp 0.6s ease both';
    }, 200);
  }, 800);

  setTimeout(() => {
    document.getElementById('dialogueBox').classList.remove('hidden');
    typewriter(
      document.getElementById('dialogueText'),
      npc.openingDialogue,
      30,
      () => renderChoices(npc)
    );
  }, 1600);
}

function updateNpcCounter() {
  const total = NPCS.length;
  const chosenCount = state.npcsDismissed.size;

  const counterEl = document.getElementById('npcCounter');
  counterEl.textContent = `${chosenCount}/${total}명 만남`;

  const btnFinish = document.getElementById('btnFinish');
  if (chosenCount >= 2) {
    btnFinish.classList.remove('hidden');
  } else {
    btnFinish.classList.add('hidden');
  }
}

document.querySelectorAll('.npc-marker').forEach(marker => {
  marker.addEventListener('click', () => {
    if (marker.classList.contains('used')) return;

    // Move Player to the marker position
    const targetTop = marker.style.top;
    const targetLeft = marker.style.left;
    const playerMarker = document.getElementById('playerMarker');
    
    if (playerMarker) {
      playerMarker.style.top = targetTop;
      playerMarker.style.left = targetLeft;
      
      // disable interactions during walking
      document.body.style.pointerEvents = 'none';
      
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
        openInterrogation(parseInt(marker.dataset.npc, 10));
      }, 1000); // Wait for transition (1s) to complete
    } else {
      openInterrogation(parseInt(marker.dataset.npc, 10));
    }
  });
});

let typeInterval = null;
function typewriter(element, text, speed, callback) {
  if (typeInterval) clearInterval(typeInterval);
  element.textContent = '';
  let i = 0;
  typeInterval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(typeInterval);
      if (callback) callback();
    }
  }, speed);
}

function renderChoices(npc) {
  state.phase = 'choices';
  const container = document.getElementById('choicesContainer');
  container.classList.remove('hidden');
  container.innerHTML = '';
  npc.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.text;
    btn.style.animationDelay = idx * 0.12 + 's';
    btn.style.animation = 'fadeUp 0.4s ease both';
    btn.style.animationDelay = (idx * 0.15) + 's';
    btn.addEventListener('click', () => {
      handleChoice(choice, npc);
    });
    container.appendChild(btn);
  });
}

function handleChoice(choice, npc) {
  document.getElementById('choicesContainer').innerHTML = '';

  typewriter(
    document.getElementById('dialogueText'),
    choice.response,
    30,
    () => {
      showNextButton(() => {
        state.npcsDismissed.add(npc.id);
        document.getElementById(`npc-${npc.id}`).classList.add('used');
        document.getElementById(`npc-${npc.id}`).classList.add('selected');
        showScene('map');
        updateNpcCounter();
      });
    }
  );
}

function showNextButton(callback) {
  const container = document.getElementById('choicesContainer');
  container.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'choice-btn';
  btn.textContent = '지도로 돌아가기 ›';
  btn.style.textAlign = 'center';
  btn.style.justifyContent = 'center';
  btn.style.fontWeight = 'bold';
  btn.style.animation = 'fadeUp 0.4s ease both';
  btn.addEventListener('click', callback);
  container.appendChild(btn);
}

document.getElementById('btnBack').addEventListener('click', () => {
  if (state.currentNpcId !== null) {
    state.npcsDismissed.add(state.currentNpcId);
    document.getElementById(`npc-${state.currentNpcId}`).classList.add('used');
  }
  showScene('map');
  updateNpcCounter();
});

document.getElementById('btnFinish').addEventListener('click', () => {
  showScene('ending');
  runEndingSequence();
});

// ══════════════════════════════════════════════
// ENDING SEQUENCE
// ══════════════════════════════════════════════
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runEndingSequence() {
  const tombEl = document.getElementById('endingTomb');
  const explosionEl = document.getElementById('lightExplosion');
  const starsEl = document.getElementById('endingStars');
  const ctaEl = document.getElementById('ctaCard');

  // Phase 1~4: Skip Animations
  tombEl.style.display = 'none';
  explosionEl.classList.add('hidden');
  starsEl.classList.add('hidden');

  // Phase 5: CTA & Auto Show Poster
  ctaEl.classList.remove('hidden');
  const modal = document.getElementById('posterModal');
  modal.classList.remove('hidden');
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
    try { await navigator.share({ title: '예루살렘 미스터리', text: shareText }); } catch { }
  } else {
    try {
      await navigator.clipboard.writeText(shareText);
      alert('공유 텍스트가 복사되었습니다!');
    } catch { alert(shareText); }
  }
});

// ── Replay ─────────────────────────────
document.getElementById('btnReplay').addEventListener('click', () => {
  window.location.reload();
});

// ── Utility: Stars ─────────────────
function createStars(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = Math.random() * 3 + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 2 + 's';
    star.style.opacity = Math.random() * 0.8 + 0.2;
    container.appendChild(star);
  }
}

// ── Utility: Light Particles (Ending) ─────
function createLightParticles() {
  const container = document.getElementById('lightParticles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.width = size + 'px';
    p.style.height = size + 'px';

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 200 + 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);

    p.style.left = '50%';
    p.style.top = '50%';
    p.style.animationDelay = Math.random() * 0.5 + 's';

    container.appendChild(p);
  }
}

// init intro stars
createStars('starField1', 80);
