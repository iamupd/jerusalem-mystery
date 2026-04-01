/* ═══════════════════════════════════════════════
   예루살렘 도난사건 – HD Pixel Art Edition
═══════════════════════════════════════════════ */

const TILE = 32;
const COLS = 20;
const ROWS = 15;
const SPEED = 2.5;

// === SPRITE-BASED CHARACTER RENDERER ===

// Load sprite images
const playerImg = new Image();
playerImg.src = 'assets/player.png';
const npcImg = new Image();
npcImg.src = 'assets/npcs.png';
const itemImg = new Image();
itemImg.src = 'assets/items.png';
const overworldImg = new Image();
overworldImg.src = 'assets/overworld.jpg';

// Processed sprite references
let playerSprite = null, npcSprite = null, itemSprite = null;

let spritesLoaded = 0;
const SPRITES_TOTAL = 3;
playerImg.onload = () => { playerSprite = playerImg; spritesLoaded++; };
npcImg.onload = () => { npcSprite = npcImg; spritesLoaded++; };
itemImg.onload = () => { itemSprite = itemImg; spritesLoaded++; };
[playerImg, npcImg, itemImg].forEach(img => {
  img.onerror = () => { spritesLoaded++; console.warn('Sprite load failed:', img.src); };
});

// Player sprite sheet: 3 cols x 4 rows (clean, no text labels)
// dir: 0=up, 1=down, 2=left, 3=right
const DIR_TO_ROW = [1, 0, 3, 2]; // map game dir to sprite sheet row

function drawPlayerSprite(ctx, px, py, dir, frame, size) {
  if (!playerSprite) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(px+size/2, py+size-2, size/3, 4, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#3498db';
    ctx.fillRect(px+4, py+4, size-8, size-8);
    return;
  }
  const cols = 3, rows = 4;
  const sw = playerSprite.width / cols;
  const sh = playerSprite.height / rows;
  const row = DIR_TO_ROW[dir] || 0;
  const col = Math.floor(frame) % cols;
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(px+size/2, py+size-2, size/2.5, 5, 0, 0, Math.PI*2); ctx.fill();
  ctx.drawImage(playerSprite, col*sw, row*sh, sw, sh, px-size*0.25, py-size*0.4, size*1.5, size*1.5);
}

// NPC sprite sheet: 4 cols x 2 rows = 8 characters
function drawNpcSprite(ctx, px, py, npcIndex, size) {
  if (!npcSprite) {
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(px+4, py+4, size-8, size-8);
    return;
  }
  const cols = 4, rows = 2;
  const sw = npcSprite.width / cols;
  const sh = npcSprite.height / rows;
  const col = npcIndex % cols;
  const row = Math.floor(npcIndex / cols);
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(px+size/2, py+size-2, size/2.5, 5, 0, 0, Math.PI*2); ctx.fill();
  ctx.drawImage(npcSprite, col*sw, row*sh, sw, sh, px-size*0.25, py-size*0.4, size*1.5, size*1.5);
}

// Item sprite sheet: 6 cols x 5 rows = 30 items
// We map item IDs to grid positions
const ITEM_GRID = {
  'baby':0, 'scroll1':1, 'star':2, 'lock1':3, 'news1':4, 'box1':5,
  'bag1':6, 'stone':7, 'bell':8, 'med':9, 'money':10, 'cloth':11,
  'net':12, 'basket':13, 'chicken':14, 'diary':15, 'cross':16, 'mirbox':17,
  'cuff':18, 'whip':19, 'ham':20, 'feath':21,
  'bag2':6, 'lock':3, 'report':4, 'locker':5, 'plant':7,
  'sin1':1, 'sin2':1, 'sin3':1, 'rom58':1, 'mark':2,
  'medicine':9, 'mirror_box':17, 'feather':21,
  'hammer':20, 'report':15, 'news':4
};

function drawItemSprite(ctx, px, py, itemId, size) {
  if (!itemSprite) return false;
  const idx = ITEM_GRID[itemId];
  if (idx === undefined) return false;
  const cols = 6, rows = 5;
  const sw = itemSprite.width / cols;
  const sh = itemSprite.height / rows;
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  ctx.drawImage(itemSprite, col*sw, row*sh, sw, sh, px-size*0.3, py-size*0.3, size*1.6, size*1.6);
  return true;
}

