/* ═════════════════════════════════════════════════════════
   AI 리서치 기반 카드뉴스 생성기
   - OpenAI gpt-4o-mini 사용
   - 사용자 본인 API 키 (LocalStorage 저장)
   - 카테고리별 시스템 프롬프트로 타겟에 맞는 톤 강제
   - 응답은 JSON Mode로 강제 (state 구조에 바로 매핑)
   ═════════════════════════════════════════════════════════ */

const API_KEY_STORAGE = 'openai_api_key_v1';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';

// ───── 키 관리 ─────
function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || '';
}
function setApiKey(key) {
  const trimmed = (key || '').trim();
  if (!trimmed) {
    localStorage.removeItem(API_KEY_STORAGE);
    return false;
  }
  localStorage.setItem(API_KEY_STORAGE, trimmed);
  return true;
}
function hasApiKey() {
  return !!getApiKey();
}
function maskApiKey(key) {
  if (!key || key.length < 12) return '미설정';
  return key.slice(0, 7) + '...' + key.slice(-4);
}

// ───── 카테고리별 시스템 프롬프트 ─────
// 핵심: 타겟 페르소나·금지 어휘·필수 포함 요소를 구체적으로 명시
const SYSTEM_PROMPTS = {
  farming: `당신은 한국 농민·귀농인을 위한 인스타그램 카드뉴스를 작성하는 전문가입니다.

대상: 30~70대 한국 농민·귀농 준비자. 스마트폰은 쓰지만 마케팅 용어는 모름.

필수 원칙:
- 모든 카피에 구체성 필수: 작물명(딸기·고추·블루베리 등), 시기(3월 초·장마 직전), 금액(원 단위), 수량(kg·평·주)을 반드시 포함
- 시의성 있는 정보 우선: 최근 정부 지원사업, 올해 시세 동향, 계절 작물 캘린더, 신청 마감일 등 알면 도움 되는 실제 정보
- 5060대도 이해할 어휘만 사용. 외래어·영어 약자 금지(SNS, GEO, MVP 같은 단어 X)
- 격식체("~합니다") 대신 친근체("~해요", "~예요") 사용
- 한 카드 한 메시지. 본문은 3줄 이내, 각 줄 25자 이내

금지: "전략", "최적화", "퍼포먼스", "ROI", "콘텐츠", "마케팅" 같은 비즈니스 용어. 대신 "팔기", "단골 만들기", "사진 찍기", "이야기 적기"로.

피해야 할 표면적 팁:
- "꾸준히 올리세요" (구체적 빈도·시간·요일 없으면 빈말)
- "사진을 예쁘게" (어떻게? 어떤 시간? 어떤 각도?)
- "단골을 만드세요" (어떤 행동으로?)`,

  shop: `당신은 한국 소상공인(카페·식당·동네 가게 사장님)을 위한 인스타그램 카드뉴스를 작성하는 전문가입니다.

대상: 20~60대 자영업자. 매출이 곧 생존. 시간 없음. 추상론 싫어함.

필수 원칙:
- 매출·비용·시간 절감과 직결되는 실전 액션만 작성
- 구체 숫자 필수: "별점 4.8 만들기", "재주문률 30% 상승", "월 50만원 절감" 같이 측정 가능한 결과
- 최근 정책·플랫폼 변화 반영: 배달앱 수수료, 카드 수수료, 자영업자 지원금, 임대료 동향, 최근 행정 변경
- 한 카드 한 액션. "오늘 가게 닫고 바로 할 수 있는 일" 수준의 구체성
- 따뜻하지만 친근체. "사장님" 호칭 활용 가능

금지: "브랜딩", "콘텐츠 마케팅", "퍼널", "리드", "타겟팅" 같은 마케팅 용어. 대신 "단골 만들기", "리뷰 늘리기", "재방문" 같은 일상어.

피해야 할 표면적 팁:
- "친절하게 응대하세요" (당연한 말)
- "SNS를 활용하세요" (어떻게? 무엇을?)
- "충성 고객을 만드세요" (구체적 행동 없으면 무의미)`,

  daily: `당신은 한국 직장인·1인 가구·청년을 위한 인스타그램 카드뉴스를 작성하는 전문가입니다.

대상: 20~40대 평범한 한국인. 시간·돈·에너지 부족. 거창한 자기계발 싫어함.

필수 원칙:
- "오늘 저녁 집에서 바로 할 수 있는 한 가지" 수준의 작은 행동만
- 구체 수치: 시간(10분·30분), 금액(월 5만원·연 60만원), 빈도(주 3회·하루 1번)
- 최근 트렌드·서비스·정책 반영: 토스/카카오뱅크 새 기능, 청년 정책, 신상 앱, 최근 생활 비용 동향
- 따뜻하지만 가볍게. 가르치는 톤 X. "함께 해봐요" 톤
- 한 카드 한 습관. "오늘 밤 자기 전 한 번"이면 충분

금지: "성공", "자기계발", "성장 마인드셋", "라이프 디자인" 같은 자기계발 책 표현. 대신 "쉬는 시간", "나만의 시간", "잠 잘 자기" 같은 일상어.

피해야 할 표면적 팁:
- "감사 일기를 쓰세요" (왜? 어떻게? 언제?)
- "물을 많이 드세요" (구체 양·시간·방법 없으면 빈말)
- "운동하세요" (어떤? 얼마나? 어디서?)`,

  general: `당신은 한국 인스타그램 카드뉴스 카피라이터입니다. 구체적이고 실용적이며 독자 행동으로 바로 이어지는 카피만 작성하세요.`,
};

