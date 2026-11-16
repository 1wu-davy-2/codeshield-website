/* Copy + intent keywords for the in-page chat widget.
   Kept in one file so all four languages stay side by side. */

export const CHAT_INTENTS = [
  {
    id: "pricing",
    keys: ["价格", "多少钱", "费用", "报价", "收费", "price", "pricing", "cost", "quote", "価格", "料金", "가격", "비용"]
  },
  {
    id: "trial",
    keys: ["试用", "免费", "体验", "trial", "free", "トライアル", "無料", "무료", "체험"]
  },
  {
    id: "docs",
    keys: ["文档", "教程", "上手", "手册", "doc", "docs", "guide", "documentation", "ドキュメント", "문서"]
  },
  {
    id: "how",
    keys: ["原理", "加密", "解密", "混淆", "怎么工作", "如何实现", "encrypt", "decrypt", "how", "works", "仕組み", "暗号", "원리", "암호"]
  },
  {
    id: "license",
    keys: ["许可", "授权", "续期", "激活", "绑定", "license", "licence", "renew", "activate", "ライセンス", "갱신", "라이선스"]
  },
  {
    id: "delivery",
    keys: ["私有化", "部署", "交付方式", "买断", "on-prem", "deploy", "delivery", "offline", "オンプレ", "배포"]
  },
  {
    id: "frameworks",
    keys: ["支持", "框架", "版本", "spring", "django", "jdk", "python", "java", "support", "framework", "対応", "지원"]
  },
  {
    id: "contact",
    keys: ["联系", "销售", "商务", "邮件", "电话", "微信", "人工", "contact", "sales", "email", "human", "連絡", "문의"]
  }
];

