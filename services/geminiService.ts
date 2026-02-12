import { AnalysisInput } from "../types";
import { ENV } from "../config";

export const runAioAnalysis = async (input: AnalysisInput): Promise<string> => {
  try {
    const response = await fetch(`${ENV.API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Analysis failed');
    }

    return data.data.result;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    throw new Error(error.message || 'ネットワークエラーが発生しました。バックエンドAPIに接続できません。');
  }
};

// Optional: Fetch analysis history
export const fetchAnalysisHistory = async (limit: number = 10, offset: number = 0) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/api/history?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data.analyses : [];
  } catch (error) {
    console.error("Fetch History Error:", error);
    return [];
  }
};

// Optional: Get specific analysis by ID
export const getAnalysisById = async (id: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/api/analysis/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch analysis: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Get Analysis Error:", error);
    return null;
  }
};
