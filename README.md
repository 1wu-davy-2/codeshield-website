# CodeShield 官网

CodeShield 的产品官网：Python / Java 构建期加密、运行期解密与 Ed25519 授权交付。

技术栈：**React 18 + Vite 5**，无运行时外部依赖。纯静态构建产物，可直接部署到任意静态托管。

## 本地运行

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # 输出 dist/
npm run preview    # 预览构建产物 http://127.0.0.1:4173
```

> 不要直接双击 `index.html`：Vite 使用 ES Module，需要通过本地服务器打开。

## 目录结构

```
index.html                  HTML 入口、SEO/OG 元数据、主题与语言引导脚本、SVG sprite
public/assets/img/          favicon 与 og-cover.png（1200×630）
src/main.jsx                React 入口
src/App.jsx                 页面组合与全局交互
src/components/             Header / Hero / 各内容区块 / Footer / 弹窗
src/i18n/                   中、英、日、韩四份词典与语言 Provider
src/lib/hooks.js            主题、滚动 reveal、剪贴板等
src/styles.css              全站设计系统（浅色 / 深色主题）
.github/workflows/deploy.yml GitHub Pages 自动构建与部署
.qa/                        本地视觉 QA 脚本（不参与构建，未纳入仓库）
legacy-static/              迁移前的原生 HTML/CSS/JS 备份（不参与构建，未纳入仓库）
```

## 国际化

- 词典：`src/i18n/zh.js`、`en.js`、`ja.js`、`ko.js`
- 新增文案时同时补齐四份词典；`t("section.key")` 缺失时会回退英文，再回退中文。
- 语言检测顺序：URL `?lang=zh|en|ja|ko` → `localStorage["cs-lang"]` → 浏览器语言。
- 支持 `?lang=zh-Hans`、`zh-CN` 等写法，统一映射到 `zh-Hans`。
- 页面使用对应语言字体：
  - 简中：PingFang SC / Microsoft YaHei / Noto Sans SC
  - 日文：Hiragino Sans / Yu Gothic UI / Noto Sans JP
  - 韩文：Noto Sans KR / Malgun Gothic
- 韩文启用 `word-break: keep-all`，避免单词中间断行。

## 主题

- 默认跟随系统；可在右上角切换浅色 / 深色。
- 持久化键：`localStorage["cs-theme"]`
- 预览指定主题：`?theme=light` / `?theme=dark`
- 首屏在 `<head>` 内联脚本中恢复主题，避免闪烁。

## 产品截图替换

「操作界面」区块会根据当前站点主题自动加载深色 / 浅色截图，存在时替换内置示意图，不存在时显示交互式示意界面，不会出现裂图：

- 深色：`public/assets/img/product/{python,java}-workbench-dark.png`
- 浅色：`public/assets/img/product/{python,java}-workbench-light.png`
- 回退：`public/assets/img/product/{python,java}-workbench.png`

当前已提供 Python / Java 各深色、浅色两套截图，切换右上角主题即可自动轮动。截图规格和可直接转发给设计同事的话术见 [`docs/product-media-brief.md`](docs/product-media-brief.md)。

## 当前占位项

- 邮件地址：`hello@codeshield.dev`、`sales@codeshield.dev`
- 购买、试用、预约演示均通过 `mailto:` 打开本地邮件客户端
- 技术文档 / 系统状态 / 更新日志按钮暂时提示“即将上线”
- 价格：试用 ¥0 / 专业 ¥299 / 企业 ¥599（按年、按席位，最终以合同为准）
- 未实现真实支付、账号、许可证签发；后续授权系统建议放在同级 `licensing-portal/` 目录，官网通过 API 或独立入口接入。

## GitHub Pages

仓库推送到 `main` 后会通过 Actions 自动构建并部署 `dist/`。首次部署需要在 GitHub：

`Settings → Pages → Build and deployment → Source → GitHub Actions`

## QA

QA 脚本与视觉截图保存在本地 `.qa/` 目录，属于开发辅助文件，未纳入仓库。
