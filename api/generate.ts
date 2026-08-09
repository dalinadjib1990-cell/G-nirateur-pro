import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkqsGPlm3rbVXzhbqas7qxDDk060Y3cc4",
  authDomain: "gen-lang-client-0694864679.firebaseapp.com",
  projectId: "gen-lang-client-0694864679",
  storageBucket: "gen-lang-client-0694864679.firebasestorage.app",
  messagingSenderId: "233520604904",
  appId: "1:233520604904:web:eec44d74b8d9b147094b5d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const maxDuration = 60; // Set max duration to 60 seconds (Vercel Hobby limit)

let cachedKeys: string[] = [];
let lastKeysFetch = 0;
const badKeysMap = new Map<string, number>(); // key -> timestamp when it failed

const getApiKeys = async () => {
  const now = Date.now();
  // Clear bad keys older than 10 minutes (600,000 ms)
  for (const [k, time] of badKeysMap.entries()) {
    if (now - time > 600000) badKeysMap.delete(k);
  }

  // Use cached keys if fresh (within 2 minutes)
  if (cachedKeys.length > 0 && now - lastKeysFetch < 120000) {
    return cachedKeys.filter(k => !badKeysMap.has(k));
  }

  const keys: string[] = [];
  if (process.env.GEMINI_API_KEY) keys.push(process.env.GEMINI_API_KEY);
  
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('GEMINI_API_KEY_') && process.env[key]) {
      keys.push(process.env[key] as string);
    }
  });

  try {
    const q = query(collection(db, 'api_keys'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.key && typeof data.key === 'string') {
        keys.push(data.key);
      }
    });
  } catch (error) {
    console.error("Error fetching keys from Firestore:", error);
  }
  
  cachedKeys = [...new Set(keys)];
  lastKeysFetch = now;
  return cachedKeys.filter(k => !badKeysMap.has(k));
};

const markKeyError = async (key: string, errorMsg: string) => {
  try {
    const { updateDoc } = await import('firebase/firestore');
    const q = query(collection(db, 'api_keys'), where('key', '==', key));
    const snapshot = await getDocs(q);
    
    const promises = snapshot.docs.map(docSnap => updateDoc(docSnap.ref, {
        isActive: false,
        error: errorMsg
    }));
    await Promise.all(promises);
  } catch (error) {
    console.error("Error marking key error in Firestore:", error);
  }
};

