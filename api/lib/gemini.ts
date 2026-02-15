import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION = `
あなたは、AI検索最適化（AIO/LLMO）戦略の専門コンサルタントです。
与えられた企業・ブランド情報をもとに、以下の構成で非常に詳細なレポートを作成してください。

【レポート構成】
1) 背景：ChatGPT、Gemini、Perplexityなどの生成AIが検索の主流になりつつある現状と、AIが参照する情報源として選ばれることの重要性を解説。
2) 対象ブランドの現状分析：公式サイトやプレスリリースから読み取れる強み・弱みを整理。
3) 競合との比較：指定されたブランドとの差分を明確化し、AIが参照する可能性を比較。
4) AIに選ばれるための要件：権威性、引用されやすさ、構造化データ、エンティティ設計などの観点を網羅。
5) 目的別の最適化ポイント：集客目的（認知、CV、採用など）に応じた施策の優先順位を提示。
6) リスク分析：業界環境や規制、競争激化などのリスク要因を整理。
7) 具体的実行プラン：誰でも実行可能な形で、タスクリスト形式で段階的に提示。

【出力時の厳守ルール】
- 記号「*」「**」は一切使用禁止（箇条書き、強調含む）
- JSON-LD、HTML、プログラムコードなどのコード断片は含めない
- すべて日本語の自然文で記述
- 長文・詳細な出力を心がける
`;

export const analyzeWithGemini = async (
  brandName: string,
  officialUrls: string,
  additionalUrls: string,
  competitors: string,
  goal: string,
  conditions: string,
  extraNotes: string
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
  });

  const prompt = `
${SYSTEM_INSTRUCTION}

以下の入力情報を踏まえ、AI検索最適化（AIO/LLMO）の戦略分析レポートを作成してください。

分析対象：
1) 対象ブランド：${brandName}
2) 公式URL：${officialUrls || '未指定'}
3) 補足資料/ニュース：${additionalUrls || '未指定'}
4) 比較ブランド：${competitors || '未指定'}
5) 集客の目的：${goal || '未指定'}
6) 業界環境：${conditions || '未指定'}
7) ユーザーからの追加要件：${extraNotes || '特になし'}

【厳守指示】
- 出力は非常に詳細かつ長文で行ってください。
- **記号「*」や「**」は、文中・箇条書き・強調を含め、一切使用しないでください。**
- **JSON-LD、HTML、プログラムコード等のコード断片は一切含めないでください。** 素人でも理解できるよう、すべて具体的な日本語の指示・説明として記述してください。
- 「7) 具体的実行プラン」は、作業手順を誰でもわかる言葉で詳述してください。
- 追加要件（7番）がある場合は、その内容を最優先で分析に反映させてください。
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No text generated from Gemini');
    }

    return text;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to generate analysis: ${error.message}`);
  }
};
