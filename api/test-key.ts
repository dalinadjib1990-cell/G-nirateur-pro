import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { apiKey } = req.body || req.query || {};

  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(400).json({ success: false, error: 'المفتاح مطلوب لاختباره' });
  }

  const startTime = Date.now();

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-testKey',
        }
      }
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "اختبار المفتاح: أجب كلمة 'شغال' فقط",
    });

    const latencyMs = Date.now() - startTime;
    const answer = response.text?.trim() || 'OK';

    return res.status(200).json({
      success: true,
      status: 'active',
      latencyMs,
      message: `المفتاح يعمَل بنجاح! استجابة الـ AI: (${answer}) في ${latencyMs}ms`
    });
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    const errMsg = error.message || String(error);
    const isRateLimit = error?.status === 429 || errMsg.includes('429') || errMsg.includes('quota');

    return res.status(200).json({
      success: false,
      status: isRateLimit ? 'rate_limited' : 'error',
      latencyMs,
      error: isRateLimit ? 'تم تجاوز حد الاستخدام المؤقت (429 Rate Limit)' : `خطأ بالمفتاح: ${errMsg.substring(0, 100)}`
    });
  }
}
