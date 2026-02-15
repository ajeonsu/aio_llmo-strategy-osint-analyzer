import React from 'react';
import { User } from 'firebase/auth';

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  return (
    <header className="bg-slate-900 text-white py-6 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
          AI検索・回答最適化 <span className="text-blue-400">戦略分析スタジオ</span>
        </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-slate-300">{user?.email}</span>
            </div>
            <button
              onClick={onSignOut}
              className="px-4 py-2 text-sm font-medium text-white border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        <p className="text-slate-400 max-w-2xl text-sm md:text-base">
          「AIに選ばれ、引用されるブランド」へ。
          公開情報の分析を通じて、SearchGPTやPerplexity等の生成AI検索に強い構造を設計します。
        </p>
      </div>
    </header>
  );
};

export default Header;
