/* ═════════════════════════════════════════════════════════
   인스타 카드뉴스 빌더 — 로직
   - state 관리 (입력값 객체)
   - 실시간 카드 렌더링 (3종 레이아웃)
   - html-to-image로 1080×1350 PNG 캡처
   - JSZip으로 일괄 다운로드

   안전 처리:
   - 모든 사용자 입력은 escapeHtml()로 escape 후 템플릿 삽입
   - DOM 삽입은 Range.createContextualFragment 기반 setHtml() 사용
     (scripts/event handlers 비활성, XSS 안전)
   ═════════════════════════════════════════════════════════ */

const TOTAL_CARDS = 8; // cover(1) + content(6) + cta(1)

// ───────── 초기 state (기본값) ─────────
const state = {
  seriesName: '나의 카드뉴스 시리즈',
  channel: '@AICLab_TV',
  layout: 'classic',
  colors: { main: '#1a2332', accent: '#d4af37', bg: '#f5f1e8' },
  cover: {
    badge: '이번 주 인사이트',
    title: '검색이 사라지는\n시대',
    subtitle: 'AI가 답을 대신 말하는 지금,\n살아남는 콘텐츠는 따로 있다',
    highlight: '6가지 핵심 전략',
  },
  contents: [
    { number: '01', subtitle: '첫 문장이 모든 것',           title: 'Answer-First 원칙',      body: 'AI는 첫 문단을 그대로 인용합니다.\n질문 → 한 줄 답 → 근거 순서로.' },
    { number: '02', subtitle: '통계·수치 인용',              title: '숫자를 무기로',          body: '"많은 사람이"가 아니라\n"73%가"로 쓰세요.\n구체적 수치 1개당 인용률 +40%' },
    { number: '03', subtitle: 'AI 신뢰 신호',                title: '출처를 밝혀라',          body: '통계 옆에 출처 링크,\n인용문 옆에 화자 이름.\n검증 가능한 글만 인용됩니다.' },
    { number: '04', subtitle: 'AI가 가장 좋아하는 구조',     title: 'FAQ는 필수',             body: '질문-답변 쌍은\nAI 학습 데이터의 황금 포맷.\nFAQ 3개로 노출 확률을 바꾸세요.' },
    { number: '05', subtitle: 'E-E-A-T 권위 신호',           title: '저자가 누구냐',          body: '익명 글은 AI가 외면합니다.\n저자 소개·경력·자격증을\n반드시 명시하세요.' },
    { number: '06', subtitle: '멀티플랫폼 송출',             title: '한 곳에 올인 금지',      body: '블로그·유튜브·인스타·X.\n여러 출처에서 보이는 글을\nAI는 더 신뢰합니다.' },
  ],
  cta: {
    title: '더 깊이 배우려면\n채널 구독!',
    subtitle: '매주 새로운 콘텐츠',
    homepage: 'kimjinsoo.vercel.app',
    email: 'info@aiclab2020.com',
    book: '저서 《이것이 GEO마케팅이다》',
  },
};

const DEFAULT_STATE = structuredClone(state);
let currentCardIdx = 0;

// ───────── 안전한 HTML 삽입 헬퍼 ─────────
// Range.createContextualFragment는 scripts/event handlers를 비활성화 상태로 파싱
function setHtml(el, htmlStr) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.deleteContents();
  const frag = range.createContextualFragment(htmlStr);
  el.appendChild(frag);
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br(str) {
  return escapeHtml(str).replace(/\n/g, '<br>');
}

// ─────────────────────────────────────────────────────────
// 카드 렌더링 (idx → 적절한 카드 타입 함수 호출)
// ─────────────────────────────────────────────────────────
function renderCard(idx, targetEl) {
  const { colors, layout } = state;
  let html;
  if (idx === 0) {
    html = renderCover(state.cover, colors, layout);
  } else if (idx === TOTAL_CARDS - 1) {
    html = renderCta(state.cta, state.channel, colors, layout);
  } else {
    const contentIdx = idx - 1;
    html = renderContent(state.contents[contentIdx], colors, layout, state.channel);
  }
  setHtml(targetEl, html);
}

// ───────── 베이스 프레임 ─────────
function baseFrame(inner, colors, extra = '') {
  return `
    <div style="
      width:1080px; height:1350px;
      background:${colors.bg};
      font-family: 'Pretendard Variable', Pretendard, sans-serif;
      color:${colors.main};
      position:relative;
      overflow:hidden;
      ${extra}
    ">${inner}</div>
  `;
}

