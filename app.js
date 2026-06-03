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
  channel: '',
  layout: 'classic',
  colors: { main: '#e2e8f0', accent: '#00d4ff', bg: '#080c18' },
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
    title: '',
    subtitle: '',
    homepage: '',
    email: '',
    book: '',
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

// ───────── SVG 스케치 데코레이터 ─────────
function svgNeuralNet(accent) {
  return `<svg style="position:absolute;right:-30px;top:40px;width:560px;height:680px;opacity:0.13;pointer-events:none" viewBox="0 0 560 680" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="160" r="12" fill="${accent}"/>
    <circle cx="70" cy="280" r="12" fill="${accent}"/>
    <circle cx="70" cy="400" r="12" fill="${accent}"/>
    <circle cx="70" cy="520" r="10" fill="${accent}"/>
    <circle cx="220" cy="100" r="12" fill="${accent}"/>
    <circle cx="220" cy="220" r="16" fill="${accent}"/>
    <circle cx="220" cy="340" r="12" fill="${accent}"/>
    <circle cx="220" cy="460" r="12" fill="${accent}"/>
    <circle cx="220" cy="570" r="10" fill="${accent}"/>
    <circle cx="370" cy="180" r="18" fill="${accent}"/>
    <circle cx="370" cy="320" r="14" fill="${accent}"/>
    <circle cx="370" cy="460" r="14" fill="${accent}"/>
    <circle cx="500" cy="260" r="20" fill="${accent}"/>
    <circle cx="500" cy="400" r="14" fill="${accent}"/>
    <line x1="70" y1="160" x2="220" y2="100" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="70" y1="160" x2="220" y2="220" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="70" y1="280" x2="220" y2="220" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="70" y1="280" x2="220" y2="340" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="70" y1="400" x2="220" y2="340" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="70" y1="400" x2="220" y2="460" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="70" y1="520" x2="220" y2="460" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="70" y1="520" x2="220" y2="570" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="220" y1="100" x2="370" y2="180" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="220" y1="220" x2="370" y2="180" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="220" y1="220" x2="370" y2="320" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="220" y1="340" x2="370" y2="320" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="220" y1="340" x2="370" y2="460" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="220" y1="460" x2="370" y2="460" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <line x1="370" y1="180" x2="500" y2="260" stroke="${accent}" stroke-width="2" opacity="0.6"/>
    <line x1="370" y1="320" x2="500" y2="260" stroke="${accent}" stroke-width="2" opacity="0.6"/>
    <line x1="370" y1="320" x2="500" y2="400" stroke="${accent}" stroke-width="2" opacity="0.6"/>
    <line x1="370" y1="460" x2="500" y2="400" stroke="${accent}" stroke-width="2" opacity="0.6"/>
  </svg>`;
}

