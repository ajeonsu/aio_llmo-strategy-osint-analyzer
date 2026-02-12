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
  id: string;
  input: AnalysisInput;
  result: string;
  timestamp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