function adjustColor(color, amount) {
  let usePound = false;
  if (color[0] == "#") { color = color.slice(1); usePound = true; }
  let num = parseInt(color,16);
  let r = Math.min(255, Math.max(0, (num >> 16) + amount));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amount));
  let b = Math.min(255, Math.max(0, (num & 0xFF) + amount));
  return (usePound?"#":"") + (b | (g << 8) | (r << 16)).toString(16).padStart(6, '0');
}

// === VIBRANT PALETTE ROOM DATA ===
const ROOMS = {
  overworld: {
    name: '🗺️ 축제의 빈 무덤 거리',
    bg: '#7bc950', // Bright grass base (Stardew style)
    floor: '#a0db60', // Light grass detail
    wall: '#c9965a', // Dirt paths/walls
    items: [],
    npcs: [],
    doors: [
      {x:6, y:1, w:2, h:2, target:'room5', label:'1. 십자가 언덕', emoji:'✝️'},
      {x:16, y:3, w:2, h:2, target:'room4', label:'2. 어부의 집', emoji:'🐟'},
      {x:3, y:7, w:2, h:2, target:'room1', label:'3. 요한의 방', emoji:'📖'},
      {x:16, y:8, w:2, h:2, target:'room3', label:'6. 혈루증 여인', emoji:'🤲'},
      {x:3, y:11, w:2, h:2, target:'room2', label:'4. 예수의 무덤', emoji:'⚰️'},
      {x:15, y:13, w:2, h:2, target:'room6', label:'5. 병사의 방', emoji:'⚔️'},
    ],
    map: null
  },
  room1: {name:'📖 요한의 방', bg:'#3a2820', floor:'#5c4033', wall:'#8b5a2b',
    items:[
      {x:5,y:3,emoji:'👶',label:'모형',id:'baby',msg:'구유 모형 뒷면에 [예수]라고 적혀있다!'},
      {x:10,y:3,emoji:'📜',label:'조각',id:'scroll1',msg:'"아들을 낳으리니 이름을 예수라 하라"'},
      {x:15,y:5,emoji:'⭐',label:'장식',id:'star',msg:'뭔가가 씌여져 있는 것 같은데?'},
      {x:8,y:8,emoji:'🔒',label:'상자',id:'lock1',msg:'자물쇠가 걸려있다. 숫자를...!'},
      {x:14,y:10,emoji:'📰',label:'기사',id:'news1',msg:'"나사렛 예수, 십자가 처형"'},
    ],
    npcs:[{x:3,y:10,name:'요한',emoji:'🧔',npcIndex:0,colors:{hair:'#4a3520',skin:'#ffdbac',shirt:'#1a508b',pants:'#1c1c1c',shoes:'#4a2e15'},
      dialogue:[{text:'"오직 뜻을 기록함은 믿게 하려 함이요..."', choices:[
        {text:'"누구를 위함입니까?"', response:'"결정적인 진실은 스포일러라 여기서 말할 수 없소. 4월 4일 오후 1시, 서울-안디옥교회로 오시오."', clue:'예수님은 하나님의 ??? 이시다'}]}]
    }], doors:[{x:9,y:14,w:2,h:1,target:'overworld',label:'나가기',emoji:'🚪'}]
  },
  room2: {name:'⚰️ 빈 무덤', bg:'#4a5b6c', floor:'#6b7e91', wall:'#2c3e50',
    items:[
      {x:5,y:4,emoji:'📦',label:'상자',id:'box1',msg:'안에 퍼즐 조각들이 있다!'},
      {x:10,y:3,emoji:'🎒',label:'가방',id:'bag1',msg:'지시카드: "열쇠를 찾으라!"'},
      {x:15,y:4,emoji:'👜',label:'가방',id:'bag2',msg:'가방을 열어야 해! 가방을..!'},
      {x:8,y:8,emoji:'🪨',label:'돌',id:'stone',msg:'여기에 뭔가가 있나?'},
      {x:13,y:9,emoji:'🔔',label:'종',id:'bell',msg:'(뎅- 뎅-) 마리아가 다가온다...'},
    ],
    npcs:[{x:14,y:10,name:'막달라 마리아',emoji:'👩',npcIndex:1,colors:{hair:'#b03a2e',skin:'#f5cba7',shirt:'#512e5f',pants:'#e6b0aa',shoes:'#7b241c'},
      dialogue:[{text:'"시신을 훔쳐간게 아니야. 기적으로 무덤을 여신거지."', choices:[
        {text:'"부활하셨다는 겁니까?"', response:'"무덤이 비어있는 진짜 이유는... 4월 4일 오후 1시, 서울-안디옥교회에서 직접 확인하세요!"', clue:'예수님은 죽음을 이기고 ??? 하신 분이다'}]}]
    }], doors:[{x:9,y:14,w:2,h:1,target:'overworld',label:'나가기',emoji:'🚪'}]
  },
  room3: {name:'🤲 혈루증 여인', bg:'#6c5b4a', floor:'#917e6b', wall:'#503e2c',
    items:[
      {x:6,y:4,emoji:'💊',label:'약병',id:'med',msg:'효과 없는 약들...'},
      {x:12,y:4,emoji:'💰',label:'빈 주머니',id:'money',msg:'재산을 다 날렸다는 증거.'},
      {x:9,y:7,emoji:'👗',label:'옷자락',id:'cloth',msg:'자락만 만져도 나을 수 있다는 믿음!'},
    ],
    npcs:[{x:4,y:10,name:'여인',emoji:'👩‍🦱',npcIndex:2,colors:{hair:'#d35400',skin:'#e6b0aa',shirt:'#1e8449',pants:'#f4d03f',shoes:'#7e5109'},
      dialogue:[{text:'"12년간 피를 흘리며 앓았지만 나았어요."', choices:[
        {text:'"정말이십니까?"', response:'"그 병을 낫게 한 능력의 비밀은... 4월 4일 오후 1시, 서울-안디옥교회로 오시면 알 수 있어요."', clue:'예수님은 불치병도 ??? 하신 기적의 분이다'}]}]
    }], doors:[{x:9,y:14,w:2,h:1,target:'overworld',label:'나가기',emoji:'🚪'}]
  },
  room4: {name:'🐟 어부의 집', bg:'#34495e', floor:'#5d6d7e', wall:'#212f3c',
    items:[
      {x:5,y:3,emoji:'🪤',label:'그물',id:'net',msg:'어부의 흔적이 남아있다.'},
      {x:12,y:3,emoji:'🧺',label:'광주리',id:'basket',msg:'이건 오병이어 사건 때 썼던 광주리잖아..'},
      {x:8,y:6,emoji:'🐔',label:'닭',id:'chicken',msg:'꼬끼오! 닭이 울자 베드로가 놀란다.'},
      {x:15,y:8,emoji:'📓',label:'일기',id:'diary',msg:'"네가 세 번 나를 모른다 하리라..."'},
    ],
    npcs:[{x:4,y:9,name:'베드로',emoji:'🧔‍♂️',npcIndex:3,colors:{hair:'#5d4037',skin:'#d7ccc8',shirt:'#00bcd4',pants:'#5d4037',shoes:'#3e2723'},
      dialogue:[{text:'"아... 예수? 나, 난 그 사람 몰라!"', choices:[
        {text:'"(닭 소리를 들려준다)"', response:'"나처럼 실패한 자를 찾아오신 그분의 진짜 이야기는... 4월 4일 오후 1시, 서울-안디옥교회에서 들려주겠소!"', clue:'예수님은 죽음을 이기고 다시 ??? 하신 분이다'}]}]
    }], doors:[{x:9,y:14,w:2,h:1,target:'overworld',label:'나가기',emoji:'🚪'}]
  },
  room5: {name:'✝️ 십자가 언덕', bg:'#4a2311', floor:'#6e3016', wall:'#2e1005',
    items:[
      {x:10,y:2,emoji:'✝️',label:'십자가',id:'cross',msg:'"유대인의 왕"'},
      {x:7,y:5,emoji:'📌',label:'죄목1',id:'sin1',msg:'그가 찔린 것은 우리의 허물...'},
      {x:10,y:9,emoji:'📦',label:'거울',id:'mirbox',msg:'비밀은 나 자신에게 있다.'},
    ],
    npcs:[{x:4,y:8,name:'행인',emoji:'👷',npcIndex:4,colors:{hair:'#1a1a1a',skin:'#f3e5ab',shirt:'#556b2f',pants:'#8b4513',shoes:'#111111'},
      dialogue:[{text:'"정말 끔찍한 처형이었지."', choices:[
        {text:'"누구의 죄 때문입니까?"', response:'"그가 누구의 죄를 대신 졌는지에 대한 명확한 해답은 4월 4일 오후 1시, 서울-안디옥교회에서 밝혀진다네."', clue:'예수님은 우리의 죄를 위해 십자가에서 ??? 하셨다'}]}]
    }], doors:[{x:9,y:14,w:2,h:1,target:'overworld',label:'나가기',emoji:'🚪'}]
  },
  room6: {name:'⚔️ 병사의 방', bg:'#566573', floor:'#808b96', wall:'#1c2833',
    items:[
      {x:5,y:3,emoji:'⛓️',label:'수갑',id:'cuff',msg:'수갑 (3)'},
      {x:9,y:3,emoji:'🪢',label:'채찍',id:'whip',msg:'채찍 (7)'},
      {x:13,y:3,emoji:'🔨',label:'망치',id:'ham',msg:'망치 (8)'},
      {x:13,y:7,emoji:'🗄️',label:'사물함',id:'lock',msg:'비밀번호가 걸려있어. 숫자가 뭐지..?'},
      {x:10,y:10,emoji:'🪶',label:'깃털',id:'feath',msg:'천사의 깃털!'},
    ],
    npcs:[{x:15,y:10,name:'병사',emoji:'💂',npcIndex:6,colors:{hair:'#f1c40f',skin:'#f8c471',shirt:'#c0392b',pants:'#34495e',shoes:'#17202a'},
      dialogue:[{text:'"암호 천사! 좋다, 통과해라."', choices:[
        {text:'"진실은?"', response:'"이것은 군사 기밀이다! 더 자세한 내막을 원한다면 4월 4일 오후 1시, 서울-안디옥교회로 은밀히 찾아가라!"', clue:'예수님은 무덤에서 3일 만에 ??? 하셨다'}]}]
    }], doors:[{x:9,y:14,w:2,h:1,target:'overworld',label:'나가기',emoji:'🚪'}]
  }
};

