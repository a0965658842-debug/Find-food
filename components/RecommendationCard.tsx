import React, { useMemo } from 'react';
import type { Recommendation } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  
  // Helper to determine a relevant image based on keywords in the title
  // Since we cannot get real photos without a separate Places API Key, we use a rich set of high-quality contextual images
  const imageUrl = useMemo(() => {
    const titleLower = recommendation.title.toLowerCase();
    
    const images = {
      // Drinks
      boba: "https://images.unsplash.com/photo-1558855410-3112e253d755?auto=format&fit=crop&w=800&q=80",
      coffee: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80", 
      juice: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=800&q=80",
      bar: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80", // Cocktails/Bar
      
      // Asian Food
      sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
      ramen: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
      hotpot: "https://images.unsplash.com/photo-1549048085-bab2f1f49f65?auto=format&fit=crop&w=800&q=80", // Close enough to hotpot/soup
      dimsum: "https://images.unsplash.com/photo-1496116218417-1a781b1c423c?auto=format&fit=crop&w=800&q=80",
      thai: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80",
      korean: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?auto=format&fit=crop&w=800&q=80",

      // Western Food
      burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      pizza: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
      pasta: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
      steak: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
      brunch: "https://images.unsplash.com/photo-1533089862017-5614ec87e25c?auto=format&fit=crop&w=800&q=80",

      // Generic
      dessert: "https://images.unsplash.com/photo-1563729768-74915bd6c276?auto=format&fit=crop&w=800&q=80",
      generic: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
    };

    // Drink keywords
    if (titleLower.includes('茶') || titleLower.includes('tea') || titleLower.includes('bubble') || titleLower.includes('boba') || titleLower.includes('milk')) return images.boba;
    if (titleLower.includes('cafe') || titleLower.includes('coffee') || titleLower.includes('咖啡') || titleLower.includes('starbucks')) return images.coffee;
    if (titleLower.includes('juice') || titleLower.includes('fruit') || titleLower.includes('果汁') || titleLower.includes('smoothie')) return images.juice;
    if (titleLower.includes('bar') || titleLower.includes('pub') || titleLower.includes('lounge') || titleLower.includes('酒') || titleLower.includes('bistro')) return images.bar;
    
    // Food keywords - Asian
    if (titleLower.includes('sushi') || titleLower.includes('japanese') || titleLower.includes('壽司') || titleLower.includes('日式') || titleLower.includes('izakaya') || titleLower.includes('居酒屋')) return images.sushi;
    if (titleLower.includes('ramen') || titleLower.includes('noodle') || titleLower.includes('拉麵') || titleLower.includes('麵')) return images.ramen;
    if (titleLower.includes('hotpot') || titleLower.includes('shabu') || titleLower.includes('火鍋') || titleLower.includes('鍋')) return images.hotpot;
    if (titleLower.includes('thai') || titleLower.includes('泰式')) return images.thai;
    if (titleLower.includes('korean') || titleLower.includes('bbq') || titleLower.includes('韓式')) return images.korean;

    // Food keywords - Western
    if (titleLower.includes('burger') || titleLower.includes('漢堡')) return images.burger;
    if (titleLower.includes('pizza') || titleLower.includes('披薩') || titleLower.includes('義式')) return images.pizza;
    if (titleLower.includes('pasta') || titleLower.includes('義大利麵')) return images.pasta;
    if (titleLower.includes('steak') || titleLower.includes('牛排')) return images.steak;
    if (titleLower.includes('brunch') || titleLower.includes('早午餐')) return images.brunch;

    if (titleLower.includes('bakery') || titleLower.includes('cake') || titleLower.includes('dessert') || titleLower.includes('甜點') || titleLower.includes('烘焙')) return images.dessert;
    
    // Deterministic fallback
    const keys = Object.values(images);
    const index = recommendation.title.length % keys.length;
    return keys[index];
  }, [recommendation.title]);

  return (
    <div className="group relative flex flex-col bg-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={recommendation.title} 
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
           <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md group-hover:text-amber-400 transition-colors">
            {recommendation.title}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow p-5 flex flex-col justify-between bg-slate-800">
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-slate-400 text-sm">
             <svg className="w-4 h-4 mr-1.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
             <span>Google Maps 已驗證地點</span>
          </div>
        </div>

        <a
          href={recommendation.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex justify-center items-center px-4 py-3 bg-slate-700 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors duration-200 group/btn"
        >
          <span>查看地圖與評論</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default RecommendationCard;
