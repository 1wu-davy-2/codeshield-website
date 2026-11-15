# 三项目 Logo：设计说明与生成话术 v2

替代上一版话术。上一版你已经在 Grok 里跑过，结果不合格——先把原因说清楚，再给能用的东西。

---

## 0. 上一版为什么失败

不是「Grok 生图不行」，也不完全是「话术太弱」，是三个问题叠在一起：

| 问题 | 具体表现 | 你看到的后果 |
| --- | --- | --- |
| **描述的是构造，不是结果** | 写「由左右两枚尖括号变形拼合」 | 模型不知道拼合后长什么样，直接画了两个实心三角箭头 |
| **单个图标塞了太多元素** | 盾 + 蛇 + 眼 + 负空间 + 渐变 | 蛇被简化成一坨白块，眼睛变成一个洞 |
| **符号依赖造型功力** | 「盘成 S 的蛇，尾巴收成括号」 | 文生图没有几何约束，蛇必然退化成水滴/钩子 |

**结论**：logo 属于「精确几何」，文生图模型（Grok / MJ / SD 都一样）在这类任务上的成功率本来就只有两三成，靠堆词救不回来。要么给参考图做图生图，要么直接让文本模型写 SVG。

---

## 1. 最终设计（矢量稿已出）

三个文件在 `docs/brand/`，都是 64 网格的干净路径，可直接改色、导出、打包：

| 文件 | 用途 |
| --- | --- |
| `codeshield.svg` / `.png` | 官网、GitHub 组织头像、商务物料 |
| `pyshield.svg` / `.png` | 桌面构建器图标、README、安装包 |
| `javashield.svg` / `.png` | JavaShield 工具、Maven 插件文档 |
| `preview.html` | 三标并排 + 深色底预览 |
| `qa.html` | 64 / 32 / 16px 真实尺寸测试 |

### 设计逻辑

同一枚盾牌（同一段路径）、同一套平涂渐变、同一个 12% 安全边距。差异只在中庭符号和色相：

| 项目 | 中庭符号 | 主色 | 一句话 |
| --- | --- | --- | --- |
| **CodeShield** | 无符号，盾被一条斜缝分成两块，右块下沉 1px | `#2B5BFF → #22D3EE` 蓝→青 | 一个盾，两块板，护住两条产品线 |
| **PyShield** | 白色 `‹ ›` 双尖括号 | `#4B63E8 → #7A5AF8` 靛→紫 | 代码被封进盾里（沿用已发布的标） |
| **JavaShield** | 白色圆角方块 + 琥珀色锯齿裂缝 | `#0E9F6E → #0B6E5A` 玉绿→深青 | 类文件在加载前被劈开解密 |

> **关于 PyShield 的蛇**：我按「盾 + 蛇」连画了 5 版，在 64 网格内蛇头必然退化成水滴、葫芦或鸟头，16px 下完全读不出（文生图出的那版更糟，是一团白块）。所以 PyShield 保留已发布的括号标——它已经印在 exe、安装包和文档里，改动成本也最低。真要做蛇，得让人用钢笔工具画路径，不能靠生成。

---

## 2. 四条路线（按可靠性排序）

| 路线 | 做法 | 成功率 | 适用 |
| --- | --- | --- | --- |
| **A. 改矢量** | 直接拿 `docs/brand/*.svg` 改 | 100% | 现在就能用 |
| **B. 让文本模型写 SVG** | 把第 4 节的 spec 给 Claude / GPT / Kimi | 高 | 想换造型但保持几何精确 |
| **C. 图生图** | 拿 SVG 导出的 PNG 当参考图，低重绘幅度 | 中 | 想探索变体 |
| **D. 纯文生图** | 第 3 节话术 | 低 | 只找灵感，别指望直接出成品 |

---

## 3. 话术 v2（给图像模型）

### 3.1 三句话公式

比上一版有效的写法，是把「怎么构造」换成「画面里有几个形状、每个在哪、多大」：

```
① 主体 + 形状数量        "a shield, and nothing else inside it"
② 每个形状的位置与比例    "two brackets, 15 units tall, 6 units apart, centered"
③ 颜色 + 风格 + 禁忌      "one gradient, flat, no stroke, no shadow, no text"
```

三个硬约束，每个 prompt 都要写：

- **"exactly N shapes"**——不写数量，模型一定加装饰；
- **"readable at 16 px"**——模型会主动简化细节；
- **"no text, no letters, no numbers"**——括号形状极容易被脑补成字母。

### 3.2 CodeShield（母品牌）

```
Flat vector app icon, 512x512, square.
EXACTLY ONE object: a shield, split into two plates by a 3px diagonal gap that runs
from top-left to bottom-right. The right plate is shifted 1px downward, so the two
plates read as pieces of one shield, not as a broken object.
Both plates share ONE linear gradient at 135 degrees: #2B5BFF at top-left to #22D3EE
at bottom-right. Nothing else inside the shield: no symbol, no letter, no dot.
Crisp geometry, sharp corners, generous 12% margin, transparent background.
Flat color only: no stroke, no shadow, no highlight, no bevel, no 3D, no texture.
Must stay readable at 16px. No text, no letters, no numbers, no watermark, no border.
--ar 1:1 --style raw --v 6.1
```

### 3.3 PyShield

```
Flat vector app icon, 512x512, square.
EXACTLY THREE elements: one shield, two angle brackets.
The shield is filled with a 135-degree linear gradient, #4B63E8 to #7A5AF8.
Inside it, two mirrored angle brackets form a wide  < >  pair: 15 units tall,
5.8 units of horizontal reach each, 6 units of empty space between them,
both drawn as 3.6-unit white strokes with round caps and round joins,
vertically centered in the shield.
Nothing else: no code slash, no dot, no letter, no third bracket.
Crisp geometry, 12% margin, transparent background.
Flat color only: no stroke outline, no shadow, no glow, no 3D, no texture.
Must stay readable at 16px. No text, no letters, no numbers, no watermark.
--ar 1:1 --style raw --v 6.1
```

