const ko = {
  meta: {
    title: "CodeShield — Python 및 Java 소스 보호와 라이선스 납품",
    description: "CodeShield는 Python과 Java 애플리케이션에 빌드 시점 암호화, 런타임 복호화, Ed25519 서명 라이선스를 제공합니다. 14일 무료 체험."
  },
  a11y: {
    skip: "본문으로 건너뛰기"
  },
  common: {
    primaryNav: "주 내비게이션",
    mobileNav: "모바일 내비게이션",
    language: "언어",
    themeToggle: "다크 / 라이트 테마 전환",
    copyCommand: "명령 복사",
    menu: "메뉴 열기",
    close: "닫기",
    backToTop: "맨 위로"
  },
  nav: {
    docs: "문서",
    product: "제품",
    lab: "암호화 빌드",
    capabilities: "기능",
    how: "작동 방식",
    security: "보안 경계",
    pricing: "가격",
    faq: "FAQ",
    trial: "무료 체험"
  },
  hero: {
    badge: "Python × Java · 빌드 시점 암호화 · 런타임 복호화",
    title1: "제품을 배포하고,",
    title2: "소스는 숨기세요.",
    lead: "CodeShield는 Python과 Java 애플리케이션에 빌드 시점 암호화, 런타임 복호화, Ed25519 서명 라이선스를 하나의 체계로 제공합니다. 클래스와 모듈은 디스크에 항상 암호문으로 남고, 라이선스는 별도로 발급되며 갱신은 파일 하나만 교체하면 됩니다.",
    ctaPrimary: "14일 무료 체험 시작",
    ctaSecondary: "암호화 빌드 열기",
    trust1: "신용카드 불필요",
    trust2: "로컬 오프라인 빌드",
    trust3: "5분 안에 적용",
    terminalTitle: "codeshield · protected build",
    fact1: "Agent 없음 → 즉시 실패",
    fact2: "클래스별 독립 키",
    fact3: "런타임 의존성 없음"
  },
  stats: {
    s1: { label: "암호 스위트", note: "AES-GCM · ChaCha20-Poly1305 · ChaCha20+HMAC" },
    s2: { label: "용량 증가", note: "먼저 압축한 뒤 암호화, jar 실측" },
    s3: { label: "자동화 테스트", note: "암호화, 라이선스, 프레임워크 회귀 검증" },
    s4: { label: "오프라인 실행", note: "런타임은 외부 서비스에 연결하지 않습니다" }
  },
  proof: {
    label: "실제 기술 스택에서 검증 완료",
    note: "Spring Boot 3.2 fat jar 회귀 테스트 통과: 컴포넌트 스캔, 의존성 주입, 구성 바인딩, Actuator 모두 정상 동작."
  },
  why: {
    eyebrow: "CodeShield를 선택하는 이유",
    title: "암호화는 시작일 뿐, 납품이 목적입니다.",
    lead: "대부분의 도구는 난독화나 암호화에서 멈춥니다. CodeShield는 키 관리, 라이선스, 발급, 갱신, 체험 전환을 하나의 파이프라인으로 묶어 보호된 소프트웨어를 실제로 판매하고 갱신하고 감사할 수 있게 합니다.",
    c1: { title: "빌드 시점 암호화", desc: "소스와 바이트코드는 빌드 시 AEAD 암호문으로 봉인되어 디스크에 읽을 수 있는 로직이 남지 않습니다." },
    c2: { title: "2단계 라이선스", desc: "도구 라이선스는 누가 빌드할 수 있는지를, 제품 라이선스는 어디서 언제까지 실행할 수 있는지를 결정합니다." },
    c3: { title: "오프라인 우선", desc: "런타임 검증과 복호화는 로컬에서 수행됩니다. Enterprise는 완전한 오프라인 활성화와 응답을 지원합니다." },
    c4: { title: "무변경 통합", desc: "Java는 Launcher-Agent-Class로 Agent를 내장하고 Maven은 프로필 하나면 됩니다. Python은 명령 하나입니다." },
    c5: { title: "프레임워크 친화적", desc: "메타데이터 stub이 애노테이션과 시그니처를 유지하므로 Spring, MyBatis, Swagger, JPA 스캔이 그대로 동작합니다." },
    c6: { title: "라이선스 하나, 런타임 둘", desc: "Python과 Java는 라이선스 필드와 지문 알고리즘을 공유합니다. 도구 라이선스 하나로 두 타깃을 모두 사용합니다." }
  },
  product: {
    eyebrow: "듀얼 엔진",
    title: "Python과 Java, 하나의 납품 체계.",
    lead: "두 엔진은 봉투 구조, 라이선스 필드, 머신 지문 알고리즘을 공유합니다. 하나의 발급 백엔드, 하나의 도구 라이선스로 두 런타임을 지원합니다.",
    tabsAria: "런타임 선택",
    pythonDesc: "Django / Flask 프로젝트 모듈을 읽을 수 없는 stub으로 암호화하고, 보호 런타임이 필요할 때 복호화합니다. 소스 없이 배포 가능한 사본을 납품합니다.",
    pythonB1: "CPython 3.12 대상, Django 프로젝트 검증 완료",
    pythonB2: "3가지 암호 스위트, 네이티브 런타임은 Pro에서 사용",
    pythonB3: "만료, 유예 기간, 머신 바인딩을 지원하는 제품 라이선스",
    pythonB4: "명령 하나로 보호 사본과 라이선스 생성",
    pythonNote: "예시: 모듈 48개 · 2.0 MB · 12.6초",
    javaDesc: "비즈니스 클래스를 암호문 sidecar로 변환하고 메타데이터 stub을 유지합니다. java -jar가 내장 Agent를 자동 로드하므로 JVM 옵션이나 Spring Boot 수정이 필요 없습니다.",
    javaB1: "stub / in-place 두 가지 모드",
    javaB2: "JDK 8–21 타깃 바이트코드, Boot 3.2 검증 완료",
    javaB3: "갱신은 jshield.lic 교체만으로, 재패키징 불필요",
    javaB4: "Maven 플러그인으로 무변경 적용",
    javaNote: "예시: 클래스 1,284개 · Boot 3.2 · Bean 255개"
  },
  how: {
    eyebrow: "작동 방식",
    title: "소스에서 블랙박스까지, 네 단계.",
    lead: "암호화는 빌드 머신에서 수행되고 개인 키는 항상 사용자 곁에 남습니다. 런타임에서는 검증 한 번, 복호화 한 번만 수행합니다.",
    s1: { title: "스캔과 압축", desc: "비즈니스 모듈과 클래스를 식별하고 의존성과 module-info를 건너뜁니다. 먼저 deflate한 뒤 암호화해 용량을 관리합니다." },
    s2: { title: "AEAD 봉인", desc: "클래스마다 독립 키를 사용하고 AAD에 빌드 ID와 클래스 이름을 묶습니다. 암호문을 옮기거나 이식하면 즉시 실패합니다." },
    s3: { title: "서명 매니페스트", desc: "Ed25519 서명 매니페스트와 메타데이터 stub을 생성합니다. 보호 대상 항목을 변조하면 모두 거부됩니다." },
    s4: { title: "런타임 복호화", desc: "Agent는 JVM이 클래스를 정의하기 직전에 복호화합니다. 누락, 만료, 다른 머신에서는 fail-closed로 동작하며 조용히 성능이 저하되지 않습니다." },
    pipe1: "소스",
    pipe2: "컴파일",
    pipe3: "암호화",
    pipe4: "서명",
    pipe5: "납품",
    pipe6: "런타임 복호화",
    note: "빌드는 전부 로컬에서 수행됩니다. 소스는 업로드되지 않고 개인 키는 빌드 머신을 벗어나지 않습니다."
  },
  arch: {
    eyebrow: "키 계층",
    title: "단계적 파생, 단일 실패 지점 없음.",
    lead: "마스터 키, 라이선스 키, 빌드 키, 클래스 키를 순차적으로 파생합니다. 서명 개인 키는 빌드 측에만 존재하며 런타임은 공개 키만 가집니다.",
    node1: { title: "Master key", desc: "Agent에 내장, 난독화 저장" },
    node2: { title: "License key", desc: "HKDF(build_id)로 파생" },
    node3: { title: "Build key", desc: "jshield.lic을 해제해 획득" },
    node4: { title: "Class key", desc: "HKDF(클래스 이름)로 파생, 클래스별 독립" },
    badge1: "Ed25519 서명 / 검증",
    badge2: "AAD = build_id + class name",
    badge3: "런타임에 서명 개인 키 없음",
    note: "동일한 지문 알고리즘과 라이선스 필드로 Python과 Java를 모두 지원합니다."
  },
  security: {
    eyebrow: "보안 경계",
    title: "벽을 높일 뿐, 환상을 팔지 않습니다.",
    lead: "같은 프로세스 안의 보호는 의욕적인 공격자의 메모리 덤프를 막을 수 없습니다. CodeShield의 목표는 '가볍게 디컴파일하는' 일을 'Agent를 작성해야 하는' 엔지니어링 문제로 바꾸는 것입니다.",
    c1: {
      title: "효과적으로 막는 것",
      i1: "압축 해제나 디컴파일로 비즈니스 로직을 직접 읽는 것",
      i2: "Agent가 없을 때의 조용한 성능 저하",
      i3: "보호 항목이나 매니페스트 변조",
      i4: "다른 머신 실행, 만료, 유예 기간 초과",
      i5: "빌드나 클래스 이름을 넘나드는 암호문 이식"
    },
    c2: {
      title: "약속하지 않는 것",
      i1: "JVMTI나 heap dump로 평문을 추출하는 것의 차단",
      i2: "의욕적인 공격자가 자체 Agent를 로드하는 것의 차단",
      i3: "클래스 이름, 메서드 시그니처, 애노테이션 숨기기",
      i4: "절대적 DRM 또는 '깨뜨릴 수 없음'"
    },
    c3: {
      title: "권장 배포 방식",
      i1: "도구, 설치 프로그램, 산출물에 코드 서명",
      i2: "채널별 단기 라이선스 발급과 정기 갱신",
      i3: "고가치 고객에는 호스팅 빌드 또는 HSM 서명",
      i4: "계약, 감사, EULA를 결합한 다층 방어"
    },
    footnote: "위 내용은 제품 문서의 보안 선언과 일치합니다. 검증 가능한 능력만 약속합니다."
  },
  compare: {
    eyebrow: "기능 비교",
    title: "난독화 도구와는 차원이 다릅니다.",
    lead: "난독화는 가독성을 낮출 뿐입니다. CodeShield는 암호문, 무결성, 라이선스, 갱신을 함께 해결합니다.",
    tableAria: "기능 비교표",
    feature: "기능",
    col1: "난독화 도구",
    col2: "오픈소스 암호화",
    col3: "CodeShield",
    r1: "정적 디컴파일",
    r1c1: "읽을 수 있는 로직",
    r1c2: "암호문",
    r1c3: "암호문 + 서명 매니페스트",
    r2: "프레임워크 메타데이터 스캔",
    r2c1: "호환",
    r2c2: "절충이 필요한 경우 많음",
    r2c3: "메타데이터 stub, 기본 호환",
    r3: "서명 라이선스",
    r3c1: "없음",
    r3c2: "약하거나 직접 구현 필요",
    r3c3: "Ed25519, 오프라인 검증",
    r4: "갱신 방식",
    r4c1: "없음",
    r4c2: "재패키징",
    r4c3: "라이선스 파일 교체",
    r5: "머신 바인딩",
    r5c1: "없음",
    r5c2: "일부 지원",
    r5c3: "첫 실행 바인딩",
    r6: "무결성 검사",
    r6c1: "없음",
    r6c2: "일부",
    r6c3: "전체 SHA-256",
    r7: "크로스 언어 통합 라이선스",
    r7c1: "없음",
    r7c2: "없음",
    r8: "상용 납품 프로세스",
    r8c1: "없음",
    r8c2: "없음",
    r8c3: "체험 · 할당량 · 폐기",
    hint: "가로로 스크롤하여 전체 비교 보기"
  },
  pricing: {
    eyebrow: "가격",
    title: "체험으로 시작하고, 비즈니스와 함께 성장하세요.",
    lead: "모든 에디션은 로컬에서 빌드합니다. 체험에는 신용카드가 필요 없고, 정식 라이선스는 연간 구독이며 갱신 시 산출물을 다시 패키징할 필요가 없습니다.",
    trial: {
      name: "체험판",
      tag: "스타터",
      price: "¥0",
      period: "14일",
      desc: "핵심 보호 파이프라인을 모두 경험",
      cta: "무료 체험 시작",
      f1: "14일 유효",
      f2: "빌드 3회",
      f3: "모듈 및 클래스 핵심 암호화",
      f4: "단일 머신 바인딩",
      f5: "산출물 체험 워터마크",
      f6: "네이티브 런타임, 제품 라이선스 발급, CI 미포함"
    },
    pro: {
      name: "프로",
      tag: "가장 인기",
      price: "¥299",
      period: "/ 시트 / 년",
      desc: "개인 개발자와 소규모 팀을 위해",
      cta: "프로 구매",
      f1: "월 100회 로컬 빌드",
      f2: "3가지 암호 스위트",
      f3: "네이티브 런타임 (Python)",
      f4: "제품 라이선스 발급",
      f5: "고객 워터마크와 에디션 표시",
      f6: "Python + Java 두 타깃",
      f7: "Maven 플러그인과 CLI",
      f8: "이메일 지원 (영업일 1일)"
    },
    ent: {
      name: "엔터프라이즈",
      tag: "대규모",
      price: "¥599",
      period: "/ 시트 / 년 · 최소 5 시트",
      desc: "오프라인 운영과 감사가 필요한 팀을 위해",
      cta: "영업 문의",
      f1: "프로의 모든 기능",
      f2: "오프라인 활성화와 응답",
      f3: "CI 토큰과 파이프라인 노드",
      f4: "폐기 목록과 빌드 감사",
      f5: "HSM / KMS 서명 연동",
      f6: "프라이빗 배포 지원",
      f7: "우선 지원 (4시간 응답)",
      f8: "맞춤 납품과 SLA"
    },
    note: "가격은 인민폐(¥) 기준 연간 청구입니다. 최종 가격, 세금, SLA는 판매 계약에 따릅니다. 체험판 기능은 정책에 따라 제한됩니다.",
    guarantee1: "인보이스 발행 가능",
    guarantee2: "법인 계좌 이체 지원",
    guarantee3: "상용 EULA"
  },
  faq: {
    eyebrow: "FAQ",
    title: "구매 전에 알아두실 내용.",
    q1: "암호화하면 시작 속도가 느려지나요?",
    a1: "Java의 AES-GCM은 AES-NI를 사용하므로 수천 개 클래스 복호화에 보통 수십 밀리초가 걸립니다. 실제 비용은 디스크 I/O이며 CodeShield는 공유 JarFile에서 무작위로 읽습니다. Python은 모듈 단위로 지연 복호화하므로 사용하지 않는 모듈에는 비용이 들지 않습니다.",
    q2: "Spring Boot를 지원하나요?",
    a2: "지원합니다. 기본 stub 모드가 필드, 메서드 시그니처, 애노테이션을 유지하므로 컴포넌트 스캔, 의존성 주입, 구성 바인딩, JPA, Actuator가 모두 정상 동작합니다. 실제 Spring Boot 3.2 fat jar로 회귀 테스트를 완료했습니다.",
    q3: "어떤 Python / Java 버전을 지원하나요?",
    a3: "Python은 CPython 3.12를 대상으로 하며 Django 프로젝트에서 검증했습니다. Java 타깃 바이트코드는 JDK 8–21을 지원하고 빌더는 JDK 11 또는 17+ 사용을 권장합니다. JDK 11과 JDK 17의 Spring Boot 3.2를 검증했습니다.",
    q4: "갱신에 재패키징이 필요한가요?",
    a4: "아니요. Java 산출물은 jshield.lic, Python 산출물은 pyshield.lic만 교체하면 됩니다. 비즈니스 jar와 보호 사본은 그대로 유지되고 머신 바인딩 기록도 보존됩니다.",
    q5: "모든 리버스 엔지니어링을 막을 수 있나요?",
    a5: "아니요. 같은 프로세스 안의 보호로는 불가능합니다. CodeShield는 직접 디컴파일, 변조, 무단 실행을 막고 공격 비용을 Agent 작성, JVMTI 사용, 메모리 분석이 필요한 수준으로 높입니다.",
    q6: "완전 오프라인으로 운영할 수 있나요?",
    a6: "가능합니다. 런타임은 로컬 검증과 복호화만 수행하고 외부 서비스에 연결하지 않습니다. Enterprise는 오프라인 활성화 요청과 서명 응답 파일을 제공해 내부망과 격리 환경에 적합합니다.",
    q7: "라이선스 하나로 Python과 Java를 모두 사용할 수 있나요?",
    a7: "가능합니다. 두 엔진은 라이선스 필드와 머신 지문 알고리즘을 공유하므로 도구 라이선스 하나로 두 타깃을 모두 사용할 수 있습니다.",
    q8: "구매 후 어떻게 납품되나요?",
    a8: "결제 후 도구 라이선스를 발급하고 다운로드 주소를 보내드립니다. 내려받아 설치하면 바로 사용할 수 있습니다. Enterprise는 계약, 법인 이체, 인보이스, 맞춤 SLA를 지원합니다."
  },
  cta: {
    title: "다음 블랙박스를 배포할 준비가 되셨나요?",
    lead: "14일 무료 체험, 첫 보호 빌드까지 5분.",
    primary: "체험 라이선스 받기",
    secondary: "데모 예약",
    note: "이메일로 직접 문의하셔도 됩니다: hello@codeshield.dev"
  },
  footer: {
    tagline: "Python과 Java를 위한 빌드 시점 코드 보호와 라이선스 납품.",
    product: "제품",
    product1: "기능",
    product2: "암호화 빌드",
    product3: "보안 경계",
    product4: "가격",
    resources: "리소스",
    resources1: "FAQ",
    resources2: "기술 문서",
    resources3: "시스템 상태",
    resources4: "변경 로그",
    company: "회사",
    company1: "문의",
    company2: "개인정보 처리방침",
    company3: "최종 사용자 라이선스 계약",
    rights: "모든 권리 보유.",
    made: "실제 소프트웨어를 배포하는 팀을 위해 설계했습니다."
  },
  legal: {
    privacy: {
      title: "개인정보 처리방침",
      body: "<p>본 웹사이트는 정적 페이지이며 추적 쿠키를 사용하지 않고 개인 데이터를 수집하지 않습니다. 테마와 언어 설정은 브라우저의 localStorage에만 저장됩니다. 이메일로 문의하시면 해당 정보는 문의에 답변하는 용도로만 사용합니다.</p><p>정식 라이선스 시스템이 출시되면 본 방침을 업데이트하고, 계정이나 머신 정보를 수집하기 전에 동의를 받겠습니다.</p>"
    },
    eula: {
      title: "최종 사용자 라이선스 계약",
      body: "<p>CodeShield는 상용 소프트웨어 라이선스로 제공됩니다. 도구 라이선스는 시트 수와 기간에 따라 발급되며 무단 재배포는 금지됩니다. 보호된 산출물의 배포 권리는 구매자에게 있습니다.</p><p>전체 조건은 도구와 함께 제공되는 LICENSE 및 판매 계약을 따릅니다. 공식 문서가 필요하면 hello@codeshield.dev로 문의해 주세요.</p>"
    }
  },
  toast: {
    soon: "해당 페이지는 곧 공개됩니다",
    copied: "클립보드에 복사했습니다",
    emailCopied: "이메일 주소를 복사했습니다"
  },
  mailto: {
    trialSubject: "CodeShield 체험 신청",
    proSubject: "CodeShield 프로 구매 문의",
    enterpriseSubject: "CodeShield 엔터프라이즈 문의",
    demoSubject: "CodeShield 데모 예약"
  }
};

export default ko;