// ───────── COVER ─────────
function renderCover(data, colors, layout) {
  if (layout === 'minimal') {
    return baseFrame(`
      <div style="position:absolute; top:0; left:0; right:0; height:8px; background:${colors.accent}"></div>
      <div style="padding:120px 90px 90px; display:flex; flex-direction:column; height:100%;">
        <div style="font-size:24px; font-weight:700; letter-spacing:4px; color:${colors.accent}; margin-bottom:60px;">
          ${escapeHtml(data.badge).toUpperCase()}
        </div>
        <div style="border-top:2px solid ${colors.main}; padding-top:80px; flex:1; display:flex; flex-direction:column; justify-content:center;">
          <h1 style="font-size:130px; font-weight:900; line-height:1.05; letter-spacing:-3px; margin-bottom:60px;">
            ${nl2br(data.title)}
          </h1>
          <p style="font-size:38px; font-weight:500; line-height:1.45; color:${colors.main}; opacity:0.72;">
            ${nl2br(data.subtitle)}
          </p>
        </div>
        <div style="margin-top:50px; padding-top:30px; border-top:2px solid ${colors.main}; display:flex; justify-content:space-between; font-size:22px; font-weight:700;">
          <span>${escapeHtml(data.highlight)}</span>
          <span style="color:${colors.accent}">${escapeHtml(state.channel)}</span>
        </div>
      </div>
    `, colors);
  }
  if (layout === 'bold') {
    return baseFrame(`
      <div style="position:absolute; inset:0; background:${colors.main}; clip-path:polygon(0 0, 100% 0, 100% 70%, 0 100%);"></div>
      <div style="position:relative; padding:120px 90px 90px; display:flex; flex-direction:column; height:100%;">
        <div style="display:inline-block; align-self:flex-start; background:${colors.accent}; color:${colors.main}; padding:18px 36px; font-size:30px; font-weight:900; letter-spacing:2px; margin-bottom:60px;">
          ${escapeHtml(data.badge).toUpperCase()}
        </div>
        <h1 style="font-size:140px; font-weight:900; line-height:1.0; letter-spacing:-4px; color:${colors.bg}; margin-bottom:60px;">
          ${nl2br(data.title)}
        </h1>
        <p style="font-size:40px; font-weight:600; line-height:1.4; color:${colors.bg}; opacity:0.85;">
          ${nl2br(data.subtitle)}
        </p>
        <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:flex-end; padding-top:40px;">
          <div style="background:${colors.accent}; color:${colors.main}; padding:14px 28px; font-size:28px; font-weight:900;">
            ${escapeHtml(data.highlight)}
          </div>
          <div style="font-size:28px; font-weight:800; color:${colors.bg};">
            ${escapeHtml(state.channel)}
          </div>
        </div>
      </div>
    `, colors);
  }
  // classic (default)
  return baseFrame(`
    <div style="position:absolute; inset:0; background: radial-gradient(circle at 85% 15%, ${colors.accent}33 0%, transparent 50%), ${colors.bg};"></div>
    <div style="position:relative; padding:120px 90px 90px; display:flex; flex-direction:column; height:100%; text-align:center; align-items:center;">
      <div style="display:inline-block; background:${colors.main}; color:${colors.bg}; padding:16px 36px; font-size:28px; font-weight:800; letter-spacing:2px; margin-bottom:60px;">
        ${escapeHtml(data.badge).toUpperCase()}
      </div>
      <h1 style="font-size:140px; font-weight:900; line-height:1.05; letter-spacing:-3px; margin-bottom:50px;">
        ${nl2br(data.title)}
      </h1>
      <p style="font-size:40px; font-weight:500; line-height:1.45; opacity:0.78; margin-bottom:60px;">
        ${nl2br(data.subtitle)}
      </p>
      <div style="display:inline-block; background:${colors.accent}; color:${colors.main}; padding:18px 40px; font-size:32px; font-weight:900; border-radius:8px;">
        ${escapeHtml(data.highlight)}
      </div>
      <div style="margin-top:auto; padding-top:40px; font-size:28px; font-weight:700; color:${colors.main}; opacity:0.85;">
        ${escapeHtml(state.channel)}
      </div>
    </div>
  `, colors);
}