function svgCircuit(accent, idx) {
  const p = [
    `<svg style="position:absolute;right:50px;top:50px;width:240px;height:240px;opacity:0.1;pointer-events:none" viewBox="0 0 240 240" fill="none"><rect x="20" y="20" width="200" height="200" rx="4" stroke="${accent}" stroke-width="1.5"/><circle cx="20" cy="20" r="5" fill="${accent}"/><circle cx="220" cy="20" r="5" fill="${accent}"/><circle cx="20" cy="220" r="5" fill="${accent}"/><circle cx="220" cy="220" r="5" fill="${accent}"/><line x1="120" y1="20" x2="120" y2="70" stroke="${accent}" stroke-width="1.5"/><line x1="120" y1="70" x2="170" y2="70" stroke="${accent}" stroke-width="1.5"/><circle cx="170" cy="70" r="5" fill="${accent}"/><line x1="20" y1="120" x2="70" y2="120" stroke="${accent}" stroke-width="1.5"/><line x1="70" y1="120" x2="70" y2="170" stroke="${accent}" stroke-width="1.5"/><circle cx="70" cy="170" r="5" fill="${accent}"/><line x1="220" y1="120" x2="170" y2="120" stroke="${accent}" stroke-width="1.5"/><line x1="170" y1="120" x2="170" y2="170" stroke="${accent}" stroke-width="1.5"/><circle cx="170" cy="170" r="5" fill="${accent}"/><rect x="95" y="95" width="50" height="50" stroke="${accent}" stroke-width="1.5"/><circle cx="120" cy="120" r="10" fill="${accent}" opacity="0.5"/></svg>`,
    `<svg style="position:absolute;left:40px;bottom:100px;width:220px;height:220px;opacity:0.09;pointer-events:none" viewBox="0 0 220 220" fill="none"><circle cx="110" cy="110" r="90" stroke="${accent}" stroke-width="1.5" stroke-dasharray="8 5"/><circle cx="110" cy="110" r="60" stroke="${accent}" stroke-width="1.5"/><circle cx="110" cy="110" r="30" stroke="${accent}" stroke-width="1.5"/><circle cx="110" cy="110" r="8" fill="${accent}"/><line x1="110" y1="20" x2="110" y2="50" stroke="${accent}" stroke-width="1.5"/><line x1="110" y1="170" x2="110" y2="200" stroke="${accent}" stroke-width="1.5"/><line x1="20" y1="110" x2="50" y2="110" stroke="${accent}" stroke-width="1.5"/><line x1="170" y1="110" x2="200" y2="110" stroke="${accent}" stroke-width="1.5"/></svg>`,
    `<svg style="position:absolute;right:40px;top:40px;width:280px;height:280px;opacity:0.09;pointer-events:none" viewBox="0 0 280 280" fill="none"><polygon points="140,20 230,70 230,170 140,220 50,170 50,70" stroke="${accent}" stroke-width="1.5"/><polygon points="140,55 205,92 205,165 140,202 75,165 75,92" stroke="${accent}" stroke-width="1"/><circle cx="140" cy="140" r="25" stroke="${accent}" stroke-width="1.5"/><circle cx="140" cy="140" r="8" fill="${accent}"/><line x1="140" y1="20" x2="140" y2="55" stroke="${accent}" stroke-width="1"/><line x1="230" y1="70" x2="205" y2="92" stroke="${accent}" stroke-width="1"/><line x1="50" y1="170" x2="75" y2="165" stroke="${accent}" stroke-width="1"/></svg>`,
    `<svg style="position:absolute;right:50px;top:60px;width:160px;height:320px;opacity:0.08;pointer-events:none" viewBox="0 0 160 320" fill="${accent}" font-family="monospace"><text x="0" y="45" font-size="32">01</text><text x="50" y="90" font-size="26">10</text><text x="10" y="135" font-size="30">11</text><text x="70" y="180" font-size="24">00</text><text x="0" y="225" font-size="28">01</text><text x="55" y="270" font-size="32">10</text><text x="20" y="315" font-size="26">11</text></svg>`,
    `<svg style="position:absolute;left:0;bottom:60px;width:500px;height:160px;opacity:0.1;pointer-events:none" viewBox="0 0 500 160" fill="none"><path d="M0,80 Q62,40 125,80 Q187,120 250,80 Q312,40 375,80 Q437,120 500,80" stroke="${accent}" stroke-width="2.5"/><path d="M0,100 Q62,60 125,100 Q187,140 250,100 Q312,60 375,100 Q437,140 500,100" stroke="${accent}" stroke-width="1.5" opacity="0.5"/><path d="M0,60 Q62,20 125,60 Q187,100 250,60 Q312,20 375,60 Q437,100 500,60" stroke="${accent}" stroke-width="1.5" opacity="0.5"/></svg>`,
    `<svg style="position:absolute;right:0;top:0;width:340px;height:480px;opacity:0.07;pointer-events:none" viewBox="0 0 340 480" fill="${accent}">${[0,1,2,3,4,5,6,7].map(r=>[0,1,2,3,4,5].map(c=>`<circle cx="${28+c*52}" cy="${28+r*60}" r="4"/>`).join('')).join('')}</svg>`,
  ];
  return p[idx % p.length];
}

