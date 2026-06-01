/* ═════════════════════════════════════════════════════════
   주제 → 카드뉴스 8장 자동 생성기 (템플릿 매트릭스)

   입력: { topic, format, tone, category }
   출력: state 객체 (예시 데이터와 같은 구조)

   - format: tips | steps | compare
   - tone: info | emotional | witty | serious
   - category: marketing | tech | health | finance | book | general
   ═════════════════════════════════════════════════════════ */

// 카테고리별 컬러/레이아웃 기본값
const CATEGORY_STYLES = {
  marketing: { layout: 'classic',  colors: { main: '#1a2332', accent: '#d4af37', bg: '#f5f1e8' } }, // 네이비골드
  tech:      { layout: 'bold',     colors: { main: '#0a3d62', accent: '#f5af19', bg: '#eef5f9' } }, // 오션
  health:    { layout: 'minimal',  colors: { main: '#3d0f17', accent: '#ff6b6b', bg: '#fff5f5' } }, // 체리
  finance:   { layout: 'classic',  colors: { main: '#1d3b2a', accent: '#c9a957', bg: '#f3efe4' } }, // 포레스트
  book:      { layout: 'minimal',  colors: { main: '#5c2a3c', accent: '#e8a87c', bg: '#fdf6ec' } }, // 와인살구
  farming:   { layout: 'minimal',  colors: { main: '#6B4423', accent: '#F4B942', bg: '#FFF8E7' } }, // 수확 (농민)
  shop:      { layout: 'bold',     colors: { main: '#C0392B', accent: '#E8A33D', bg: '#F5EEDC' } }, // 시장 (소상공인)
  daily:     { layout: 'classic',  colors: { main: '#5D7B9A', accent: '#F2C9B5', bg: '#FAFAFA' } }, // 일기 (일상)
  general:   { layout: 'classic',  colors: { main: '#1a2332', accent: '#d4af37', bg: '#f5f1e8' } }, // 기본
};

// 톤별 어미/표현 (간단한 후처리)
function applyTone(text, tone) {
  if (!text) return text;
  if (tone === 'emotional') {
    return text
      .replace(/입니다\./g, '이에요.')
      .replace(/합니다\./g, '해요.')
      .replace(/됩니다\./g, '돼요.');
  }
  if (tone === 'witty') {
    return text
      .replace(/입니다\./g, '랍니다 :)')
      .replace(/합니다\./g, '하죠!')
      .replace(/됩니다\./g, '됩니다 ✨');
  }
  if (tone === 'serious') {
    return text
      .replace(/입니다\./g, '입니다. 반드시.')
      .replace(/하세요\./g, '해야 합니다.')
      .replace(/좋습니다\./g, '필수적입니다.');
  }
  return text; // info (default)
}

// 톤별 표지 강조 문구
const TONE_HIGHLIGHTS = {
  info:      ['핵심 정리', '6가지 핵심', '한눈에 보기', '필수 가이드'],
  emotional: ['오늘부터 시작', '함께 가요', '나에게 주는 선물', '작은 변화부터'],
  witty:     ['이거 모르면 손해!', '꿀팁 대방출', '아하 모먼트', '진짜 실용 가이드'],
  serious:   ['반드시 알아야 할 것', '놓치면 안 되는', '전문가가 강조하는', '필수 체크'],
};

// 톤별 배지
const TONE_BADGES = {
  info:      ['핵심 가이드', '인사이트', '한 줄 요약', '필수 정보'],
  emotional: ['오늘의 영감', '나에게 한마디', '작은 시작', '함께해요'],
  witty:     ['이건 알아야 해', '꿀팁 시간', '재밌게 배우기', '하루의 한 입'],
  serious:   ['전문가 분석', '심층 인사이트', '깊이 있는 시선', '진지하게'],
};

// ──── 형식 1: 팁 시리즈 ────────────────────────────────
function tipsFormat(topic, tone) {
  return {
    cover: {
      badge:     pick(TONE_BADGES[tone]),
      title:     `${topic},\n핵심 6가지`,
      subtitle:  applyTone(`${topic}에 대해 꼭 알아야 할 것들.\n5분 안에 정리합니다.`, tone),
      highlight: pick(TONE_HIGHLIGHTS[tone]),
    },
    contents: [
      { number: '01', subtitle: '시작하기 전에',         title: `왜 지금 ${topic}인가`,        body: applyTone(`흐름이 바뀌고 있습니다.\n지금 알아두면 1년 뒤가 다릅니다.\n그게 ${topic}의 가치입니다.`, tone) },
      { number: '02', subtitle: '첫 번째 원칙',           title: `${topic}의 기본`,           body: applyTone(`기본을 무시하면 무너집니다.\n화려한 기법보다 단단한 기초.\n여기서 모든 게 시작됩니다.`, tone) },
      { number: '03', subtitle: '실전 적용법',           title: `오늘부터 할 일`,             body: applyTone(`작게 시작하세요.\n하루 10분이면 충분합니다.\n꾸준함이 결과를 만듭니다.`, tone) },
      { number: '04', subtitle: '흔한 실수',             title: `이건 피하세요`,              body: applyTone(`완벽주의가 발목을 잡습니다.\n70% 완성도로 일단 출시.\n나머지는 피드백으로 다듬으세요.`, tone) },
      { number: '05', subtitle: '한 단계 더',            title: `더 잘하는 노하우`,           body: applyTone(`데이터를 보세요.\n감으로 결정하면 흔들립니다.\n숫자가 다음 행동을 알려줍니다.`, tone) },
      { number: '06', subtitle: '다음은',                title: `여기까지 왔다면`,            body: applyTone(`기본기는 끝났습니다.\n이제 본인만의 색을 입힐 차례.\n${topic}의 진짜는 여기부터입니다.`, tone) },
    ],
  };
}

