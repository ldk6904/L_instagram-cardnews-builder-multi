/* ═════════════════════════════════════════════════════════
   예시 데이터 — 강의용 6종 완성본
   각 예시는 state 객체 전체를 한 번에 교체할 수 있는 형태
   ═════════════════════════════════════════════════════════ */

const EXAMPLES = [
  // ───────── 1. GEO 생존전략 (classic + 네이비골드) ─────────
  {
    id: 'geo-survival',
    emoji: '🔍',
    title: 'GEO 생존전략',
    summary: 'AI 검색 시대 살아남는 콘텐츠 6가지',
    tag: '마케팅 · GEO',
    state: {
      seriesName: 'GEO 마케팅 시리즈',
      channel: '@AICLab_TV',
      layout: 'classic',
      colors: { main: '#1a2332', accent: '#d4af37', bg: '#f5f1e8' },
      cover: {
        badge: 'GEO 생존전략',
        title: '검색이 사라지는\n시대',
        subtitle: 'AI가 답을 대신 말하는 지금,\n살아남는 콘텐츠는 따로 있다',
        highlight: '6가지 핵심 전략',
      },
      contents: [
        { number: '01', subtitle: '첫 문장이 모든 것',       title: 'Answer-First 원칙', body: 'AI는 첫 문단을 그대로 인용합니다.\n질문 → 한 줄 답 → 근거 순서로.' },
        { number: '02', subtitle: '통계·수치 인용',          title: '숫자를 무기로',     body: '"많은 사람이"가 아니라\n"73%가"로 쓰세요.\n인용률이 +40% 올라갑니다.' },
        { number: '03', subtitle: 'AI 신뢰 신호',            title: '출처를 밝혀라',     body: '통계 옆에 출처 링크,\n인용문 옆에 화자 이름.\n검증 가능한 글만 살아남습니다.' },
        { number: '04', subtitle: 'AI가 좋아하는 구조',      title: 'FAQ는 필수',        body: '질문-답변 쌍은\nAI 학습 데이터의 황금 포맷.\nFAQ 3개로 노출이 바뀝니다.' },
        { number: '05', subtitle: 'E-E-A-T 권위 신호',       title: '저자가 누구냐',     body: '익명 글은 AI가 외면합니다.\n저자 소개·경력·자격증을\n반드시 명시하세요.' },
        { number: '06', subtitle: '멀티플랫폼 송출',         title: '한 곳에 올인 금지', body: '블로그·유튜브·인스타·X.\n여러 출처에서 보이는 글을\nAI는 더 신뢰합니다.' },
      ],
      cta: {
        title: 'GEO를\n더 깊이 배우려면',
        subtitle: '메이TV에서 매주 만나요',
        homepage: 'kimjinsoo.vercel.app',
        email: 'info@aiclab2020.com',
        book: '저서 《이것이 GEO마케팅이다》',
      },
    },
  },

  // ───────── 2. AI 도구 추천 5선 (bold + 오션) ─────────
  {
    id: 'ai-tools-5',
    emoji: '🤖',
    title: 'AI 도구 추천 5선',
    summary: '2026년 꼭 써봐야 할 AI 서비스',
    tag: '테크 · AI',
    state: {
      seriesName: 'AI 도구 큐레이션',
      channel: '@your_tech',
      layout: 'bold',
      colors: { main: '#0a3d62', accent: '#f5af19', bg: '#eef5f9' },
      cover: {
        badge: 'AI 큐레이션',
        title: '진짜 쓸만한\nAI 도구 5선',
        subtitle: '2026년 업무 효율을\n2배로 끌어올리는 라인업',
        highlight: '실전 검증 완료',
      },
      contents: [
        { number: '01', subtitle: '글쓰기 자동화',       title: 'Claude Sonnet',     body: '긴 문서·코드·기획서까지.\n맥락 유지가 가장 뛰어난\n범용 AI 어시스턴트.' },
        { number: '02', subtitle: '이미지 생성',         title: 'Midjourney v7',     body: '톤 일관성 최고.\n인스타·블로그·썸네일까지\n한 번에 해결.' },
        { number: '03', subtitle: '회의 정리',           title: 'Granola',           body: '회의 녹음 → 요약 + 액션.\n노션·슬랙 자동 연동.\n주 5시간 절약.' },
        { number: '04', subtitle: '코드 자동완성',       title: 'Cursor',            body: '에디터에 AI 내장.\n리팩토링·디버깅 속도가\n3배 빨라집니다.' },
        { number: '05', subtitle: '음성 합성',           title: 'ElevenLabs',        body: '내 목소리 클론 가능.\n유튜브 더빙·팟캐스트에\n품질이 압도적.' },
        { number: '06', subtitle: '검색의 미래',         title: 'Perplexity Pro',    body: '출처 포함 답변.\n구글 검색을 대체할\n첫 번째 도구.' },
      ],
      cta: {
        title: '매주 새로운\nAI 도구를 찾아드려요',
        subtitle: '구독하고 1주일 빠르게 익히세요',
        homepage: 'your-tech-blog.com',
        email: 'hello@your-tech.com',
        book: '',
      },
    },
  },

  // ───────── 3. 30일 운동 챌린지 (minimal + 체리) ─────────
  {
    id: 'fitness-30day',
    emoji: '💪',
    title: '30일 홈트 챌린지',
    summary: '집에서 따라하는 4주 운동 루틴',
    tag: '건강 · 운동',
    state: {
      seriesName: '30일 홈트 챌린지',
      channel: '@fit_with_me',
      layout: 'minimal',
      colors: { main: '#3d0f17', accent: '#ff6b6b', bg: '#fff5f5' },
      cover: {
        badge: '30일 챌린지',
        title: '집에서 30일,\n인생 체형 만들기',
        subtitle: '하루 15분, 도구 없이.\n4주만에 달라지는 변화.',
        highlight: '초보자 환영',
      },
      contents: [
        { number: 'W1', subtitle: '기초 다지기',        title: '1주차: 코어',       body: '플랭크 30초 × 3세트.\n매일 같은 시간에.\n자세가 곧 결과입니다.' },
        { number: 'W2', subtitle: '하체 강화',          title: '2주차: 스쿼트',     body: '스쿼트 15회 × 4세트.\n무릎이 발끝을 넘지 않게.\n천천히 깊게 내려가세요.' },
        { number: 'W3', subtitle: '상체 시작',          title: '3주차: 푸쉬업',     body: '무릎 푸쉬업 10회 × 3세트.\n팔꿈치는 45도 각도.\n호흡 잊지 마세요.' },
        { number: 'W4', subtitle: '복합 운동',          title: '4주차: 버피',       body: '버피 10회 × 3세트.\n쉬는 시간 30초 이내.\n심박수가 뛰어야 진짜.' },
        { number: '05', subtitle: '식단의 기본',        title: '단백질 1.2g',       body: '체중 kg × 1.2 = 하루 단백질량.\n계란·닭가슴살·두부.\n근육은 식단이 80%.' },
        { number: '06', subtitle: '회복도 운동',        title: '잠 7시간',          body: '운동만큼 중요한 게 수면.\n잠 부족 = 근손실 + 폭식.\n11시 전 취침 습관.' },
      ],
      cta: {
        title: '함께 운동할\n친구 찾아요',
        subtitle: '인증샷 #fitwithme 태그',
        homepage: 'fit-with-me.com',
        email: 'coach@fit-with-me.com',
        book: '',
      },
    },
  },

  // ───────── 4. 부업 시작 가이드 (classic + 포레스트) ─────────
  {
    id: 'side-hustle',
    emoji: '💼',
    title: '부업 시작 6단계',
    summary: '월 100만원 부수입 만드는 법',
    tag: '재테크 · 부업',
    state: {
      seriesName: '직장인 부업 가이드',
      channel: '@side_income',
      layout: 'classic',
      colors: { main: '#1d3b2a', accent: '#c9a957', bg: '#f3efe4' },
      cover: {
        badge: '부업 가이드',
        title: '월 100만원,\n진짜 가능합니다',
        subtitle: '퇴근 후 2시간으로 시작하는\n부수입 6단계 로드맵',
        highlight: '직장인 전용',
      },
      contents: [
        { number: '01', subtitle: '자기 분석',          title: '내 강점 찾기',       body: '동료가 자주 물어보는 것.\n그게 나의 전문성입니다.\n3가지만 적어보세요.' },
        { number: '02', subtitle: '시장 검증',          title: '수요 확인',          body: '네이버·유튜브에서\n관련 키워드 검색량 확인.\n검색 = 돈이 되는 신호.' },
        { number: '03', subtitle: '최소 상품',          title: 'MVP 1주일',          body: '완벽한 30일짜리 강의 X.\n3강짜리 미니 패키지 O.\n빠르게 시장 반응 보세요.' },
        { number: '04', subtitle: '플랫폼 선택',        title: '한 곳만 집중',       body: '인스타·블로그·유튜브\n동시에 다 하지 마세요.\n첫 1만 팔로워까진 한 곳만.' },
        { number: '05', subtitle: '가격 책정',          title: '시간 × 가치',        body: '시간당 환산 X.\n해결하는 문제의 가치 O.\n낮게 시작 → 후기 쌓고 인상.' },
        { number: '06', subtitle: '꾸준함이 답',        title: '90일 룰',            body: '3개월 안 그만두면\n무조건 결과가 나옵니다.\n매일 1시간이 복리로.' },
      ],
      cta: {
        title: '부업 동료가\n필요하신가요?',
        subtitle: '주 1회 인사이트 메일',
        homepage: 'side-income.kr',
        email: 'hello@side-income.kr',
        book: '저서 《퇴근 후 2시간》',
      },
    },
  },

  // ───────── 5. 독서 후기 시리즈 (minimal + 와인살구) ─────────
  {
    id: 'book-review',
    emoji: '📚',
    title: '독서 후기',
    summary: '《원씽》 한 권 핵심 정리',
    tag: '독서 · 자기계발',
    state: {
      seriesName: '한 권 정리 시리즈',
      channel: '@book_with_you',
      layout: 'minimal',
      colors: { main: '#5c2a3c', accent: '#e8a87c', bg: '#fdf6ec' },
      cover: {
        badge: 'BOOK REVIEW',
        title: '《원씽》\n핵심 6가지',
        subtitle: '게리 켈러가 말하는\n한 가지에 집중하는 힘',
        highlight: '10분 읽기',
      },
      contents: [
        { number: '01', subtitle: '진짜 질문',          title: '단 하나의 질문',     body: '"내가 할 수 있는 단 한 가지,\n그것을 함으로써 다른 모든 일이\n더 쉬워지거나 불필요해지는?"' },
        { number: '02', subtitle: '거짓말 깨기',        title: '멀티태스킹은 신화',  body: '뇌는 동시에 두 가지를\n못합니다. 빠른 전환일 뿐.\n전환마다 28% 시간 손실.' },
        { number: '03', subtitle: '도미노 효과',        title: '작은 첫 도미노',     body: '하나가 다음을 넘어뜨립니다.\n작은 일 하나 = 그 다음 큰 일.\n순서가 결과를 만듭니다.' },
        { number: '04', subtitle: '시간 차단법',        title: 'Time Blocking',      body: '하루 4시간을 \'그 하나\'에.\n그 시간은 신성한 약속.\n그 외엔 모두 부차적.' },
        { number: '05', subtitle: '의지력의 진실',      title: '의지력은 한정 자원',  body: '하루치 의지력은 정해져 있음.\n중요한 일을 아침에.\nSNS·메일은 마지막에.' },
        { number: '06', subtitle: '실행 공식',          title: '목적 → 우선순위 → 생산성', body: '큰 그림(목적)에서\n오늘 우선순위 추출.\n그것만 끝내는 게 생산성.' },
      ],
      cta: {
        title: '책 한 권을\n10분에 정리해드려요',
        subtitle: '매주 화요일 발행',
        homepage: 'book-with-you.com',
        email: 'reader@book-with-you.com',
        book: '',
      },
    },
  },

  // ───────── 6. 인스타 마케팅 꿀팁 (bold + 모노톤) ─────────
  {
    id: 'insta-marketing',
    emoji: '📸',
    title: '인스타 마케팅 6법칙',
    summary: '팔로워 0에서 1만까지',
    tag: '마케팅 · SNS',
    state: {
      seriesName: '인스타 마케팅 클래스',
      channel: '@insta_growth',
      layout: 'bold',
      colors: { main: '#0a0a0a', accent: '#666666', bg: '#f0f0f0' },
      cover: {
        badge: 'INSTAGRAM',
        title: '팔로워 0 → 1만,\n12개월 로드맵',
        subtitle: '아무것도 없는 계정을\n수익화 가능한 채널로',
        highlight: '6단계 공식',
      },
      contents: [
        { number: '01', subtitle: '한 가지 주제',       title: '니치를 좁혀라',      body: '"라이프스타일"은 너무 넓음.\n"30대 직장인 점심 도시락"\n구체적일수록 강합니다.' },
        { number: '02', subtitle: '톤앤매너',           title: '시각적 통일감',      body: '컬러 3개·폰트 2개 고정.\n프리셋 하나만 써도 충분.\n3개월 뒤 차이가 보입니다.' },
        { number: '03', subtitle: '캐러셀이 왕',        title: '저장률 게임',        body: '단발 사진보다 캐러셀.\n저장 = 알고리즘 신호.\n첫 장은 강한 후킹 필수.' },
        { number: '04', subtitle: '발행 주기',          title: '주 3회 90일',        body: '매일 X. 일관성 O.\n주 3회 × 12주 = 36개.\n그때부터 성장 시작.' },
        { number: '05', subtitle: '댓글 = 자산',        title: '먼저 다가가기',      body: '같은 니치 30개 계정.\n매일 댓글 5개씩.\n팔로워보다 강한 연결.' },
        { number: '06', subtitle: '데이터 보기',        title: '주 1회 인사이트',    body: '저장률·도달률·프로필 방문.\n베스트 게시물 패턴 분석.\n다음 콘텐츠의 힌트.' },
      ],
      cta: {
        title: '계정 진단 무료\n신청해보세요',
        subtitle: '주 5명 한정',
        homepage: 'insta-growth.com',
        email: 'help@insta-growth.com',
        book: '',
      },
    },
  },

  // ═══════════════════════════════════════════════
  // 농민·귀농 (harvest 톤: 흙갈+새벽노랑+크림, minimal)
  // ═══════════════════════════════════════════════

  // ───────── 7. 스마트폰 직거래 (농민) ─────────
  {
    id: 'farm-direct-sale',
    emoji: '🌾',
    title: '직거래 시작하기',
    summary: '스마트폰만으로 농산물 직거래',
    tag: '농민 · 직거래',
    state: {
      seriesName: '농부의 하루',
      channel: '@my_farm_kr',
      layout: 'minimal',
      colors: { main: '#6B4423', accent: '#F4B942', bg: '#FFF8E7' },
      cover: {
        badge: '농부의 하루',
        title: '스마트폰으로\n직거래 시작',
        subtitle: '내가 키운 농산물,\n제값 받고 파는 7가지 방법',
        highlight: '초보 OK',
      },
      contents: [
        { number: '01', subtitle: '왜 직거래인가',    title: '유통 마진을 우리에게', body: '도매상 거치면\n농가 5천원, 소비자 1만5천원.\n그 차이를 함께 나눠요.' },
        { number: '02', subtitle: '첫 단골은 가까이', title: '가족 단톡방부터',     body: '친척·동창·이웃 50명.\n진심 어린 소량 판매가\n입소문의 시작이에요.' },
        { number: '03', subtitle: '사진 한 장의 힘',  title: '아침 햇살에 찍어요',   body: '광고보다 강한 건\n흙 묻은 작물 사진 한 장.\n매일 1장씩만 올려보세요.' },
        { number: '04', subtitle: '정직한 가격',      title: '왜 이 가격인지',       body: '마트보다 1.2배까지는\n합리적입니다.\n이유 한 줄이면 거부감 사라져요.' },
        { number: '05', subtitle: '배송은 작게',      title: '5kg 미만 우체국',       body: '소량은 우체국 택배가 가장 쌉니다.\n같은 동네는 직접 배달로\n단골을 만들어요.' },
        { number: '06', subtitle: '꾸준함이 브랜드',  title: '주 3회 같은 시간',     body: '비 오는 날도 빠지지 마세요.\n알고리즘이 아니라\n사람이 기억합니다.' },
      ],
      cta: {
        title: '농부의 이야기를\n매일 전해드려요',
        subtitle: '내 작물의 단골 만들기',
        homepage: 'my-farm.kr',
        email: 'hello@my-farm.kr',
        book: '',
      },
    },
  },

  // ───────── 8. 작물 사진 잘 찍기 (농민) ─────────
  {
    id: 'farm-photo-tips',
    emoji: '📷',
    title: '작물 사진 잘 찍기',
    summary: '핸드폰만으로도 매출 2배',
    tag: '농민 · 콘텐츠',
    state: {
      seriesName: '농부의 사진관',
      channel: '@my_farm_kr',
      layout: 'minimal',
      colors: { main: '#6B4423', accent: '#F4B942', bg: '#FFF8E7' },
      cover: {
        badge: '농부의 사진관',
        title: '작물 사진\n이렇게 찍어요',
        subtitle: '핸드폰만으로 매출이\n2배 되는 7가지 기술',
        highlight: '장비 0원',
      },
      contents: [
        { number: '01', subtitle: '아침이 정답',      title: '해 뜨고 1시간',       body: '오전 7~9시의 부드러운 햇살.\n그늘 없이도 입체감이 살아요.\n비싼 조명 필요 없어요.' },
        { number: '02', subtitle: '구도의 비밀',      title: '3분의 1 법칙',         body: '작물은 화면 가운데가 아닌\n가로·세로 3분의 1 지점에.\n자동 격자선 켜고 맞춰요.' },
        { number: '03', subtitle: '배경 정리',        title: '흙·나무·하늘만',      body: '비닐·기계·플라스틱은 빼세요.\n자연스러운 배경이\n신뢰를 만듭니다.' },
        { number: '04', subtitle: '손이 들어가야',    title: '손 한 쪽 보이게',     body: '농부 손이 보이면 진정성 +100.\n흙 묻은 손 부끄러워 마세요.\n그게 차별점이에요.' },
        { number: '05', subtitle: '계절감',           title: '풍경도 함께',         body: '작물 위주에서 벗어나서\n밭·하늘·이슬도 한 장씩.\n계절이 보이면 단골이 생겨요.' },
        { number: '06', subtitle: '편집은 최소',      title: '밝기만 +10%',         body: '필터 욕심 내지 마세요.\n인스타 기본 편집에서\n밝기 +10%면 충분합니다.' },
      ],
      cta: {
        title: '내 작물도\n예쁘게 보이고 싶다면',
        subtitle: '주 1회 사진 팁',
        homepage: 'my-farm.kr',
        email: 'photo@my-farm.kr',
        book: '',
      },
    },
  },

  // ───────── 9. 손편지 마케팅 (농민) ─────────
  {
    id: 'farm-handwritten',
    emoji: '✉️',
    title: '손편지 마케팅',
    summary: '재구매율 70% 만드는 방법',
    tag: '농민 · 단골',
    state: {
      seriesName: '농부의 정성',
      channel: '@my_farm_kr',
      layout: 'minimal',
      colors: { main: '#6B4423', accent: '#F4B942', bg: '#FFF8E7' },
      cover: {
        badge: '농부의 정성',
        title: '손편지 한 장이\n단골을 만들어요',
        subtitle: '택배 박스에 넣는 작은 쪽지로\n재구매율 70% 만들기',
        highlight: '비용 100원',
      },
      contents: [
        { number: '01', subtitle: '왜 손편지인가',    title: '디지털 시대의 역설',   body: '카톡·문자는 흔합니다.\n손글씨 한 장은 특별해요.\n사진 찍어 SNS에 자랑하죠.' },
        { number: '02', subtitle: '쓰는 시기',        title: '포장할 때 함께',       body: '주문 들어오면 바로 작성.\n작물 옆에 넣고 같이 포장.\n별도 시간 안 들어요.' },
        { number: '03', subtitle: '내용은 짧게',      title: '3줄이면 충분',         body: '인사 한 줄\n작물 이야기 한 줄\n감사 한 줄.\n길면 부담스러워요.' },
        { number: '04', subtitle: '구체적으로',       title: '오늘 아침 수확',       body: '"신선합니다" 보다\n"오늘 새벽 5시에 땄어요"\n구체적일수록 진심이 닿아요.' },
        { number: '05', subtitle: '계절 인사',        title: '날씨를 담아요',         body: '"요즘 비가 자주 와서\n걱정이실 텐데..." 같은\n계절 안부 한 마디.' },
        { number: '06', subtitle: '후기 부탁',        title: '사진 한 장만 부탁',    body: '"받은 사진 한 장만\n보내주시면 감사하겠습니다"\n응답률이 3배 올라가요.' },
      ],
      cta: {
        title: '진심이 통하는\n농부의 마케팅',
        subtitle: '매주 화요일 노하우',
        homepage: 'my-farm.kr',
        email: 'letter@my-farm.kr',
        book: '',
      },
    },
  },

  // ═══════════════════════════════════════════════
  // 소상공인 (market 톤: 토마토+머스타드+우드, bold)
  // ═══════════════════════════════════════════════

  // ───────── 10. 단골 늘리는 SNS (소상공인) ─────────
  {
    id: 'shop-sns-loyal',
    emoji: '🏪',
    title: '단골 늘리는 SNS',
    summary: '작은 가게가 꼭 알아야 할 7가지',
    tag: '소상공인 · 마케팅',
    state: {
      seriesName: '사장님 노트',
      channel: '@my_shop_kr',
      layout: 'bold',
      colors: { main: '#C0392B', accent: '#E8A33D', bg: '#F5EEDC' },
      cover: {
        badge: '사장님 노트',
        title: '단골이 늘어나는\nSNS 운영법',
        subtitle: '작은 가게 사장님이 꼭 알아야 할\n7가지 실전 비법',
        highlight: '혼자서도 OK',
      },
      contents: [
        { number: '01', subtitle: '전단지의 시대 끝', title: '동네 손님의 80%',     body: '동네 손님 10명 중 8명이\n인스타로 가게를 찾아요.\n검색 첫 화면이 곧 매출.' },
        { number: '02', subtitle: '프로필이 첫인상',  title: '3초 안에 결정',       body: '위치·영업시간·시그니처 메뉴.\n이 3가지만 명확해도\n발길이 달라집니다.' },
        { number: '03', subtitle: '음식보다 사람',    title: '사장님 얼굴이 답',     body: '메뉴 사진 9장보다\n사장님 일하는 모습 1장.\n사람이 사람을 따라옵니다.' },
        { number: '04', subtitle: '리뷰 요청법',      title: '계산할 때 말고',       body: '"맛있게 드셨나요?" 물을 때.\nQR 명함 한 장이면\n리뷰가 5배 늘어나요.' },
        { number: '05', subtitle: '스토리는 매일',    title: '24시간의 마법',       body: '오늘 재료·준비·마감.\n부담 없는 3장으로\n"살아있는 가게" 인상.' },
        { number: '06', subtitle: '할인보다 스토리',  title: '한정성이 지갑 연다',    body: '"30% 할인"보다\n"오늘 들어온 갈치 50인분".\n이야기가 매출을 만들어요.' },
      ],
      cta: {
        title: '사장님을 위한\n실전 마케팅 노트',
        subtitle: '매주 월요일 노하우 도착',
        homepage: 'my-shop.kr',
        email: 'hello@my-shop.kr',
        book: '',
      },
    },
  },

  // ───────── 11. 진상 응대 매뉴얼 (소상공인) ─────────
  {
    id: 'shop-customer-trouble',
    emoji: '🛡️',
    title: '진상 응대 매뉴얼',
    summary: '감정 안 다치고 가게도 지키기',
    tag: '소상공인 · 운영',
    state: {
      seriesName: '사장님 노트',
      channel: '@my_shop_kr',
      layout: 'bold',
      colors: { main: '#C0392B', accent: '#E8A33D', bg: '#F5EEDC' },
      cover: {
        badge: '사장님 노트',
        title: '진상 손님,\n이렇게 대처해요',
        subtitle: '감정 안 다치고 가게도 지키는\n7단계 응대 매뉴얼',
        highlight: '실전 검증',
      },
      contents: [
        { number: '01', subtitle: '첫 3초 호흡',      title: '대답하기 전 숨 한 번',  body: '말 받기 전 1초 멈춤.\n감정 안 휘말리는 첫 단계.\n전문가의 기본 습관입니다.' },
        { number: '02', subtitle: '인정 먼저',        title: '"불편하셨겠어요"',     body: '시비 가리기 전\n감정 먼저 인정.\n90%는 여기서 풀려요.' },
        { number: '03', subtitle: '사실만 정리',      title: '5W1H로 받아적기',     body: '언제·어디서·무엇이.\n메모지에 적으면서 듣기.\n과장이 줄어듭니다.' },
        { number: '04', subtitle: '선택지 제시',      title: '교환 vs 환불',         body: '"이렇게 해드릴까요?"\n선택권을 드리면\n주도권이 손님에게 갑니다.' },
        { number: '05', subtitle: '선 긋기',          title: '욕설·폭언은 단호히',   body: '"그런 표현은 듣기 어렵습니다."\n한 번 말하고 거리 두기.\n참기만 하면 더 심해집니다.' },
        { number: '06', subtitle: '기록 남기기',      title: 'CCTV·녹취 활용',      body: '심한 경우 영상·녹음 확보.\n나중에 법적 도움 받을 때\n증거가 됩니다.' },
      ],
      cta: {
        title: '사장님의 권리도\n중요합니다',
        subtitle: '매주 실전 가이드',
        homepage: 'my-shop.kr',
        email: 'support@my-shop.kr',
        book: '',
      },
    },
  },

  // ───────── 12. 배달앱 평점 올리기 (소상공인) ─────────
  {
    id: 'shop-delivery-rating',
    emoji: '⭐',
    title: '배달앱 평점 올리기',
    summary: '별 4.8 만드는 7가지 액션',
    tag: '소상공인 · 배달',
    state: {
      seriesName: '사장님 노트',
      channel: '@my_shop_kr',
      layout: 'bold',
      colors: { main: '#C0392B', accent: '#E8A33D', bg: '#F5EEDC' },
      cover: {
        badge: '사장님 노트',
        title: '배달앱 별점\n4.8 만들기',
        subtitle: '평점이 곧 매출.\n7가지 실전 액션 정리',
        highlight: '즉시 적용',
      },
      contents: [
        { number: '01', subtitle: '포장이 첫인상',    title: '국물은 두 겹',         body: '새는 국물 한 방울이\n별점 1점을 떨어뜨려요.\n포장재 비용 아끼지 마세요.' },
        { number: '02', subtitle: '뜨거움 유지',      title: '보온백 + 핫팩',        body: '도착 시 식어 있으면\n맛이 절반.\n핫팩 한 장이면 해결됩니다.' },
        { number: '03', subtitle: '손편지 한 장',     title: '주문 감사 메모',       body: '"오늘도 감사합니다"\n손글씨 한 장으로\n재주문률 +30%.' },
        { number: '04', subtitle: '리뷰 답글',        title: '24시간 안에',         body: '좋은 리뷰는 감사 인사,\n나쁜 리뷰는 사과+개선.\n응답률이 평점을 만듭니다.' },
        { number: '05', subtitle: '메뉴 사진',        title: '실제와 똑같이',         body: '과한 보정은 역효과.\n받았을 때 사진과 같아야\n별점 5점이 나옵니다.' },
        { number: '06', subtitle: '주문 시간',        title: '예상 시간 +10분',     body: '"30분"이라 적고 25분에 도착.\n약속을 지키는 게 아니라\n초과 만족이 별점을 만들어요.' },
      ],
      cta: {
        title: '배달 운영의\n실전 노하우',
        subtitle: '매주 화요일 정리',
        homepage: 'my-shop.kr',
        email: 'delivery@my-shop.kr',
        book: '',
      },
    },
  },

  // ═══════════════════════════════════════════════
  // 일상 (journal 톤: 잉크블루+살구+페이퍼, classic)
  // ═══════════════════════════════════════════════

  // ───────── 13. 월 10만원 절약 (일상) ─────────
  {
    id: 'life-save-money',
    emoji: '💰',
    title: '월 10만원 절약',
    summary: '지출은 그대로, 잔고는 늘어나는 습관',
    tag: '일상 · 절약',
    state: {
      seriesName: '오늘의 작은 습관',
      channel: '@my_daily_kr',
      layout: 'classic',
      colors: { main: '#5D7B9A', accent: '#F2C9B5', bg: '#FAFAFA' },
      cover: {
        badge: '오늘의 작은 습관',
        title: '월 10만 원\n더 모으는 법',
        subtitle: '지출은 그대로, 잔고는 늘어나는\n7가지 작은 습관',
        highlight: '지금 시작',
      },
      contents: [
        { number: '01', subtitle: '통장 쪼개기',      title: '급여일 자동이체',     body: '월급의 20%를 다른 통장으로.\n"남으면 저축"은 절대 안 남아요.\n먼저 떼어두세요.' },
        { number: '02', subtitle: '구독 청소',        title: '매월 1일 점검',       body: 'OTT·멤버십·클라우드.\n3개월 안 쓴 건 해지.\n월 평균 2~3만 원 새고 있어요.' },
        { number: '03', subtitle: '장보기는 일주일치', title: '냉장고 비우는 날',     body: '수요일을 비우는 날로.\n식재료 낭비 줄고\n자연스럽게 월 5만 원 절약.' },
        { number: '04', subtitle: '현금 챌린지',      title: '주말은 현금만',         body: '토·일은 카드 대신 현금 5만 원.\n손에 잡히는 돈은\n안 쓰게 됩니다.' },
        { number: '05', subtitle: '잔돈 저금',        title: '1,000원의 힘',         body: '토스·카카오뱅크 잔돈 모으기.\n결제마다 1,000원 단위 저축.\n1년이면 30만 원이 모여요.' },
        { number: '06', subtitle: '기록의 마법',      title: '하루 30초 가계부',     body: '쓸 때마다 30초 메모.\n한 달 뒤 보면 줄어드는\n"왜 샀지?" 항목들.' },
      ],
      cta: {
        title: '매일 한 줄,\n인생이 바뀌어요',
        subtitle: '주 1회 작은 습관 메일',
        homepage: 'my-daily.kr',
        email: 'hello@my-daily.kr',
        book: '',
      },
    },
  },

  // ───────── 14. 퇴근 후 30분 (일상) ─────────
  {
    id: 'life-evening-30',
    emoji: '🌙',
    title: '퇴근 후 30분',
    summary: '하루를 잘 마무리하는 회복 루틴',
    tag: '일상 · 루틴',
    state: {
      seriesName: '오늘의 작은 습관',
      channel: '@my_daily_kr',
      layout: 'classic',
      colors: { main: '#5D7B9A', accent: '#F2C9B5', bg: '#FAFAFA' },
      cover: {
        badge: '오늘의 작은 습관',
        title: '퇴근 후 30분,\n나를 회복하는 루틴',
        subtitle: '집에 도착하고 잠들기 전까지.\n다시 충전되는 7가지 습관',
        highlight: '하루 30분',
      },
      contents: [
        { number: '01', subtitle: '문 앞에서 한 번',  title: '오늘 일은 여기까지',   body: '현관문 닫는 순간\n"오늘 끝" 마음 정리.\n경계가 있으면 회복이 시작돼요.' },
        { number: '02', subtitle: '옷부터 갈아입기',  title: '편한 옷 1분 안에',     body: '회사 옷 그대로면\n뇌도 일 모드 유지.\n옷이 모드 전환의 스위치.' },
        { number: '03', subtitle: '조명을 낮춰요',    title: '천장등 끄고 간접등',    body: '저녁엔 따뜻한 노란 빛.\n수면 호르몬이 분비됩니다.\n잠 깊이가 달라져요.' },
        { number: '04', subtitle: '스크린은 30분만',  title: '폰 대신 종이',         body: '책 1장, 노트 한 줄.\n아침 컨디션이\n명확히 좋아져요.' },
        { number: '05', subtitle: '몸 풀기',          title: '스트레칭 5분',         body: '어깨·목·허리 가볍게.\n근육 긴장 풀리면\n잠 자려고 누웠을 때 편해요.' },
        { number: '06', subtitle: '내일 준비',        title: '3가지만 미리',         body: '내일 입을 옷·아침 메뉴·첫 할 일.\n결정을 줄이면\n아침이 가벼워집니다.' },
      ],
      cta: {
        title: '하루를 잘 마무리하는\n사람들',
        subtitle: '매주 일요일 루틴 정리',
        homepage: 'my-daily.kr',
        email: 'routine@my-daily.kr',
        book: '',
      },
    },
  },

  // ───────── 15. 미니멀 살림 (일상) ─────────
  {
    id: 'life-minimal-home',
    emoji: '🏠',
    title: '미니멀 살림 시작',
    summary: '물건은 줄이고 여유는 늘리기',
    tag: '일상 · 미니멀',
    state: {
      seriesName: '오늘의 작은 습관',
      channel: '@my_daily_kr',
      layout: 'classic',
      colors: { main: '#5D7B9A', accent: '#F2C9B5', bg: '#FAFAFA' },
      cover: {
        badge: '오늘의 작은 습관',
        title: '미니멀 살림,\n오늘부터 시작',
        subtitle: '물건은 줄이고\n여유는 늘리는 7가지 원칙',
        highlight: '하루 1개부터',
      },
      contents: [
        { number: '01', subtitle: '하루 1개 비우기',  title: '오늘 1개, 1년 365개',  body: '큰 결심 말고 작은 실천.\n매일 1개씩만 비워요.\n1년이면 집이 달라집니다.' },
        { number: '02', subtitle: '1년 안 쓴 것',     title: '미련 없이 정리',       body: '"언젠가 쓸지도..."\n그 언젠가는 오지 않아요.\n안 쓰면 비우세요.' },
        { number: '03', subtitle: '하나 들어오면',    title: '하나 내보내기',         body: '새 옷 사면 헌 옷 1벌 기부.\n물건 총량이 일정하게.\n공간이 숨 쉴 수 있어요.' },
        { number: '04', subtitle: '바닥은 비우기',    title: '바닥에 둔 것 0개',     body: '바닥이 깨끗하면\n공간이 두 배로 보여요.\n청소 시간도 절반.' },
        { number: '05', subtitle: '시각 정리',        title: '오픈 수납은 3색까지',   body: '보이는 곳은\n3가지 색 이내로.\n눈이 쉬면 마음도 쉬어요.' },
        { number: '06', subtitle: '서류 1박스 룰',    title: '안 들어가면 버리기',   body: '서류·영수증은 한 박스만.\n넘치면 가장 오래된 것부터.\n과거 정리가 미래 여유.' },
      ],
      cta: {
        title: '단정한 일상의\n작은 즐거움',
        subtitle: '매주 토요일 정리 팁',
        homepage: 'my-daily.kr',
        email: 'minimal@my-daily.kr',
        book: '',
      },
    },
  },
];