function svgPulse(accent) {
  return `<svg style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:1000px;height:1000px;opacity:0.07;pointer-events:none" viewBox="0 0 1000 1000" fill="none"><circle cx="500" cy="500" r="100" stroke="${accent}" stroke-width="2"/><circle cx="500" cy="500" r="210" stroke="${accent}" stroke-width="1.5"/><circle cx="500" cy="500" r="330" stroke="${accent}" stroke-width="1.5" stroke-dasharray="12 6"/><circle cx="500" cy="500" r="450" stroke="${accent}" stroke-width="1" stroke-dasharray="8 8"/><line x1="500" y1="60" x2="500" y2="170" stroke="${accent}" stroke-width="2"/><line x1="500" y1="830" x2="500" y2="940" stroke="${accent}" stroke-width="2"/><line x1="60" y1="500" x2="170" y2="500" stroke="${accent}" stroke-width="2"/><line x1="830" y1="500" x2="940" y2="500" stroke="${accent}" stroke-width="2"/><circle cx="500" cy="60" r="10" fill="${accent}"/><circle cx="500" cy="940" r="10" fill="${accent}"/><circle cx="60" cy="500" r="10" fill="${accent}"/><circle cx="940" cy="500" r="10" fill="${accent}"/><circle cx="500" cy="500" r="22" fill="${accent}" opacity="0.35"/></svg>`;
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
      <div style="position:absolute;top:0;left:0;right:0;height:7px;background:linear-gradient(90deg,${colors.accent},${colors.accent}77,transparent)"></div>
      ${svgNeuralNet(colors.accent)}
      <div style="padding:130px 90px 90px;display:flex;flex-direction:column;height:100%;">
        <div style="font-size:24px;font-weight:700;letter-spacing:5px;color:${colors.accent};margin-bottom:60px;">
          ${escapeHtml(data.badge).toUpperCase()}
        </div>
        <div style="border-top:2px solid ${colors.main}33;padding-top:70px;flex:1;display:flex;flex-direction:column;justify-content:center;">
          <h1 style="font-size:126px;font-weight:900;line-height:1.0;letter-spacing:-3px;margin-bottom:52px;">
            ${nl2br(data.title)}
          </h1>
          <p style="font-size:38px;font-weight:500;line-height:1.5;color:${colors.main};opacity:0.7;">
            ${nl2br(data.subtitle)}
          </p>
        </div>
        <div style="margin-top:50px;padding-top:30px;border-top:1px solid ${colors.main}28;display:flex;justify-content:space-between;align-items:center;font-size:22px;font-weight:700;">
          <span style="color:${colors.accent}">${escapeHtml(data.highlight)}</span>
          <span style="opacity:0.5">${escapeHtml(state.channel)}</span>
        </div>
      </div>
    `, colors);
  }
  if (layout === 'bold') {
    return baseFrame(`
      <div style="position:absolute;inset:0;background:${colors.main};clip-path:polygon(0 0,100% 0,100% 65%,0 100%);"></div>
      ${svgNeuralNet(colors.accent)}
      <div style="position:relative;padding:110px 90px 90px;display:flex;flex-direction:column;height:100%;">
        <div style="display:inline-block;align-self:flex-start;background:${colors.accent};color:${colors.bg};padding:16px 34px;font-size:28px;font-weight:900;letter-spacing:3px;margin-bottom:55px;border-radius:4px;">
          ${escapeHtml(data.badge).toUpperCase()}
        </div>
        <h1 style="font-size:136px;font-weight:900;line-height:1.0;letter-spacing:-4px;color:${colors.bg};margin-bottom:52px;">
          ${nl2br(data.title)}
        </h1>
        <p style="font-size:40px;font-weight:600;line-height:1.45;color:${colors.bg};opacity:0.82;">
          ${nl2br(data.subtitle)}
        </p>
        <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;padding-top:40px;">
          <div style="background:${colors.accent};color:${colors.bg};padding:14px 28px;font-size:28px;font-weight:900;border-radius:4px;">
            ${escapeHtml(data.highlight)}
          </div>
          <div style="font-size:26px;font-weight:800;color:${colors.bg};opacity:0.65;">
            ${escapeHtml(state.channel)}
          </div>
        </div>
      </div>
    `, colors);
  }
  // classic (default)
  return baseFrame(`
    <div style="position:absolute;inset:0;background:linear-gradient(135deg,${colors.bg} 0%,${colors.bg} 55%,${colors.accent}1a 100%);"></div>
    <div style="position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,${colors.accent},${colors.accent}66,transparent);"></div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:8px;background:linear-gradient(180deg,${colors.accent},${colors.accent}33,transparent);"></div>
    ${svgNeuralNet(colors.accent)}
    <div style="position:relative;padding:120px 90px 90px 116px;display:flex;flex-direction:column;height:100%;">
      <div style="display:inline-flex;align-self:flex-start;align-items:center;gap:12px;background:${colors.accent};color:${colors.bg};padding:14px 32px;font-size:26px;font-weight:800;letter-spacing:3px;margin-bottom:68px;border-radius:4px;">
        <span style="width:8px;height:8px;border-radius:50%;background:${colors.bg};display:inline-block;flex-shrink:0;"></span>
        ${escapeHtml(data.badge).toUpperCase()}
      </div>
      <h1 style="font-size:134px;font-weight:900;line-height:1.0;letter-spacing:-4px;margin-bottom:46px;color:${colors.main};">
        ${nl2br(data.title)}
      </h1>
      <p style="font-size:40px;font-weight:500;line-height:1.5;color:${colors.main};opacity:0.72;margin-bottom:60px;max-width:820px;">
        ${nl2br(data.subtitle)}
      </p>
      <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;padding-top:36px;border-top:1px solid ${colors.main}22;">
        <div style="border:2px solid ${colors.accent};color:${colors.accent};padding:16px 34px;font-size:28px;font-weight:900;letter-spacing:1px;border-radius:6px;">
          ${escapeHtml(data.highlight)}
        </div>
        <div style="font-size:26px;font-weight:700;color:${colors.main};opacity:0.45;">
          ${escapeHtml(state.channel)}
        </div>
      </div>
    </div>
  `, colors);
}

// ───────── CONTENT ─────────
function renderContent(data, colors, layout, channel) {
  const idxInList = state.contents.findIndex(c => c.number === data.number);
  const svgDeco = svgCircuit(colors.accent, idxInList);

  if (layout === 'minimal') {
    return baseFrame(`
      <div style="position:absolute;left:0;top:0;bottom:0;width:8px;background:linear-gradient(180deg,${colors.accent},${colors.accent}44,transparent);"></div>
      ${svgDeco}
      <div style="padding:110px 90px 100px 116px;display:flex;flex-direction:column;height:100%;">
        <div style="font-size:116px;font-weight:900;color:${colors.accent};line-height:1;letter-spacing:-4px;margin-bottom:20px;">
          ${escapeHtml(data.number)}
        </div>
        <div style="font-size:26px;font-weight:700;letter-spacing:3px;color:${colors.main};opacity:0.5;margin-bottom:36px;text-transform:uppercase;">
          ${escapeHtml(data.subtitle)}
        </div>
        <h2 style="font-size:88px;font-weight:900;line-height:1.1;letter-spacing:-2px;margin-bottom:48px;border-top:2px solid ${colors.main}33;padding-top:48px;">
          ${nl2br(data.title)}
        </h2>
        <p style="font-size:42px;font-weight:500;line-height:1.6;opacity:0.82;">
          ${nl2br(data.body)}
        </p>
        <div style="margin-top:auto;padding-top:40px;font-size:24px;font-weight:700;color:${colors.accent};">
          ${escapeHtml(channel)}
        </div>
      </div>
    `, colors);
  }
  if (layout === 'bold') {
    return baseFrame(`
      <div style="position:absolute;top:0;left:0;width:300px;height:300px;background:${colors.accent};display:grid;place-items:center;">
        <span style="font-size:168px;font-weight:900;color:${colors.bg};line-height:1;">${escapeHtml(data.number)}</span>
      </div>
      ${svgDeco}
      <div style="padding:330px 90px 90px;display:flex;flex-direction:column;height:100%;">
        <div style="font-size:26px;font-weight:700;letter-spacing:3px;color:${colors.accent};margin-bottom:22px;text-transform:uppercase;">
          ${escapeHtml(data.subtitle)}
        </div>
        <h2 style="font-size:100px;font-weight:900;line-height:1.05;letter-spacing:-2px;margin-bottom:56px;">
          ${nl2br(data.title)}
        </h2>
        <div style="background:${colors.main};color:${colors.bg};padding:46px 50px;font-size:40px;font-weight:500;line-height:1.55;border-radius:8px;">
          ${nl2br(data.body)}
        </div>
        <div style="margin-top:auto;padding-top:40px;display:flex;justify-content:space-between;font-size:24px;font-weight:700;">
          <span style="color:${colors.accent};">${escapeHtml(channel)}</span>
          <span style="opacity:0.38;">${idxInList + 1} / ${state.contents.length}</span>
        </div>
      </div>
    `, colors);
  }
  // classic
  return baseFrame(`
    <div style="position:absolute;inset:0;background:linear-gradient(135deg,${colors.bg} 0%,${colors.bg} 60%,${colors.accent}12 100%);"></div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:8px;background:linear-gradient(180deg,${colors.accent},${colors.accent}44,transparent);"></div>
    ${svgDeco}
    <div style="position:relative;padding:110px 90px 90px 116px;display:flex;flex-direction:column;height:100%;">
      <div style="display:flex;align-items:center;gap:24px;margin-bottom:44px;">
        <div style="font-size:130px;font-weight:900;color:${colors.accent};line-height:1;letter-spacing:-4px;">
          ${escapeHtml(data.number)}
        </div>
        <div style="height:110px;width:4px;background:${colors.main};opacity:0.14;flex-shrink:0;"></div>
        <div style="font-size:28px;font-weight:700;color:${colors.main};opacity:0.62;letter-spacing:1px;max-width:380px;line-height:1.3;">
          ${escapeHtml(data.subtitle)}
        </div>
      </div>
      <h2 style="font-size:94px;font-weight:900;line-height:1.1;letter-spacing:-2px;margin-bottom:50px;color:${colors.main};">
        ${nl2br(data.title)}
      </h2>
      <p style="font-size:42px;font-weight:500;line-height:1.6;color:${colors.main};opacity:0.82;">
        ${nl2br(data.body)}
      </p>
      <div style="margin-top:auto;padding-top:44px;display:flex;justify-content:space-between;align-items:center;font-size:24px;border-top:1px solid ${colors.main}18;">
        <span style="font-weight:700;color:${colors.accent};">${escapeHtml(channel)}</span>
        <span style="font-weight:700;color:${colors.main};opacity:0.32;">${idxInList + 1} / ${state.contents.length}</span>
      </div>
    </div>
  `, colors);
}

// ───────── CTA ─────────
function renderCta(data, channel, colors, layout) {
  const bookLine = data.book
    ? `<div style="font-weight:700;color:${colors.accent};font-size:26px;">${escapeHtml(data.book)}</div>`
    : '';
  const bookLineBold = data.book
    ? `<div style="font-weight:800;color:${colors.accent};margin-top:8px;">${escapeHtml(data.book)}</div>`
    : '';
  const bookLineClassic = data.book
    ? `<div style="margin-top:8px;padding-top:18px;border-top:1px solid ${colors.bg}33;font-weight:700;color:${colors.accent};">${escapeHtml(data.book)}</div>`
    : '';

  if (layout === 'minimal') {
    return baseFrame(`
      <div style="position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,${colors.accent},${colors.accent}77,transparent)"></div>
      ${svgPulse(colors.accent)}
      <div style="position:relative;padding:130px 90px;display:flex;flex-direction:column;height:100%;text-align:center;align-items:center;justify-content:center;">
        <div style="font-size:24px;font-weight:700;letter-spacing:6px;color:${colors.accent};margin-bottom:50px;">
          THANK YOU
        </div>
        <h2 style="font-size:96px;font-weight:900;line-height:1.1;letter-spacing:-2px;margin-bottom:28px;">
          ${nl2br(data.title)}
        </h2>
        <p style="font-size:36px;font-weight:500;opacity:0.65;margin-bottom:80px;">
          ${escapeHtml(data.subtitle)}
        </p>
        <div style="width:100%;max-width:700px;border-top:2px solid ${colors.main}33;padding-top:50px;display:flex;flex-direction:column;gap:24px;font-size:30px;">
          <div style="font-weight:800;color:${colors.accent};">${escapeHtml(channel)}</div>
          <div style="opacity:0.72;">🌐 ${escapeHtml(data.homepage)}</div>
          <div style="opacity:0.72;">✉ ${escapeHtml(data.email)}</div>
          ${bookLine}
        </div>
      </div>
    `, colors);
  }
  if (layout === 'bold') {
    return baseFrame(`
      <div style="position:absolute;inset:0;background:${colors.main};"></div>
      ${svgPulse(colors.accent)}
      <div style="position:relative;padding:130px 90px;display:flex;flex-direction:column;height:100%;color:${colors.bg};">
        <div style="display:inline-block;align-self:flex-start;background:${colors.accent};color:${colors.bg};padding:14px 28px;font-size:24px;font-weight:900;letter-spacing:3px;margin-bottom:50px;border-radius:4px;">
          CONNECT
        </div>
        <h2 style="font-size:116px;font-weight:900;line-height:1.0;letter-spacing:-3px;margin-bottom:36px;">
          ${nl2br(data.title)}
        </h2>
        <p style="font-size:38px;font-weight:500;opacity:0.82;margin-bottom:70px;">
          ${escapeHtml(data.subtitle)}
        </p>
        <div style="background:${colors.bg};color:${colors.main};padding:40px 50px;margin-top:auto;display:flex;flex-direction:column;gap:18px;font-size:30px;border-radius:8px;">
          <div style="font-weight:900;font-size:34px;color:${colors.accent};">${escapeHtml(channel)}</div>
          <div style="opacity:0.85;">🌐 ${escapeHtml(data.homepage)}</div>
          <div style="opacity:0.85;">✉ ${escapeHtml(data.email)}</div>
          ${bookLineBold}
        </div>
      </div>
    `, colors);
  }
  // classic
  return baseFrame(`
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,${colors.bg} 0%,${colors.bg} 50%,${colors.accent}0f 100%);"></div>
    <div style="position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,${colors.accent},${colors.accent}66,transparent);"></div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:8px;background:linear-gradient(180deg,${colors.accent},${colors.accent}33,transparent);"></div>
    ${svgPulse(colors.accent)}
    <div style="position:relative;padding:110px 90px 90px;display:flex;flex-direction:column;height:100%;text-align:center;align-items:center;">
      <div style="display:inline-flex;align-items:center;gap:14px;background:${colors.accent};color:${colors.bg};padding:14px 34px;font-size:26px;font-weight:800;letter-spacing:3px;margin-bottom:60px;border-radius:4px;">
        <span style="width:8px;height:8px;border-radius:50%;background:${colors.bg};display:inline-block;flex-shrink:0;"></span>
        함께해요
      </div>
      <h2 style="font-size:100px;font-weight:900;line-height:1.1;letter-spacing:-2px;margin-bottom:28px;color:${colors.main};">
        ${nl2br(data.title)}
      </h2>
      <p style="font-size:38px;font-weight:500;opacity:0.65;margin-bottom:auto;color:${colors.main};">
        ${escapeHtml(data.subtitle)}
      </p>
      <div style="margin-top:60px;width:100%;max-width:820px;background:${colors.main};color:${colors.bg};padding:46px 60px;border-radius:12px;display:flex;flex-direction:column;gap:20px;font-size:30px;text-align:left;">
        <div style="font-size:38px;font-weight:900;color:${colors.accent};">${escapeHtml(channel)}</div>
        <div style="opacity:0.85;">🌐 ${escapeHtml(data.homepage)}</div>
        <div style="opacity:0.85;">✉ ${escapeHtml(data.email)}</div>
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
