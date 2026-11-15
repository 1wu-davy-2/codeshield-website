# CodeShield 官网「文件对照」素材需求（Python × Java）

本文是给 Python / Java 两个实现侧的交付说明。目标不是再做一套演示图，而是把**真实构建产物**接进官网的「文件对照」浏览器：左侧列出原始文件，右侧列出同一文件对应的 stub / 密文 / 清单 / 许可证；用户点击任意文件，就能查看它加密前后的真实内容。

---

## 1. 现在页面里哪些是演示，哪些已经是真的

实验台已从首页滚动区移出，改为顶部导航「加密构建」的独立页面（`/#/lab`），页面内用「构建配置 / 执行与产物」两个标签页切换。我实际跑了一遍表单、构建流程和文件对照。当前状态需要分开看：

| 部分 | 当前状态 | 说明 |
| --- | --- | --- |
| 构建配置表单 | 部分数据驱动 | 已按真实 Python 工作台的信息结构重构：项目与输出、算法 / 运行时 / 完整性清单、许可证有效期 / 绑定 / 客户、高级选项。项目名、运行时、算法、保护模式、license / 绑定会从快照同步；目录与指纹是只读演示值，提交仍为交互演示。 |
| 五阶段进度条、耗时、日志 | 动画演示 | 只表达 Scan → Compress → AEAD → Sign → Emit 的顺序，不是实际 CLI 日志。 |
| 文件对照 | **已实现** | 读取四份 JSON；左右两侧是文件树，点击文件可查看单个文件的加密前 / 加密后内容；在「执行与产物」标签页展示。 |
| 当前文件内容 | 演示快照 | 用真实 PyShield / JavaShield 跑 demo 项目得到的产物，但项目本身是 demo，因此页面显示「演示样本」。 |
| 构建密钥、许可证客户字段 | 已脱敏 | 页面不展示 `*.shield-secret.json` / `*.jshield-secret.json`，Java agent 配置里的 master key 也已替换。 |

这次需要补的，**只是四份 JSON 文档**，不需要再改 React 组件。四份文档放进去后，页面会自动替换当前的演示快照。

---

## 2. 四份文档，放在哪里

以下路径相对官网项目根目录（即 `website/`）。请交付以下四个文件：

```
public/assets/data/lab/python-before.json
public/assets/data/lab/python-after.json
public/assets/data/lab/java-before.json
public/assets/data/lab/java-after.json
```

- `before` = 原始项目快照（明文源码）。
- `after` = 真实保护构建后的快照（stub、密文、manifest、license 等）。
- `demo` 字段：本次素材来自演示项目，填 `true`，页面显示「演示样本」；如果以后换成脱敏的真实项目构建，填 `false`，页面会显示「真实构建快照」。
- 四份文档的 `project.id` 必须成对一致：`python-before.project.id === python-after.project.id`，Java 同理。

一份文档建议控制在 **300 KB 以内**，每侧精选 **6–20 个代表性文件**。不需要把 48 个模块或 1,284 个类全放进来；所有文件都放会让浏览器端文件树失去可读性。选一个核心业务文件、一个配置、一个测试/未加密文件、一个构建期生成文件即可讲清故事。

---

## 3. 数据结构（v1）

完整 JSON Schema 见：

- `docs/lab-snapshot.schema.json`
- 可直接参考当前四份样例：`public/assets/data/lab/*.json`

### 3.1 顶层字段

```json
{
  "schemaVersion": 1,
  "product": "python",
  "stage": "before",
  "demo": true,
  "generatedAt": "2026-11-15T09:12:18Z",
  "project": {
    "id": "erp-portal",
    "name": "ERP Portal",
    "runtime": "CPython 3.12 · Django 5.2",
    "root": "erp-portal",
    "container": "dir",
    "command": "python shield.py build -p ./erp-portal -o ./dist/erp-portal-shielded --cipher chacha-pure -e 2027-12-31 --bind-first-run",
    "secretOmitted": true
  },
  "files": []
}
```

