/**
 * 商务联系页的可替换内容。
 *
 * 所有字段留空（"" / [] ）时，页面渲染带「待补充」标记的占位块；
 * 填上内容后自动切换为真实信息，不需要改组件。
 *
 * 二维码与截图放在 public/assets/img/contact/ 下，路径写相对 public 的地址，
 * 例如 "assets/img/contact/wechat-qr.png"。
 */
export const CONTACT = {
  email: "hello@codeshield.dev",
  wechat: "",
  phone: "",
  location: "",
  wechatQr: "",

  /** 每条：{ period: "2021 — 至今", org: "公司 / 项目", role: "角色", summary: "一句话结果", points: [] } */
  experience: [],

  /** 每张：{ src: "assets/img/contact/shot-1.png", caption: "说明" } */
  shots: []
};

export const EXPERIENCE_SLOTS = 3;
export const SHOT_SLOTS = 3;