const state = {
  screen: 'title', room: 'overworld',
  player: {x: 10*TILE, y: 7*TILE, dir: 1, frame: 0, moving: false},
  coins: 5, clues: [], foundItems: new Set(), collectedItems: [], visitedRooms: new Set(),
  keys: {up:false,down:false,left:false,right:false},
  dialogueActive: false, dialogueQueue: [], nearbyTarget: null, animTimer: 0
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mmCanvas = document.getElementById('minimapCanvas');
const mmCtx = mmCanvas.getContext('2d');

function resizeCanvas() {
  canvas.width = COLS * TILE;
  canvas.height = ROWS * TILE;
  canvas.style.width = '';
  canvas.style.height = '';
}

function generateMap(roomId) {
  const map = [];
  for(let r=0;r<ROWS;r++) {
    map[r] = [];
    for(let c=0;c<COLS;c++) {
      if(r===0||r===ROWS-1||c===0||c===COLS-1) map[r][c] = 1;
      else map[r][c] = 0;
    }
  }
  const room = ROOMS[roomId];
  if(roomId === 'overworld') {
    // Overworld uses the custom map image, so we leave it open (no extra walls)
  } else {
    for(let c=2;c<COLS-2;c+=4) { map[2][c]=2; }
    map[6][2]=2; map[6][COLS-3]=2; map[11][4]=2; map[11][COLS-5]=2;
  }
  if(room.doors) room.doors.forEach(d => {
    for(let dy=0;dy<d.h;dy++) for(let dx=0;dx<d.w;dx++) {
      if(d.y+dy>=0&&d.y+dy<ROWS&&d.x+dx>=0&&d.x+dx<COLS) map[d.y+dy][d.x+dx]=3;
    }
  });
  return map;
}

function initMaps() { Object.keys(ROOMS).forEach(id => ROOMS[id].map = generateMap(id)); }

function drawPixelTile(px, py, type, room) {
  // Vibrant drawing with shading and detail
  const drawBrick = (bx, by, bw, bh, col1, col2) => {
    ctx.fillStyle = col1; ctx.fillRect(px+bx, py+by, bw, bh);
    ctx.fillStyle = col2; ctx.fillRect(px+bx, py+by+bh-2, bw, 2); // shadow
    ctx.fillRect(px+bx+bw-2, py+by, 2, bh);
  };

  if(type === 1) { // Wall
    ctx.fillStyle = room.wall; ctx.fillRect(px,py,TILE,TILE);
    ctx.fillStyle = adjustColor(room.wall, -20);
    // Draw brick clusters
    drawBrick(2,2, 12, 10, room.wall, adjustColor(room.wall, -30));
    drawBrick(16,2, 14, 10, room.wall, adjustColor(room.wall, -30));
    drawBrick(2,16, 20, 10, room.wall, adjustColor(room.wall, -30));
    // Top border
    ctx.fillStyle = adjustColor(room.wall, 40);
    ctx.fillRect(px,py,TILE, 2);
  } else if(type === 2) { // Object/Pillar
    ctx.fillStyle = room.floor; ctx.fillRect(px,py,TILE,TILE);
    // Post
    ctx.fillStyle = '#111'; ctx.fillRect(px+6, py, 20, TILE); // Outline
    ctx.fillStyle = '#8b5a2b'; ctx.fillRect(px+8, py+2, 16, TILE-4);
    ctx.fillStyle = '#a06a3b'; ctx.fillRect(px+10, py+2, 4, TILE-4);
  } else if(type === 3) { // Door
    ctx.fillStyle = room.floor; ctx.fillRect(px,py,TILE,TILE);
    ctx.fillStyle = '#111'; ctx.fillRect(px+2,py+4, TILE-4, TILE-4); // Outline
    ctx.fillStyle = '#3498db'; ctx.fillRect(px+4,py+6, TILE-8, TILE-6); // Glowing portal
    ctx.fillStyle = '#85c1e9'; ctx.fillRect(px+8,py+10, TILE-16, TILE-10);
  } else { // Floor
    ctx.fillStyle = room.bg; ctx.fillRect(px,py,TILE,TILE);
    // Floor details (Grass tufts or dirt speckles)
    const seed = (Math.sin(px * 123.456 + py) * 10000) % 1;
    if(state.room === 'overworld') {
      // Grass tufts!
      if(seed > 0.5) {
        ctx.fillStyle = room.floor;
        ctx.fillRect(px+4, py+8, 4, 10);
        ctx.fillRect(px+8, py+12, 4, 6);
        ctx.fillRect(px+12, py+6, 4, 12);
      }
    } else {
      if(seed > 0.6) {
        ctx.fillStyle = adjustColor(room.bg, 20);
        ctx.fillRect(px+4, py+4, 12, 12);
      }
    }
  }
}

function drawRoom() {
  const room = ROOMS[state.room];
  const map = room.map;
  
  if (state.room === 'overworld' && overworldImg.complete) {
    // Draw the full custom map image for the overworld
    ctx.drawImage(overworldImg, 0, 0, COLS*TILE, ROWS*TILE);
  } else {
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) drawPixelTile(c*TILE, r*TILE, map[r][c], room);
  }

  // Draw door indicators
  if(room.doors) room.doors.forEach(d => {
    const cx = d.x*TILE + (d.w*TILE)/2, cy = d.y*TILE + (d.h*TILE)/2;
    if (state.room === 'overworld') {
      // Floating Enter Button (shifted upwards to avoid overlapping map text)
      const bob = Math.sin(state.animTimer * 0.1) * 3;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(cx - 36, cy - 20 + bob, 72, 24);
      ctx.strokeStyle = '#f4d03f'; ctx.lineWidth = 2;
      ctx.strokeRect(cx - 36, cy - 20 + bob, 72, 24);
      ctx.font = '10px "Press Start 2P"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff'; ctx.fillText('들어가기▼', cx, cy - 8 + bob);
    } else {
      // Inner room signboards
      const dx = d.x*TILE + (d.w*TILE)/2, dy = d.y*TILE + TILE/2;
      ctx.fillStyle = '#111'; ctx.fillRect(dx-32, dy-24, 64, 30);
      ctx.fillStyle = '#f4d03f'; ctx.fillRect(dx-30, dy-22, 60, 26);
      ctx.font = '14px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000'; ctx.fillText(d.emoji, dx, dy - 14);
      ctx.font = '10px "Press Start 2P"'; ctx.fillText(d.label, dx, dy);
    }
  });

  // Items
  if(room.items) room.items.forEach(item => {
    if(state.foundItems.has(item.id)) return;
    const ix = item.x*TILE+TILE/2, iy = item.y*TILE+TILE/2;
    const bob = Math.sin(state.animTimer*0.05 + item.x)*3;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.arc(ix, iy+10, 8, 0, Math.PI*2); ctx.fill();
    // Try sprite first, fallback to emoji
    if(!drawItemSprite(ctx, ix, iy+bob, item.id, TILE*0.7)) {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ix, iy+bob, 16, 0, Math.PI*2); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#111'; ctx.stroke();
      ctx.font = '20px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000'; ctx.fillText(item.emoji, ix, iy+bob+2);
    }
  });

  // NPCs
  if(room.npcs) room.npcs.forEach(npc => {
    const nx = npc.x*TILE, ny = npc.y*TILE;
    const bob = Math.sin(state.animTimer*0.05 + npc.x)*2;
    if(npc.npcIndex !== undefined) {
      drawNpcSprite(ctx, nx, ny+bob, npc.npcIndex, TILE);
    } else {
      ctx.font = '24px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(npc.emoji, nx+TILE/2, ny+TILE/2+bob);
    }
    ctx.font = '9px "Press Start 2P"'; ctx.textAlign = 'center'; ctx.fillStyle = '#111';
    let tw = ctx.measureText(npc.name).width;
    ctx.fillRect(nx+TILE/2-tw/2-4, ny-14, tw+8, 14);
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.fillText(npc.name, nx+TILE/2, ny-6);
  });

  drawPlayer();
}