`after` 还要多一个 `build` 对象：

```json
"build": {
  "id": "83f934b6b61ec4e2",
  "tool": "pyshield 0.6.0",
  "algorithm": "ChaCha20-Poly1305",
  "cipher": "chacha",
  "mode": "framework-safe",
  "integrity": "protected",
  "count": 11,
  "unit": "modules",
  "output": "dist/erp-portal-shielded/",
  "license": "pyshield.lic",
  "machineBinding": true,
  "expires": "2027-12-31",
  "createdAt": "2026-11-15T09:12:18Z"
}
```

- `algorithm` 是展示给用户看的算法名，例如 `AES-256-GCM` / `ChaCha20-Poly1305`。
- `count` + `unit` 是结果横幅里的「已保护条目」，例如 `11 modules`、`4 classes`。
- `output` 是结果横幅里的交付路径。
- `project.root` 是文件树标题旁显示的根路径；Java 建议用 `dist/`，因为 jar 和 license 都在这里。
- `container`：普通目录填 `dir`；Java 的 jar 内部结构填 `jar`，页面会提示「JAR 内部条目按目录展开」。
- `secretOmitted: true` 显示「构建密钥不随官网样本发布」。

### 3.2 文件条目

```json
{
  "id": "demo/services/pricing.py",
  "path": "demo/services/pricing.py",
  "kind": "stub",
  "language": "python",
  "bytes": 2109,
  "sha256": "6c59718f8318...64位小写hex...",
  "content": "# PyShield protected module ...",
  "encoding": "text",
  "sourceId": "demo/services/pricing.py",
  "note": "stub: same path, inline Base85 payload",
  "primary": true,
  "truncated": false,
  "redacted": false
}
```

字段约束：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 文档内唯一。`before` 侧用它作为配对键。 |
| `path` | 是 | 页面显示路径。Java 使用虚拟 JAR 路径，如 `demo-1.0.0.jar/BOOT-INF/classes/...`。 |
| `sourceId` | after 侧使用 | 指向 `before` 文件的 `id`；构建期生成的文件（manifest / license / runtime）省略或填 `null`。 |
| `kind` | 是 | `source` `config` `test` `stub` `sidecar` `manifest` `license` `metadata` `binary` `data` `other`。 |
| `language` | 是 | `python` / `java` / `json` / `yaml` / `xml` / `text` / `html` / `properties` 等。 |
| `bytes` | 是 | 原始文件真实大小（不是预览文本长度）。 |
| `sha256` | 是 | 原始文件真实 SHA-256，64 位小写 hex。 |
| `content` | 是 | 展示内容。文本文件放完整内容；二进制放 hexdump；Java stub 放 javap 输出。 |
| `encoding` | 否 | `text`（默认）/ `hexdump` / `javap`。 |
| `primary` | 否 | 同一个源文件有多个产物时，指定默认展示哪一个。 |
| `truncated` | 否 | 二进制预览或长文件被截断时填 `true`，页面会显示截断提示。 |
| `redacted` | 否 | 包含脱敏内容时填 `true`，页面会显示「已脱敏」。 |
| `note` | 否 | 页面展示的技术说明。建议用英文或简短中文；会原样出现在四种语言页面。 |

---

## 4. Python 侧要什么

Python 的真实产物形态和“一个源文件旁边放一个 .pye”不同，请按实际 PyShield 输出准备：

1. **加密前**：`before.files` 放 8–14 个真实 `.py` 文件 + 至少一个配置/测试文件。推荐包含：
   - `manage.py`
   - 一个核心业务模块，例如 `demo/services/pricing.py`
   - `demo/views.py`、`demo/urls.py`、`demo/services/__init__.py`
   - `sampleproj/settings.py`、`sampleproj/urls.py`、`sampleproj/wsgi.py`
   - `requirements.txt`
   - `demo/tests.py`（默认不加密，用来展示“并非所有文件都会变成 stub”）