// ───────── CONTENT ─────────
function renderContent(data, colors, layout, channel) {
  if (layout === 'minimal') {
    return baseFrame(`
      <div style="padding:120px 90px 100px; display:flex; flex-direction:column; height:100%;">
        <div style="font-size:120px; font-weight:900; color:${colors.accent}; line-height:1; letter-spacing:-4px; margin-bottom:24px;">
          ${escapeHtml(data.number)}
        </div>
        <div style="font-size:28px; font-weight:600; letter-spacing:2px; color:${colors.main}; opacity:0.55; margin-bottom:40px; text-transform:uppercase;">
          ${escapeHtml(data.subtitle)}
        </div>
        <h2 style="font-size:90px; font-weight:900; line-height:1.1; letter-spacing:-2px; margin-bottom:50px; border-top:3px solid ${colors.main}; padding-top:50px;">
          ${nl2br(data.title)}
        </h2>
        <p style="font-size:42px; font-weight:500; line-height:1.55; opacity:0.85;">
          ${nl2br(data.body)}
        </p>
        <div style="margin-top:auto; padding-top:40px; font-size:24px; font-weight:700; color:${colors.accent};">
          ${escapeHtml(channel)}
        </div>
      </div>
    `, colors);
  }
  if (layout === 'bold') {
    return baseFrame(`
      <div style="position:absolute; top:0; left:0; width:300px; height:300px; background:${colors.accent}; display:grid; place-items:center;">
        <span style="font-size:170px; font-weight:900; color:${colors.main}; line-height:1;">${escapeHtml(data.number)}</span>
      </div>
      <div style="padding:340px 90px 90px; display:flex; flex-direction:column; height:100%;">
        <div style="font-size:28px; font-weight:700; letter-spacing:2px; color:${colors.accent}; margin-bottom:24px; text-transform:uppercase;">
          ${escapeHtml(data.subtitle)}
        </div>
        <h2 style="font-size:100px; font-weight:900; line-height:1.05; letter-spacing:-2px; margin-bottom:60px; color:${colors.main};">
          ${nl2br(data.title)}
        </h2>
        <div style="background:${colors.main}; color:${colors.bg}; padding:50px 50px; font-size:42px; font-weight:500; line-height:1.5;">
          ${nl2br(data.body)}
        </div>
        <div style="margin-top:auto; padding-top:40px; text-align:right; font-size:24px; font-weight:700; opacity:0.7;">
          ${escapeHtml(channel)}
        </div>
      </div>
    `, colors);
  }
  // classic
  const idxInList = state.contents.findIndex(c => c.number === data.number);
  return baseFrame(`
    <div style="position:absolute; inset:0; background: radial-gradient(circle at 15% 20%, ${colors.accent}22 0%, transparent 50%), ${colors.bg};"></div>
    <div style="position:relative; padding:110px 90px 90px; display:flex; flex-direction:column; height:100%;">
      <div style="display:flex; align-items:center; gap:24px; margin-bottom:50px;">
        <div style="font-size:140px; font-weight:900; color:${colors.accent}; line-height:1; letter-spacing:-4px;">
          ${escapeHtml(data.number)}
        </div>
        <div style="height:120px; width:6px; background:${colors.main}; opacity:0.15;"></div>
        <div style="font-size:30px; font-weight:700; color:${colors.main}; opacity:0.7; letter-spacing:1px;">
          ${escapeHtml(data.subtitle)}
        </div>
      </div>
      <h2 style="font-size:96px; font-weight:900; line-height:1.1; letter-spacing:-2px; margin-bottom:60px;">
        ${nl2br(data.title)}
      </h2>
      <p style="font-size:42px; font-weight:500; line-height:1.55; opacity:0.85;">
        ${nl2br(data.body)}
      </p>
      <div style="margin-top:auto; padding-top:50px; display:flex; justify-content:space-between; align-items:center; font-size:24px;">
        <span style="font-weight:700; color:${colors.accent};">${escapeHtml(channel)}</span>
        <span style="font-weight:700; color:${colors.main}; opacity:0.5;">${idxInList + 1} / ${state.contents.length}</span>
      </div>
    </div>
  `, colors);
}