function drawPlayer() {
  const p = state.player;
  const bob = p.moving ? Math.sin(state.animTimer*0.2)*3 : 0;
  const frame = p.moving ? state.animTimer*0.15 : 0;
  drawPlayerSprite(ctx, p.x, p.y+bob, p.dir, frame, TILE);
}

function drawMinimap() {
  const scale = 6;
  mmCtx.fillStyle = '#111'; mmCtx.fillRect(0,0,120,90);
  const room = ROOMS[state.room]; const map = room.map;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
    if(map[r][c]===1||map[r][c]===2) mmCtx.fillStyle='#34495e';
    else if(map[r][c]===3) mmCtx.fillStyle='#f1c40f';
    else mmCtx.fillStyle='#2c3e50';
    mmCtx.fillRect(c*scale,r*scale,scale,scale);
  }
  if(room.items) room.items.forEach(item => {
    if(!state.foundItems.has(item.id)) { mmCtx.fillStyle='#2ecc71'; mmCtx.fillRect(item.x*scale+1,item.y*scale+1,4,4); }
  });
  if(room.npcs) room.npcs.forEach(n => { mmCtx.fillStyle='#e74c3c'; mmCtx.fillRect(n.x*scale+1,n.y*scale+1,4,4); });
  mmCtx.fillStyle='#3498db';
  mmCtx.fillRect(Math.floor(state.player.x/TILE)*scale+1,Math.floor(state.player.y/TILE)*scale+1,4,4);
}