2. **加密后**：same path 的 `.py` 文件被替换为真实 PyShield stub。stub 的载荷是 **内联 Base85 字符串**，不是独立 sidecar 文件。
   - `kind: "stub"`；`language: "python"`；`encoding: "text"`；`sourceId` 指向同名 before 文件。
   - 直接贴 stub 的实际文本；如果 Base85 载荷很长，可截断并设 `truncated: true`，但要保留 `# PyShield protected module...`、import 行和 `module_id`。
   - `requirements.txt`、`demo/tests.py`、模板文件按实际原样复制；`kind` 分别为 `config` / `test` / `data`。
3. **构建期生成文件**（`sourceId` 留空）：
   - `.pyshield-build.json`（可移除工具许可字段）
   - `.pyshield-manifest.json`（完整 JSON）
   - `pyshield.lic`（二进制 PSX1 envelope；用 hexdump 预览前 160–256 字节）
   - 至少一个 `_shield_runtime/*.pyc`（用 hexdump 预览前 256 字节，展示 runtime 为 sourceless `.pyc`）
4. **不要放**：`<output>.shield-secret.json`、真实工具许可、真实客户名、真实机器指纹、任何签名私钥。

## 5. Java 侧要什么

Java 的产物不是磁盘上一堆 `.class` 和 `.bin` 文件，而是**重新打包后的 jar + 同目录的 license / agent**。请在 JSON 中使用虚拟 JAR 路径：

```
dist/demo-1.0.0.jar/BOOT-INF/classes/...           ← stub .class
dist/demo-1.0.0.jar/META-INF/jshield/p/*.bin       ← AES-GCM payload
dist/demo-1.0.0.jar/META-INF/jshield-manifest.json
dist/demo-1.0.0.jar/META-INF/MANIFEST.MF
dist/jshield.lic
```

1. **加密前**：6–10 个真实 Spring Boot 源文件：
   - `pom.xml`
   - `src/main/resources/application.yml`
   - 4–6 个核心 `.java`（建议至少一个 `@Service` 和一个 `@RestController`）
2. **加密后**：
   - 原 `.class` 路径保留，内容是 metadata stub。请用 `javap -p -c` 的输出作为 `content`，`encoding: "javap"`；`bytes` / `sha256` 用真实 `.class` 文件的值，`kind: "stub"`。
   - `META-INF/jshield/p/*.bin` 用 hexdump 预览前 256–512 字节，`encoding: "hexdump"`，`kind: "sidecar"`，保留真实 `bytes` / `sha256`；`sourceId` 指向对应的 `.java`。
   - `BOOT-INF/classes/application.yml` 是未加密复制，`kind: "config"`，`sourceId` 指向原 `application.yml`。
   - `META-INF/jshield-manifest.json`、`META-INF/MANIFEST.MF`：完整文本，`sourceId` 留空。
   - `jshield-agent.properties`：可以放，但 `master_key=` 必须替换为 `[REDACTED]`，`redacted: true`。
   - `jshield.lic`：不要贴完整 envelope；放解码摘要 + 前 96 字节 hexdump，`redacted: true`、`truncated: true`。
3. **不要放**：`*.jshield-secret.json`、真实 `master_key` / `build_key` / signing seed、真实 customer、机器 ID、生产许可证。

## 6. 二进制与长文件怎么展示

- 二进制文件不要转成 Base64 全文塞进 JSON；用 `hexdump` 预览前 256–512 字节，并保留真实 `bytes` / `sha256`。
- 长文本（manifest、stub Base85 载荷）可以截断，设 `truncated: true`，但至少保留文件头、关键字段和结尾。
- Java `.class` 不要放乱码二进制；放 `javap` 输出，设置 `encoding: "javap"`。页面会显示 `JAVAP` 标签。
- `content` 中不要出现 NUL 字符；validator 会直接报错。