// ───────── CTA ─────────
function renderCta(data, channel, colors, layout) {
  const bookLine = data.book
    ? `<div style="font-weight:700; color:${colors.accent}; font-size:26px;">${escapeHtml(data.book)}</div>`
    : '';
  const bookLineBold = data.book
    ? `<div style="font-weight:800; color:${colors.accent}; margin-top:8px;">${escapeHtml(data.book)}</div>`
    : '';
  const bookLineClassic = data.book
    ? `<div style="margin-top:8px; padding-top:20px; border-top:1px solid rgba(245,241,232,0.3); font-weight:700;">${escapeHtml(data.book)}</div>`
    : '';

  if (layout === 'minimal') {
    return baseFrame(`
      <div style="padding:140px 90px; display:flex; flex-direction:column; height:100%; text-align:center; align-items:center; justify-content:center;">
        <div style="font-size:26px; font-weight:700; letter-spacing:5px; color:${colors.accent}; margin-bottom:50px;">
          THANK YOU
        </div>
        <h2 style="font-size:100px; font-weight:900; line-height:1.1; letter-spacing:-2px; margin-bottom:30px;">
          ${nl2br(data.title)}
        </h2>
        <p style="font-size:36px; font-weight:500; opacity:0.7; margin-bottom:80px;">
          ${escapeHtml(data.subtitle)}
        </p>
        <div style="width:100%; max-width:700px; border-top:2px solid ${colors.main}; padding-top:50px; display:flex; flex-direction:column; gap:24px; font-size:30px;">
          <div style="font-weight:800;">${escapeHtml(channel)}</div>
          <div style="opacity:0.75;">🌐 ${escapeHtml(data.homepage)}</div>
          <div style="opacity:0.75;">✉ ${escapeHtml(data.email)}</div>
          ${bookLine}
        </div>
      </div>
    `, colors);
  }
  if (layout === 'bold') {
    return baseFrame(`
      <div style="background:${colors.main}; padding:140px 90px; display:flex; flex-direction:column; height:100%; color:${colors.bg};">
        <div style="display:inline-block; align-self:flex-start; background:${colors.accent}; color:${colors.main}; padding:14px 28px; font-size:24px; font-weight:900; letter-spacing:3px; margin-bottom:50px;">
          CONNECT
        </div>
        <h2 style="font-size:120px; font-weight:900; line-height:1.0; letter-spacing:-3px; margin-bottom:40px;">
          ${nl2br(data.title)}
        </h2>
        <p style="font-size:38px; font-weight:500; opacity:0.85; margin-bottom:80px;">
          ${escapeHtml(data.subtitle)}
        </p>
        <div style="background:${colors.bg}; color:${colors.main}; padding:40px 50px; margin-top:auto; display:flex; flex-direction:column; gap:18px; font-size:30px;">
          <div style="font-weight:900; font-size:36px;">${escapeHtml(channel)}</div>
          <div>🌐 ${escapeHtml(data.homepage)}</div>
          <div>✉ ${escapeHtml(data.email)}</div>
          ${bookLineBold}
        </div>
      </div>
    `, colors);
  }
  // classic
  return baseFrame(`
    <div style="position:absolute; inset:0; background: radial-gradient(circle at 50% 30%, ${colors.accent}22 0%, transparent 60%), ${colors.bg};"></div>
    <div style="position:relative; padding:120px 90px; display:flex; flex-direction:column; height:100%; text-align:center; align-items:center;">
      <div style="display:inline-block; background:${colors.main}; color:${colors.bg}; padding:14px 32px; font-size:26px; font-weight:800; letter-spacing:3px; margin-bottom:60px;">
        함께해요
      </div>
      <h2 style="font-size:106px; font-weight:900; line-height:1.1; letter-spacing:-2px; margin-bottom:30px;">
        ${nl2br(data.title)}
      </h2>
      <p style="font-size:38px; font-weight:500; opacity:0.75; margin-bottom:auto;">
        ${escapeHtml(data.subtitle)}
      </p>
      <div style="margin-top:60px; width:100%; max-width:780px; background:${colors.main}; color:${colors.bg}; padding:50px 60px; border-radius:12px; display:flex; flex-direction:column; gap:20px; font-size:30px;">
        <div style="font-size:42px; font-weight:900; color:${colors.accent};">${escapeHtml(channel)}</div>
        <div>🌐 ${escapeHtml(data.homepage)}</div>
        <div>✉ ${escapeHtml(data.email)}</div>
        ${bookLineClassic}
      </div>
    </div>
  `, colors);
}

// ─────────────────────────────────────────────────────────
// 카드 라벨
// ─────────────────────────────────────────────────────────
function cardLabel(idx) {
  if (idx === 0) return 'COVER';
  if (idx === TOTAL_CARDS - 1) return 'CTA';
  return String(idx).padStart(2, '0');
}

// ─────────────────────────────────────────────────────────
// 폼 → state 동기화
// ─────────────────────────────────────────────────────────
function bindForm() {
  const $ = id => document.getElementById(id);

  $('seriesName').addEventListener('input', e => { state.seriesName = e.target.value; });
  $('coverBadge').addEventListener('input', e => { state.cover.badge = e.target.value; updateAll(); });
  $('coverTitle').addEventListener('input', e => { state.cover.title = e.target.value; updateAll(); });
  $('coverSubtitle').addEventListener('input', e => { state.cover.subtitle = e.target.value; updateAll(); });
  $('coverHighlight').addEventListener('input', e => { state.cover.highlight = e.target.value; updateAll(); });

  document.querySelectorAll('input[name="layout"]').forEach(input => {
    input.addEventListener('change', e => { state.layout = e.target.value; updateAll(); });
  });

  document.querySelectorAll('.palette-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.palette-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.colors = {
        main: chip.dataset.main,
        accent: chip.dataset.accent,
        bg: chip.dataset.bg,
      };
      $('colorMain').value = state.colors.main;
      $('colorAccent').value = state.colors.accent;
      $('colorBg').value = state.colors.bg;
      updateAll();
    });
  });
  $('colorMain').addEventListener('input', e => { state.colors.main = e.target.value; updateAll(); });
  $('colorAccent').addEventListener('input', e => { state.colors.accent = e.target.value; updateAll(); });
  $('colorBg').addEventListener('input', e => { state.colors.bg = e.target.value; updateAll(); });

  renderCardEditor();

  $('channel').addEventListener('input', e => { state.channel = e.target.value; updateAll(); });
  $('ctaTitle').addEventListener('input', e => { state.cta.title = e.target.value; updateAll(); });
  $('ctaSubtitle').addEventListener('input', e => { state.cta.subtitle = e.target.value; updateAll(); });
  $('homepage').addEventListener('input', e => { state.cta.homepage = e.target.value; updateAll(); });
  $('email').addEventListener('input', e => { state.cta.email = e.target.value; updateAll(); });
  $('book').addEventListener('input', e => { state.cta.book = e.target.value; updateAll(); });
}

