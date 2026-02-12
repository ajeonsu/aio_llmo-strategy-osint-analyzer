
export interface AnalysisInput {
  brandName: string;
  officialUrls: string;
  additionalUrls: string;
  competitors: string;
  goal: string;
  conditions: string;
  extraNotes: string;
}

export interface AnalysisResult {
  rawMarkdown: string;
  scores: Record<string, number>;
}

export enum Category {
  A = "A. 権威性・信頼",
  B = "B. 引用されやすさ",
  C = "C. 参照される分布",
  D = "D. クエリ網羅",
  E = "E. ナレッジ資産",
  F = "F. エンティティ設計",
  G = "G. PR/ニュース運用",
  H = "H. 技術的土台"
}