// ───── JSON 출력 스키마 안내 (system prompt 공통 후미) ─────
const JSON_SCHEMA_GUIDE = `

응답은 반드시 다음 JSON 형식으로만 출력하세요. 다른 설명·인사·코드블록 표시 금지.

{
  "seriesName": "시리즈 이름 (10자 이내)",
  "cover": {
    "badge": "표지 큰 배지 (10자 이내)",
    "title": "표지 제목 (2줄, \\n으로 줄바꿈, 각 줄 12자 이내)",
    "subtitle": "표지 부제 (2줄, \\n으로 줄바꿈, 각 줄 20자 이내)",
    "highlight": "작은 강조 배지 (8자 이내)"
  },
  "contents": [
    {
      "number": "01",
      "subtitle": "소제목 (12자 이내)",
      "title": "카드 제목 (12자 이내)",
      "body": "본문 3줄, \\n으로 줄바꿈, 각 줄 25자 이내. 구체적 수치·시기·작물명·금액 반드시 포함"
    },
    ... 정확히 6개 (number는 01~06)
  ],
  "cta": {
    "title": "CTA 제목 (2줄, \\n으로 줄바꿈)",
    "subtitle": "CTA 부제 (한 줄)",
    "homepage": "예시 도메인 (실제 운영 도메인이 아니라도 OK, 예: my-farm.kr)",
    "email": "예시 이메일",
    "book": ""
  }
}`;

// ───── OpenAI 호출 ─────
async function generateWithAI({ topic, category = 'general', format = 'tips', tone = 'info' }) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API 키가 설정되지 않았습니다. 상단 "🔑 API 키 설정"을 먼저 클릭하세요.');
  }
  if (!topic || !topic.trim()) {
    throw new Error('주제를 입력해주세요.');
  }

  const categoryPrompt = SYSTEM_PROMPTS[category] || SYSTEM_PROMPTS.general;
  const systemPrompt = categoryPrompt + JSON_SCHEMA_GUIDE;

  const formatHint = {
    tips:    '핵심 6가지를 정리한 팁 시리즈 형식',
    steps:   '6단계 순서 가이드 형식 (STEP 1 → 6)',
    compare: '오해와 진실을 6가지 비교하는 형식',
  }[format] || '';

  const toneHint = {
    info:      '정보 전달 톤 (사실 기반)',
    emotional: '감성적인 톤 (공감과 위로)',
    witty:     '위트 있는 톤 (재미와 가벼움)',
    serious:   '진지한 톤 (전문가의 경고)',
  }[tone] || '';

  const userPrompt = `주제: ${topic}
형식: ${formatHint}
톤: ${toneHint}

위 주제로 인스타그램 카드뉴스 8장(표지 1 + 본문 6 + CTA 1)을 한국어로 작성해주세요. 시스템 프롬프트의 모든 원칙을 반드시 따르세요. 표면적이거나 누구나 아는 팁이 아니라, 독자가 "이건 처음 듣는다" 싶은 구체적 정보를 우선하세요.`;

  const response = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    let msg = `OpenAI API 오류 (${response.status})`;
    try {
      const errJson = JSON.parse(errText);
      msg = errJson.error?.message || msg;
    } catch {}
    if (response.status === 401) {
      msg = 'API 키가 유효하지 않습니다. 키를 다시 확인해주세요.';
    } else if (response.status === 429) {
      msg = '요청 한도 초과 또는 결제 잔액 부족. OpenAI 계정을 확인해주세요.';
    }
    throw new Error(msg);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI 응답이 비어있습니다.');

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error('AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.');
  }

  return parsed;
}

// ───── AI 응답 → state 객체 변환 ─────
// (카테고리에 매칭되는 컬러/레이아웃은 topic-generator.js의 CATEGORY_STYLES 사용)
function aiResponseToState(aiResponse, { category, channel = '@my_channel' }) {
  const style = (typeof CATEGORY_STYLES !== 'undefined' && CATEGORY_STYLES[category])
    || { layout: 'classic', colors: { main: '#1a2332', accent: '#d4af37', bg: '#f5f1e8' } };

  // contents가 6개가 아니면 보정
  const contents = Array.isArray(aiResponse.contents) ? aiResponse.contents.slice(0, 6) : [];
  while (contents.length < 6) {
    contents.push({
      number: String(contents.length + 1).padStart(2, '0'),
      subtitle: '내용 보강 필요',
      title: '추가 작성',
      body: 'AI 응답이 부족합니다. 다시 생성해주세요.',
    });
  }

  return {
    seriesName: aiResponse.seriesName || '나의 카드뉴스 시리즈',
    channel,
    layout: style.layout,
    colors: style.colors,
    cover: {
      badge: aiResponse.cover?.badge || '인사이트',
      title: aiResponse.cover?.title || '제목',
      subtitle: aiResponse.cover?.subtitle || '',
      highlight: aiResponse.cover?.highlight || '',
    },
    contents: contents.map((c, i) => ({
      number: c.number || String(i + 1).padStart(2, '0'),
      subtitle: c.subtitle || '',
      title: c.title || '',
      body: c.body || '',
    })),
    cta: {
      title: aiResponse.cta?.title || '구독해주세요',
      subtitle: aiResponse.cta?.subtitle || '',
      homepage: aiResponse.cta?.homepage || '',
      email: aiResponse.cta?.email || '',
      book: aiResponse.cta?.book || '',
    },
  };
}

// 글로벌로 export (app.js에서 사용)
window.AIResearch = {
  getApiKey,
  setApiKey,
  hasApiKey,
  maskApiKey,
  generateWithAI,
  aiResponseToState,
};
