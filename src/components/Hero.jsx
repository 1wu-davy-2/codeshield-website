import { useI18n } from "../i18n/index.jsx";
import { Counter, Icon } from "./ui.jsx";

const SOURCE_LINES = [
  ["01", "def calculate_price(user, plan):", "code-purple"],
  ["02", "    price = PLAN_PRICE[plan]", "code-blue"],
  ["03", "    if user.is_enterprise:", "code-purple"],
  ["04", "        return price * 0.82", "code-cyan"],
  ["05", "    return price", "code-blue"]
];

const CIPHER_LINES = ["9F2A 7C11 E84B 0D92", "A77E 31F0 5C2D 8B19", "0D4E F812 6A93 C701", "B28C 44D1 9E07 2F6A"];

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-gridlines" />
        <div className="hero-beam" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-kicker reveal">
            <span className="kicker-mark"><Icon name="shield" className="icon icon-xs" /></span>
            <span>CODE PROTECTION / 01</span>
            <span className="kicker-line" />
            <span className="kicker-status"><i /> LOCAL-FIRST</span>
          </div>
          <h1 className="reveal" style={{ "--d": ".06s" }}>
            <span>{t("hero.title1")}</span>
            <span className="hero-title-accent">{t("hero.title2")}</span>
          </h1>
          <p className="hero-lead reveal" style={{ "--d": ".12s" }}>{t("hero.lead")}</p>
          <div className="hero-actions reveal" style={{ "--d": ".18s" }}>
            <a className="btn btn-primary btn-lg" href="#/lab">
              <Icon name="play" className="icon icon-sm" />
              <span>{t("hero.ctaSecondary")}</span>
              <Icon name="arrow-right" className="icon icon-sm" />
            </a>
            <a className="btn btn-ghost btn-lg" href="#pricing">
              <span>{t("hero.ctaPrimary")}</span>
              <Icon name="arrow-right" className="icon icon-sm" />
            </a>
          </div>
          <ul className="hero-trust reveal" style={{ "--d": ".24s" }}>
            {["hero.trust2", "hero.trust3", "hero.trust1"].map((key) => (
              <li key={key}><Icon name="check" className="icon icon-xs" /><span>{t(key)}</span></li>
            ))}
          </ul>
        </div>

        <div className="hero-visual reveal" style={{ "--d": ".14s" }} aria-label="Source code to ciphertext visualization">
          <div className="visual-index" aria-hidden="true">BUILD / ENCRYPT / SIGN</div>
          <div className="transform-board">
            <div className="transform-head">
              <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
              <span>payment_logic.py</span>
              <span className="transform-live"><i /> LIVE PREVIEW</span>
            </div>
            <div className="transform-body">
              <div className="source-pane">
                <div className="pane-label"><span>INPUT</span><span>PLAIN SOURCE</span></div>
                <div className="source-code">
                  {SOURCE_LINES.map(([number, line, color]) => (
                    <div className="source-line" key={number}>
                      <span className="line-number">{number}</span>
                      <code className={color}>{line}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="shield-core" aria-hidden="true">
                <div className="core-orbit orbit-one" />
                <div className="core-orbit orbit-two" />
                <div className="core-icon"><Icon name="logo" /></div>
                <span className="core-label">AES-256</span>
              </div>

              <div className="cipher-pane">
                <div className="pane-label"><span>OUTPUT</span><span>SEALED</span></div>
                <div className="cipher-code">
                  {CIPHER_LINES.map((line, index) => <code key={line} style={{ "--i": index }}>{line}</code>)}
                </div>
                <div className="cipher-file"><Icon name="lock" className="icon icon-xs" /> payment_logic.cse</div>
              </div>
            </div>
            <div className="transform-foot">
              <span><Icon name="check-circle" className="icon icon-xs" /> Ed25519 signed</span>
              <span><Icon name="cloud-off" className="icon icon-xs" /> 0 bytes uploaded</span>
              <span className="build-time">BUILD 08.42s</span>
            </div>
          </div>
          <div className="hero-float hero-float-a" aria-hidden="true">
            <Icon name="fingerprint" className="icon icon-sm" />
            <div><strong>Machine bound</strong><span>首次运行自动绑定</span></div>
          </div>
          <div className="hero-float hero-float-b" aria-hidden="true">
            <span className="float-check"><Icon name="check" className="icon icon-xs" /></span>
            <div><strong>1,284 / 1,284</strong><span>CLASSES PROTECTED</span></div>
          </div>
        </div>
      </div>

      <div className="container hero-stats reveal">
        <div className="hero-stat"><strong><Counter value={2} /></strong><span>Python + Java<br />双引擎保护</span></div>
        <div className="hero-stat"><strong><Counter value={3} /></strong><span>AEAD 密码套件<br />按场景自由选择</span></div>
        <div className="hero-stat"><strong><Counter value={200} suffix="+" /></strong><span>自动化回归测试<br />覆盖真实框架</span></div>
        <div className="hero-stat"><strong><Counter value={100} suffix="%" /></strong><span>本地构建<br />源码不出设备</span></div>
        <a className="hero-scroll" href="#product" aria-label="Explore products"><span>SCROLL TO EXPLORE</span><Icon name="arrow-right" className="icon icon-sm" /></a>
      </div>
    </section>
  );
}
