# CodeShield 官网

CodeShield 的产品官网：Python / Java 构建期加密、运行期解密与 Ed25519 授权交付。

技术栈：**React 18 + Vite 5**，无运行时外部依赖。纯静态构建产物，可直接部署到任意静态托管。

## 本地运行

```bash
npm install
npm run dev        # http://127.0.0.1:12222
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
src/lib/labData.js          文件对照快照加载与基础校验
src/lib/contact.js          商务联系页内容配置（留空即渲染占位块）
src/components/LabFileExplorer.jsx 左右文件树、逐文件前后对照
src/components/LabPage.jsx   独立「加密构建」工作台页面
src/labForm.css             工作台表单与标签页样式
src/styles.css              全站设计系统（浅色 / 深色主题）
src/docs/                   技术文档模块（正文数据、三栏布局、搜索与文档版式）
scripts/port-docs.py        从 PyShield/docs-site 提取文档正文与搜索索引
public/assets/data/lab/     四份构建快照 JSON（python/java × before/after）
scripts/validate-lab-data.mjs 快照数据校验脚本
docs/lab-file-snapshot-brief.md 文件对照素材交付说明与转发话术
docs/lab-snapshot.schema.json  快照数据 JSON Schema
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

当前已提供 Python / Java 各深色、浅色两套截图，切换右上角主题即可自动轮动。

截图支持点击放大：点卡片任意位置或右下角「点击放大」胶囊，打开原生 `<dialog>` 灯箱查看完整原图（Esc 或点击背景关闭，可另开原图）。灯箱按 1600px 原始宽度封顶，不做放大插值。截图规格和可直接转发给设计同事的话术见 [`docs/product-media-brief.md`](docs/product-media-brief.md)。

## 加密构建工作台

「别只看介绍，亲手运行一次」不再嵌在首页滚动流中，而是独立页面：

- 顶部导航「加密构建」或直接访问 `/#/lab`
- 页面内分「构建配置 / 执行与产物」两个标签页
- 配置页按真实 Python 工作台的信息结构组织：项目与输出、加密选项（算法 / 运行时 / 完整性清单）、许可证（有效期 / 绑定 / 客户）、高级选项
- 点击「开始加密」后自动切到执行与产物；构建完成后左右两侧展开文件树，点击任意源文件即可查看它对应的 stub / 密文 / manifest / license

工作台读取以下四份快照：

- `public/assets/data/lab/python-before.json`
- `public/assets/data/lab/python-after.json`
- `public/assets/data/lab/java-before.json`
- `public/assets/data/lab/java-after.json`

当前四份文件是真实 PyShield / JavaShield demo 构建的快照，`demo: true`，页面显示“演示样本”；替换为真实脱敏构建后把 `demo` 改为 `false`，页面自动显示“真实构建快照”，无需改 React 代码。

配置页里的项目名、运行时、算法、保护模式、许可证和绑定状态会从快照的 `before.project` / `after.build` 同步；目录与指纹为只读演示值。构建动画是交互演示，文件内容以快照为准。

```bash
npm run validate:lab   # 校验四份 JSON、配对关系、敏感字段与大小
```

数据格式、脱敏规则和可直接转发的交付话术：
[`docs/lab-file-snapshot-brief.md`](docs/lab-file-snapshot-brief.md)；JSON Schema：
[`docs/lab-snapshot.schema.json`](docs/lab-snapshot.schema.json)。

## 当前占位项

- 邮件地址：`hello@codeshield.dev`、`sales@codeshield.dev`
- 购买、试用、预约演示均通过 `mailto:` 打开本地邮件客户端
- 系统状态 / 更新日志按钮暂时提示“即将上线”
- 价格：试用 ¥0 / 专业 ¥299 / 企业 ¥599（按年、按席位，最终以合同为准）
- 未实现真实支付、账号、许可证签发；后续授权系统建议放在同级 `licensing-portal/` 目录，官网通过 API 或独立入口接入。

## 技术文档

技术文档以「左侧导航 + 正文 + 右侧本页目录」的三栏结构内嵌在官网里，不再单独部署静态站：

- 入口：顶部导航「文档」，或直接访问 `/#/docs`
- 分页：`#/docs/<page>`，例如 `#/docs/build`、`#/docs/licensing`
- 小节锚点：`#/docs/build#ciphers`（首屏可直接打开）

```
src/docs/
├── content.json        8 个页面的正文 HTML（脚本提取，勿手改）
├── searchIndex.json    搜索索引，href 已改写为站内路由
├── routes.js           路由与页面 id（不引正文，供 App 判断 view）
├── docsData.js         侧栏、上一篇 / 下一篇、页面元信息
├── enhance.js          标题 id、页内链接改写、代码块外壳与语法高亮
├── DocsPage.jsx        三栏布局、TOC 滚动高亮、复制按钮、移动端抽屉
├── DocsSearch.jsx      Ctrl/Cmd + K 搜索弹窗
└── docs-core.css       文档版式，全部作用域限定在 .docs-root
```

更新正文（文档原型改动后重新提取，不要手改 `content.json`）：

```bash
python scripts/port-docs.py                                  # 默认读取 ../PyShield/docs-site
python scripts/port-docs.py --source <docs-site 目录>
```

脚本只搬运 `<template id="page-content">` 内的正文和页面元信息，并重写 `*.html` 链接与搜索 `href`；版式、交互、导航都在 React 侧，与内容解耦。

约定：

- 正文为简体中文。导航、搜索、目录、上一篇 / 下一篇等界面文案走 `docs.*` 词典（中 / 英 / 日 / 韩）；非中文界面会在正文上方提示“技术文档当前仅提供简体中文”。
- 代码块用 `pre[data-file][data-lang]` 声明文件名与语言，`data-highlight="off"` 关闭高亮；复制按钮由 `DocsPage` 事件委托处理。
- 主题复用官网的 `data-theme` 与 `localStorage["cs-theme"]`，文档不再单独保存主题。
- 文档整包按需加载：`DocsPage` 走 `React.lazy`，正文与搜索索引不进营销页首屏 bundle（构建后独立的 `DocsPage-*.js` chunk）。
- 文档页面不渲染营销页脚，改为文档自己的版本行与 GitHub 链接。

## 商务联系页

`#/contact`，顶部导航「联系商务」与页脚「联系我们」都指向这里。

页面内容集中在一个配置文件里，改完即生效，不用动组件：

- `src/lib/contact.js`：`email` / `wechat` / `phone` / `location` / `wechatQr`，以及 `experience`、`shots` 两个列表
- 留空（`""` 或 `[]`）时，页面渲染虚线占位块与「待补充」标记；填上内容后自动切换成正式排版
- 经历条目：`{ period, org, role, summary, points: [] }`；截图条目：`{ src, caption }`
- 二维码与截图放在 `public/assets/img/contact/`，路径写相对 `public` 的地址，例如 `assets/img/contact/wechat-qr.png`
- 页面按需加载（独立 `ContactPage-*.js` chunk），不占首屏体积

## GitHub Pages

仓库推送到 `main` 后会通过 Actions 自动构建并部署 `dist/`。首次部署需要在 GitHub：

`Settings → Pages → Build and deployment → Source → GitHub Actions`

## QA

QA 脚本与视觉截图保存在本地 `.qa/` 目录，属于开发辅助文件，未纳入仓库。
