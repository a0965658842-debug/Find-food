import { GoogleGenAI } from "@google/genai";
import type { Coordinates, Recommendation, SearchOptions } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface GeminiResponse {
  summary: string;
  recommendations: Recommendation[];
}

export async function getRecommendations(coords: Coordinates, options: SearchOptions): Promise<GeminiResponse> {
  try {
    // Construct a specific prompt based on user preferences
    const timeText = options.time ? `適用時段為「${options.time}」` : '目前營業中';
    const styleText = options.style ? `風格或類別為「${options.style}」` : '餐廳、飲料店（手搖飲、果汁）或咖啡廳';
    
    const prompt = `請搜尋附近 (${coords.latitude}, ${coords.longitude}) 評價最好的 6-8 間地點。
    
    搜尋條件：
    1. ${timeText}
    2. ${styleText}
    
    請務必使用 Google Maps 工具確認地點存在並列出。請不要產生任何文字介紹或摘要。`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }], // Only googleMaps is needed for grounding chunks
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
          },
        },
      },
    });

    const summary = ""; 
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const uniqueRecommendations = new Map<string, Recommendation>();

    groundingChunks.forEach(chunk => {
      if (chunk.maps && chunk.maps.title && chunk.maps.uri) {
        if (!uniqueRecommendations.has(chunk.maps.uri)) {
           uniqueRecommendations.set(chunk.maps.uri, {
            title: chunk.maps.title,
            uri: chunk.maps.uri,
           });
        }
      }
    });

    const recommendations = Array.from(uniqueRecommendations.values());

    if (recommendations.length === 0) {
        throw new Error("找不到符合該時段或風格的推薦地點，請嘗試調整搜尋條件。");
    }
    
    return { summary, recommendations };
  } catch (error) {
    console.error("Error fetching recommendations from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`獲取推薦失敗: ${error.message}`);
    }
    throw new Error("發生未知錯誤，請稍後再試。");
  }
}