// ── Event & Physics Loop ──
function checkCollisions() {
  const p = state.player; const room = ROOMS[state.room];
  const pcx = p.x+TILE/2, pcy = p.y+TILE/2;
  state.nearbyTarget = null;
  const check = (x,y) => Math.abs(pcx-x)<TILE*1.5 && Math.abs(pcy-y)<TILE*1.5;

  if(room.doors) for(const d of room.doors) if(check(d.x*TILE+d.w*TILE/2, d.y*TILE+d.h*TILE/2)) return state.nearbyTarget={type:'door',data:d};
  if(room.items) for(const i of room.items) if(!state.foundItems.has(i.id) && check(i.x*TILE+TILE/2, i.y*TILE+TILE/2)) return state.nearbyTarget={type:'item',data:i};
  if(room.npcs) for(const n of room.npcs) if(check(n.x*TILE+TILE/2, n.y*TILE+TILE/2)) return state.nearbyTarget={type:'npc',data:n};
}

function canMove(nx, ny) {
  const map = ROOMS[state.room].map;
  for(const c of [{x:nx+4,y:ny+4},{x:nx+TILE-5,y:ny+4},{x:nx+4,y:ny+TILE-5},{x:nx+TILE-5,y:ny+TILE-5}]) {
    let col = Math.floor(c.x/TILE), row = Math.floor(c.y/TILE);
    if(col<0||col>=COLS||row<0||row>=ROWS||map[row][col]===1||map[row][col]===2) return false;
  }
  return true;
}