## 7. 安全与脱敏底线

- 只使用 demo 项目或隔离的演示构建，不要用生产客户项目。
- 绝不发布 `*.shield-secret.json` / `*.jshield-secret.json`。
- 绝不发布 master key、build key、签名私钥、真实许可证内容。
- 客户名、邮箱、机器指纹、license id 一律删除或替换。
- 若必须展示 license / agent 配置，`master_key`、`customer`、`fingerprints` 等替换为 `[REDACTED]`，并设 `"redacted": true`。
- 工具自身是 trial/development 版时，不要把 trial 字段放进 `.pyshield-build.json`；只保留 `build_id`、`cipher`、`modules`、`tool` 等中性字段。

## 8. 校验与验收

在官网项目根目录运行：

```bash
npm run validate:lab
```

它会检查：

- 四份文件是否存在、JSON 是否合法；
- `schemaVersion`、`product`、`stage`、`project.id`、`files` 是否完整；
- `before` / `after` 的 `sourceId` 是否都能配对；
- `bytes` / `sha256` / `encoding` / `kind` 是否符合约束；
- 是否误带 `*-secret.json`、`master_key`、`build_key` 等敏感内容。

通过后打开页面：

1. 点击「开始加密」；
2. 等构建完成后，检查左右两侧文件列表；
3. 点击至少一个业务文件，确认右侧能定位到 stub / 密文 / manifest；
4. 点击右栏的生成文件（license / manifest），确认左侧显示“无明文对应文件”；
5. 切换深色 / 浅色和移动端，确认布局正常。

---

## 9. 可直接转发的话术

### 9.1 发给 Python 侧

> **CodeShield 官网文件对照素材（Python）**
>
> 我们正在把官网「文件对照」换成真实构建产物。请用 demo 项目跑一次 PyShield，交付 **2 份 JSON**：
>
> 1. `public/assets/data/lab/python-before.json`
> 2. `public/assets/data/lab/python-after.json`
>
> 请参考：
> - 数据格式：`docs/lab-snapshot.schema.json`
> - 现有样例：`public/assets/data/lab/python-before.json` / `python-after.json`（demo 快照，可复制后替换内容）
>
> 要求：
> 1. 用 demo 项目（建议 `erp-portal`，Django 5.2 / CPython 3.12），不要真实客户项目。
> 2. 加密前选 8–14 个代表性文件：`manage.py`、一个核心业务模块（如 `demo/services/pricing.py`）、`views.py`、`urls.py`、`settings.py`、`requirements.txt`、`demo/tests.py` 等。
> 3. 加密后按真实 PyShield 输出填：同名 `.py` stub（内联 Base85 密文，不是独立 sidecar）、未加密的 `tests.py` / `requirements.txt`、`.pyshield-build.json`、`.pyshield-manifest.json`、`pyshield.lic`、一个 `_shield_runtime/*.pyc`。
> 4. stub 用完整文本；license / pyc 用 hexdump 预览前 256 字节并设 `truncated: true`；`bytes` / `sha256` 用真实文件值。
> 5. 每个 after 文件用 `sourceId` 指向 before 的同名文件；生成文件省略 `sourceId`。核心业务文件设 `"primary": true`。
> 6. **不要**包含 `<output>.shield-secret.json`、真实工具许可、真实客户名、机器指纹或任何签名私钥。`demo` 先填 `true`。
> 7. 在官网项目根目录运行 `npm run validate:lab`，通过后把两份 JSON 放到上述路径。
>
> 如果直接给两个目录（加密前源码目录 + 加密后输出目录）更方便，也可以，但请同时给：build_id、算法、保护模式、模块数、输出路径、license 文件名、是否机器绑定、到期时间，我们这边负责转换。

### 9.2 发给 Java 侧

