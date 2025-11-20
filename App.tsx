import React, { useState, useCallback } from 'react';
import { getRecommendations } from './services/geminiService';
import type { Recommendation, SearchOptions } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import RecommendationCard from './components/RecommendationCard';

const TIME_OPTIONS = [
  { id: 'breakfast', label: '早餐' },
  { id: 'brunch', label: '早午餐' },
  { id: 'lunch', label: '午餐' },
  { id: 'afternoon', label: '下午茶' },
  { id: 'dinner', label: '晚餐' },
  { id: 'latenight', label: '宵夜' },
];

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  
  // Search State
  const [selectedTime, setSelectedTime] = useState<string>('lunch');
  const [searchStyle, setSearchStyle] = useState<string>('');

  const handleFindPlaces = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    setLoadingMessage('正在獲取您的位置...');

    if (!navigator.geolocation) {
      setError('您的瀏覽器不支援地理定位功能。');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const timeLabel = TIME_OPTIONS.find(t => t.id === selectedTime)?.label || '';
        setLoadingMessage(`AI 正在搜尋附近的${timeLabel}${searchStyle ? `「${searchStyle}」` : ''}地點...`);
        
        try {
          const options: SearchOptions = {
            time: timeLabel,
            style: searchStyle
          };

          const result = await getRecommendations({ latitude, longitude }, options);
          setRecommendations(result.recommendations);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : '發生未預期的錯誤');
        } finally {
          setIsLoading(false);
        }
      },
      (geoError) => {
        let errorMessage = '獲取位置時發生錯誤。';
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = '位置權限被拒絕。請在瀏覽器設定中允許存取位置。';
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = '無法取得位置資訊。';
            break;
          case geoError.TIMEOUT:
            errorMessage = '獲取位置逾時。';
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      }
    );
  }, [selectedTime, searchStyle]);

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center py-8 lg:py-12 space-y-4">
          <div className="inline-block mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold tracking-wide border border-amber-500/30 uppercase">
              Gemini AI 智能嚮導
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            探索附近的 <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">美味與飲品</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            自訂您的用餐時段與風格，AI 為您精選最佳去處。
          </p>
        </header>

        {/* Main Action Area */}
        <main className="flex-grow flex flex-col items-center w-full max-w-6xl mx-auto">
          
          {/* Search Controls - Only show if not loading */}
          {!isLoading && !recommendations && (
            <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl mb-12 animate-fade-in-up">
              
              {/* Time Selection */}
              <div className="mb-8">
                <label className="block text-slate-300 text-sm font-medium mb-4 text-center">
                  您想在什麼時段用餐？
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedTime(option.id)}
                      className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedTime === option.id
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 transform scale-105'
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Input */}
              <div className="mb-8">
                <label className="block text-slate-300 text-sm font-medium mb-4 text-center">
                   您今天想嘗試什麼風格？ (選填)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchStyle}
                    onChange={(e) => setSearchStyle(e.target.value)}
                    placeholder="例如：日式拉麵、安靜咖啡廳、麻辣鍋..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleFindPlaces}
                  className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-full shadow-lg shadow-orange-900/20 hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  開始搜尋
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <LoadingSpinner message={loadingMessage} />}

          {/* Error State */}
          {error && (
            <div className="w-full flex flex-col items-center space-y-6">
              <ErrorDisplay message={error} />
              <button
                  onClick={() => setError(null)}
                  className="text-slate-400 hover:text-white underline decoration-amber-500/50 hover:decoration-amber-500 transition-all"
               >
                  返回重試
              </button>
            </div>
          )}

          {/* Results Display */}
          {recommendations && (
            <div className="w-full animate-fade-in-up">
              
              <div className="flex items-center justify-between mb-8 px-2">
                 <h2 className="text-2xl font-bold text-white flex items-center">
                   <span className="w-1 h-8 bg-amber-500 rounded-full mr-3"></span>
                   為您推薦的精選地點
                 </h2>
                 <button
                    onClick={() => setRecommendations(null)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                 >
                    修改搜尋條件
                 </button>
              </div>

              {/* Cards Grid */}
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {recommendations.map((rec) => (
                    <RecommendationCard key={rec.uri} recommendation={rec} />
                  ))}
                </div>
              ) : (
                 <div className="text-center py-12 text-slate-400 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <p>抱歉，找不到附近的相關地點。</p>
                 </div>
              )}

              {/* Bottom Action */}
              <div className="mt-16 text-center pb-12">
                <button
                    onClick={() => setRecommendations(null)}
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-full border border-slate-700 hover:border-amber-500/50 transition-all duration-300"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    重新設定條件
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