function interact() {
  if(state.dialogueActive || !state.nearbyTarget) return;
  const t = state.nearbyTarget;
  if(t.type === 'door') enterRoom(t.data.target);
  else if(t.type === 'item') {
    state.foundItems.add(t.data.id);
    state.collectedItems.push({emoji: t.data.emoji, label: t.data.label, id: t.data.id});
    showDialogue('📦 발견!', t.data.msg);
    updateInvestPanel();
  }
  else if(t.type === 'npc') { const d = t.data.dialogue[0]; showDialogue(t.data.name, d.text, d.choices, t.data); }
}

function updateHUD() {
  document.getElementById('hudLocation').textContent = ROOMS[state.room].name;
  document.getElementById('hudCoins').textContent = '🪙 ' + state.coins;
  document.getElementById('hudClues').textContent = '📜 ' + state.clues.length + '/3';
  const btn = document.getElementById('actionBtn');
  btn.textContent = state.nearbyTarget ? (state.nearbyTarget.type==='door'?'🚪 이동':(state.nearbyTarget.type==='item'?'🔍 조사':'💬 대화')) : '🔍 수사';
  state.nearbyTarget ? btn.classList.add('glow') : btn.classList.remove('glow');
}

function enterRoom(roomId) {
  if(state.dialogueActive) return;
  const trans = document.getElementById('roomTransition');
  document.getElementById('transitionText').textContent = ROOMS[roomId].name;
  trans.classList.remove('hidden');
  setTimeout(() => {
    state.room = roomId; state.visitedRooms.add(roomId);
    state.player.x = 10*TILE; state.player.y = (roomId==='overworld'?7:12)*TILE;
    state.nearbyTarget = null;
    trans.classList.add('hidden');
    if(state.clues.length >= 3) setTimeout(showEnding, 500);
  }, 1000);
}

