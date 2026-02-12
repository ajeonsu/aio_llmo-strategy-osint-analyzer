
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white py-8 border-b border-slate-700">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          AI検索・回答最適化 <span className="text-blue-400">戦略分析スタジオ</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
          「AIに選ばれ、引用されるブランド」へ。
          公開情報の分析を通じて、SearchGPTやPerplexity等の生成AI検索に強い構造を設計します。
        </p>
      </div>
    </header>
  );
};

export default Header;