function renderCardEditor() {
  const editor = document.getElementById('cardEditor');
  // 안전한 비우기
  while (editor.firstChild) editor.removeChild(editor.firstChild);

  state.contents.forEach((card, i) => {
    const item = document.createElement('div');
    item.className = 'card-editor-item';

    const numBadge = document.createElement('span');
    numBadge.className = 'card-num';
    numBadge.textContent = `CARD ${i + 2}`;
    item.appendChild(numBadge);

    item.appendChild(makeField(`content-num-${i}`,    '숫자',    'input',    card.number,   v => { state.contents[i].number = v; updateAll(); }));
    item.appendChild(makeField(`content-sub-${i}`,    '소제목',  'input',    card.subtitle, v => { state.contents[i].subtitle = v; updateAll(); }));
    item.appendChild(makeField(`content-title-${i}`,  '제목',    'input',    card.title,    v => { state.contents[i].title = v; updateAll(); }));
    item.appendChild(makeField(`content-body-${i}`,   '본문',    'textarea', card.body,     v => { state.contents[i].body = v; updateAll(); }));

    editor.appendChild(item);
  });
}

function makeField(id, label, type, value, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'field';
  const lbl = document.createElement('label');
  lbl.htmlFor = id;
  lbl.textContent = label;
  wrap.appendChild(lbl);

  let input;
  if (type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 3;
  } else {
    input = document.createElement('input');
    input.type = 'text';
  }
  input.id = id;
  input.value = value;
  input.addEventListener('input', e => onChange(e.target.value));
  wrap.appendChild(input);
  return wrap;
}

// ─────────────────────────────────────────────────────────
// 미리보기 갱신
// ─────────────────────────────────────────────────────────
function updateAll() {
  renderCard(currentCardIdx, document.getElementById('previewCard'));
  updateIndicator();
}

function updateIndicator() {
  document.getElementById('cardIndicator').textContent = `${currentCardIdx + 1} / ${TOTAL_CARDS}`;
  document.querySelectorAll('.thumb').forEach((el, i) => {
    el.classList.toggle('active', i === currentCardIdx);
  });
}

function buildThumbnails() {
  const thumbs = document.getElementById('previewThumbs');
  while (thumbs.firstChild) thumbs.removeChild(thumbs.firstChild);
  for (let i = 0; i < TOTAL_CARDS; i++) {
    const t = document.createElement('div');
    t.className = 'thumb';
    t.textContent = cardLabel(i);
    t.addEventListener('click', () => { currentCardIdx = i; updateAll(); });
    thumbs.appendChild(t);
  }
}

// ─────────────────────────────────────────────────────────
// 네비게이션
// ─────────────────────────────────────────────────────────
function setupNav() {
  document.getElementById('prevCard').addEventListener('click', () => {
    currentCardIdx = (currentCardIdx - 1 + TOTAL_CARDS) % TOTAL_CARDS;
    updateAll();
  });
  document.getElementById('nextCard').addEventListener('click', () => {
    currentCardIdx = (currentCardIdx + 1) % TOTAL_CARDS;
    updateAll();
  });
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowLeft') document.getElementById('prevCard').click();
    if (e.key === 'ArrowRight') document.getElementById('nextCard').click();
  });
}