const chat = {
  zh: {
    title: "CodeShield 在线支持",
    status: "在线 · 通常 1 分钟内回复",
    greeting: "你好，我是 CodeShield 助手。价格、试用、框架兼容、加密原理都可以直接问我。",
    placeholder: "输入问题，Enter 发送",
    send: "发送",
    open: "打开在线聊天",
    close: "关闭聊天",
    typing: "正在输入",
    quickTitle: "常见问题",
    quick: {
      pricing: "价格怎么算？",
      trial: "有免费试用吗？",
      frameworks: "支持哪些框架和版本？",
      how: "加密是怎么实现的？",
      contact: "联系真人"
    },
    fallback: "这个我暂时答不上来。可以邮件 hello@codeshield.dev，或到「联系商务」页留下项目规模与时间点，一个工作日内会有人跟进。",
    copyEmail: "复制邮箱",
    copied: "邮箱已复制",
    goContact: "去联系商务",
    answers: {
      pricing:
        "试用版 ¥0 / 14 天；专业版 ¥299 每席位每年，含每月 100 次本地构建；企业版 ¥599 每席位每年，5 席位起，含离线激活与 CI Token。价格以人民币计、按年订阅，税费与 SLA 以合同为准。",
      trial:
        "免费试用 14 天，无需信用卡：3 次构建额度、模块与 class 核心加密、单机绑定，产物带试用水印。右上角「免费试用」→ 定价 →「开始免费试用」，可选 Windows / Linux 安装包。",
      docs:
        "文档在 #/docs，覆盖快速开始、构建、许可证与故障排查；也可以打开「加密构建」页，跑一次端到端的加密 → 运行演示。",
      how:
        "构建期把源码与字节码先压缩再封装成 AEAD 密文（AES-GCM、ChaCha20-Poly1305、ChaCha20+HMAC），运行期由内嵌 Agent 用本地密钥解密，授权走 Ed25519 验签。磁盘上不留可读逻辑，运行期不依赖在线服务。",
      license:
        "两级许可：工具授权决定谁能构建，产物许可证决定软件能在哪台机器、运行到什么时候。续期只替换 jshield.lic / pyshield.lic，业务产物不用重新打包，机器绑定记录也不会丢。",
      delivery:
        "三种合作方式：在线订阅（按年）、项目制买断 + 年度授权、私有化交付（含 HSM / KMS 签发对接与 SLA）。可以先签 NDA 再谈细节。",
      frameworks:
        "Python 面向 CPython 3.12，Django 已验证；Java 覆盖 JDK 8–21 字节码，Spring Boot 3.2 fat jar 回归通过，Spring、MyBatis、JPA、Swagger 的扫描与注解都不受影响。",
      contact:
        "邮件最快：hello@codeshield.dev（商务 sales@codeshield.dev）。也可以到「联系商务」页说明项目规模、运行环境和时间点，一个工作日内回复方案与报价。"
    }
  },

  en: {
    title: "CodeShield live support",
    status: "Online · usually replies in a minute",
    greeting: "Hi, I'm the CodeShield assistant. Ask me about pricing, the trial, framework support or how the encryption works.",
    placeholder: "Type a question, Enter to send",
    send: "Send",
    open: "Open live chat",
    close: "Close chat",
    typing: "typing",
    quickTitle: "Common questions",
    quick: {
      pricing: "How much does it cost?",
      trial: "Is there a free trial?",
      frameworks: "Which frameworks are supported?",
      how: "How does the encryption work?",
      contact: "Talk to a human"
    },
    fallback:
      "I can't answer that one yet. Email hello@codeshield.dev, or leave your project size and timeline on the contact page — you'll hear back within one business day.",
    copyEmail: "Copy email",
    copied: "Email copied",
    goContact: "Contact sales",
    answers: {
      pricing:
        "Trial is ¥0 for 14 days. Pro is ¥299 per seat per year with 100 local builds a month. Enterprise is ¥599 per seat per year, 5 seats minimum, with offline activation and CI tokens. Billed yearly in CNY; tax and SLA follow the contract.",
      trial:
        "14 days free, no credit card: 3 builds, module and class-level encryption, single-machine binding, watermarked output. Header “free trial” → pricing → “start free trial” gives you the Windows and Linux installers.",
      docs:
        "Docs live at #/docs — quick start, build, licensing and troubleshooting. You can also open the encryption lab to run an end-to-end encrypt → run demo.",
      how:
        "At build time sources and bytecode are compressed and sealed as AEAD ciphertext (AES-GCM, ChaCha20-Poly1305, ChaCha20+HMAC). At runtime an embedded agent decrypts with a local key and verifies an Ed25519 license. No readable logic on disk, no online service at runtime.",
      license:
        "Two licence levels: the tool licence decides who can build, the artifact licence decides which machine runs the software and until when. Renewal only swaps jshield.lic / pyshield.lic — no rebuild, and machine bindings are preserved.",
      delivery:
        "Three options: yearly subscription, project buy-out plus annual licence, or on-prem delivery with HSM / KMS signing and an SLA. Happy to sign an NDA first.",
      frameworks:
        "Python targets CPython 3.12 and is verified on Django. Java covers JDK 8–21 bytecode and passes Spring Boot 3.2 fat-jar regression — Spring, MyBatis, JPA and Swagger scanning keep working.",
      contact:
        "Email is fastest: hello@codeshield.dev (sales@codeshield.dev). Or use the contact page with your project size, runtime and timeline — reply within one business day."
    }
  },

  ja: {
    title: "CodeShield オンラインサポート",
    status: "オンライン · 通常 1 分以内に返信",
    greeting: "CodeShield アシスタントです。価格、無料トライアル、対応フレームワーク、暗号化の仕組みなどをお尋ねください。",
    placeholder: "質問を入力し、Enter で送信",
    send: "送信",
    open: "チャットを開く",
    close: "チャットを閉じる",
    typing: "入力中",
    quickTitle: "よくある質問",
    quick: {
      pricing: "料金はいくらですか？",
      trial: "無料トライアルはありますか？",
      frameworks: "対応フレームワークは？",
      how: "暗号化の仕組みは？",
      contact: "担当者と話したい"
    },
    fallback:
      "この質問にはまだお答えできません。hello@codeshield.dev へのメール、またはお問い合わせページに規模と時期をご記入ください。1 営業日以内にご返信します。",
    copyEmail: "メールをコピー",
    copied: "コピーしました",
    goContact: "営業に問い合わせる",
    answers: {
      pricing:
        "トライアルは ¥0 / 14 日間。Pro は 1 シート年額 ¥299（月 100 回のローカルビルド）。Enterprise は 1 シート年額 ¥599、5 シートからで、オフライン認証と CI トークンを含みます。人民元・年額請求です。",
      trial:
        "14 日間無料、クレジットカード不要。ビルド 3 回、モジュールとクラスの暗号化、1 台バインド、試用水印付き。ヘッダーの「無料トライアル」→ 料金 →「無料トライアルを開始」から Windows / Linux 版をダウンロードできます。",
      docs:
        "ドキュメントは #/docs にあります（クイックスタート、ビルド、ライセンス、トラブルシューティング）。暗号化ラボで暗号化 → 実行のデモも試せます。",
      how:
        "ビルド時にソースとバイトコードを圧縮して AEAD 暗号文（AES-GCM、ChaCha20-Poly1305、ChaCha20+HMAC）に封入し、実行時は組み込みエージェントがローカル鍵で復号、Ed25519 で検証します。ディスクに可読ロジックは残らず、実行時にオンライン接続も不要です。",
      license:
        "ライセンスは 2 層です。ツールライセンスはビルド権限、成果物ライセンスは実行マシンと有効期限を決めます。更新は jshield.lic / pyshield.lic の差し替えのみで、再ビルド不要、マシンバインドも保持されます。",
      delivery:
        "3 つの形態: 年額サブスクリプション、プロジェクト買い切り + 年間ライセンス、オンプレ納品（HSM / KMS 署名連携と SLA 込み）。まず NDA の締結も可能です。",
      frameworks:
        "Python は CPython 3.12 対象で Django で検証済み。Java は JDK 8–21 のバイトコードに対応し、Spring Boot 3.2 fat jar の回帰テストに合格。Spring、MyBatis、JPA、Swagger のスキャンも影響を受けません。",
      contact:
        "メールが最速です: hello@codeshield.dev（営業 sales@codeshield.dev）。お問い合わせページに規模・実行環境・時期をご記入いただければ 1 営業日以内にご返信します。"
    }
  },

  ko: {
    title: "CodeShield 온라인 지원",
    status: "온라인 · 보통 1분 내 응답",
    greeting: "CodeShield 도우미입니다. 가격, 무료 체험, 프레임워크 지원, 암호화 방식 등을 물어보세요.",
    placeholder: "질문을 입력하고 Enter로 전송",
    send: "보내기",
    open: "채팅 열기",
    close: "채팅 닫기",
    typing: "입력 중",
    quickTitle: "자주 묻는 질문",
    quick: {
      pricing: "가격은 얼마인가요?",
      trial: "무료 체험이 있나요?",
      frameworks: "어떤 프레임워크를 지원하나요?",
      how: "암호화는 어떻게 동작하나요?",
      contact: "담당자와 상담"
    },
    fallback:
      "아직 답변드리기 어려운 질문입니다. hello@codeshield.dev 로 메일을 보내시거나 문의 페이지에 규모와 일정을 남겨 주세요. 영업일 기준 1일 내 회신드립니다.",
    copyEmail: "메일 복사",
    copied: "복사되었습니다",
    goContact: "영업팀 문의",
    answers: {
      pricing:
        "체험판은 ¥0 / 14일입니다. Pro는 시트당 연 ¥299(월 100회 로컬 빌드), Enterprise는 시트당 연 ¥599이며 5시트부터, 오프라인 활성화와 CI 토큰이 포함됩니다. 위안화 기준 연 구독입니다.",
      trial:
        "14일 무료, 신용카드 불필요. 빌드 3회, 모듈·클래스 암호화, 단일 PC 바인딩, 체험 워터마크가 포함됩니다. 상단의 '무료 체험' → 요금제 → '무료 체험 시작'에서 Windows / Linux 설치 파일을 받을 수 있습니다.",
      docs:
        "문서는 #/docs 에 있습니다(빠른 시작, 빌드, 라이선스, 문제 해결). 암호화 랩에서 암호화 → 실행 데모도 직접 확인할 수 있습니다.",
      how:
        "빌드 시 소스와 바이트코드를 압축해 AEAD 암호문(AES-GCM, ChaCha20-Poly1305, ChaCha20+HMAC)으로 봉인하고, 실행 시 내장 에이전트가 로컬 키로 복호화하며 Ed25519로 검증합니다. 디스크에 판독 가능한 로직이 남지 않고 런타임에 온라인 연결도 필요 없습니다.",
      license:
        "라이선스는 2단계입니다. 도구 라이선스는 빌드 권한을, 산출물 라이선스는 실행 가능한 PC와 기간을 정합니다. 갱신은 jshield.lic / pyshield.lic 교체만으로 끝나며 재빌드가 필요 없고 PC 바인딩도 유지됩니다.",
      delivery:
        "세 가지 방식이 있습니다: 연 구독, 프로젝트 단위 구매 + 연 라이선스, 온프레미스 납품(HSM / KMS 서명 연동과 SLA 포함). 필요하면 NDA를 먼저 체결할 수 있습니다.",
      frameworks:
        "Python은 CPython 3.12 대상이며 Django에서 검증되었습니다. Java는 JDK 8–21 바이트코드를 지원하고 Spring Boot 3.2 fat jar 회귀 테스트를 통과했습니다. Spring, MyBatis, JPA, Swagger 스캔에 영향이 없습니다.",
      contact:
        "메일이 가장 빠릅니다: hello@codeshield.dev (영업 sales@codeshield.dev). 문의 페이지에 규모·실행 환경·일정을 남겨 주시면 영업일 기준 1일 내 회신드립니다."
    }
  }
};

export default chat;