// ──── 형식 2: 단계별 가이드 ────────────────────────────
function stepsFormat(topic, tone) {
  return {
    cover: {
      badge:     pick(TONE_BADGES[tone]),
      title:     `${topic},\n6단계 로드맵`,
      subtitle:  applyTone(`처음부터 끝까지, 순서대로.\n빠짐없이 따라할 수 있는 가이드.`, tone),
      highlight: '단계별 실전',
    },
    contents: [
      { number: 'STEP 1', subtitle: '준비',     title: '시작 전 점검',             body: applyTone(`${topic}을 시작하기 전에\n무엇이 필요한지 확인하세요.\n준비가 절반입니다.`, tone) },
      { number: 'STEP 2', subtitle: '진입',     title: '첫 발 떼기',               body: applyTone(`완벽한 계획보다\n불완전한 시작이 낫습니다.\n오늘 10분만 투자해보세요.`, tone) },
      { number: 'STEP 3', subtitle: '구축',     title: '기본 구조 만들기',         body: applyTone(`뼈대를 먼저 세우세요.\n살은 나중에 붙입니다.\n전체 그림이 보이면 길이 명확해집니다.`, tone) },
      { number: 'STEP 4', subtitle: '검증',     title: '작게 테스트하기',          body: applyTone(`전체에 적용하기 전에\n작은 단위로 먼저 시도하세요.\n실패 비용을 줄이는 가장 빠른 길입니다.`, tone) },
      { number: 'STEP 5', subtitle: '확장',     title: '키워가기',                 body: applyTone(`잘 되는 것에 집중하세요.\n안 되는 건 빠르게 정리.\n성과 나는 곳에 자원을 두 배.`, tone) },
      { number: 'STEP 6', subtitle: '지속',     title: '습관으로 만들기',          body: applyTone(`90일을 버티면 자동화됩니다.\n그때부터는 ${topic}이\n내 삶의 일부가 됩니다.`, tone) },
    ],
  };
}

// ──── 형식 3: 비교·분석 (오해 vs 진실) ──────────────────
function compareFormat(topic, tone) {
  return {
    cover: {
      badge:     pick(TONE_BADGES[tone]),
      title:     `${topic},\n진짜와 가짜`,
      subtitle:  applyTone(`널리 퍼진 오해와 잘 알려지지 않은 진실.\n이 글로 정리하세요.`, tone),
      highlight: '오해 → 진실',
    },
    contents: [
      { number: '오해 1', subtitle: '많이 하는 착각',    title: '"열심히만 하면 된다"',         body: applyTone(`방향이 틀리면 노력이 손해.\n${topic}에서는 방향이 1순위입니다.\n속도는 그 다음입니다.`, tone) },
      { number: '진실 1', subtitle: '실제로는',           title: '방향 → 속도 → 양',           body: applyTone(`이 순서를 지켜야 합니다.\n방향이 맞으면 속도가 의미 있고,\n속도가 있어야 양이 쌓입니다.`, tone) },
      { number: '오해 2', subtitle: '흔한 믿음',          title: '"많이 하면 잘 된다"',         body: applyTone(`양이 질을 만든다는 말,\n반은 맞고 반은 틀립니다.\n방향 없는 양은 그냥 소모입니다.`, tone) },
      { number: '진실 2', subtitle: '핵심은',              title: '의도된 반복',                  body: applyTone(`매번 살짝 다른 방식으로,\n결과를 보면서 조정하는 반복.\n그게 진짜 ${topic}입니다.`, tone) },
      { number: '결론',   subtitle: '한 문장으로',         title: `${topic}의 진짜`,             body: applyTone(`겉으로는 비슷해 보여도\n안에서는 완전히 다른 게임입니다.\n오늘부터 진짜를 선택하세요.`, tone) },
      { number: '행동',   subtitle: '내일부터',            title: '구체적인 첫 단계',           body: applyTone(`작은 것 하나만 바꿔보세요.\n오늘 1시간 안에 할 수 있는 것.\n그게 변화의 시작입니다.`, tone) },
    ],
  };
}

// 단순한 랜덤 선택
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ──── 메인 엔트리: 주제 → state ─────────────────────────
// eslint-disable-next-line no-unused-vars
function generateFromTopic({ topic, format = 'tips', tone = 'info', category = 'general' }) {
  const cleanTopic = (topic || '').trim() || '나의 주제';
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.general;

  let parts;
  if (format === 'steps') parts = stepsFormat(cleanTopic, tone);
  else if (format === 'compare') parts = compareFormat(cleanTopic, tone);
  else parts = tipsFormat(cleanTopic, tone);

  return {
    seriesName: `${cleanTopic} 시리즈`,
    channel: '@your_channel',
    layout: style.layout,
    colors: { ...style.colors },
    cover: parts.cover,
    contents: parts.contents,
    cta: {
      title: applyTone(`${cleanTopic},\n더 깊이 보고 싶다면`, tone),
      subtitle: applyTone('구독하고 매주 만나요.', tone),
      homepage: 'your-site.com',
      email: 'hello@your-site.com',
      book: '',
    },
  };
}
