/* Copy for the #/download page. */

const download = {
  zh: {
    metaTitle: "下载试用版",
    metaDescription: "下载 CodeShield 试用版：Windows 与 Linux 安装包直接下载，14 天免费试用，无需信用卡。macOS 版本即将提供。",
    back: "返回首页",
    kicker: "DOWNLOAD / TRIAL",
    title: "下载试用版",
    lead: "14 天免费试用，包含完整的核心保护链路：构建期加密、运行期解密与许可证签发。选择平台直接下载，解压即用，无需信用卡。",
    snapshot: "构建快照 · 随主分支持续更新",
    platforms: {
      windows: {
        name: "Windows",
        meta: "Windows 10 / 11 · x64",
        cta: "下载 .exe",
        note: "双击运行；首次启动会做完整性自检。"
      },
      linux: {
        name: "Linux",
        meta: "x86_64 · ELF",
        cta: "下载二进制",
        note: "chmod +x PyShieldBuilder 后运行。"
      },
      macos: {
        name: "macOS",
        meta: "Apple Silicon / Intel",
        cta: "即将提供",
        note: "正在打包与签名，稍后开放下载。"
      }
    },
    soon: "即将提供",
    size: "文件大小",
    facts: ["14 天有效期", "无需信用卡", "本地离线构建"],
    verifyTitle: "校验与版本",
    sha: "SHA-256 校验文件",
    releases: "GitHub Releases · 全部版本",
    docs: "快速开始文档",
    note: "下载包不含构建密钥；试用产物带试用水印。"
  },

  en: {
    metaTitle: "Download the trial",
    metaDescription: "Download CodeShield: direct installers for Windows and Linux, 14-day free trial, no credit card. macOS build coming soon.",
    back: "Back to home",
    kicker: "DOWNLOAD / TRIAL",
    title: "Download the trial",
    lead: "14 days free, covering the full protection chain: build-time encryption, runtime decryption and license issuance. Pick a platform, unzip and run — no credit card.",
    snapshot: "Build snapshot · refreshed with every push",
    platforms: {
      windows: {
        name: "Windows",
        meta: "Windows 10 / 11 · x64",
        cta: "Download .exe",
        note: "Double-click to run; integrity is verified on first launch."
      },
      linux: {
        name: "Linux",
        meta: "x86_64 · ELF",
        cta: "Download binary",
        note: "Run chmod +x PyShieldBuilder first."
      },
      macos: {
        name: "macOS",
        meta: "Apple Silicon / Intel",
        cta: "Coming soon",
        note: "Being packaged and signed — available shortly."
      }
    },
    soon: "Coming soon",
    size: "File size",
    facts: ["14-day validity", "No credit card", "Local offline builds"],
    verifyTitle: "Verify & versions",
    sha: "SHA-256 checksums",
    releases: "GitHub Releases · all builds",
    docs: "Quick start guide",
    note: "Build keys are not shipped; trial artifacts carry a watermark."
  },

  ja: {
    metaTitle: "トライアルをダウンロード",
    metaDescription: "CodeShield トライアル版のダウンロード：Windows / Linux のインストーラを直接ダウンロード。14 日間無料、クレジットカード不要。macOS 版は準備中です。",
    back: "ホームに戻る",
    kicker: "DOWNLOAD / TRIAL",
    title: "トライアルをダウンロード",
    lead: "14 日間無料。ビルド時の暗号化、実行時の復号、ライセンス発行まで一通り含みます。プラットフォームを選んでダウンロードし、解凍してすぐ使えます。",
    snapshot: "ビルドスナップショット · 随時更新",
    platforms: {
      windows: {
        name: "Windows",
        meta: "Windows 10 / 11 · x64",
        cta: ".exe をダウンロード",
        note: "ダブルクリックで起動。初回起動時に整合性を検証します。"
      },
      linux: {
        name: "Linux",
        meta: "x86_64 · ELF",
        cta: "バイナリをダウンロード",
        note: "chmod +x PyShieldBuilder を実行してから起動してください。"
      },
      macos: {
        name: "macOS",
        meta: "Apple Silicon / Intel",
        cta: "準備中",
        note: "パッケージと署名を準備中です。"
      }
    },
    soon: "準備中",
    size: "ファイルサイズ",
    facts: ["有効期間 14 日", "クレジットカード不要", "ローカルでオフラインビルド"],
    verifyTitle: "検証とバージョン",
    sha: "SHA-256 チェックサム",
    releases: "GitHub Releases · すべてのビルド",
    docs: "クイックスタート",
    note: "ビルド鍵は同梱されません。トライアル成果物には透かしが入ります。"
  },

  ko: {
    metaTitle: "체험판 다운로드",
    metaDescription: "CodeShield 체험판 다운로드: Windows / Linux 설치 파일 직접 다운로드, 14일 무료, 신용카드 불필요. macOS 버전은 준비 중입니다.",
    back: "홈으로",
    kicker: "DOWNLOAD / TRIAL",
    title: "체험판 다운로드",
    lead: "14일 무료. 빌드 시 암호화, 실행 시 복호화, 라이선스 발급까지 모두 포함합니다. 플랫폼을 선택해 내려받고 압축을 풀면 바로 사용할 수 있습니다.",
    snapshot: "빌드 스냅샷 · 지속 업데이트",
    platforms: {
      windows: {
        name: "Windows",
        meta: "Windows 10 / 11 · x64",
        cta: ".exe 다운로드",
        note: "더블클릭으로 실행하며, 첫 실행 시 무결성을 검사합니다."
      },
      linux: {
        name: "Linux",
        meta: "x86_64 · ELF",
        cta: "바이너리 다운로드",
        note: "chmod +x PyShieldBuilder 후 실행하세요."
      },
      macos: {
        name: "macOS",
        meta: "Apple Silicon / Intel",
        cta: "준비 중",
        note: "패키징과 서명을 준비하고 있습니다."
      }
    },
    soon: "준비 중",
    size: "파일 크기",
    facts: ["14일 유효", "신용카드 불필요", "로컬 오프라인 빌드"],
    verifyTitle: "검증 및 버전",
    sha: "SHA-256 체크섬",
    releases: "GitHub Releases · 전체 빌드",
    docs: "빠른 시작 문서",
    note: "빌드 키는 포함되지 않으며, 체험 산출물에는 워터마크가 들어갑니다."
  }
};

export default download;