function showDialogue(speaker, text, choices, npc) {
  state.dialogueActive = true;
  document.getElementById('dialogueOverlay').classList.remove('hidden');
  document.getElementById('dialogueSpeaker').textContent = speaker;
  document.getElementById('dialogueChoices').innerHTML = '';
  document.getElementById('dialogueContinue').classList.add('hidden');
  
  let i = 0, el = document.getElementById('dialogueTextRpg'); el.textContent = '';
  const timer = setInterval(() => {
    el.textContent += text.charAt(i++);
    if(i >= text.length) {
      clearInterval(timer);
      if(choices) {
        choices.forEach(ch => {
          let b = document.createElement('button'); b.className = 'dialogue-choice-btn'; b.textContent = ch.text;
          b.onclick = () => { document.getElementById('dialogueChoices').innerHTML=''; if(ch.clue&&!state.clues.includes(ch.clue)) { state.clues.push(ch.clue); updateInvestPanel(); } showDialogue(speaker, ch.response, null, npc); };
          document.getElementById('dialogueChoices').appendChild(b);
        });
      } else {
        document.getElementById('dialogueContinue').classList.remove('hidden');
        const close = () => {
          document.getElementById('dialogueOverlay').classList.add('hidden'); state.dialogueActive = false;
          document.getElementById('dialogueContinue').removeEventListener('click', close);
          if(state.clues.length >= 3) setTimeout(showEnding, 500);
        };
        document.getElementById('dialogueContinue').addEventListener('click', close);
      }
    }
  }, 20);
}

function showEnding() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-ending').classList.add('active'); state.screen = 'ending';
  const rEl = document.getElementById('endingResults'); rEl.innerHTML = '';
  const emojis = ['📖','⚰️','🤲','🐟','✝️','⚔️'];
  state.clues.forEach((c, i) => rEl.innerHTML += `<div class="ending-result-item"><span class="ending-result-icon">${emojis[i]}</span><span>${c}</span><span style="margin-left:auto;color:#2ecc71">✅</span></div>`);
}

