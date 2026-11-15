const en = {
  meta: {
    title: "CodeShield — Source protection and license delivery for Python & Java",
    description: "CodeShield combines build-time encryption, runtime decryption and Ed25519-signed licenses for Python and Java applications. Start a 14-day free trial."
  },
  a11y: {
    skip: "Skip to main content"
  },
  common: {
    primaryNav: "Primary navigation",
    mobileNav: "Mobile navigation",
    language: "Language",
    themeToggle: "Toggle dark / light theme",
    copyCommand: "Copy command",
    menu: "Open menu",
    close: "Close",
    backToTop: "Back to top"
  },
  nav: {
    docs: "Docs",
    product: "Product",
    lab: "Build lab",
    capabilities: "Capabilities",
    how: "How it works",
    security: "Security",
    pricing: "Pricing",
    faq: "FAQ",
    trial: "Start free trial"
  },
  hero: {
    badge: "Python × Java · Build-time encryption · Runtime decryption",
    title1: "Ship the product.",
    title2: "Not the source.",
    lead: "CodeShield gives Python and Java applications one system for build-time encryption, runtime decryption and Ed25519-signed licensing. Classes and modules stay encrypted on disk, licenses are issued independently — and renewal is a single-file swap.",
    ctaPrimary: "Start your 14-day free trial",
    ctaSecondary: "Open the build lab",
    trust1: "No credit card",
    trust2: "Local, offline builds",
    trust3: "Integrate in 5 minutes",
    terminalTitle: "codeshield · protected build",
    fact1: "No agent → hard fail",
    fact2: "Per-class keys",
    fact3: "Zero runtime dependencies"
  },
  stats: {
    s1: { label: "Cipher suites", note: "AES-GCM · ChaCha20-Poly1305 · ChaCha20+HMAC" },
    s2: { label: "Size overhead", note: "Deflate first; measured jar overhead" },
    s3: { label: "Automated tests", note: "Covering crypto, licensing and framework regressions" },
    s4: { label: "Offline runtime", note: "The runtime never calls home" }
  },
  proof: {
    label: "Verified on real stacks",
    note: "Spring Boot 3.2 fat jar regression passed: component scanning, dependency injection, configuration binding and Actuator all work."
  },
  why: {
    eyebrow: "Why CodeShield",
    title: "Encryption is the start. Delivery is the point.",
    lead: "Most tools stop at obfuscation or encryption. CodeShield turns key management, licensing, issuance, renewal and trial conversion into one complete pipeline — so protected software can actually be sold, renewed and audited.",
    c1: { title: "Build-time encryption", desc: "Source and bytecode are sealed into AEAD ciphertext during the build. No readable logic ever reaches disk." },
    c2: { title: "Two-tier licensing", desc: "A tool license decides who can build; a product license decides where and until when the software runs." },
    c3: { title: "Offline first", desc: "Runtime verification and decryption happen locally. Enterprise adds fully offline activation and responses." },
    c4: { title: "Drop-in integration", desc: "Java embeds an agent via Launcher-Agent-Class; Maven needs one profile. Python needs one command." },
    c5: { title: "Framework friendly", desc: "Metadata stubs preserve annotations and signatures, so Spring, MyBatis, Swagger and JPA scanning keep working." },
    c6: { title: "One license, two runtimes", desc: "Python and Java share license fields and fingerprint algorithms. One tool license unlocks both targets." }
  },
  product: {
    eyebrow: "Two engines",
    title: "Python and Java. One delivery system.",
    lead: "Both engines share the envelope format, license fields and machine-fingerprint algorithm — one issuance backend, one tool license, two runtimes.",
    tabsAria: "Choose runtime",
    pythonDesc: "Encrypt Django / Flask project modules into unreadable stubs, decrypted on demand by a protected runtime. Ship a deployable copy without shipping the source.",
    pythonB1: "Built for CPython 3.12, validated on Django projects",
    pythonB2: "Three cipher suites, native runtime available on Pro",
    pythonB3: "Product licenses with expiry, grace period and machine binding",
    pythonB4: "One command produces the protected copy and its license",
    pythonNote: "Example: 48 modules · 2.0 MB · 12.6 s",
    javaDesc: "Encrypt business classes into ciphertext sidecars while keeping metadata stubs. java -jar auto-loads the embedded agent — no JVM flags, no Spring Boot changes.",
    javaB1: "Stub and in-place modes",
    javaB2: "JDK 8–21 target bytecode, verified on Boot 3.2",
    javaB3: "Renew by replacing jshield.lic — no rebuild",
    javaB4: "Zero-change adoption through the Maven plugin",
    javaNote: "Example: 1,284 classes · Boot 3.2 · 255 beans"
  },
  how: {
    eyebrow: "How it works",
    title: "From source to black box in four steps.",
    lead: "Encryption happens on your build machine; private keys never leave your side. Runtime performs one verification and one decryption.",
    s1: { title: "Scan and compress", desc: "Identify business modules and classes, skip dependencies and module-info, then deflate before encrypting to keep size in check." },
    s2: { title: "AEAD sealing", desc: "Every class gets its own key, with AAD bound to the build ID and class name. Moved or transplanted ciphertext fails immediately." },
    s3: { title: "Signed manifest", desc: "An Ed25519-signed manifest and metadata stubs are generated. Tampering with any protected entry is rejected." },
    s4: { title: "Runtime decryption", desc: "The agent decrypts just before the JVM defines a class. Missing, expired or moved licenses fail closed — never silently degrade." },
    pipe1: "Source",
    pipe2: "Compile",
    pipe3: "Encrypt",
    pipe4: "Sign",
    pipe5: "Deliver",
    pipe6: "Runtime decrypt",
    note: "Every build runs locally. Source is never uploaded; private keys never leave the build machine."
  },
  arch: {
    eyebrow: "Key hierarchy",
    title: "Layered derivation. No single point of failure.",
    lead: "Master, license, build and class keys are derived in sequence. Signing keys exist only on the build side; runtime carries nothing but the public key.",
    node1: { title: "Master key", desc: "Embedded in the agent, obfuscated" },
    node2: { title: "License key", desc: "Derived with HKDF(build_id)" },
    node3: { title: "Build key", desc: "Unsealed from jshield.lic" },
    node4: { title: "Class key", desc: "Derived by HKDF(class name), per class" },
    badge1: "Ed25519 sign / verify",
    badge2: "AAD = build_id + class name",
    badge3: "No signing keys at runtime",
    note: "The same fingerprint algorithm and license fields serve Python and Java."
  },
  security: {
    eyebrow: "Security boundaries",
    title: "We raise the bar. We don't sell illusions.",
    lead: "No in-process protection can stop a motivated attacker from dumping memory. CodeShield's goal is to turn casual decompilation into an engineering problem that requires writing an agent.",
    c1: {
      title: "What it effectively blocks",
      i1: "Reading business logic by unzipping or decompiling",
      i2: "Silent degradation when the agent is missing",
      i3: "Tampering with protected entries or the manifest",
      i4: "Running on another machine, after expiry or past grace",
      i5: "Porting ciphertext across builds or class names"
    },
    c2: {
      title: "What we do not promise",
      i1: "Stopping JVMTI or heap dumps from extracting plaintext",
      i2: "Stopping a motivated attacker from loading their own agent",
      i3: "Hiding class names, method signatures or annotations",
      i4: "Absolute DRM or being \"unbreakable\""
    },
    c3: {
      title: "How to deploy it well",
      i1: "Code-sign your tools, installers and artifacts",
      i2: "Issue short-lived licenses per channel and renew regularly",
      i3: "Use hosted builds or HSM signing for high-value customers",
      i4: "Pair the software with contracts, audits and an EULA"
    },
    footnote: "These statements match the product documentation. We only promise capabilities we can verify."
  },
  compare: {
    eyebrow: "Comparison",
    title: "A different league from obfuscators.",
    lead: "Obfuscation reduces readability. CodeShield also solves ciphertext, integrity, licensing and renewal.",
    tableAria: "Capability comparison table",
    feature: "Capability",
    col1: "Obfuscators",
    col2: "Open-source encryption",
    col3: "CodeShield",
    r1: "Static decompilation",
    r1c1: "Readable logic",
    r1c2: "Ciphertext",
    r1c3: "Ciphertext + signed manifest",
    r2: "Framework metadata scan",
    r2c1: "Compatible",
    r2c2: "Often compromised",
    r2c3: "Metadata stubs, natively compatible",
    r3: "Signed license",
    r3c1: "None",
    r3c2: "Weak or roll your own",
    r3c3: "Ed25519, offline verification",
    r4: "Renewal",
    r4c1: "None",
    r4c2: "Rebuild",
    r4c3: "Replace the license file",
    r5: "Machine binding",
    r5c1: "None",
    r5c2: "Partial",
    r5c3: "First-run binding",
    r6: "Integrity checks",
    r6c1: "None",
    r6c2: "Partial",
    r6c3: "Full SHA-256",
    r7: "Cross-language licensing",
    r7c1: "None",
    r7c2: "None",
    r8: "Commercial delivery flow",
    r8c1: "None",
    r8c2: "None",
    r8c3: "Trial · quotas · revocation",
    hint: "Swipe horizontally to see the full comparison"
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Start with a trial. Grow with your business.",
    lead: "Every edition builds locally. No credit card for the trial; paid licenses are annual, and renewing never requires rebuilding your artifacts.",
    trial: {
      name: "Trial",
      tag: "Starter",
      price: "¥0",
      period: "14 days",
      desc: "Experience the full core protection pipeline",
      cta: "Start free trial",
      f1: "14-day validity",
      f2: "3 build credits",
      f3: "Core module & class encryption",
      f4: "Single-machine binding",
      f5: "Trial watermark on artifacts",
      f6: "No native runtime, product license issuance or CI"
    },
    pro: {
      name: "Pro",
      tag: "Most popular",
      price: "¥299",
      period: "/ seat / year",
      desc: "For independent developers and small teams",
      cta: "Buy Pro",
      f1: "100 local builds per month",
      f2: "Three cipher suites",
      f3: "Native runtime (Python)",
      f4: "Product license issuance",
      f5: "Customer watermark and edition tag",
      f6: "Python + Java targets",
      f7: "Maven plugin and CLI",
      f8: "Email support (1 business day)"
    },
    ent: {
      name: "Enterprise",
      tag: "At scale",
      price: "¥599",
      period: "/ seat / year · min. 5 seats",
      desc: "For teams that need offline operation and audit",
      cta: "Contact sales",
      f1: "Everything in Pro",
      f2: "Offline activation and responses",
      f3: "CI tokens and pipeline nodes",
      f4: "Revocation lists and build audit",
      f5: "HSM / KMS signing integration",
      f6: "Private deployment support",
      f7: "Priority support (4-hour response)",
      f8: "Custom delivery and SLA"
    },
    note: "Prices are in CNY (¥), billed annually. Final pricing, taxes and SLA are set by the sales contract. Trial capabilities are subject to policy limits.",
    guarantee1: "Invoices available",
    guarantee2: "Bank transfer supported",
    guarantee3: "Commercial EULA"
  },
  faq: {
    eyebrow: "FAQ",
    title: "What you may want to know before buying.",
    q1: "Does encryption slow down startup?",
    a1: "Java AES-GCM uses AES-NI; decrypting thousands of classes typically takes tens of milliseconds. The real cost is disk I/O, and CodeShield reads through a shared JarFile. Python decrypts modules lazily, so unused modules cost nothing.",
    q2: "Does it support Spring Boot?",
    a2: "Yes. Stub mode is the default and preserves fields, method signatures and annotations, so component scanning, dependency injection, configuration binding, JPA and Actuator all work. We have run a real Spring Boot 3.2 fat jar regression.",
    q3: "Which Python and Java versions are supported?",
    a3: "Python targets CPython 3.12 and has been validated on Django projects. Java target bytecode covers JDK 8–21; the builder recommends JDK 11 or 17+. Spring Boot 3.2 on JDK 11 and JDK 17 has been verified.",
    q4: "Does renewal require a rebuild?",
    a4: "No. Java artifacts only need a new jshield.lic; Python artifacts replace pyshield.lic. The business jar and protected copies stay untouched, and machine-binding records are preserved.",
    q5: "Can it stop all reverse engineering?",
    a5: "No in-process protection can. CodeShield blocks direct decompilation, tampering and unauthorized runs, raising the cost to the level of writing an agent, using JVMTI or analyzing memory.",
    q6: "Can it run fully offline?",
    a6: "Yes. Runtime only verifies and decrypts locally and never calls home. Enterprise adds offline activation requests and signed responses for intranets and isolated environments.",
    q7: "Can one license cover both Python and Java?",
    a7: "Yes. Both engines share license fields and the machine-fingerprint algorithm, so one tool license unlocks both targets.",
    q8: "How is the purchase delivered?",
    a8: "After payment we issue a tool license and send your download link; import it and you're ready. Enterprise supports contracts, bank transfer, invoices and custom SLAs."
  },
  cta: {
    title: "Ready to ship your next black box?",
    lead: "A 14-day free trial. Your first protected build in 5 minutes.",
    primary: "Get a trial license",
    secondary: "Book a demo",
    note: "Or email us directly: hello@codeshield.dev"
  },
  footer: {
    tagline: "Build-time code protection and license delivery for Python and Java.",
    product: "Product",
    product1: "Capabilities",
    product2: "Build lab",
    product3: "Security",
    product4: "Pricing",
    resources: "Resources",
    resources1: "FAQ",
    resources2: "Documentation",
    resources3: "System status",
    resources4: "Changelog",
    company: "Company",
    company1: "Contact",
    company2: "Privacy policy",
    company3: "End-user license agreement",
    rights: "All rights reserved.",
    made: "Designed for teams that ship real software."
  },
  legal: {
    privacy: {
      title: "Privacy policy",
      body: "<p>This website is a static page. It does not use tracking cookies or collect personal data. Your theme and language preferences are stored only in your browser's localStorage. When you contact us by email, we use that information solely to answer your inquiry.</p><p>This policy will be updated when the licensing portal launches, and we will ask for your consent before collecting any account or machine information.</p>"
    },
    eula: {
      title: "End-user license agreement",
      body: "<p>CodeShield is licensed under a commercial software license. Tool licenses are issued per seat and term, and unauthorized redistribution is prohibited; buyers retain the right to distribute protected artifacts.</p><p>The complete terms are governed by the LICENSE delivered with the tool and by the sales contract. For an official copy, contact hello@codeshield.dev.</p>"
    }
  },
  toast: {
    soon: "This page is coming soon",
    copied: "Copied to clipboard",
    emailCopied: "Email copied"
  },
  mailto: {
    trialSubject: "CodeShield trial request",
    proSubject: "CodeShield Pro purchase",
    enterpriseSubject: "CodeShield Enterprise inquiry",
    demoSubject: "CodeShield demo request"
  }
};

export default en;
