/* Copy added for the product-deep-dive sections. Kept separate from the
   original dictionaries so the marketing copy stays easy to compare. */
const additions = {
  zh: {
    productHub: {
      title: "两条产品线，不是同一个壳套两次。",
      lead: "Python 与 Java 的构建方式与运行时机制不同，但共享许可证字段、机器指纹与离线验证。先选交付目标，再沿对应链路走完构建、签名与运行。",
      pythonTag: "源码模块 → 受保护 stub",
      javaTag: "业务 class → 密文 sidecar",
      pythonFor: "适合 SaaS、私有化交付、算法与业务模块",
      javaFor: "适合 Spring Boot、企业应用、服务端与桌面端",
      flowCta: "查看执行流程",
      uiCta: "查看操作界面",
      shared: "共享 Ed25519 许可证 · 机器指纹 · 离线验证"
    },
    flow: {
      eyebrow: "执行原理",
      title: "从构建到运行，每一步都能验证。",
      lead: "构建期完成扫描、加密与签名；运行期只做许可证校验与内存解密。切换产品，查看两条链路各自的实现。",
      build: "构建期",
      runtime: "运行期",
      live: "实时事件",
      auto: "自动演示",
      note: "四个阶段都可以在本地构建机完成，运行期不需要联网。",
      python0: "扫描 Django / Flask 业务模块，跳过依赖与虚拟环境缓存。",
      python1: "模块先 deflate 再以 AEAD 加密，每个模块独立密钥，AAD 绑定构建 ID 与模块名。",
      python2: "生成不可读 stub、元数据、Ed25519 清单与 pyshield.lic，许可证可独立续期。",
      python3: "受保护运行时校验许可证与机器指纹，按需将模块解密到进程内存，磁盘始终是密文。",
      java0: "扫描业务 class，保留 Spring、MyBatis、JPA 需要的注解与签名。",
      java1: "生成元数据 stub 与密文 sidecar，每个类独立密钥，AAD 绑定构建 ID 与类名。",
      java2: "生成 Ed25519 签名清单、jshield.lic，并写入 Launcher-Agent-Class。",
      java3: "JVM defineClass 之前解密；缺失、过期或换机时 fail-closed，明文只存在于内存。"
    },
    ui: {
      eyebrow: "操作界面",
      title: "构建、许可和产物，在同一个操作台完成。",
      lead: "从选择项目到执行受保护构建，再到查看许可证状态与运行日志，操作路径保持一条直线。",
      pythonCaption: "Python 构建工作台",
      javaCaption: "Java 构建工作台",
      pythonAlt: "CodeShield Python 构建工作台界面",
      javaAlt: "CodeShield Java 构建工作台界面",
      previewNote: "界面预览；深色与浅色截图会随站点主题自动切换，实际界面以发布版本为准。"
    }
  },
  en: {
    productHub: {
      title: "Two product lines. Not one shell, twice.",
      lead: "Python and Java take different build paths and runtime mechanics, but share license fields, machine fingerprints and offline verification. Pick a target, then follow its build → sign → run chain.",
      pythonTag: "Source modules → protected stubs",
      javaTag: "Business classes → ciphertext sidecars",
      pythonFor: "For SaaS, private deployments, algorithms and business modules",
      javaFor: "For Spring Boot, enterprise apps, servers and desktop clients",
      flowCta: "View execution flow",
      uiCta: "View the workspace",
      shared: "Shared Ed25519 licenses · machine fingerprints · offline verification"
    },
    flow: {
      eyebrow: "Execution model",
      title: "From build to runtime, every hop is verifiable.",
      lead: "The build machine scans, encrypts and signs. Runtime verifies the license and decrypts into memory only. Switch products to see each chain.",
      build: "Build time",
      runtime: "Runtime",
      live: "Live event",
      auto: "Auto demo",
      note: "All four stages run on your local build machine. Runtime never needs the network.",
      python0: "Scan Django / Flask business modules, skipping dependencies and virtualenv caches.",
      python1: "Modules are deflated, then AEAD-sealed with per-module keys; AAD binds the build ID and module name.",
      python2: "Emit unreadable stubs, metadata, an Ed25519 manifest and pyshield.lic for independent renewal.",
      python3: "The protected runtime verifies the license and machine fingerprint, then decrypts modules into process memory on demand.",
      java0: "Scan business classes while preserving the annotations and signatures Spring, MyBatis and JPA need.",
      java1: "Emit metadata stubs and ciphertext sidecars with per-class keys; AAD binds the build ID and class name.",
      java2: "Generate an Ed25519 manifest, jshield.lic and the Launcher-Agent-Class entry.",
      java3: "Decrypt before JVM defineClass. Missing, expired or mismatched licenses fail closed; plaintext lives only in memory."
    },
    ui: {
      eyebrow: "Workspace",
      title: "Build, license and ship from one console.",
      lead: "Choose a project, run a protected build, inspect license state and read the runtime log — the path stays a straight line.",
      pythonCaption: "Python build workspace",
      javaCaption: "Java build workspace",
      pythonAlt: "CodeShield Python build workspace",
      javaAlt: "CodeShield Java build workspace",
      previewNote: "Interface previews follow the site theme. The shipped workspace may differ."
    }
  },
  ja: {
    productHub: {
      title: "2 つの製品ライン。同じ殻の使い回しではありません。",
      lead: "Python と Java はビルド方式も実行時機構も異なりますが、ライセンスフィールド、マシン指紋、オフライン検証を共有します。納品対象を選び、構築 → 署名 → 実行の各チェーンを確認できます。",
      pythonTag: "ソースモジュール → 保護 stub",
      javaTag: "業務 class → 暗号文 sidecar",
      pythonFor: "SaaS、プライベート納品、アルゴリズムや業務モジュールに",
      javaFor: "Spring Boot、企業アプリ、サーバー、デスクトップに",
      flowCta: "実行フローを見る",
      uiCta: "操作画面を見る",
      shared: "Ed25519 ライセンス · マシン指紋 · オフライン検証を共有"
    },
    flow: {
      eyebrow: "実行原理",
      title: "構築から実行まで、すべての工程を検証。",
      lead: "構築時にスキャン、暗号化、署名を行い、実行時はライセンス検証とメモリ内復号だけを行います。製品を切り替えて各チェーンを確認できます。",
      build: "構築時",
      runtime: "実行時",
      live: "ライブイベント",
      auto: "自動デモ",
      note: "4 つの工程はすべてローカルの構築機で完結します。実行時にネットワークは不要です。",
      python0: "Django / Flask の業務モジュールをスキャンし、依存関係と仮想環境キャッシュを除外します。",
      python1: "モジュールを deflate してから AEAD で暗号化。モジュールごとに独立した鍵を使い、AAD にビルド ID とモジュール名を束縛します。",
      python2: "読めない stub、メタデータ、Ed25519 マニフェスト、pyshield.lic を生成。ライセンスは個別に更新できます。",
      python3: "保護ランタイムがライセンスとマシン指紋を検証し、必要に応じてモジュールをプロセスメモリへ復号します。ディスク上は常に暗号文です。",
      java0: "業務 class をスキャンし、Spring、MyBatis、JPA に必要な注釈とシグネチャを保持します。",
      java1: "メタデータ stub と暗号文 sidecar を生成。クラスごとに独立した鍵を使い、AAD にビルド ID とクラス名を束縛します。",
      java2: "Ed25519 署名マニフェスト、jshield.lic を生成し、Launcher-Agent-Class を書き込みます。",
      java3: "JVM の defineClass 前に復号。欠落、期限切れ、別マシンでは fail-closed となり、平文はメモリ内だけに存在します。"
    },
    ui: {
      eyebrow: "操作画面",
      title: "構築・ライセンス・成果物を 1 つのワークスペースで。",
      lead: "プロジェクト選択から保護ビルド、ライセンス状態、実行ログまで、操作の流れは一本道です。",
      pythonCaption: "Python ビルドワークスペース",
      javaCaption: "Java ビルドワークスペース",
      pythonAlt: "CodeShield Python ビルドワークスペースの画面",
      javaAlt: "CodeShield Java ビルドワークスペースの画面",
      previewNote: "ライト / ダークの画面はサイトテーマに連動します。実際の画面はリリース版に準じます。"
    }
  },
  ko: {
    productHub: {
      title: "두 개의 제품 라인. 하나의 껍데기를 두 번 쓰는 것이 아닙니다.",
      lead: "Python과 Java는 빌드 방식과 런타임 메커니즘이 다르지만 라이선스 필드, 머신 지문, 오프라인 검증을 공유합니다. 대상을 고른 뒤 빌드 → 서명 → 실행 체인을 확인하세요.",
      pythonTag: "소스 모듈 → 보호된 stub",
      javaTag: "비즈니스 class → 암호문 sidecar",
      pythonFor: "SaaS, 프라이빗 배포, 알고리즘 및 비즈니스 모듈에 적합",
      javaFor: "Spring Boot, 엔터프라이즈 앱, 서버 및 데스크톱에 적합",
      flowCta: "실행 흐름 보기",
      uiCta: "작업 화면 보기",
      shared: "Ed25519 라이선스 · 머신 지문 · 오프라인 검증 공유"
    },
    flow: {
      eyebrow: "실행 원리",
      title: "빌드부터 런타임까지, 모든 단계를 검증합니다.",
      lead: "빌드 시점에 스캔, 암호화, 서명을 수행하고 런타임에는 라이선스 검증과 메모리 복호화만 수행합니다. 제품을 전환해 각 체인을 확인하세요.",
      build: "빌드 시점",
      runtime: "런타임",
      live: "실시간 이벤트",
      auto: "자동 데모",
      note: "네 단계 모두 로컬 빌드 머신에서 완료됩니다. 런타임에는 네트워크가 필요하지 않습니다.",
      python0: "Django / Flask 비즈니스 모듈을 스캔하고 의존성과 가상 환경 캐시는 건너뜁니다.",
      python1: "모듈을 deflate한 뒤 AEAD로 암호화합니다. 모듈별 독립 키를 사용하고 AAD에 빌드 ID와 모듈 이름을 묶습니다.",
      python2: "읽을 수 없는 stub, 메타데이터, Ed25519 매니페스트, pyshield.lic를 생성합니다. 라이선스는 별도로 갱신할 수 있습니다.",
      python3: "보호 런타임이 라이선스와 머신 지문을 검증한 뒤 필요할 때 모듈을 프로세스 메모리로 복호화합니다. 디스크에는 항상 암호문만 남습니다.",
      java0: "비즈니스 class를 스캔하고 Spring, MyBatis, JPA에 필요한 애노테이션과 시그니처를 유지합니다.",
      java1: "메타데이터 stub와 암호문 sidecar를 생성합니다. 클래스별 독립 키를 사용하고 AAD에 빌드 ID와 클래스 이름을 묶습니다.",
      java2: "Ed25519 서명 매니페스트와 jshield.lic를 만들고 Launcher-Agent-Class를 기록합니다.",
      java3: "JVM defineClass 전에 복호화합니다. 누락, 만료, 다른 머신에서는 fail-closed이며 평문은 메모리에만 존재합니다."
    },
    ui: {
      eyebrow: "작업 화면",
      title: "빌드, 라이선스, 산출물을 하나의 워크스페이스에서.",
      lead: "프로젝트 선택부터 보호 빌드, 라이선스 상태, 실행 로그까지 한 흐름으로 이어집니다.",
      pythonCaption: "Python 빌드 워크스페이스",
      javaCaption: "Java 빌드 워크스페이스",
      pythonAlt: "CodeShield Python 빌드 워크스페이스 화면",
      javaAlt: "CodeShield Java 빌드 워크스페이스 화면",
      previewNote: "라이트 / 다크 화면은 사이트 테마에 맞춰 전환됩니다. 실제 화면은 출시 버전에 따릅니다."
    }
  }
};

export default additions;
