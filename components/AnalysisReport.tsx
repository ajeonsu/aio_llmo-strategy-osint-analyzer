
import React from 'react';

interface AnalysisReportProps {
  content: string;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ content }) => {
  // Simple markdown renderer that strips * and ** stars and formats sections
  const renderContent = (text: string) => {
    // Aggressively strip any single or double asterisks used for bold/italic formatting
    const cleanText = text.replace(/\*/g, '');

    return cleanText.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold text-slate-900 border-l-4 border-blue-600 pl-4 mt-12 mb-6">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-semibold text-slate-800 mt-8 mb-4">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 mb-2 text-slate-700 list-disc">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2"></div>;
      }
      return <p key={i} className="mb-4 text-slate-600 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-8 md:p-12 mb-20 animate-fade-in">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">公開情報・戦略分析レポート</h2>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-sm">Target: AI Search / LLM Optimization Strategy</p>
        </div>
      </div>

      <div className="prose max-w-none">
        {renderContent(content)}
      </div>

      <div className="mt-16 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          戦略家のアドバイス
        </h4>
        <p className="text-slate-600 text-sm leading-relaxed">
          このレポートは、インターネット上に公開されている情報をAIが分析し、その「引用されやすさ」を推論したものです。
          どなたでも理解・実行できるよう、専門的な技術コードを排除し、具体的な手順としてまとめています。
        </p>
      </div>
    </div>
  );
};

export default AnalysisReport;