### 3.4 JavaShield

```
Flat vector app icon, 512x512, square.
EXACTLY THREE elements: one shield, one white rounded square, one amber crack.
Shield filled with a 135-degree gradient, #0E9F6E to #0B6E5A.
Centered on it, a pure white rounded square (20 units, 4.6 corner radius).
Through that square runs a single amber #F5A524 zigzag crack, 2.6 units thick,
from the top edge to the bottom edge, with two kinks and one short branch.
Nothing else: no letter, no coffee cup, no gear, no circuit lines, no glow.
Crisp geometry, 12% margin, transparent background.
Flat color only: no stroke outline, no shadow, no highlight, no 3D, no texture.
Must stay readable at 16px. No text, no letters, no numbers, no watermark.
--ar 1:1 --style raw --v 6.1
```

### 3.5 中文版（即梦 / 豆包 / 通义）

```
生成一枚 512×512 的扁平矢量应用图标，方块构图。
画面里只有三个元素：一枚盾牌、一个白色圆角方块、一条琥珀色裂缝。
盾牌填充 135 度线性渐变，从 #0E9F6E 到 #0B6E5A。
盾牌正中是一个纯白圆角方块，边长 20 单位、圆角 4.6 单位。
方块被一条 #F5A524 的琥珀色锯齿裂缝从上到下贯穿，缝宽 2.6 单位，两个折点、一条短分支。
除这三个元素外不要任何东西：不要字母、不要咖啡杯、不要齿轮、不要电路线、不要发光。
边缘锐利、几何精确、四周留 12% 留白、透明背景。
纯平涂：无描边、无阴影、无高光、无立体、无材质噪点。缩到 16px 仍要能认出。
画面中不要出现任何文字、字母、数字、水印、边框。
```

### 3.6 一次出六个方向（找灵感用）

```
Generate 6 different logo directions for a code-protection product called JavaShield,
arranged in a 3x2 grid, each cell a separate 512x512 flat vector icon on white.
All six must share the same palette (#0E9F6E, #0B6E5A, #F5A524) and the same shield
silhouette; only the symbol inside changes:
1 cracked class block, 2 stacked plates, 3 broken seal ring, 4 keyhole in a byte grid,
5 split hexagon, 6 shield with a single vertical byte slot.
Flat color, no gradients inside the symbols, no text, no 3D.
```

---

## 4. 让文本模型直接写 SVG（推荐路线 B）

比图像模型靠谱得多。把下面这段直接发给 Claude / GPT / Kimi，让它输出 SVG 源码，再微调数值：

```
你是矢量图标设计师。请输出一个可直接保存为 .svg 的文件，要求：

- viewBox="0 0 64 64"，width/height 64
- 只用 path / rect / circle 和 linearGradient，不要 <image>、不要 base64
- 图形必须在 11..53 的 x 范围内、6..57 的 y 范围内居中
- 盾牌路径固定为：
  M32 6.6 52.4 13.6V31.4C52.4 43.4 43.8 52.4 32 56.4 20.2 52.4 11.6 43.4 11.6 31.4V13.6Z
- 渐变 135 度：#0E9F6E → #0B6E5A

在盾牌中庭放一个白色圆角方块（x 21.9 y 19.4 宽高 20.2，圆角 4.6），
再用一条 stroke-width 2.6 的琥珀 #F5A524 折线从上到下贯穿它，两个折点，端点为圆头。
不要任何文字节点。输出完整 SVG，不要解释。
```

改配色只要替换两个色值；改盾形只要换那一条 path；改符号就改中庭那两行。

---

## 5. 通用负面词

```
中文：写实、3D、立体、投影、内发光、外发光、玻璃、金属、噪点、颗粒、笔刷、手绘、拟物、
文字、字母、数字、拼音、水印、边框、背景图案、多个 logo 并排、样机 mockup、多余装饰。

English: photorealistic, 3D render, bevel, emboss, drop shadow, inner glow, outer glow,
glassmorphism, metallic, noise, grain, brush texture, hand-drawn, skeuomorphic, text,
letters, numbers, watermark, border, background pattern, multiple logos, mockup,
extra ornaments, gradient mesh, lens flare.
```

---

## 6. 验收

| 检查 | 通过标准 |
| --- | --- |
| 16px | 只剩一个可辨认的形状，不糊成一团（用 `qa.html` 看） |
| 单色 | 去色后三个标仍能区分，不能只靠颜色 |
| 家族 | 三个并排，第一眼像同一家公司的三条产品线 |
| 负空间 | 镂空在深色背景上反转后依然干净 |
| 形状数 | 每个标不超过 3 个可数元素，多了就是没简化到位 |
| 可矢量化 | 边缘是硬几何边，没有羽化、没有半透明过渡 |

---

## 7. 落地

1. `docs/brand/*.svg` 就是源文件，直接用 Figma / Illustrator 打开就能改；
2. 需要 ICO：PyShield 走 `python tools/make_icon.py`，把 `gui/assets/logo.svg` 换成新文件后重跑；
3. 官网替换点：`website/public/assets/img/favicon.svg` + `index.html` 里的 `#i-logo` symbol；
4. 深色版不用另画：图形本身是纯白/渐变，深色底直接用（`preview.html` 下半部分就是效果）；
5. 单色版：把 `fill="url(#xx)"` 换成 `fill="#0B1220"`，白色部分换 `#fff` 或镂空。
