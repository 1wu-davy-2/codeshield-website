import CONTENT from "./content.json";
import { DOCS_PAGE_IDS, docsHref, docsPageHref } from "./routes.js";

export { docsHref, docsPageHref, isDocsPage } from "./routes.js";

export const DOCS_GITHUB = "https://github.com/1wu-davy-2/PyShield";
export const DOCS_VERSION = "v0.6.0";

/** Sidebar structure, mirroring the prototype's NAV array. */
export const DOCS_NAV = [
  {
    title: "开始",
    items: [
      { page: "index", title: "介绍" },
      { page: "quick-start", title: "快速开始" }
    ]
  },
  {
    title: "构建",
    items: [
      { page: "build", title: "构建配置" },
      { page: "runtime", title: "密码套件与运行时" },
      { page: "integrity", title: "完整性清单" }
    ]
  },
  {
    title: "授权",
    items: [{ page: "licensing", title: "许可证与机器绑定" }]
  },
  {
    title: "交付",
    items: [
      { page: "deploy", title: "部署与验证" },
      { page: "deploy", anchor: "troubleshooting", title: "常见故障" }
    ]
  },
  {
    title: "安全",
    items: [{ page: "security", title: "安全模型与边界" }]
  }
];

export const DOCS_ORDER = DOCS_PAGE_IDS;

export function docsPage(pageId) {
  return CONTENT[pageId] || CONTENT.index;
}

/** Flat list of sidebar entries without the anchor duplicates. */
export function docsPageSequence() {
  const seen = new Set();
  const list = [];
  DOCS_NAV.forEach((group) => {
    group.items.forEach((item) => {
      if (item.anchor || seen.has(item.page)) return;
      seen.add(item.page);
      list.push({ page: item.page, title: docsPage(item.page).title, group: group.title });
    });
  });
  return list;
}
