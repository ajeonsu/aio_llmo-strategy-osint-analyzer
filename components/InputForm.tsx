
import React, { useState } from 'react';
import { AnalysisInput } from '../types';

interface InputFormProps {
  onSubmit: (input: AnalysisInput) => void;
  isSubmitting: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<AnalysisInput>({
    brandName: '',
    officialUrls: '',
    additionalUrls: '',
    competitors: '',
    goal: '',
    conditions: '',
    extraNotes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          分析対象の情報を入力
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">対象ブランド名（必須） <span className="text-red-500">*</span></label>
            <input
              required
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              placeholder="例: 株式会社サンプルAI"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">目指すゴール（任意）</label>
            <input
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="例: 資料請求、採用、認知拡大"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900">公式サイトのURL</label>
          <textarea
            name="officialUrls"
            value={formData.officialUrls}
            onChange={handleChange}
            placeholder="https://example.com (複数ある場合は改行して入力)"
            rows={2}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900">その他の参考資料（プレスリリース、記事、SNSなど）</label>
          <textarea
            name="additionalUrls"
            value={formData.additionalUrls}
            onChange={handleChange}
            placeholder="URLや内容を貼り付けてください"
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">比較ブランド</label>
            <input
              name="competitors"
              value={formData.competitors}
              onChange={handleChange}
              placeholder="比較したいブランド名"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">業界・ビジネスモデルの前提</label>
            <input
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              placeholder="例: SaaS、B2B、単価100万円など"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900">自由な要件・追加リクエスト</label>
          <textarea
            name="extraNotes"
            value={formData.extraNotes}
            onChange={handleChange}
            placeholder="特に重点的に分析してほしいポイントや、具体的な悩みなどを自由に記載してください"
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 ${
            isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              分析エンジンを稼働中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              この情報で分析を開始する
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