// ─────────────────────────────────────────────────────────
// 다운로드 (ZIP)
// ─────────────────────────────────────────────────────────
async function downloadAll() {
  const btn = document.getElementById('downloadBtn');
  const modal = document.getElementById('downloadModal');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const statusEl = document.getElementById('downloadStatus');

  btn.disabled = true;
  modal.classList.add('open');
  statusEl.textContent = 'PNG 생성 중...';

  const zip = new JSZip();
  const folderName = (state.seriesName || 'cardnews').replace(/[^a-zA-Z0-9가-힣_-]/g, '_').slice(0, 30);
  const folder = zip.folder(folderName);

  const stage = document.createElement('div');
  stage.style.cssText = 'position:fixed; top:-99999px; left:-99999px; width:1080px; height:1350px; z-index:-1;';
  document.body.appendChild(stage);

  try {
    for (let i = 0; i < TOTAL_CARDS; i++) {
      renderCard(i, stage);
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 200));

      const blob = await htmlToImage.toBlob(stage.firstElementChild, {
        width: 1080,
        height: 1350,
        pixelRatio: 2,
        cacheBust: true,
      });
      if (blob) {
        const filename = `card-${String(i + 1).padStart(2, '0')}.png`;
        folder.file(filename, blob);
      }
      const done = i + 1;
      progressBar.style.width = `${(done / TOTAL_CARDS) * 100}%`;
      progressText.textContent = `${done} / ${TOTAL_CARDS}`;
    }

    statusEl.textContent = 'ZIP 압축 중...';
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${folderName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    statusEl.textContent = '✓ 다운로드 완료!';
    setTimeout(() => { modal.classList.remove('open'); }, 1200);
  } catch (err) {
    statusEl.textContent = '❌ 오류: ' + err.message;
    console.error(err);
    setTimeout(() => { modal.classList.remove('open'); }, 3000);
  } finally {
    if (stage.parentNode) document.body.removeChild(stage);
    btn.disabled = false;
  }
}

// ─────────────────────────────────────────────────────────
// 폼 UI ← state 단방향 동기화 (예시 로딩·리셋·외부 입력 후 호출)
// ─────────────────────────────────────────────────────────
function syncFormFromState() {
  document.getElementById('seriesName').value = state.seriesName;
  document.getElementById('coverBadge').value = state.cover.badge;
  document.getElementById('coverTitle').value = state.cover.title;
  document.getElementById('coverSubtitle').value = state.cover.subtitle;
  document.getElementById('coverHighlight').value = state.cover.highlight;

  // 레이아웃 라디오
  const layoutRadio = document.querySelector(`input[name="layout"][value="${state.layout}"]`);
  if (layoutRadio) layoutRadio.checked = true;

  // 컬러 프리셋 선택 (현재 값과 일치하는 chip 찾기)
  document.querySelectorAll('.palette-chip').forEach(c => c.classList.remove('selected'));
  const matchingChip = Array.from(document.querySelectorAll('.palette-chip')).find(c =>
    c.dataset.main === state.colors.main &&
    c.dataset.accent === state.colors.accent &&
    c.dataset.bg === state.colors.bg
  );
  if (matchingChip) matchingChip.classList.add('selected');

  document.getElementById('colorMain').value = state.colors.main;
  document.getElementById('colorAccent').value = state.colors.accent;
  document.getElementById('colorBg').value = state.colors.bg;
  document.getElementById('channel').value = state.channel;
  document.getElementById('ctaTitle').value = state.cta.title;
  document.getElementById('ctaSubtitle').value = state.cta.subtitle;
  document.getElementById('homepage').value = state.cta.homepage;
  document.getElementById('email').value = state.cta.email;
  document.getElementById('book').value = state.cta.book;

  renderCardEditor();
  currentCardIdx = 0;
  updateAll();
}

// ─────────────────────────────────────────────────────────
// 초기화 (Reset)
// ─────────────────────────────────────────────────────────
function reset() {
  if (!confirm('모든 입력을 초기값으로 되돌릴까요?')) return;
  Object.assign(state, structuredClone(DEFAULT_STATE));
  syncFormFromState();
}

// ─────────────────────────────────────────────────────────
// 예시 로딩
// ─────────────────────────────────────────────────────────
function loadExample(exampleId) {
  const example = EXAMPLES.find(e => e.id === exampleId);
  if (!example) return;
  Object.assign(state, structuredClone(example.state));
  syncFormFromState();
  closeModalById('examplesModal');
}

// ─────────────────────────────────────────────────────────
// 주제 입력 → 카드뉴스 자동 생성
// ─────────────────────────────────────────────────────────
function generateFromTopicForm({ closeAfter = true } = {}) {
  const topic    = document.getElementById('topicInput').value.trim();
  const format   = (document.querySelector('input[name="topicFormat"]:checked') || {}).value || 'tips';
  const tone     = (document.querySelector('input[name="topicTone"]:checked') || {}).value || 'info';
  const category = (document.querySelector('input[name="topicCategory"]:checked') || {}).value || 'general';

  if (!topic) {
    const input = document.getElementById('topicInput');
    input.focus();
    input.style.borderColor = '#ef4444';
    setTimeout(() => { input.style.borderColor = ''; }, 1500);
    return;
  }

  const newState = generateFromTopic({ topic, format, tone, category });
  Object.assign(state, newState);
  syncFormFromState();
  if (closeAfter) closeModalById('topicModal');
}

