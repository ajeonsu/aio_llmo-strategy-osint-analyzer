
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AnalysisReport from './components/AnalysisReport';
import AuthModal from './components/AuthModal';
import { AnalysisInput } from './types';
import { runAioAnalysis } from './services/geminiService';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut, getAuthToken } = useAuth();

  const handleAnalysisSubmit = useCallback(async (input: AnalysisInput) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('認証トークンの取得に失敗しました。');
      }

      const markdown = await runAioAnalysis(input, token);
      setResult(markdown);
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('Unauthorized')) {
        setError('ログインが必要です。再度ログインしてください。');
        setShowAuthModal(true);
      } else {
        setError(err.message || '分析中にエラーが発生しました。バックエンドAPIへの接続を確認してください。');
      }
    } finally {
      setLoading(false);
    }
  }, [user, getAuthToken]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header 
        user={user} 
        onSignIn={() => setShowAuthModal(true)} 
        onSignOut={signOut} 
      />
      
      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {!result && (
          <div className="mb-12">
            <div className="bg-blue-600 rounded-2xl p-6 mb-10 text-white shadow-xl flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white/20 p-4 rounded-xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 21l3-1 3 1-.75-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">AI時代のブランド露出戦略を策定する</h3>
                <p className="text-blue-100 text-sm md:text-base opacity-90 leading-relaxed">
                  検索ユーザーが「AIの回答」を信じる時代。あなたのブランドがAIに「信頼できる情報源」として参照されるための設計図を公開情報から作成します。
                  URLやプレスリリースを入力するだけで、AIの引用アルゴリズムを考慮した具体的なアクションプランを提案します。
                </p>
              </div>
            </div>
            
            <InputForm onSubmit={handleAnalysisSubmit} isSubmitting={loading} />
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {result && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <button 
                onClick={() => setResult(null)}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 px-4 py-2 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                入力フォームに戻る
              </button>
            </div>
            <AnalysisReport content={result} />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-500 py-10 mt-auto border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 AI Search Strategy Studio. このツールは公開情報のみを使用して分析を行っています。</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
