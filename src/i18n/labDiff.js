/* Copy for the lab file-comparison diff controls. */

const labDiff = {
  zh: {
    modesLabel: "对比模式",
    modeSide: "并排",
    modeUnified: "统一",
    modeChanges: "仅差异",
    added: "新增行",
    removed: "删除行",
    statTitle: (add, del) => `+${add} 新增，−${del} 删除`,
    noChanges: "两侧内容一致，没有差异。",
    copyPatch: "复制 diff",
    copied: "diff 已复制",
    compare: "对比",
    unifiedTitle: "统一差异视图",
    changesTitle: "仅显示改动",
    contextNote: "未改动的行已折叠",
    totalLabel: "当前文件"
  },
  en: {
    modesLabel: "Diff mode",
    modeSide: "Split",
    modeUnified: "Unified",
    modeChanges: "Changes only",
    added: "added lines",
    removed: "removed lines",
    statTitle: (add, del) => `+${add} added, −${del} removed`,
    noChanges: "Both sides are identical — no changes.",
    copyPatch: "Copy diff",
    copied: "Diff copied",
    compare: "compare",
    unifiedTitle: "Unified diff",
    changesTitle: "Changed lines only",
    contextNote: "Unchanged lines collapsed",
    totalLabel: "Selected file"
  },
  ja: {
    modesLabel: "差分モード",
    modeSide: "並列",
    modeUnified: "統合",
    modeChanges: "差分のみ",
    added: "追加行",
    removed: "削除行",
    statTitle: (add, del) => `+${add} 追加、−${del} 削除`,
    noChanges: "両側は同一で、差分はありません。",
    copyPatch: "diff をコピー",
    copied: "コピーしました",
    compare: "比較",
    unifiedTitle: "統合差分",
    changesTitle: "変更行のみ",
    contextNote: "未変更の行は折りたたみ",
    totalLabel: "選択中のファイル"
  },
  ko: {
    modesLabel: "비교 모드",
    modeSide: "나란히",
    modeUnified: "통합",
    modeChanges: "변경만",
    added: "추가 행",
    removed: "삭제 행",
    statTitle: (add, del) => `+${add} 추가, −${del} 삭제`,
    noChanges: "양쪽 내용이 같아 차이가 없습니다.",
    copyPatch: "diff 복사",
    copied: "복사되었습니다",
    compare: "비교",
    unifiedTitle: "통합 차이 보기",
    changesTitle: "변경된 줄만",
    contextNote: "변경 없는 줄은 접힘",
    totalLabel: "선택한 파일"
  }
};

export default labDiff;