let currentKeyIndex = 0;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKeys = await getApiKeys();
    if (apiKeys.length === 0) {
      return res.status(500).json({ error: "No API keys configured" });
    }

    const { generationType, teacherInfo, subjectInfo, aiPrompt, documentLanguage, includeWatermark, contentStyle, designStyle, pageFrame } = req.body;

    if (!generationType) {
      return res.status(400).json({ error: "generationType is required" });
    }

    let systemInstruction = `أنت مساعد ذكي ومصمم محترف لمعلمي المدارس. 
    مهمتك إنشاء مذكرات، اختبارات، سلاسل تمارين، ملخصات، أو قصاصات بناءً على مدخلات المعلم بأعلى جودة بصرية.
    يجب أن يكون المخرج بتنسيق HTML فقط (بدون أي وسوم Markdown مثل \`\`\`html).
    استخدم inline CSS وتنسيقات متقدمة لجعله جذاباً جداً وجاهزاً للطباعة على ورقة A4.
    يجب أن تستخدم المتغير var(--doc-color, #1e40af) كـ primary color للون الرئيسي.
    
    تعليمات هامة جداً (يجب الالتزام بها حرفياً):
    1. لا تستخدم أكواد LaTeX للمعادلات الرياضية أبدأ (مثل رموز $ أو \\lim). استخدم دائماً نصوص عادية Unicode ورموز HTML كـ <sup> و <sub> و كسور CSS أو الجداول لعرض الرياضيات بشكل جميل.
    2. لا تقم بإنشاء إطار (border) حول الصفحة بالكامل، نظامنا سيقوم بإضافة الإطار المناسب بناءً على اختيار المستخدم. ركز فقط على تنسيق المحتوى الداخلي والعناوين.
    3. استخدم كلاس "avoid-break" (class="avoid-break") لأي بطاقة صغيرة (div)، تمرين قصير، أو أي جزء مترابط لا تريد أن ينقسم بين صفحتين عند الطباعة. لا تستخدم هذا الكلاس مع الأقسام الطويلة جداً لكي لا تترك مساحات بيضاء كبيرة.
    4. لا تضف أي هوامش جانبية ضخمة (margins/padding) للحاويات الرئيسية، اجعل العرض 100% لتستغل عرض الورقة.
    5. ممنوع قطعياً استخدام وسم <style>. جميع التنسيقات يجب أن تكون inline CSS (أي style="...").
    6. ممنوع استخدام خصائص position: fixed أو position: absolute إلا في العلامة المائية فقط لتجنب تخريب واجهة التطبيق.
    7. **قواعد الجيل الثاني الصارمة للرموز الرياضية والفيزيائية (مناهج الجيل الثاني - الجزائر 2nd Generation)**:
       يُمنع منعاً باتاً مطلقاً استخدام الحروف والرموز العربية (مثل أ، ب، ج، س، ص، ع، د) في الرياضيات أو الفيزياء أو العلوم والتكنولوجيا!
       يجب كتابة جميع المعادلات، المطابقات الشهيرة، المتغيرات، الدوال، والأشكال الهندسية بالحروف اللاتينية والفرنسية حصرياً (مثل a, b, c, x, y, z, f(x), A, B, C) وباتجاه من اليسار إلى اليمين LTR دائماً مع وضعها داخل (span dir="ltr" style="display:inline-block;")!
       أمثلة إجبارية للالتزام بها:
       - المطابقات الشهيرة: اكتب (a + b)² = a² + 2ab + b² و (a - b)² = a² - 2ab + b² و (a - b)(a + b) = a² - b² (يمنع كتابة (أ + ب)² أو (س + 3)²).
       - عبارات وتمارين التحليل والتفكيك والتبسيط: اكتب A = (2x - 3)² - (x + 1)² أو f(x) = 3x² + 5x - 2.
       - الهندسة والمتجهات: اكتب المثلث ABC والشعاع u والمستقيم (d) والنقاط A(2, 3).
       - الفيزياء والعلوم: اكتب القوانين بـ E = mc² أو v = d / t أو P = U × I.
    
    تعليمات التصميم والهيكلة:
    1. ستايل التصميم (Design Style): المستخدم اختار "${designStyle}". طبق هذا النمط من خلال الألوان المتدرجة، أشكال العناوين، الزوايا المنحنية، والخطوط للفقرات والبطاقات الداخلية. 
    2. ستايل المضمون (Content Style): المستخدم اختار "${contentStyle}".
        - "مختصر هادف": استخدم نقاطاً قصيرة، جداول صغيرة مركزة، وتخلص من الحشو.
        - "مفصل": تعمق في الشرح، أضف أمثلة، تفريعات كثيرة، وجداول موسعة.
        - "مضمون عادي": توازن معتاد.
    3. الترويسة (Header) أفقية بالكامل توزع معلومات الدولة، المؤسسة، الأستاذ، والمادة.
    4. **الجداول**: الجداول يجب أن تكون بعرض 100%. لون صف العناوين بـ var(--doc-color).
    5. **الأشكال والرسومات**: أضف أشكال (SVG) تناسب المادة (رياضيات: هندسة، علوم: نباتات/خلايا، إلخ).
       - في حال اختيار "وثيقة تفاعلية مدعومة بالصور المدمجة"، استخدم SVG characters مدمجة كرسومات توضيحية لطلاب يطرحون أسئلة أو يفكرون، واجعل المظهر تفاعلياً بشكل كرتوني محبب ومزخرف (كالصور المرفقة بالطبيعة أو الألوان الزاهية).
    6. **العلامة المائية (Watermark)**: ${includeWatermark ? 'المستخدم طلب علامة مائية. أضف عنصر <div> كأول عنصر في body. أعطه الكلاس `watermark-bg` فقط بدون أي inline styles. وضع بداخله رسمة SVG تناسب المادة.' : 'المستخدم لم يطلب علامة مائية. لا تضف أي علامة مائية.'}
    7. اللغة: التزم بلغة الوثيقة ${documentLanguage} مع ضبط اتجاه النص (RTL للعربية، LTR للغات الأجنبية).`;
    
    let typeLabel = '';
    if (generationType === 'memo') typeLabel = 'مذكرة درس';
    else if (generationType === 'test') typeLabel = 'اختبار / فرض';
    else if (generationType === 'series') typeLabel = 'سلسلة تمارين';
    else if (generationType === 'summary') typeLabel = 'ملخص';
    else if (generationType === 'visual') typeLabel = 'وثيقة تفاعلية مدعومة بالصور المدمجة والشخصيات الكرتونية التوضيحية';
    else if (generationType === 'cutout_start') typeLabel = 'قصاصات لـ 8 وضعيات انطلاقية (قابلة للقص والطباعة للطلاب)';
    else if (generationType === 'cutout_learning') typeLabel = 'قصاصات لـ 8 وضعيات تعلمية (قابلة للقص والطباعة)';
    else if (generationType === 'cutout_integration') typeLabel = 'قصاصات لـ 8 وضعيات إدماجية / تقويمية (تتضمن قسمين بكل قصاصة)';

    let userPrompt = `
    الرجاء إنشاء: ${typeLabel}
    
    **اللغة المطلوبة للوثيقة**: ${documentLanguage === 'fr' ? 'الفرنسية (French)' : documentLanguage === 'en' ? 'الإنجليزية (English)' : 'العربية (Arabic)'}
    **ستايل التصميم**: ${designStyle}
    **ستايل المضمون**: ${contentStyle}

    **معلومات المعلم والمؤسسة:**
    - الأستاذ: ${teacherInfo?.firstName || ''} ${teacherInfo?.lastName || ''}
    - المؤسسة: ${teacherInfo?.school || ''}
    - الطور: ${teacherInfo?.phase || ''}
    - المستوى: ${teacherInfo?.level || ''}
    - المادة: ${teacherInfo?.subject || ''}
    
    **تفاصيل المحتوى:**
    ${generationType === 'test' ? `
    - نوع التقويم: ${subjectInfo?.examType || ''}
    - الفصل: ${subjectInfo?.term || ''}
    - التوقيت: ${subjectInfo?.duration || ''} (هام جداً: ضع رمز/أيقونة ساعة SVG تعبر عن التوقيت تتناسب مع ستايل التصميم المختار)
    ` : ''}
    ${subjectInfo ? JSON.stringify(subjectInfo, null, 2) : ''}
    
    **توجيهات إضافية وتحديد ستايل التصميم:**
    ${aiPrompt || 'قم بتصميم أنيق واحترافي.'}
    
    أخرج كود HTML مرتب، مع استخدام flexbox للترويسة والجداول. 
    اجعل التصميم يشبه النماذج الاحترافية جداً، مزخرف على الجوانب بإطارات ورسومات، ووفر المساحة (استغل كامل عرض الورقة). لا تترك هوامش فارغة ضخمة.
    ${generationType === 'visual' ? `
    - **هام جدًا للمذكرة التفاعلية**: يجب أن تُصمم الصفحة كأنها قصة أو مجلة أطفال تعليمية تفاعلية، استخدم الكثير من الشخصيات الكرتونية بصيغة SVG (طلاب، معلم، حيوانات، أو أشكال معبرة) إلى جانب الفقرات.
    - اجعل الإطارات والبطاقات تحتوي على زوايا دائرية، ظلال ناعمة، وألوان مبهجة حسب الستايل المختار.
    - استخدم تصميمات مبتكرة بدلاً من الجداول التقليدية (مثل بطاقات حوارية "قال ريان..." "قالت سلمى...").
    ` : ''}
    هام جداً لتقليل عدد الأوراق عند الطباعة وتصدير PDF محاذي للمعاينة بشكل تام:
    - قلل الفراغات العمودية (margin, padding) بين العناصر والفقرات والجداول (اجعل padding 8px-10px في بطاقات التمارين و margin-bottom 10px).
    - بالنسبة للامتحانات والتقويمات، استغل كامل مساحة الصفحة الأولى لأقصى حد، واجعل الترويسة مضغوطة ومنسقة (padding: 6px 8px; margin-bottom: 10px) لتتسطح الصفحة الأولى وتتسع لأكبر عدد ممكن من التمارين (التمارين الأول والثاني والوضعية) قبل الانتقال للصفحة الثانية.
    - ضع كل تمرين أو وضعية أو قسم كامل داخل بطاقة تحتوي إجبارياً على class="avoid-break" و style="page-break-inside: avoid; break-inside: avoid; border: 1.5px solid var(--doc-color, #1e40af); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; background-color: #ffffff;" لتجنب قطعه بين الصفحات بشكل عشوائي.
    - استغل المساحة الأفقية جيداً (يمكن استخدام شبكة grid أو flex لترتيب الأسئلة أو البطاقات جنباً إلى جنب).
    - تجنب ترك أي هوامش سفلية (margin-bottom) مبالغ فيها، ولا تستخدم وسوم <br> فارغة.
    - إذا كان هناك الكثير من العناصر (مثل القصاصات أو التمارين القصيرة)، رتبها في عمودين أو ثلاثة لتقليل طول الصفحة.
    `;

    let response;
    let retries = Math.min(10, apiKeys.length);
    let attempts = 0;
    let lastError;
    // Load balance across keys by picking a random start offset
    let keyIdx = Math.floor(Math.random() * apiKeys.length);

    while (attempts < retries) {
      const apiKey = apiKeys[keyIdx % apiKeys.length];
      keyIdx++;
      
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        break; 
      } catch (error: any) {
        lastError = error;
        attempts++;
        
        const errString = typeof error === 'object' ? JSON.stringify(error) : String(error);
        const errMsg = error?.message || errString;
        console.error(`Attempt ${attempts} failed for key ending in ...${apiKey.slice(-6)}:`, errMsg);
        
        const isRateLimit = error?.status === 429 || error?.code === 429 || errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED');
        const isAuthError = error?.status === 400 || error?.status === 403 || errMsg.includes('API_KEY_INVALID');

        if (isRateLimit || isAuthError) {
          badKeysMap.set(apiKey, Date.now());
          // Mark key error asynchronously in background without delaying response
          markKeyError(apiKey, errMsg.substring(0, 100)).catch(() => {});
        }

        if (isRateLimit || isAuthError) {
          continue; // Try next key immediately
        } else {
          // Brief pause for transient errors
          await new Promise(resolve => setTimeout(resolve, 300));
          continue;
        }
      }
    }

    if (!response) {
      const errString = typeof lastError === 'object' ? JSON.stringify(lastError) : String(lastError);
      const errMsg = lastError?.message || errString;
      const isRateLimit = lastError?.status === 429 || lastError?.code === 429 || errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED');
      
      if (isRateLimit) {
         throw new Error("RATE_LIMIT");
      }
      throw lastError || new Error("Failed to generate content");
    }

    let htmlContent = response.text || "";
    htmlContent = htmlContent.replace(/```html/gi, '').replace(/```/g, '');
    htmlContent = htmlContent.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
    htmlContent = htmlContent.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    htmlContent = htmlContent.replace(/position\s*:\s*fixed/gi, 'position: absolute');
    htmlContent = htmlContent.replace(/100vw/gi, '100%').replace(/100vh/gi, '100%');

    res.status(200).json({ content: htmlContent });
  } catch (error: any) {
    const errString = typeof error === 'object' ? JSON.stringify(error) : String(error);
    const errMsg = error?.message || errString;
    console.error("Gemini API Error details:", errString, errMsg);
    
    if (errMsg === 'RATE_LIMIT' || error?.status === 429 || error?.code === 429 || errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: "عذراً، لقد استنفدت حصتك المجانية للذكاء الاصطناعي أو هناك ضغط كبير. يرجى المحاولة لاحقاً." });
    }
    res.status(500).json({ error: errMsg || "An error occurred during generation." });
  }
}