function updateInvestPanel() {
  // Update clue list
  const clueEl = document.getElementById('clueList');
  if(state.clues.length === 0) {
    clueEl.innerHTML = '<li class="invest-empty">아직 발견된 증거가 없습니다</li>';
  } else {
    clueEl.innerHTML = '';
    state.clues.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = 'clue-item';
      li.textContent = `${i+1}. ${c}`;
      clueEl.appendChild(li);
    });
  }
  // Update item list
  const itemEl = document.getElementById('itemList');
  if(state.collectedItems.length === 0) {
    itemEl.innerHTML = '<li class="invest-empty">아직 획득한 아이템이 없습니다</li>';
  } else {
    itemEl.innerHTML = '';
    state.collectedItems.forEach(item => {
      const li = document.createElement('li');
      li.className = 'found-item';
      li.innerHTML = `<span class="invest-emoji">${item.emoji}</span>${item.label}`;
      itemEl.appendChild(li);
    });
  }
}

function update() {
  if(state.screen !== 'game' || state.dialogueActive) return;
  let dx=0, dy=0, p=state.player;
  if(state.keys.up) { dy=-SPEED; p.dir=0; }
  if(state.keys.down) { dy=SPEED; p.dir=1; }
  if(state.keys.left) { dx=-SPEED; p.dir=2; }
  if(state.keys.right) { dx=SPEED; p.dir=3; }
  p.moving = dx!==0||dy!==0;
  if(dx!==0 && canMove(p.x+dx, p.y)) p.x+=dx;
  if(dy!==0 && canMove(p.x, p.y+dy)) p.y+=dy;
  p.x = Math.max(0, Math.min(p.x, (COLS-1)*TILE));
  p.y = Math.max(0, Math.min(p.y, (ROWS-1)*TILE));
  checkCollisions(); updateHUD();

  // Auto-enter rooms from overworld (disable auto-exit so players can explore inner rooms freely)
  if(state.room === 'overworld' && state.nearbyTarget && state.nearbyTarget.type === 'door') {
    enterRoom(state.nearbyTarget.data.target);
  }
}

function gameLoop() { update(); state.animTimer++; if(state.screen==='game'){drawRoom(); drawMinimap();} requestAnimationFrame(gameLoop); }

function setupInput() {
  window.addEventListener('keydown', e => { if(e.key==='ArrowUp'||e.key==='w') state.keys.up=true; if(e.key==='ArrowDown'||e.key==='s') state.keys.down=true; if(e.key==='ArrowLeft'||e.key==='a') state.keys.left=true; if(e.key==='ArrowRight'||e.key==='d') state.keys.right=true; if(e.key===' '||e.key==='Enter') interact(); });
  window.addEventListener('keyup', e => { if(e.key==='ArrowUp'||e.key==='w') state.keys.up=false; if(e.key==='ArrowDown'||e.key==='s') state.keys.down=false; if(e.key==='ArrowLeft'||e.key==='a') state.keys.left=false; if(e.key==='ArrowRight'||e.key==='d') state.keys.right=false; });
  const h = (id,k) => { let el=document.getElementById(id); let st=()=>{state.keys[k]=true;}; let ed=()=>{state.keys[k]=false;}; el.onmousedown=st; el.onmouseup=ed; el.onmouseleave=ed; el.ontouchstart=e=>{e.preventDefault();st()}; el.ontouchend=e=>{e.preventDefault();ed()}; el.ontouchcancel=ed; };
  h('dpadUp','up'); h('dpadDown','down'); h('dpadLeft','left'); h('dpadRight','right');
  document.getElementById('dpadCenter').onclick = interact; document.getElementById('actionBtn').onclick = interact;
  document.getElementById('noteClose').onclick = () => document.getElementById('noteOverlay').classList.add('hidden');
  // Toggle invest panel
  document.getElementById('investToggle').onclick = () => {
    const body = document.getElementById('investBody');
    body.style.display = body.style.display === 'none' ? 'block' : 'none';
  };
}

function init() {
  initMaps(); resizeCanvas(); setupInput(); window.addEventListener('resize', resizeCanvas);
  const startGame = () => { document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); document.getElementById('screen-game').classList.add('active'); state.screen='game'; state.room='overworld'; updateHUD(); resizeCanvas(); };
  const btnStart = document.getElementById('btnStart');
  btnStart.onclick = startGame;
  btnStart.addEventListener('touchend', (e) => { e.preventDefault(); startGame(); });
  document.getElementById('btnReplay').onclick = () => location.reload();
  gameLoop();
}

init();