// ─────────────────────────────────────────────────────────
// AI 리서치 기반 카드뉴스 생성 (OpenAI gpt-4o-mini)
// ─────────────────────────────────────────────────────────
async function generateFromAI() {
  const topic    = document.getElementById('topicInput').value.trim();
  const format   = (document.querySelector('input[name="topicFormat"]:checked') || {}).value || 'tips';
  const tone     = (document.querySelector('input[name="topicTone"]:checked') || {}).value || 'info';
  const category = (document.querySelector('input[name="topicCategory"]:checked') || {}).value || 'general';

  if (!topic) {
    const input = document.getElementById('topicInput');
    input.focus();
    input.style.borderColor = '#ef4444';
    setTimeout(() => { input.style.borderColor = ''; }, 1500);
    return;
  }

  if (!window.AIResearch || !window.AIResearch.hasApiKey()) {
    closeModalById('topicModal');
    openModalById('apiKeyModal');
    return;
  }

  // 진행 모달 표시 (다운로드 모달 재활용)
  const status = document.getElementById('downloadStatus');
  const progressText = document.getElementById('progressText');
  const progressBar = document.getElementById('progressBar');
  if (status) status.textContent = '🤖 AI가 카드뉴스를 작성 중...';
  if (progressText) progressText.textContent = '리서치 + 카피 작성 (10~15초 소요)';
  if (progressBar) progressBar.style.width = '40%';
  openModalById('downloadModal');

  try {
    const aiResponse = await window.AIResearch.generateWithAI({ topic, category, format, tone });
    const channel = document.getElementById('channel').value || '@my_channel';
    const newState = window.AIResearch.aiResponseToState(aiResponse, { category, channel });

    if (progressBar) progressBar.style.width = '100%';
    if (progressText) progressText.textContent = '✅ 완료! 미리보기 확인하세요.';

    Object.assign(state, newState);
    syncFormFromState();

    setTimeout(() => {
      closeModalById('downloadModal');
      closeModalById('topicModal');
    }, 600);
  } catch (err) {
    closeModalById('downloadModal');
    alert('❌ ' + err.message);
  }
}

// ─────────────────────────────────────────────────────────
// API 키 상태 UI 동기화
// ─────────────────────────────────────────────────────────
function updateApiKeyStatusUI() {
  if (!window.AIResearch) return;
  const key = window.AIResearch.getApiKey();
  const btnLabel = document.getElementById('apiKeyBtnLabel');
  const statusEl = document.getElementById('apiKeyCurrentStatus');
  if (btnLabel) btnLabel.textContent = key ? 'API 키 ✓' : 'API 키';
  if (statusEl) statusEl.textContent = window.AIResearch.maskApiKey(key);
}

function buildExamplesGrid() {
  const grid = document.getElementById('exampleGrid');
  if (!grid) return;
  while (grid.firstChild) grid.removeChild(grid.firstChild);

  EXAMPLES.forEach(ex => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'example-card';
    btn.dataset.exampleId = ex.id;

    const emoji = document.createElement('span');
    emoji.className = 'example-emoji';
    emoji.textContent = ex.emoji;
    btn.appendChild(emoji);

    const title = document.createElement('div');
    title.className = 'example-title';
    title.textContent = ex.title;
    btn.appendChild(title);

    const summary = document.createElement('div');
    summary.className = 'example-summary';
    summary.textContent = ex.summary;
    btn.appendChild(summary);

    const meta = document.createElement('div');
    meta.className = 'example-meta';

    const tag = document.createElement('span');
    tag.className = 'example-tag';
    tag.textContent = ex.tag;
    meta.appendChild(tag);

    const swatches = document.createElement('span');
    swatches.className = 'example-swatches';
    [ex.state.colors.main, ex.state.colors.accent, ex.state.colors.bg].forEach(color => {
      const s = document.createElement('span');
      s.style.background = color;
      swatches.appendChild(s);
    });
    meta.appendChild(swatches);

    btn.appendChild(meta);
    btn.addEventListener('click', () => loadExample(ex.id));
    grid.appendChild(btn);
  });
}

// ─────────────────────────────────────────────────────────
// 모달 헬퍼
// ─────────────────────────────────────────────────────────
function openModalById(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
}
function closeModalById(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
}