> **CodeShield 官网文件对照素材（Java）**
>
> 我们正在把官网「文件对照」换成真实构建产物。请用 demo Spring Boot 项目跑一次 JavaShield，交付 **2 份 JSON**：
>
> 1. `public/assets/data/lab/java-before.json`
> 2. `public/assets/data/lab/java-after.json`
>
> 请参考：
> - 数据格式：`docs/lab-snapshot.schema.json`
> - 现有样例：`public/assets/data/lab/java-before.json` / `java-after.json`（demo 快照，可复制后替换内容）
>
> 要求：
> 1. 用 demo Spring Boot 项目（JDK 17 / Spring Boot 3.2），不要真实客户项目。
> 2. 加密前选 6–10 个文件：`pom.xml`、`application.yml`、4–6 个核心 `.java`（至少一个 `@Service` 和一个 `@RestController`）。
> 3. 加密后按真实 jar 内部结构填，使用虚拟路径 `demo-1.0.0.jar/BOOT-INF/classes/...`、`demo-1.0.0.jar/META-INF/jshield/p/*.bin`、`demo-1.0.0.jar/META-INF/jshield-manifest.json`、`demo-1.0.0.jar/META-INF/MANIFEST.MF`，以及 `dist/jshield.lic`。
> 4. `.class` stub 用 `javap -p -c` 输出作为 `content`，`encoding: "javap"`；`bytes` / `sha256` 用真实 `.class` 的值。`.bin` 用 hexdump 前 256–512 字节，`encoding: "hexdump"`，设 `truncated: true`。
> 5. 每个 stub / `.bin` 用 `sourceId` 指向对应的 `.java`；manifest / MANIFEST.MF / license 省略 `sourceId`。核心 service 的 stub 设 `"primary": true`。
> 6. `jshield-agent.properties` 可以放，但 `master_key=` 必须替换为 `[REDACTED]`；`jshield.lic` 只放解码摘要 + 前 96 字节 hexdump，设 `redacted: true`。
> 7. **不要**包含 `*.jshield-secret.json`、真实 master key / build key / signing seed、真实客户名、机器 ID 或生产许可证。`demo` 先填 `true`。
> 8. 在官网项目根目录运行 `npm run validate:lab`，通过后把两份 JSON 放到上述路径。
>
> 如果直接给 jar + license + 源目录更方便也可以，但请写清楚 build_id、算法、保护模式、类数量、输出 jar 路径、license 文件名、是否机器绑定、到期时间。

### 9.3 发给两边都适用的一句话

> 这次不是要再做一张产品截图，而是要四份**可核查的构建快照**：左侧原始文件，右侧真实 stub / 密文 / 清单 / 许可证。核心要求是“点击哪个源文件，就能看到它对应的真实产物”。所有密钥、客户信息和机器指纹都要脱敏；不要把 `*-secret.json` 放进官网。

---

## 10. 当前样例与替换后的效果

当前 `public/assets/data/lab/` 下已经有一组可运行的样例：

| 文档 | 内容 | 来源 |
| --- | --- | --- |
| `python-before.json` / `python-after.json` | erp-portal，11 modules，ChaCha20-Poly1305 | 真实 PyShield 0.6.0 demo build |
| `java-before.json` / `java-after.json` | spring-boot-demo，4 classes，AES-256-GCM | 真实 JavaShield protected Spring Boot demo jar |

这组样例的 `demo` 为 `true`，页面显示「演示样本」。把上述四份真实文档替换进来，并把 `demo` 改为 `false`，页面会自动切换为「真实构建快照」，不需要改 React 代码。

如果替换后的文件名 / 项目名与当前样例不同（例如 Java 侧坚持用 `order-service`），无需改前端：页面里的项目卡片、构建 ID、算法、输出路径和文件树都读取 `before.project` / `after.build` / `after.files`。只有 `src/components/EncryptionLab.jsx` 里的 `PRODUCTS` 静态兜底数据需要同步一下项目名和运行时，避免加载前的闪烁文案不一致。