function setupModals() {
  // 닫기 버튼 (data-close-modal 속성)
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModalById(btn.dataset.closeModal));
  });
  // 배경 클릭 시 닫기 (modal-box 외부)
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal && modal.id !== 'downloadModal') {
        closeModalById(modal.id);
      }
    });
  });
  // ESC 키
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    ['examplesModal', 'helpModal', 'topicModal'].forEach(id => {
      const m = document.getElementById(id);
      if (m && m.classList.contains('open')) closeModalById(id);
    });
  });

  // 버튼 바인딩
  const examplesBtn = document.getElementById('examplesBtn');
  examplesBtn.addEventListener('click', () => {
    dismissFirstVisitHint();
    openModalById('examplesModal');
  });
  document.getElementById('topicBtn').addEventListener('click', () => {
    dismissFirstVisitHint();
    openModalById('topicModal');
    // 모달 열리면 입력창에 즉시 포커스
    setTimeout(() => {
      const inp = document.getElementById('topicInput');
      if (inp) inp.focus();
    }, 50);
  });
  document.getElementById('helpBtn').addEventListener('click', () => openModalById('helpModal'));

  // 주제 모달 생성/다시 생성 버튼
  document.getElementById('topicGenerate').addEventListener('click', () => generateFromTopicForm({ closeAfter: true }));
  document.getElementById('topicRegenerate').addEventListener('click', () => generateFromTopicForm({ closeAfter: false }));
  // Enter 키로도 생성
  document.getElementById('topicInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      generateFromTopicForm({ closeAfter: true });
    }
  });

  // 사용법 모달 → 예시 보러 가기
  document.getElementById('helpToExamples').addEventListener('click', () => {
    closeModalById('helpModal');
    openModalById('examplesModal');
  });

  // ── API 키 모달 ──
  const apiKeyBtn = document.getElementById('apiKeyBtn');
  if (apiKeyBtn) {
    apiKeyBtn.addEventListener('click', () => {
      const inp = document.getElementById('apiKeyInput');
      if (inp) inp.value = '';
      updateApiKeyStatusUI();
      openModalById('apiKeyModal');
    });
  }
  const apiKeySave = document.getElementById('apiKeySave');
  if (apiKeySave) {
    apiKeySave.addEventListener('click', () => {
      const v = document.getElementById('apiKeyInput').value;
      if (window.AIResearch && window.AIResearch.setApiKey(v)) {
        updateApiKeyStatusUI();
        closeModalById('apiKeyModal');
      } else {
        alert('키를 입력해주세요. (sk-로 시작)');
      }
    });
  }
  const apiKeyDelete = document.getElementById('apiKeyDelete');
  if (apiKeyDelete) {
    apiKeyDelete.addEventListener('click', () => {
      if (!confirm('저장된 API 키를 삭제할까요?')) return;
      window.AIResearch.setApiKey('');
      updateApiKeyStatusUI();
      document.getElementById('apiKeyInput').value = '';
    });
  }

  // ── AI 리서치 생성 버튼 ──
  const topicAI = document.getElementById('topicAIGenerate');
  if (topicAI) topicAI.addEventListener('click', generateFromAI);

  const openApiKeyFromTopic = document.getElementById('openApiKeyFromTopic');
  if (openApiKeyFromTopic) {
    openApiKeyFromTopic.addEventListener('click', e => {
      e.preventDefault();
      closeModalById('topicModal');
      openModalById('apiKeyModal');
    });
  }

  // 첫 방문 인라인 힌트 (모달 X — 페이지 사용 차단 안 함)
  if (!localStorage.getItem('cardnews-builder-welcomed')) {
    examplesBtn.classList.add('pulse');
    const hint = document.getElementById('firstVisitHint');
    if (hint) {
      hint.hidden = false;
      // 화살표가 '예시로 시작' 버튼을 가리키도록 위치 정렬
      requestAnimationFrame(() => {
        const rect = examplesBtn.getBoundingClientRect();
        hint.style.right = `${Math.max(8, window.innerWidth - rect.right - 8)}px`;
      });
    }
    document.getElementById('hintClose').addEventListener('click', dismissFirstVisitHint);
  }
}

function dismissFirstVisitHint() {
  localStorage.setItem('cardnews-builder-welcomed', '1');
  const btn = document.getElementById('examplesBtn');
  if (btn) btn.classList.remove('pulse');
  const hint = document.getElementById('firstVisitHint');
  if (hint) hint.hidden = true;
}

// ─────────────────────────────────────────────────────────
// 진입점
// ─────────────────────────────────────────────────────────
function init() {
  bindForm();
  buildThumbnails();
  buildExamplesGrid();
  setupNav();
  setupModals();
  document.getElementById('downloadBtn').addEventListener('click', downloadAll);
  document.getElementById('resetBtn').addEventListener('click', reset);
  updateApiKeyStatusUI();
  updateAll();
}

document.addEventListener('DOMContentLoaded', init);
