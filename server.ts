import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { getAllApiKeysInfo, recordKeyUsage, recordKeyError } from "./src/lib/apiKeyHelper.js";

// Gather all API keys from environment
const getApiKeys = () => {
  const keys: string[] = [];
  if (process.env.GEMINI_API_KEY) keys.push(process.env.GEMINI_API_KEY);
  
  if (process.env.GEMINI_API_KEYS) {
    const splitKeys = process.env.GEMINI_API_KEYS.split(/[\n,;\s]+/).map(k => k.trim()).filter(k => k.length > 10);
    keys.push(...splitKeys);
  }

  // Also look for GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_KEY_... etc.
  Object.keys(process.env).forEach(key => {
    if ((key.startsWith('GEMINI_API_KEY_') || key.startsWith('GEMINI_KEY_')) && process.env[key]) {
      const val = process.env[key] as string;
      if (val && val.length > 10) keys.push(val);
    }
  });
  
  // Deduplicate
  return [...new Set(keys)];
};

let currentKeyIndex = 0;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Endpoint to handle downloading files generated client-side
  // This bypasses WebView restrictions on blob: and data: URIs
  app.post("/api/download", (req, res) => {
    try {
      const { data, filename, contentType } = req.body;
      
      if (!data) return res.status(400).send("No data provided");
      
      // Extract base64 part if it's a data URI
      const base64Data = data.includes(';base64,') ? data.split(';base64,').pop() : data;
      const buffer = Buffer.from(base64Data, 'base64');
      
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename || 'download')}"`);
      res.setHeader('Content-Type', contentType || 'application/octet-stream');
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.send(buffer);
    } catch (error) {
      console.error("Download endpoint error:", error);
      res.status(500).send("Error generating download");
    }
  });

  app.get("/api/keys-stats", async (req, res) => {
    try {
      const statsData = await getAllApiKeysInfo();
      res.json({ success: true, ...statsData });
    } catch (error: any) {
      console.error("Error fetching keys stats:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/test-key", async (req, res) => {
    const { apiKey } = req.body || {};
    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({ success: false, error: "المفتاح مطلوب" });
    }
    const startTime = Date.now();
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build-test' } }
      });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "test ping",
      });
      const latencyMs = Date.now() - startTime;
      res.json({
        success: true,
        status: 'active',
        latencyMs,
        message: `المفتاح يعمَل بنجاح (${latencyMs}ms)`
      });
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      const errMsg = error?.message || String(error);
      const isRateLimit = error?.status === 429 || errMsg.includes('429') || errMsg.includes('quota');
      res.json({
        success: false,
        status: isRateLimit ? 'rate_limited' : 'error',
        latencyMs,
        error: isRateLimit ? 'تجاوز حد الاستخدام (429 Rate Limit)' : errMsg.substring(0, 100)
      });
    }
  });

function getDesignStyleInstructions(designStyle: string): string {
  const s = (designStyle || '').toLowerCase().trim();

  // 1. 3D Educational Board (اللوح التعليمي ثلاثي الأبعاد)
  if (s === 'royal_academy' || s === 'style1' || s.includes('3d') || s.includes('لوح') || s.includes('مجسم') || s.includes('board')) {
    return `🎨 **توجيهات ستايل 01 — اللوح التعليمي ثلاثي الأبعاد (3D Educational Board)**:
       - **الهوية البصرية**: لوح مدرسي عائم ذو عمق ثلاثي الأبعاد حقيقي، إطار أزرق كحلي داكن (#0f274a) مع طبقة زجاجية بصرية عاكسة، وبراغي تثبيت معدنية فضية ولامعة في الأركان الأربعة (⚪).
       - **المفاهيم البصرية والرموز**: كرات وأقراص ثلاثية الأبعاد خضراء (+) وحمراء (-) للأعداد والعمليات، بطاقات بيضاء ملساء عائمة بظلال واقعية واضحة (box-shadow: 0 10px 25px rgba(15,39,74,0.14);).
       - **المحطات والمراحل**: كبسولات مراحل ثلاثية الأبعاد ببروز لوني سفلي، كبسولة التهيئة بلون أزرق بحري، كبسولة الوضعية التعلمية ببروز كحلي وذهبي، كبسولة الحوصلة بصندوق زجاجي ذهبي، وإعادة الاستثمار ببطاقة تفاعلية عائمة.
       - **التفاعل والحيوية**: مربعات تأشير تفاعلية [☑️ تم الإنجاز]، إرشاد بيداغوجي للأستاذ داخل صندوق زجاجي بلوري، وشارات توقيت مجسمة ⏱️.`;
  }

  // 2. Colorful Math Infographic (الإنفوجرافيك الرياضي الملون)
  if (s === 'orange_active' || s === 'style10' || s.includes('orange') || s.includes('رياضي') || s.includes('ملون') || s.includes('إنفوجرافيك')) {
    return `🎨 **توجيهات ستايل 02 — الإنفوجرافيك الرياضي الملون (Colorful Math Infographic)**:
       - **الهوية البصرية**: إنفوجرافيك رياضي حديث مفعم بالحيوية، خلفية مربعات بيانية برتقالية دافئة خفيفة، عقد مفهوم مركزية ملونة، وأنابيب وأسهم ربط بصرية ذكية.
       - **المفاهيم البصرية**: أشرطة كسور مستطيلة مقسمة وملونة، مخططات تدفق شجرية لخطوات الحل، ألوان برتقالية متوهجة (#ea580c) مع أزرق سماوي (#0284c7) وفيروزي (#0d9488).
       - **المحطات والمراحل**: عناوين المحطات داخل كبسولات بيضاوية عريضة مع أيقونات دائرية ملونة بارزة. بطاقة الوضعية التعلمية مزودة برسم بياني SVG مشرق، وبطاقة الحوصلة محاطة بإطار برتقالي مزدوج مع شريط نجاح ملون.
       - **التفاعل والحيوية**: خطوات مرقمة بأقراص ملونة زاهية (① ② ③)، بطاقات أمثلة ملونة جنباً إلى جنب، وتأشير مرحلي للتقدم.`;
  }

  // 3. Educational Blueprint (المخطط الهندسي الأزرق)
  if (s === 'math_pro' || s === 'style13' || s.includes('blueprint') || s.includes('مخطط') || s.includes('هندسي') || s.includes('أزرق')) {
    return `🎨 **توجيهات ستايل 03 — المخطط الهندسي الأزرق (Educational Blueprint)**:
       - **الهوية البصرية**: مخطط معماري وهندسي تقني، شبكة رسم بياني ميليمترية زرقاء، خطوط تقنية بيضاء وسماوية على خلفية كحلية، علامات زوايا قائمة ⦜، ومحاور إحداثيات (x, y).
       - **المفاهيم البصرية**: أشكال هندسية دقيقة بـ SVG مع محاور وأضلاع منقطة، ترميزات هندسية دقيقة [PHASE-01 // WARM_UP] و [PROPOSITION // THALES] و [SCALE: 1:1].
       - **المحطات والمراحل**: بطاقات تقنية مؤطرة بحدود زرقاء وسماوية مزدوجة، أختام هندسية دائرية، وبطاقة الوضعية التعلمية كدفتر مواصفات هندسي دقيق.
       - **التفاعل والحيوية**: شارات قياس الأبعاد (Dimension lines)، إحداثيات الرؤوس، وشريط تقدم المعايير الهندسية.`;
  }

  // 4. Premium Published Textbook (الكتاب المدرسي الفاخر)
  if (s === 'emerald_school' || s === 'style3' || s.includes('textbook') || s.includes('كتاب') || s.includes('مدرسي') || s.includes('فاخر')) {
    return `🎨 **توجيهات ستايل 04 — الكتاب المدرسي الفاخر (Premium Published Textbook)**:
       - **الهوية البصرية**: كتاب مدرسي مطبوع صادر عن أرقى دور النشر العالمية والوطنية، إطارات زمردية ملكية (#065f46) مزخرفة بتطريزات عربية مغاربية ناعمة، وخط عربي أميري أصيل.
       - **المفاهيم البصرية**: تبويبات تمارين مسننة (Ribbon-cut tabs)، صناديق مبرهنات نموذجية بلون زمردي وذهبي، شروحات متقابلة في عمودين (التوضيح الهندسي | البرهان الجبري).
       - **المحطات والمراحل**: ترويسة فصل ملكية، شريط المرحلة بشارة زمردية عريضة "المرحلة الأولى ★ التهيئة وتنشيط المكتسبات القبلية"، بطاقة الوضعية التعلمية بإطار كتابي مزدوج، وصندوق الحوصلة ببرواز مذهب ناصع.
       - **التفاعل والحيوية**: هوامش إرشادية منهجية "إضاءة بيداغوجية"، شارات الأهداف المحققة، وتمارين نموذجية بنجمة الإتقان ★.`;
  }

  // 5. Gamified Education (التعلم التفاعلي والألعاب)
  if (s === 'power_red' || s === 'style5' || s.includes('gamified') || s.includes('ألعاب') || s.includes('تفاعلي') || s.includes('تحدي')) {
    return `🎨 **توجيهات ستايل 05 — التعلم التفاعلي والألعاب (Gamified Education)**:
       - **الهوية البصرية**: نظام مغامرة ومستويات بيداغوجية ملهم ومحفز!
         * المستوى 1: انطلاق ومراجعة المكتسبات القبلية 🚀 (+50 XP)
         * المستوى 2: استكشاف وبناء المورد الجديد ⚡ (+100 XP)
         * المستوى 3: قاعدة القوة والمهارة الذهبية 🏆 (+150 XP)
         * المستوى 4: معركة التحدي وإعادة الاستثمار 🎯 (+200 XP)
       - **المفاهيم البصرية**: أشرطة طاقة وتقدم ملونة، نجوم الإنجاز (★★★)، شارات نقاط الخبرة (XP Badges)، وبطاقات مهارات خارقة ملونة بالأحمر والبرتقالي والذهبي.
       - **المحطات والمراحل**: بطاقات مراحل دائرية الحواف بظلال حيوية، بطاقة وضعية مشكلة في شكل "مهمة البطل الاستكشافية"، وصندوق حوصلة "بطاقة المهارة المكتسبة".
       - **التفاعل والحيوية**: مربعات فك الألغاز، شريط التحدي الصفي، وشارة الفوز بالمستوى التعليمي.`;
  }

  // 6. Smart AI Education (التعليم الرقمي والذكاء الاصطناعي)
  if (s === 'smart_tech' || s === 'style6' || s.includes('smart') || s.includes('ai') || s.includes('رقمي') || s.includes('ذكاء')) {
    return `🎨 **توجيهات ستايل 06 — التعليم الرقمي والذكاء الاصطناعي (Smart AI Education)**:
       - **الهوية البصرية**: واجهة سيبرانية ذكية مستقبلية، ألوان السيان النيوني (#06b6d4) والبنفسجي الرقمي (#6366f1)، شبكات بيانات كوانتومية، وخطوط HUD تقنية.
       - **المفاهيم البصرية**: كبسولات توجيه الذكاء الاصطناعي (🤖 توجيه الخوارزمية البيداغوجية: ...)، بطاقات تحليل البيانات، ومخططات تدفق رقمية SVG.
       - **المحطات والمراحل**: بطاقات HUD رقمية بإطار سيان وبنفسجي علوي متوهج، شارات مراحل رقمية مشعة، وبطاقة الوضعية التعلمية مجهزة بـ "محاكاة المسألة الرقمية".
       - **التفاعل والحيوية**: مؤشرات قياس الفهم الذكي، شرائح إلكترونية رمزية، وعدادات خطوات تفاعلية.`;
  }

  // 7. Notebook 3D (دفتر الأنشطة الملموس 3D)
  if (s === 'teaching_cards' || s === 'style9' || s.includes('notebook') || s.includes('دفتر') || s.includes('ملموس') || s.includes('كراس')) {
    return `🎨 **توجيهات ستايل 07 — دفتر الأنشطة الملموس 3D (Notebook 3D)**:
       - **الهوية البصرية**: يحاكي دفتر التلميذ الحقيقي الملموس فائق الجاذبية! ورق مربعات كراس أزرق خفيف، حلقات سلك الدفتر الحلزونية العلوية، وقصاصات مثبتة بدبابيس ملونة 📌 وشريط لاصق شفاف مائل.
       - **المفاهيم البصرية**: ورقة ملاحظات صفراء لاصقة مائلة (Post-it note) لدقائق القاعدة والحوصلة، وتطبيقات الحساب داخل شبكة أسطر الكراس المدرسية.
       - **المحطات والمراحل**: التهيئة داخل قصاصة بطاقة مائلة، الوضعية التعلمية داخل صفحة كراس بخطوط هوامش حمراء، والحوصلة بملصق أصفر مع دبوس أحمر 📌.
       - **التفاعل والحيوية**: مربعات حل التلاميذ الحقيقية، دبابيس تثبيت ملونة، وتأشير بالقلم الفسفوري الأخضر والأصفر.`;
  }

  // 8. Color Block Education (الكتل اللونية الحديثة)
  if (s === 'education_pro' || s === 'style8' || s.includes('block') || s.includes('كتل') || s.includes('لونية') || s.includes('بنتو')) {
    return `🎨 **توجيهات ستايل 08 — الكتل اللونية الحديثة (Color Block Education)**:
       - **الهوية البصرية**: طراز بوهوسي حديث مستوحى من البنتو جريد (Bento Grid)، كتل ومساحات لونية صلبة متناغمة (أزرق بترولي، كحلي، فيروزي، رملي دافئ)، وأرقام أقسام ضخمة عريضة (01، 02، 03، 04).
       - **المفاهيم البصرية**: كتل معلومات مقسمة أفقياً وعمودياً مع تباين صريح وسهل المتابعة البصرية بالعين بدون أي تشويش.
       - **المحطات والمراحل**: كل مرحلة تأخذ كتلة لونية مستقلة بحد سميك ملون على اليمين (border-right: 8px solid #0f766e;)، شارات واضحة، وبطاقة الحوصلة بالكتلة الذهبية المتباينة.
       - **التفاعل والحيوية**: أرقام عملاقة أنيقة، بطاقات متراصفة هندسياً، ووضوح قراءة استثنائي.`;
  }

  // 9. Mind Map Lesson (الخريطة الذهنية التعليمية)
  if (s === 'purple_ai' || s === 'style2' || s.includes('mind') || s.includes('map') || s.includes('خريطة') || s.includes('ذهنية')) {
    return `🎨 **توجيهات ستايل 09 — الخريطة الذهنية التعليمية (Mind Map Lesson)**:
       - **الهوية البصرية**: هيكلة الدرس على شكل شبكة وخريطة ذهنية بصرية مترابطة، عقدة المفهوم المركزي في المنتصف مع تفريعات ومسارات منحنية ملونة تصل للأهداف، الوضعيات، القواعد، والتمارين.
       - **المفاهيم البصرية**: مسارات وأسهم رابطة ملونة، شارات بيضاوية ناعمة بتدرجات بنفسجية ووردية هادئة (#9333ea و #ec4899)، ومخططات مفاهيمية متناسقة.
       - **المحطات والمراحل**: كبسولات عقدية مستديرة ترتبط ببعضها بخطوط متصلة، بطاقة الوضعية التعلمية تتفرع إلى أسئلة البحث، وصندوق الحوصلة يمثل النواة المعرفية الجامعة.
       - **التفاعل والحيوية**: روابط بصرية بين القاعدة والمثال، كبسولات تفريعية ملونة، وسهولة تذكر فائقة للمفاهيم.`;
  }

  // 10. Algerian Educational Premium (المنهاج الجزائري الملكي)
  if (s === 'dz_education' || s === 'style14' || s.includes('dz') || s.includes('جزائر') || s.includes('ملكي') || s.includes('وطني')) {
    return `🎨 **توجيهات ستايل 10 — المنهاج الجزائري الملكي (Algerian Educational Premium)**:
       - **الهوية البصرية**: الهوية الوطنية الرسمية المعتمدة لوزارة التربية الوطنية الجزائرية (الجيل الثاني)، ألوان الراية الوطنية الرمزية (الأخضر الزمردي #006633، الأبيض الناصع، والأحمر الياقوتي #d21034)، وزخارف نجمية مغاربية ثمانية أصيلة ۞.
       - **المفاهيم البصرية**: ترويسة وزارية رسمية فاخرة، جدول سير الدرس البيداغوجي المعتمد، والالتزام الصارم والدقيق بمصطلحات ورموز الجيل الثاني اللاتينية LTR.
       - **المحطات والمراحل**: بطاقات مراحل مؤطرة بالأخضر الزمردي مع خط سفلي أحمر ياقوتي، بطاقة الوضعية التعلمية بشارة "المقاربة بالكفاءات - مناهج الجيل الثاني"، وصندوق الحوصلة ببرواز وطني مميز.
       - **التفاعل والحيوية**: أختام وشارات الجيل الثاني، شبكة تقويم المؤشرات الصريحة، وتأكيد الهوية التعليمية الرسمية.`;
  }

  // 11. Creative Primary - Number Train (الابتدائي الإبداعي - قطار الأعداد)
  if (s === 'kids_smart' || s === 'style7' || s.includes('kids') || s.includes('ابتدائي') || s.includes('صغار') || s.includes('قطار')) {
    return `🎨 **توجيهات ستايل 11 — الابتدائي الإبداعي (Creative Primary - Number Train)**:
       - **الهوية البصرية**: مخصص للمراحل الابتدائية والمتوسطة الأولى لتحبيب المادة وتنشيط الفهم! قاطرة وعربات قطار الأعداد الملونة 🚂 🚃 🚃، قفزات الفاصلة العشرية بالأسهم المقوسة المبهجة ↷ ↷ ↷، سحابات ملونة، ونجوم تشجيعية مبتسمة.
       - **المفاهيم البصرية**: بطاقات سحابية مستديرة الحواف بألوان مرحة (أزرق سماوي، أصفر ليموني، أخضر عشبي، وبرتقالي)، أسهم قفز المراتب بالـ SVG، وشخصيات بيداغوجية رمزية.
       - **المحطات والمراحل**: محطة 1 "محطة قطار الانطلاق والتحمية"، محطة 2 "رحلة استكشاف الكنز والتعلم"، محطة 3 "صندوق المعرفة الذهبي"، ومحطة 4 "تحدي الأبطال الصغار".
       - **التفاعل والحيوية**: نجوم تحفيزية ملونة، مساحات رسم وتلوين مبسطة، وتأشيرات مرحة.`;
  }

  // 12. Master Comprehensive Infographic (البوستر الإنفوجرافي الشامل)
  return `🎨 **توجيهات ستايل 12 — البوستر الإنفوجرافي الشامل (Master Infographic)**:
     - **الهوية البصرية**: يحول ورقة المذكرة أو الاختبار إلى بوستر إنفوجرافي بيداغوجي احترافي شامل وعالي التأثير البصري، هرمية بصرية متسلسلة ومتكاملة تعتمد على البانرات الكبرى والأعمدة المقارنة.
     - **المفاهيم البصرية**: علاقات رياضية وعلمية بمخططات مقارنة، إطارات متينة عالية التباين باللونين الكحلي الملكي (#0f172a) والأزرق الأكاديمي (#2563eb) مع لمسات ذهبية (#f59e0b).
     - **المحطات والمراحل**: مسار تدفق مرئي متواصل من الترويسة إلى التهيئة، ثم بطاقة الوضعية التعلمية كمركز استكشافي رئيسي، يليه صندوق الحوصلة المتبلور، وأخيراً حقل التحدي وإعادة الاستثمار.
     - **التفاعل والحيوية**: شارات تفاعلية متناسقة، أعمدة توضيحية متقابلة، ومؤشرات تدفق بصرية ذكية.`;
}

function splitMemoIntoSheets(html: string): string {
  if (!html || html.includes('a4-sheet')) return html;

  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;
  const tables: { full: string; inner: string; index: number }[] = [];
  while ((match = tableRegex.exec(html)) !== null) {
    tables.push({ full: match[0], inner: match[1], index: match.index });
  }

  // 1. Try to find the pedagogical stages table
  let stagesTable = tables.find(t => {
    const txt = t.inner;
    const hasStart = txt.includes('التهيئة') || txt.includes('الانطلاق') || txt.includes('الإنطلاق') || txt.includes('التشخيصي') || txt.includes('بناء التعلمات') || txt.includes('المراحل') || txt.includes('سير التعلمات');
    const hasEnd = txt.includes('حوصلة') || txt.includes('إرساء') || txt.includes('استخلاص') || txt.includes('استنتاج') || txt.includes('الاستثمار') || txt.includes('إعادة الاستثمار') || txt.includes('تقويم');
    return hasStart && hasEnd;
  });

  // If not found by exact start/end keywords, but there are multiple tables and table 1 is not the header table
  if (!stagesTable && tables.length >= 2) {
    stagesTable = tables.find((t, idx) => idx > 0 && !t.inner.includes('الجمهورية') && !t.inner.includes('وزارة التربية'));
  }

  if (stagesTable) {
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    const rows: string[] = [];
    while ((rowMatch = rowRegex.exec(stagesTable.inner)) !== null) {
      rows.push(rowMatch[0]);
    }

    if (rows.length >= 2) {
      const headerRow = rows[0] || '';
      const page1Rows = [headerRow];
      const page2Rows = [headerRow];

      let targetPage = 1;
      const breakKeywords = ['حوصلة', 'إرساء', 'استخلاص', 'استنتاج', 'الخلاصة', 'المرحلة 3', 'المرحلة الثالثة', 'إعادة الاستثمار', 'الاستثمار', 'المرحلة 4'];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (breakKeywords.some(kw => row.includes(kw))) {
          targetPage = 2;
        } else if (i >= Math.ceil((rows.length - 1) / 2) + 1 && targetPage === 1) {
          targetPage = 2;
        }
        if (targetPage === 1) page1Rows.push(row);
        else page2Rows.push(row);
      }

      // If page2Rows only has headerRow, force the second half of rows to page 2
      if (page2Rows.length <= 1 && rows.length >= 3) {
        page1Rows.length = 0;
        page2Rows.length = 0;
        page1Rows.push(headerRow);
        page2Rows.push(headerRow);
        const mid = Math.ceil(rows.length / 2);
        for (let i = 1; i < rows.length; i++) {
          if (i < mid) page1Rows.push(rows[i]);
          else page2Rows.push(rows[i]);
        }
      }

      const tableOpenTagMatch = stagesTable.full.match(/<table[^>]*>/i);
      const tableOpenTag = tableOpenTagMatch ? tableOpenTagMatch[0] : '<table width="100%" border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse;">';

      const table1 = tableOpenTag + page1Rows.join('') + '</table>';
      const table2 = tableOpenTag + page2Rows.join('') + '</table>';

      const beforeStages = html.substring(0, stagesTable.index);
      const afterStages = html.substring(stagesTable.index + stagesTable.full.length);

      const sheet1 = `<div class="a4-sheet" data-page="1">
  ${beforeStages}
  ${table1}
  <div class="page-footer" style="text-align:center; font-size:11px; color:#64748b; margin-top:14px; border-top:1px dashed #cbd5e1; padding-top:4px;">
    الصفحة 1 من 2 — مذكرة بيداغوجية (الانطلاق وبناء التعلمات)
  </div>
</div>`;

      const sheet2 = `<div class="a4-sheet" data-page="2">
  <div style="font-size:12px; font-weight:bold; color:var(--doc-color, #1e40af); margin-bottom:8px; border-bottom:1.5px solid #cbd5e1; padding-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
    <span>تابع سير الحصة البيداغوجية — مرحلة إرساء الموارد وإعادة الاستثمار</span>
    <span>الصفحة 2</span>
  </div>
  ${table2}
  ${afterStages}
  <div class="page-footer" style="text-align:center; font-size:11px; color:#64748b; margin-top:14px; border-top:1px dashed #cbd5e1; padding-top:4px;">
    الصفحة 2 من 2 — تم إنجاز المذكرة بحمد الله
  </div>
</div>`;

      return sheet1 + sheet2;
    }
  }

  // 2. If stages were created as div blocks/cards instead of a table
  const splitKeywords = ['حوصلة', 'إرساء الموارد', 'إرساء التعلمات', 'المرحلة الثالثة', 'المرحلة 3', 'إعادة الاستثمار'];
  for (const kw of splitKeywords) {
    const idx = html.indexOf(kw);
    if (idx > 300) {
      const lastTagOpen = html.lastIndexOf('<div', idx);
      if (lastTagOpen > 150) {
        const part1 = html.substring(0, lastTagOpen);
        const part2 = html.substring(lastTagOpen);
        return `<div class="a4-sheet" data-page="1">
  ${part1}
  <div class="page-footer" style="text-align:center; font-size:11px; color:#64748b; margin-top:14px; border-top:1px dashed #cbd5e1; padding-top:4px;">
    الصفحة 1 من 2 — مذكرة بيداغوجية
  </div>
</div>
<div class="a4-sheet" data-page="2">
  <div style="font-size:12px; font-weight:bold; color:var(--doc-color, #1e40af); margin-bottom:8px; border-bottom:1.5px solid #cbd5e1; padding-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
    <span>تابع سير الحصة البيداغوجية — إرساء الموارد والتقويم</span>
    <span>الصفحة 2</span>
  </div>
  ${part2}
  <div class="page-footer" style="text-align:center; font-size:11px; color:#64748b; margin-top:14px; border-top:1px dashed #cbd5e1; padding-top:4px;">
    الصفحة 2 من 2 — تم بحمد الله
  </div>
</div>`;
      }
    }
  }

  return `<div class="a4-sheet" data-page="1">${html}</div>`;
}

function splitTestIntoSheets(html: string): string {
  if (!html || html.includes('a4-sheet')) return html;

  // 1. Check for manual or explicit page break
  if (html.includes('page-break-before: always') || html.includes('page-break') || html.includes('break-before: always')) {
    const parts = html.split(/(?:<div[^>]*style="[^"]*page-break-before:\s*always[^"]*"[^>]*><\/div>|<div[^>]*class="[^"]*page-break[^"]*"[^>]*><\/div>|<div[^>]*style="[^"]*break-before:\s*always[^"]*"[^>]*><\/div>)/i);
    if (parts.length > 1) {
      return parts.map((part, idx) => `
        <div class="a4-sheet" data-page="${idx + 1}">
          ${part}
          <div class="page-footer" style="text-align:center; font-size:11px; color:#64748b; margin-top:14px; border-top:1px dashed #cbd5e1; padding-top:4px;">
            الصفحة ${idx + 1} من ${parts.length}
          </div>
        </div>
      `).join('');
    }
  }

  // 2. Intelligent split for multi-exercise tests / exams
  const splitKeywords = ['الوضعية الإدماجية', 'وضعية إدماجية', 'الجزء الثاني', 'التمرين الثالث', 'المسألة'];
  for (const kw of splitKeywords) {
    const idx = html.indexOf(kw);
    if (idx > 400) {
      const lastTagOpen = html.lastIndexOf('<div', idx);
      if (lastTagOpen > 200) {
        const part1 = html.substring(0, lastTagOpen);
        const part2 = html.substring(lastTagOpen);
        return `
          <div class="a4-sheet" data-page="1">
            ${part1}
            <div class="page-footer" style="text-align:center; font-size:11px; color:#64748b; margin-top:14px; border-top:1px dashed #cbd5e1; padding-top:4px;">
              الصفحة 1 من 2 — اقلب الصفحة ⬅️
            </div>
          </div>
          <div class="a4-sheet" data-page="2">
            <div style="font-size:12px; font-weight:bold; color:var(--doc-color, #1e40af); margin-bottom:8px; border-bottom:1.5px solid #cbd5e1; padding-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
              <span>تابع موضوع الاختبار — الجزء الثاني والتقويم</span>
              <span>الصفحة 2</span>
            </div>
            ${part2}
            <div class="page-footer" style="text-align:center; font-size:11px; color:#64748b; margin-top:14px; border-top:1px dashed #cbd5e1; padding-top:4px;">
              الصفحة 2 من 2 — بالتوفيق والنجاح
            </div>
          </div>
        `;
      }
    }
  }

  return `<div class="a4-sheet" data-page="1">${html}</div>`;
}

  app.post("/api/generate", async (req, res) => {
    try {
      const apiKeys = getApiKeys();
      if (apiKeys.length === 0) {
        return res.status(500).json({ error: "No API keys configured" });
      }

      const { generationType, teacherInfo, subjectInfo, aiPrompt, documentLanguage, includeWatermark, contentStyle, designStyle, pageFrame } = req.body;

      if (!generationType) {
        return res.status(400).json({ error: "generationType is required" });
      }

      let typeLabel = '';
      if (generationType === 'memo') typeLabel = 'مذكرة درس';
      else if (generationType === 'test') typeLabel = 'اختبار / فرض';
      else if (generationType === 'series') typeLabel = 'سلسلة تمارين';
      else if (generationType === 'summary') typeLabel = 'ملخص';
      else if (generationType === 'cutout_start') typeLabel = 'قصاصات لـ 8 وضعيات انطلاقية (قابلة للقص والطباعة للطلاب)';
      else if (generationType === 'cutout_learning') typeLabel = 'قصاصات لـ 8 وضعيات تعلمية (قابلة للقص والطباعة)';
      else if (generationType === 'cutout_integration') typeLabel = 'قصاصات لـ 8 وضعيات إدماجية / تقويمية (تتضمن قسمين بكل قصاصة)';

      let systemInstruction = `أنت مساعد ذكي ومصمم محترف لمعلمي المدارس الجزائرية والوطن العربي. 
      مهمتك إنشاء مذكرات، اختبارات، سلاسل تمارين، ملخصات، أو قصاصات بناءً على مدخلات المعلم بأعلى جودة بصرية وبيداغوجية.
      يجب أن يكون المخرج بتنسيق HTML فقط (بدون أي وسوم Markdown مثل \`\`\`html).
      استخدم inline CSS وتنسيقات متقدمة لجعله جذاباً جداً وجاهزاً للطباعة على ورقة A4 وتأكّد من توافقه التام مع برنامج Microsoft Word عند التصدير وتصدير PDF.
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
      
      8. **الترويسة الرسمية للوثيقة (Document Header Box) - إجباري لجودة تصدير Word**:
         يجب إنشاء الترويسة في أعلى الوثيقة دائماً كجدول HTML صريح ("<table width='100%' ...>") وليس flexbox/grid لضمان ظهور الترويسة بوضوح كامل وبدون أي نقص عند فتح المستند في Microsoft Word!
         استخدم الهيكل التالي بالضبط للترويسة:
         
         <table width="100%" border="0" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 18px; background-color: var(--doc-color, #1e40af); color: #ffffff; font-family: Arial, sans-serif; text-align: center; border-radius: 8px; overflow: hidden; page-break-inside: avoid;">
           <tr>
             <td width="33%" align="right" style="vertical-align: top; padding: 10px; color: #ffffff;">
               <div style="font-weight: bold; text-align: right; font-size: 13px;">الجمهورية الجزائرية الديمقراطية الشعبية</div>
               <div style="margin-top: 5px; text-align: right; font-size: 12px;">المؤسسة: ${teacherInfo?.school || 'اسم المؤسسة'}</div>
             </td>
             <td width="34%" align="center" style="vertical-align: top; padding: 10px; color: #ffffff;">
               <div style="font-size: 16px; font-weight: bold; border-bottom: 2px solid rgba(255,255,255,0.4); padding-bottom: 4px; margin-bottom: 4px;">${typeLabel}</div>
               <div style="font-size: 14px; font-weight: bold;">المادة: ${teacherInfo?.subject || 'الرياضيات'}</div>
             </td>
             <td width="33%" align="left" style="vertical-align: top; padding: 10px; color: #ffffff;">
               <div style="text-align: left; font-size: 12px;">الأستاذ: ${teacherInfo?.firstName || ''} ${teacherInfo?.lastName || ''}</div>
               <div style="margin-top: 3px; text-align: left; font-size: 12px;">المستوى: ${teacherInfo?.level || ''}</div>
               ${subjectInfo?.domain ? `<div style="margin-top: 3px; text-align: left; font-size: 12px;">المجال/الميدان: ${subjectInfo.domain}</div>` : ''}
             </td>
           </tr>
         </table>
         

      9. **التكيف والتنظيم البيداغوجي للمذكرات حسب المنهاج الجزائري الجيل الثاني (المقاربة بالكفاءات Competency-Based Approach)**:
         عند طلب "مذكرة درس" (memo)، يجب الهيكلة والتنظيم الحصري الدقيق وفق مناهج الجيل الثاني المعتمدة رسمياً في المنظومة التربوية الجزائرية:
         
         🚨 **تحذير بيداغوجي حاسم وصارم جداً (ممنوع منعاً باتاً البدء بتعريف المورد أو ذكر أي تعريف في بداية المذكرة!)** 🚨:
         • **يُمنع منعاً كلياً وباتاً ومطلقاً أن تبدأ المذكرة بـ "تعريف" أو كتابة فقرة تشرح أو تعرّف الدرس أو المفهوم في البداية!**
         • في المنهاج الرسمي الجزائري والمقاربة بالكفاءات، يعتبر البدء بالتعريف خطأ بيداغوجياً جسيماً يرفضه المفتشون والمعلمون تماماً؛ لأن المتعلم هو من يجب أن يستكشف ويبني المعرفة ويستخلص المفهوم بنفسه من خلال الوضعية التعلمية.
         • **الترتيب البيداغوجي الحصري والإلزامي لمذكرة الدرس**:
           1️⃣ **جدول ترويسة الوثيقة وبطاقة معلومات المذكرة العليا فقط** (الأستاذ، المستوى، الميدان، المقطع، عنوان المورد، الكفاءة المستهدفة) - **يُمنع منعاً باتاً كتابة أي تعريف للمورد في هذه البطاقة!**
           2️⃣ **ثم الدخول مباشرة وفوراً في جدول سير الحصة البيداغوجية الرسمي ذي الأعمدة الأربعة بالمراحل الأربعة التالية حصراً**:
              - **المرحلة 1: التهيئة (تنشيط المكتسبات القبلية)**: (05 إلى 10 د) ➔ تقتصر فقط على تذكير بمكتسبات قبلية دقيقة من السنوات السابقة وسؤال تقويم تشخيصي تمهيدي لتنشيط الذاكرة. (**ممنوع قطعياً ذكر أي تعريف أو شرح أو قواعد لدرس اليوم هنا!**).
              - **المرحلة 2: وضعية تعلمية لاستخلاص الدرس**: (20 إلى 25 د) ➔ نص وضعية مشكلة واقعية محفزة + سندات وبيانات أو رسم SVG توضيحي + أسئلة استكشافية متدرجة (ملاحظة، تجريب، تحليل، استنتاج). المتعلم هو من يحلل ويستخلص المفهوم بنفسه دون إعطائه أي تعريف جاهز.
              - **المرحلة 3: حوصلة وما يتبعها**: (10 إلى 15 د) ➔ **هنا وفقط هنا** تتم الصياغة الرسمية للقاعدة / المبرهنة / التعريف / المفهوم الرياضي أو العلمي المستخلص، وتأطيره في صندوق إبراز جميل، يتبعه مباشرة مثال تطبيقي نموذجي محلول خطوة بخطوة وملاحظات منهجية وتنبيهات لتفادي الأخطاء الشائعة.
              - **المرحلة 4: إعادة الاستثمار**: (10 إلى 15 د) ➔ تمرين تطبيقي مستهدف لحل وضعية جديدة ومستقلة وتثبيت المكتسبات.

         أولاً: **بطاقة الكفاءات والموارد (أعلى المذكرة)**:
         أنشئ جدولاً رسمياً مؤطراً بعرض 100% يحتوي على معلومات المذكرة (الميدان، المقطع، عنوان المورد، الكفاءة الختامية والمركبة، الوسائل التعليمية).
         🔴 **تنبيه صارم**: لا تضع أي تعريف أو شرح للدرس داخل هذه البطاقة!

         ثانياً: **جدول سير الدرس البيداغوجي والتوقيت الرسمي (Official 4-Column Stages Table)**:
         يجب أن تكون المذكرة مبنية في مجملها داخل جدول بيداغوجي صريح وجميل يضم الأعمدة الأربعة:
         [ **المراحل** (عرض ~16%) | **أنشطة التعلم (سير التعلمات والأنشطة)** (عرض ~48%) | **مؤشرات الكفاءة** (عرض ~20%) | **التقويم** (عرض ~16%) ]

         تُكيّف المراحل البيداغوجية والتوقيت داخل الجدول وجوباً بحسب المادة كالتالي:
         
         • **مادة الرياضيات (Mathematics)**:
           1. **التهيئة (تنشيط المكتسبات القبلية)** (05 إلى 10 دقائق): تقويم تشخيصي، مراجعة دقيقة للمكتسبات القبلية ذات الصلة المباشرة بالمورد من السنوات الماضية (ممنوع أي تعريف للدرس هنا).
           2. **وضعية تعلمية لاستخلاص الدرس** (15 إلى 20 دقيقة): تقديم نص وضعية مشكلة تعلمية كاملة، السندات والرسوم، تعليمات البحث الفردي والجماعي، توجيهات الأستاذ، وصياغة الأسئلة الموجهة لاستخلاص المفهوم والقاعدة الرياضية.
           3. **حوصلة وما يتبعها** (15 إلى 20 دقيقة): التوصل للنص الرياضي والتعاريف والخواص والمبرهنات، يتبعها مباشرة مثال تطبيقي نموذجي محلول خطوة بخطوة وملاحظات منهجية وتنبيهات لتجنب الأخطاء الشائعة.
           4. **إعادة الاستثمار** (10 إلى 15 دقيقة): تطبيق مباشر، وحل تمارين مستهدفة لوضعيات جديدة من الكتاب المدرسي لقياس درجة تمكن المتعلم المستقل وتثبيت المكتسبات.

         • **مادة العلوم الفيزيائية والتكنولوجيا (Physics & Chemistry)**:
           1. **التهيئة (تنشيط المكتسبات القبلية)** (05 إلى 10 دقائق): تقويم تشخيصي واسترجاع المفاهيم الفيزيائية المرتبطة بدرس اليوم من الدروس السابقة.
           2. **وضعية تعلمية لاستخلاص الدرس (النشاط التجريبي والتقصي)** (20 دقيقة): طرح وضعية إشكالية من الحياة اليومية، عدة تجريبية، خطوات العمل، الملاحظة والتحليل لاستخلاص وتفسير الظاهرة الفيزيائية.
           3. **حوصلة وما يتبعها** (20 دقيقة): صياغة النتيجة والقوانين والوحدات النظامية، يتبعها مثال حسابي تطبيقي نموذجي محلول وملاحظات السلامة والمنهجية.
           4. **إعادة الاستثمار** (10 دقائق): حل وضعية تقويمية أو تطبيق حسابي مستهدف في سياق جديد.

         • **مادة علوم الطبيعة والحياة (Natural Sciences)**:
           1. **التهيئة (تنشيط المكتسبات القبلية)** (05 إلى 10 دقائق): مراجعة المفاهيم الحيوية السابقة وطرح المشكل العلمي.
           2. **وضعية تعلمية لاستخلاص الدرس (التقصي واختبار الفرضيات)** (20 دقيقة): دراسة وثائق وسندات ورسومات علمية، تحليل ومقارنة، واستخلاص الآليات والنتائج العلمية.
           3. **حوصلة وما يتبعها** (15 دقيقة): صياغة الخلاصة والمخطط التحصيلي، يتبعها تطبيق نموذجي وملاحظات وتنبيهات علمية.
           4. **إعادة الاستثمار** (15 دقيقة): وضعية تقويمية لقياس معايير الاستدلال العلمي والتحكم في المكتسبات.

         • **مادة اللغة العربية (Arabic Language)**:
           1. **التهيئة (تنشيط المكتسبات القبلية)** (05 دقائق): تمهيد وتذكير بالظاهرة اللغوية السابقة والتقويم التشخيصي.
           2. **وضعية تعلمية لاستخلاص الدرس (الملاحظة والتحليل)** (20 دقيقة): قراءة السند أو الشواهد، أسئلة الفهم والمناقشة، وتفكيك الظاهرة لاستخلاص قواعد الدرس.
           3. **حوصلة وما يتبعها** (20 دقيقة): استنتاج القاعدة اللغوية أو النحوية، يتبعها نموذج إعرابي أو تطبيقي محلول بالتفصيل وملاحظات وفروق دقيقة.
           4. **إعادة الاستثمار** (15 دقيقة): تطبيقات فورية وإعراب أو إنتاج كتابي موجه لتثبيت المورد.

         • **اللغات الأجنبية - فرنسية / إنجليزية (French & English)**:
           1. **التهيئة / Mise en train (Warm-up)** (05 min): Motivation & Brainstorming, activation des prérequis.
           2. **وضعية تعلمية لاستخلاص الدرس / Situation d'apprentissage pour dégager la leçon** (20 min): Text reading, hypothesis, corpus exploitation, discovery questions to elicit the target rule.
           3. **حوصلة وما يتبعها / Bilan & Structuration et ce qui s'ensuit** (20 min): Rule formulation, followed by guided worked examples and key grammatical notes.
           4. **إعادة الاستثمار / Réinvestissement & Application** (15 min): Independent reinvestment tasks and written/oral practice.

         • **التاريخ / الجغرافيا / التربية المدنية (Social Studies)**:
           1. **التهيئة (تنشيط المكتسبات القبلية)** (05 إلى 10 دقائق): التمهيد وطرح الإشكالية وربطها بالمكتسبات السابقة.
           2. **وضعية تعلمية لاستخلاص الدرس** (25 دقيقة): دراسة ونقد الخرائط والنصوص التاريخية والجغرافية واستغلال السندات لاستخلاص الحقائق والمفاهيم.
           3. **حوصلة وما يتبعها** (15 دقيقة): صياغة أفكار المنتوج الانتقائي والخلاصة، يتبعها مخططات مفاهيمية وملاحظات هامة.
           4. **إعادة الاستثمار** (10 دقائق): أسئلة تقويمية وتطبيقات لتثبيت المكتسبات في مواقف جديدة.

         • **التربية الإسلامية (Islamic Education)**:
           1. **التهيئة (تنشيط المكتسبات القبلية)** (10 دقائق): عرض السند الشرعي (آية أو حديث) وقراءته ومراجعة المعارف السابقة.
           2. **وضعية تعلمية لاستخلاص الدرس** (20 دقيقة): مناقشة بيداغوجية، شرح المفردات، تحليل مضامين النص لاستخلاص الأحكام والتوجيهات.
           3. **حوصلة وما يتبعها** (15 دقيقة): إرساء الأحكام والتوجيهات الإيمانية والسلوكية، يتبعها تطبيقات حياتية وملاحظات منهجية.
           4. **إعادة الاستثمار** (15 دقيقة): وضعية سلوكية تقويمية أو استظهار واستثمار المكتسبات.

         في جميع الحالات، يُظهر الجدول الألوان الرسمية الهادئة والمميزة لصف العناوين (var(--doc-color)) والحدود الواضحة مع استغلال المساحة بعرض 100%.

      تعليمات التصميم والهيكلة العامة والإطارات (General Design & Frame Guidelines):
      1. **تأطير البطاقات والأقسام (Card & Section Frames)**:
         - يجب حتماً تأطير كل تمرين، مسألة، وضعية تعلمية، أو قسم رئيسي داخل بطاقة/صندوق مؤطر بإطار محدد وجذاب (مثل: style="border: 1.5px solid var(--doc-color, #1e40af); border-radius: 8px; padding: 12px; margin-bottom: 12px; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);").
         - عناوين الأقسام والتمارين يجب إبرازها بشارات/أشرطة عناوين جميلة وخلفية ملونة (مثل: style="background-color: var(--doc-color, #1e40af); color: #ffffff; border-radius: 6px; padding: 6px 14px; font-weight: bold; display: inline-block; margin-bottom: 10px; font-size: 14px;").
         - الجداول (Tables) يجب أن تحتوي دائماً على حدود صريحة لجميع الخلايا (style="border: 1px solid var(--doc-color, #1e40af); border-collapse: collapse; width: 100%;") مع تلوين صف الهيدر بلون var(--doc-color) والنص باللون الأبيض.
      2. **ستايل التصميم (Design Style)**: المستخدم اختار النمط: "${designStyle}".
         التزم بالتوجيهات البصرية والدقيقة الخاصة بستايل التصميم المختار لضمان تطوير وتطبيق الهوية البصرية للـ Style:
         
         ${getDesignStyleInstructions(designStyle)}

         🔴 **تطبيق المحتويات البصرية والتربوية (Visual Educational Workbook System)**:
         - **تأطير التمارين والوضعيات (Framed Cards)**: كل تمرين، وضعية، أو نشاط مستهدف يجب أن يُغلّف داخل بطاقة (Card) مؤطرة بحدود متناسقة ولون خفيف لخلفية العنوان.
         - **بطاقات القوانين والمعادلات البارزة (Formula & Rule Cards)**: القواعد والقوانين الرياضية والفيزيائية والمطابقات الشهيرة يجب أن تُعرض داخل بطاقات متميزة (Formula Cards) بخلفية بارزة وإطار ملون سميك ورموز واضحة جداً لجعل القواعد بارزة ومستقلة عن باقي النص.
         - **تحويل الأمثلة إلى بطاقات مستقلة (Standalone Example Cards)**: يُمنع كتابة الأمثلة في شكل كتل نصية متتالية. يجب تحويل كل مثال إلى بطاقة مستقلة صغيرة تحتوي على: شارة رقم المثال، المطلوب، العملية/الخطوة، والنتيجة النهائية داخل صندوق إبراز ملون صغير. عند وجود أمثلة متعددة، ينبغي تنظيمها في عمودين متجاورين (flex / 2-column grid).
         - **الأيقونات والرموز التعليمية البيداغوجية (Pedagogical Icons & Badges)**: أضف دائماً أيقونات تعليمية بجانب عناوين الأقسام الرئيسية صراحة:
           * 📐 للقاعدة والقانون
           * 💡 للملاحظة والتنبيه
           * ✍️ للأمثلة والتطبيقات
           * 🎯 للحوصلة والاستنتاج
           * 🔍 لأكتشف وأتقصى
           * 🧪 للبرهان والنشاط التجريبي
           * 🏋️ للتمرين وأطبق
         - **تضمين الأشكال والرسومات التوضيحية البيداغوجية (Relevant Educational Illustrations & Diagrams)**:
           عند وجود مفهوم رياضي أو علمي يتطلب توضيحاً بصرياً (مثل: المتطابقات الشهيرة، مساحة الشكل والمستطيل، القسمة الإقليدية بحدودها الأربعة، الأشكال الهندسية، الدوائر الكهربائية، الخلية الحية...)، ضع رسماً ناصعاً ونقياً بإنلاين SVG توضيحي يرتبط مباشرة بالمفهوم ويوضح القاعدة ببراعة (مثلاً: رسم هندسي مقسّم لمربع مجموع عددين للمتطابقات الشهيرة (a+b)²، أو جدول القسمة الإقليدية بأسماء أطرافها المقسوم والقاسم والحاصل والباقي).
         - **التنسيق الجانبي والمرن (Side-by-Side Two-Column Layout)**: عند وجود شرح طويل أو قاعدة ورسمة، استخدم تنسيقاً مرناً يضع (الشرح | الصورة) أو (الصورة | الشرح) جنباً إلى جنب مع مراعاة اتجاه النص RTL.
         - **الفواصل البصرية والعناصر الديكورية (Visual Separators & Accents)**: استخدم خطوطاً فاصلة متقطعة أنيقة (style="border-top: 2px dashed var(--doc-color, #1e40af); opacity: 0.3; margin: 16px 0;") وأشرطة جانبية ملونة لكسر رتابة النص ومنح الوثيقة مظهر دفتر تعليمي بائع واحترافي (Educational Workbook).
         - **العلامات والنقاط**: ضع شارات نقاط التمارين بأسلوب كبسولة أنيقة (مثل: (06 نقاط)).
         - **الطباعة الناصعة**: جميع نصوص الأسئلة الشارحة والفقرات يجب أن تكون باللون الأسود الناصع (color: #000000;) للحصول على أعلى جودة طباعة وتصدير.
      3. **ستايل المضمون (Content Style)**: المستخدم اختار "${contentStyle}".
         - "مختصر هادف": استخدم نقاطاً قصيرة، جداول صغيرة مركزة، وتخلص من الحشو.
         - "مفصل": تعمق في الشرح، أضف أمثلة، تفريعات كثيرة، وجداول موسعة.
         - "مضمون عادي": توازن معتاد.
       4. **وضوح لون نصوص التمارين والطباعة**: يجب أن تكون نصوص جميع الأسئلة والتمارين والفقرات باللون الأسود الداكن الناصع (color: #000000;) على خلفية الورقة البيضاء، ويُمنع منعاً باتاً استخدام اللون الأصفر أو الفاتح في نص التمارين.
      5. **الأشكال والرسومات (ممنوع منعاً باتاً ASCII Art)**:
         - 🔴 **ممنوع منعاً باتاً ومطلقاً استخدام الرسومات النصية أو ASCII Art مثل / \\ أو M--N أو +---+ أو |---| نهائياً!** أي رسم نصي أو رمزي هو خطأ جسيم غير مقبول.
         - إذا كان المحتوى يحتاج رسماً هندسياً أو علمياً (مثلث، توازي، طالس، فيثاغورس، دارة كهربائية، ميزان، أشرطة كسور، محاور إحداثيات)، **يجب حتماً وحصراً رسمه بواسطة كود <svg> متكامل ونظيف وملون ومتقن** بأضلاع ملونة، زوايا قائمة، وتسميات رؤوس واضحة.
      6. **العلامة المائية (Watermark)**: ${includeWatermark ? 'المستخدم طلب علامة مائية. أضف عنصر <div> كأول عنصر في body. أعطه الكلاس `watermark-bg` فقط بدون أي inline styles. وضع بداخله رسمة SVG تناسب المادة.' : 'المستخدم لم يطلب علامة مائية. لا تضف أي علامة مائية.'}
      7. اللغة: التزم بلغة الوثيقة ${documentLanguage} مع ضبط اتجاه النص (RTL للعربية، LTR للغات الأجنبية).`;
      
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
      - الفصل الدراسي: ${subjectInfo?.term || ''}
      - التوقيت والمدة: ${subjectInfo?.duration || ''} (هام جداً: ضع رمز/أيقونة ساعة SVG تعبر عن التوقيت تتناسب مع ستايل التصميم المختار)
      - عدد التمارين المطلوبة صراحة: ${subjectInfo?.targetExercisesCount ? `${subjectInfo.targetExercisesCount} تمارين` : 'تلقائي وفقاً للمعايير البيداغوجية والمدة'}

      🚨 **أمر بيداغوجي صارم للتوليد المباشر وفق المنهاج الوزاري المعتمد**:
      1️⃣ **التكيف التلقائي الذكي مع الفصل والمستوى والمادة**:
         - المستوى: ${teacherInfo?.level || ''} | المادة: ${teacherInfo?.subject || ''} | الطور: ${teacherInfo?.phase || ''} | الفصل: ${subjectInfo?.term || ''} | نوع التقويم: ${subjectInfo?.examType || ''}.
         - يمتلك الذكاء الاصطناعي **الحرية البيداغوجية الشاملة والذكية** لاختيار وصياغة تمارين واختبارات متدرجة ومتوازنة تتوافق **تماماً وحصرياً** مع المنهاج الرسمي المعتمد لدروس **${subjectInfo?.term || 'الفصل المختار'}** لهذا المستوى والمادة (مثال: إذا كان الفصل الأول تجلب دروس الفصل الأول فقط، وإذا كان الفصل الثاني تجلب دروس الفصل الثاني...).
         - إذا ترك المعلم مدخلات المقاطع فارغة، يقوم الذكاء الاصطناعي تلقائياً باختيار أهم المحاور والدروس المبرمجة في هذا الفصل الدراسي وصياغة أسئلة متنوعة ومتطابقة مع توقيت ${subjectInfo?.duration || 'التقويم'}.

      2️⃣ **عدد التمارين الإجباري**:
         ${subjectInfo?.targetExercisesCount ? `يجب صياغة بالضبط **${subjectInfo.targetExercisesCount} تمارين** مؤطرة ومستقلة (التمرين الأول، التمرين الثاني، ... إلخ) قبل الوضعية الإدماجية إن فُعّلت.` : 'صغ عدداً متوازناً ومناسباً من التمارين (عادة تمرينين إلى 3 تمارين) يناسب توقيت التقويم.'}
      ` : ''}
      ${subjectInfo ? JSON.stringify(subjectInfo, null, 2) : ''}
      
      **توجيهات إضافية وتحديد ستايل التصميم:**
      ${aiPrompt || 'قم بتصميم أنيق واحترافي.'}
      
      ${generationType === 'test' ? `
      🚨 **أمر بيداغوجي صارم وإجباري لموضوع الفرض / الاختبار** 🚨:
      🎨 **التعامل مع الرسومات والأشكال الهندسية والبيانية**:
      - إذا كان التمرين يحتاج إلى رسم هندسي أو شكل توضيحي (مثل: مثلث، معلم متعامد، دارة كهربائية، أنبوب اختبار، رسم بياني...):
        1️⃣ يُفضل تضمين كود SVG متناسق ونظيف ومباشر يوضح الشكل المطلوب بدقة.
        2️⃣ أو اترك إطاراً مؤطراً ومخططاً بخطوط شبكية منقطة أنيقة يحمل عنوان: **[مساحة مخصصة للرسم والتخطيط الهندسي / البياني]** لتتيح للأستاذ أو التلميذ الرسم عليه أو وضع الأشكال التفاعلية.

      ${(subjectInfo?.hasIntegrationSituation || req.body.hasIntegration) ? `
      📌 **شروط صياغة الوضعية الإدماجية المركبة**:
      يجب تخصيص الجزء الثاني من الفرض/الاختبار لوضعية إدماجية مركبة ومستقلة (تخصص لها 08 نقاط من 20 نقطة) تحتوي على:
      • **السياق والسندات**: نص مشكلة واقعي ومحفز مع سندات توضيحية أو جدول معطيات.
      ${subjectInfo?.integrationSections ? `• **المقاطع المستهدفة بالإدماج**: ${subjectInfo.integrationSections}` : ''}
      ${subjectInfo?.integrationCompetencies ? `• **الكفاءات والقدرات المستهدفة**: ${subjectInfo.integrationCompetencies}` : ''}
      ${subjectInfo?.integrationPrompt ? `• **توجيه خاص بسياق الوضعية والإدماج**: ${subjectInfo.integrationPrompt}` : ''}
      • **التعليمات**: أسئلة متدرجة ومترابطة تحث المتعلم على استثمار الموارد المدمجة.
      ` : ''}

      ${(subjectInfo?.includeSolution || req.body.includeSolution) ? `
      🔴 **المستخدم تفضل بطلب [تضمين الحل النموذجي]**:
      1️⃣ قم أولاً بصياغة موضوع الفرض/الاختبار كاملاً بالترويسة الرسمية والملاحظات والتمارين بأسئلتها المستقلة وسلالم التنقيط ([XX نقطة]) دون كتابة أي حل أو إجابات تحت الأسئلة إطلاقاً داخل موضوع الفرض.
      2️⃣ بعد انتهاء موضوع الفرض تماماً، أنشئ فاصلاً صريحاً بين الصفحات للطباعة:
         \`<div style="page-break-before: always; margin-top: 30px; border-top: 2px dashed var(--doc-color, #1e40af); padding-top: 20px;"></div>\`
      3️⃣ أنشئ قسماً جديداً ومستقلاً تماماً في الأسفل بعنوان بارز ومؤطر: **"التصحيح النموذجي وشبكة التنقيط لـ ${subjectInfo?.examType || 'الفرض'}"**.
         يتضمن هذا القسم الإجابات النموذجية المفصلة مقسمة لكل تمرين مع سلم درجات واضح لكل سؤال جزئي.
      ` : `
      🔴 **المستخدم لم يطلب الحل النموذجي (موضوع فرض/اختبار فقط)**:
      يُمنع منعاً باتاً صياغة أي إجابات أو "حل نموذجي" تحت الأسئلة أو داخل موضوع الفرض!
      قم بصياغة موضوع الفرض/الاختبار فقط، يحتوي على الترويسة الرسمية، الملاحظات الهامة، والتمارين بأسئلتها المنسقة مع علامة كل تمرين [XX نقطة]، دون كتابة أي حلول أو إجابات نهائياً.
      `}
      ` : ''}

      ${generationType === 'memo' ? `
      🚨 **أمر بيداغوجي صارم وإجباري لمذكرة الدرس في جميع المواد (مناهج الجيل الثاني - الجزائر 2nd Generation)** 🚨:
      🔴 **تحذير حاسم وقاطع: المذكرة لا تبدأ أبداً بأي تعريف! ممنوع منعاً باتاً ومطلقاً البدء بتعريف المورد أو كتابة فقرة تشرح الدرس في البداية!**
      يجب على الذكاء الاصطناعي الالتزام الصارم والدقيق بهيكلة مذكرة الدرس الرسمية:
      (1. التهيئة ➔ 2. وضعية تعلمية لاستخلاص الدرس ➔ 3. حوصلة وما يتبعها ➔ 4. إعادة الاستثمار).
      أي تعريف يُذكر في البداية أو في بطاقة معلومات المذكرة أو في مرحلة التهيئة يعتبر ساقطاً ومرفوضاً بيداغوجياً!
      التعريف والقواعد تظهر **حصراً وفقط داخل المرحلة الثالثة (حوصلة وما يتبعها)** بعد استخلاصها!
      1️⃣ **جدول بطاقة المذكرة البيداغوجية العليا (Top Pedagogical Info Grid)**:
         أنشئ جدولاً رسمياً مؤطراً بعرض 100% بخلفية var(--doc-color) أو حدود واضحة ("<table width='100%' border='1' cellpadding='6' ...>") يحتوي على:
         - السطر 1: [ **مذكرة رقم**: ${subjectInfo?.memoNumber || '1'} ] | [ **الأستاذ**: ${teacherInfo?.firstName || ''} ${teacherInfo?.lastName || ''} ]
         - السطر 2: [ **الميدان / المجال**: ${subjectInfo?.domain || 'أنشطة عددية / الميدان المعتمد'} ] | [ **المستوى**: ${teacherInfo?.level || ''} ]
         - السطر 3: [ **المقطع التعلمي**: ${subjectInfo?.section || subjectInfo?.unit || 'المقطع المستهدف'} ] | [ **المراجع**: الكتاب المدرسي، المنهاج، الوثيقة المرافقة، دليل الأستاذ ]
         - السطر 4: [ **الباب / المحور**: ${subjectInfo?.section || 'المحور المبرمج'} ] | [ **الوسائل**: سبورة، أقلام ملونة، مساطر/أجهزة قياس، داتاشو (اختياري) ]
         - السطر 5: [ **المورد المعرفي**: ${subjectInfo?.content || subjectInfo?.topic || 'عنوان الدرس والمورد المستهدف'} ] | [ **المدة**: ${subjectInfo?.duration || 'ساعة واحدة (1 سا)'} ]
         - السطر 6 (ممتد لكامل العرض): [ **الكفاءة المستهدفة**: صياغة الكفاءة الختامية والمركبة المراد تحقيقها لدى المتعلم بدقة وبصياغة تربوية احترافية ]

      2️⃣ **جدول سير الحصة البيداغوجية الرسمي (Official 4-Column Stages Table)**:
         أنشئ جدول HTML رئيسي بعرض 100% ("<table width='100%' border='1' cellpadding='8' cellspacing='0' style='width: 100%; border-collapse: collapse; page-break-inside: auto;'>")
         يحتوي على الألوان الرسمية والحدود الواضحة بـ الأعمدة الأربعة من اليمين إلى اليسار:
         [ **المراحل** (عرض ~16%) | **أنشطة التعلم (سير التعلمات والأنشطة)** (عرض ~48%) | **مؤشرات الكفاءة** (عرض ~20%) | **التقويم** (عرض ~16%) ]

         🔴 **المحطات والصفوف الأربعة الإلزامية بالترتيب والأسماء الصريحة**:
         • **المرحلة 1: التهيئة** (المدة: 05 - 10 د):
           - عمود المراحل: اكتب نصاً صريحاً: **التهيئة (تنشيط المكتسبات القبلية)**
           - عمود أنشطة التعلم: يحتوي وجوباً على عنوان بارز **التهيئة ومراجعة المكتسبات القبلية** (🔴 يُمنع كتابة كلمة "مقدمة"! يجب كتابة "تهيئة" حصرياً) يتضمن:
             * **تذكير صريح بالمكتسبات القبلية**: تذكير بمفهوم أو قاعدة دقيقة درسها التلميذ في **العام الماضي أو السنوات الماضية** وتخدم درس اليوم مباشرة.
             ${subjectInfo?.memoWarmup ? `* **توجيهات المعلم الخاصة بالتهيئة**: ${subjectInfo.memoWarmup}` : ''}
             * **سؤال تقويم تشخيصي محدد**: سؤال مباشر أو تمرين تمهيدي قصير لقياس استحضار التلاميذ لتلك المعارف وتنشيط ذاكرتهم قبل بدء المورد الجديد.
           - عمود مؤشرات الكفاءة: يسترجع المكتسبات القبلية للسنوات السابقة، يربط بين المكتسبات والمورد الجديد.
           - عمود التقويم: **تشخيصي**: مدى استحضار التلميذ لمعارف السنوات السابقة وجاهزيته للانطلاق.
         
         • **المرحلة 2: وضعية تعلمية لاستخلاص الدرس** (المدة: 20 - 25 د):
           - عمود المراحل: اكتب نصاً صريحاً: **وضعية تعلمية لاستخلاص الدرس**
           - عمود أنشطة التعلم: 🔴 **إجباري وأساسي جداً (يمنع الاختصار)**: يجب صياغة **وضعية تعلمية هادفة ومفصلة تقود بالضرورة لاستخلاص موضوع وقواعد الدرس** (Situation d'apprentissage pour dégager la leçon) داخل بطاقة مميزة class="situation-card avoid-break":
             * **عنوان بارز**: 🧭 **وضعية تعلمية لاستخلاص الدرس**
             * **السياق والنص المشكل**: نص وضعية مشكلة واقعية محفزة تضع التلميذ أمام تحدٍ وتساؤل يدعو لاستكشاف المورد وبناء المعرفة الجديدة.
             ${subjectInfo?.memoLearningSituation ? `* **توجيهات وسياق الوضعية من المعلم**: ${subjectInfo.memoLearningSituation}` : ''}
             * **السندات والمعطيات**: جدول بيانات، قيم عددية، أو **رسم توضيحي هندسي/علمي دقيق بـ inline SVG ملون** (ممنوع منعاً باتاً أي رسم نصي أو رمزي ASCII).
             * **التعليمات والأسئلة الاستكشافية المتدرجة (لاستخلاص الدرس ومفاهيمه)**:
               - التعليمة 1: سؤال ملاحظة وتحليل السندات والمعطيات واستخراج المؤشرات.
               - التعليمة 2: سؤال تجريب / مقارنة / تفكيك العلاقات للوصول إلى الخاصية أو المفهوم الجديد.
               - التعليمة 3: سؤال استنتاج وتخمين رياضي/علمي يصيغ المفهوم الجديد تمهيداً لإرسائه في الحوصلة، بحيث يكون استنتاج الدرس ثمرة مباشرة ومكتشفة من طرف التلميذ.
             * **مهام وسير النشاط**:
               - دور الأستاذ: يطرح الوضعية ويوجه الحوار الأفقي ويحفز الاستنتاج دون إعطاء الحل المباشر.
               - دور المتعلم: يحلل السندات، يعمل فردياً ثم في أفواج صغيرة، ويصوغ الفرضيات ويشارك في استخلاص القاعدة.
           - عمود مؤشرات الكفاءة: يحلل السند ويستخرج المعطيات، يفسر العلاقات، ويستخلص المفهوم الجديد.
           - عمود التقويم: **تكويني**: تشخيص مدى تقدم المتعلم في التقصي والتحليل وبناء المورد واستخلاص أفكار الدرس.
         
         • **المرحلة 3: حوصلة وما يتبعها** (المدة: 10 - 15 د):
           - عمود المراحل: اكتب نصاً صريحاً: **حوصلة وما يتبعها**
           - عمود أنشطة التعلم: يحتوي وجوباً على عنوان بارز **حوصلة الدرس وما يتبعها من قواعد وأمثلة** يتضمن:
             * **أولاً - الحوصلة وإرساء الموارد**: صياغة دقيقة وصريحة للقاعدة / التعريف / المبرهنة / المفهوم الرياضي أو العلمي المستخلص، مؤطرة في صندوق إبراز جميل بلون var(--doc-color).
             ${subjectInfo?.memoSummary ? `* **توجيهات المعلم للحوصلة والقواعد**: ${subjectInfo.memoSummary}` : ''}
             * **ثانياً - ما يتبع الحوصلة (أمثلة تطبيقية ونماذج وتنبيهات)**:
               - **مثال تطبيقي نموذجي مفصل ومحلول خطوة بخطوة**: تمرين محلول يوضح للتلميذ كيفية تطبيق القاعدة أو المفهوم المستخلص عملياً بالخطوات الرياضية والمنهجية.
               - **ملاحظات وتنبيهات بيداغوجية**: إضاءات منهجية، حالات خاصة، أو أخطاء شائعة ينبغي تفاديها.
           - عمود مؤشرات الكفاءة: يستوعب القاعدة، يستعمل المصطلحات الدقيقة، ويطبق الخطوات النموذجية.
           - عمود التقويم: **استنتاجي**: مدى استيعاب التلميذ للقاعدة والقدرة على تطبيقها.
         
         • **المرحلة 4: إعادة الاستثمار** (المدة: 10 - 15 د):
           - عمود المراحل: اكتب نصاً صريحاً: **إعادة الاستثمار**
           - عمود أنشطة التعلم: يحتوي وجوباً على عنوان بارز **إعادة الاستثمار وتثبيت المكتسبات** يتضمن:
             * **تمرين تطبيقي مستهدف لحل وضعية جديدة**: تطبيق مباشر أو تمرينين مستهدفين لقياس قدرة المتعلم المستقلة على حل وضعية مغايرة وتثبيت المورد المكتسب في الذاكرة طويلة المدى.
             ${subjectInfo?.memoReinvestment ? `* **توجيهات المعلم لإعادة الاستثمار**: ${subjectInfo.memoReinvestment}` : ''}
           - عمود مؤشرات الكفاءة: يستثمر المورد المعرفي الجديد في حل وضعيات وتطبيقات جديدة باستقلالية.
           - عمود التقويم: **تحصيلي / ختامي**: مدى تمكن المتعلم من حل التمرين بشكل مستقل وصحيح.
         
         🔴 كل صف tr يجب أن يحتوي على style="page-break-inside: avoid; break-inside: avoid;" لضمان عدم شطر أي صف أو مرحلة عند الطباعة والتصدير.
      ` : ''}

      أخرج كود HTML مرتب، مع استخدام جدول HTML صريح للترويسة العليا لضمان توافقه التام مع Microsoft Word عند التصدير.
      اجعل التصميم يشبه النماذج الاحترافية جداً، مزخرف على الجوانب بإطارات ورسومات، ووفر المساحة (استغل كامل عرض الورقة). لا تترك هوامش فارغة ضخمة.
      
      🚨 **قواعد صارمة جداً لمنع الفراغات الزائدة، وضبط صفحات التصدير، وتباين الألوان**:
      
      1️⃣ **منع الفراغات الزائدة وتقليل عدد الصفحات (Compact Density)**:
         - قلل الفراغات العمودية (margin, padding) بين العناصر والفقرات والجداول (اجعل padding 6px 10px في بطاقات التمارين والمستندات، و margin-bottom 8px-10px فقط).
         - اجعل الترويسة مضغوطة ومنسقة (padding: 6px 8px; margin-bottom: 8px) لملء كامل مساحة الصفحة الأولى وتجنب ترك نصف الصفحة فارغاً.
         - تجنب ترك أي هوامش سفلية (margin-bottom) مبالغ فيها، ولا تستخدم وسوم <br> فارغة إطلاقاً.

      2️⃣ **الضبط المحكم والذكي لتقسيم الصفحات (Content-Aware Page Break Mechanics)**:
         - 🔴 **ممنوع تماماً أن يظهر الفاصل بين الصفحات في منتصف بطاقة أو مثال أو قانون أو معادلة أو سطر نص أو بين سؤال وحيز إجابته!**
         - تجنب تغليف كامل المستند أو جميع الأقسام بمغلف خارجي واحد يمتلك page-break-inside: avoid حتى لا يقفز المستند بأكمله.
         - **الهيكلة الذرية للمحتوى (Atomic Elements)**: يجب تغليف كل عنصر تعليمي مستقل (كل مثال بمفرده مثل "مثال 1" في بطاقة و "مثال 2" في بطاقة مستقلة، كل تمرين، كل صندوق قانون/قاعدة، كل بطاقة حوصلة، كل رسم توضيحي) داخل بطاقة صغيرة مستقلة مسبوقة بـ class="example-card avoid-break" أو class="exercise-card avoid-break" أو class="card avoid-break". لا تجمع عدة أمثلة داخل حاوية واحدة كبيرة جداً!
         - عند انتقال الصفحة، ينتقل التمرين أو المثال أو القاعدة بالكامل إلى الصفحة التالية بأسلوب ذكي ورزين دون قص أي عنصر أو شطر أي سطر نصي.
         - بالنسبة للجداول: اجعل الجدول نفسه قابلاً للتنقل بين الصفحات table { page-break-inside: auto; break-inside: auto; } مع الحفاظ على صيانة كل صف tr, th, td { page-break-inside: avoid; break-inside: avoid; } لضمان عدم قطع الخلايا أو الأسطر.

      3️⃣ **منع الخط الأصفر والتباين العالي للطباعة والتصدير (Dark High-Contrast Text)**:
         - 🔴 **يُمنع منعاً باتاً** كتابة النصوص أو العناوين الفرعية أو البرهان أو النقاط بخط أصفر أو باهت على خلفية بيضاء ("color: yellow", "color: #eab308", "color: #f59e0b", "color: #d97706").
         - يجب أن تكون كافة النصوص والفقرات والرموز والبرهان والتمارين والعناوين الفرعية (مثل: • البرهان:، • أمثلة:، مثال 1، مثال 2...) مكتوبة بخط أسود ناصع داكن "#000000" أو "#0f172a" لضمان الوضوح التام والقراءة الممتازة.
         - لون الهوية "var(--doc-color)" يُستخدم فقط كخلفية داكنة للترويسة الرئيسية أو شارات العناوين الكبيرة مع كتابة النص داخلها باللون الأبيض الصريح "#ffffff"، أو يُستخدم للحدود والرموز الخارجية، ولا يُستخدم مطلقاً لطلاء نصوص الفقرات أو عناوين النقاط الفرعية على خلفية بيضاء.
      `;

      let response;
      let retries = Math.min(10, apiKeys.length);
      let attempts = 0;
      let lastError;
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
          recordKeyUsage(apiKey).catch(() => {});
          break; // Success
        } catch (error: any) {
          lastError = error;
          attempts++;
          const errMsg = error?.message || String(error);
          console.error(`Attempt ${attempts} failed:`, errMsg);
          
          const isRateLimit = error?.status === 429 || errMsg.includes('429') || errMsg.includes('quota');
          recordKeyError(apiKey, errMsg, isRateLimit).catch(() => {});

          if (error.status === 429) {
            continue;
          } else if (error.status === 503) {
            await new Promise(resolve => setTimeout(resolve, 300));
            continue;
          } else if (attempts >= retries) {
            throw error;
          }
        }
      }

      if (!response) {
        throw lastError || new Error("Failed to generate content");
      }

      let htmlContent = response.text || "";
      // Clean up markdown code blocks if the model adds them despite instructions
      htmlContent = htmlContent.replace(/```html/gi, '').replace(/```/g, '');
      
      // Post-process memo to ensure no rogue definition element was accidentally placed before the stages table
      if (generationType === 'memo') {
        // If there is a stray <div>, <p>, or <h*> right before the pedagogical table starting with تعريف or التعريف, remove it
        htmlContent = htmlContent.replace(/<(div|p|h[2-4])[^>]*>\s*(?:<strong>|<b>)?\s*(?:ال)?تعريف(?:\s*المورد|\s*الدرس|:)?\s*(?:<\/(?:strong|b)>)?[\s\S]*?<\/\1>\s*(?=<table[^>]*>(?:(?!الجمهورية|المؤسسة)[\s\S])*?(?:المراحل|التهيئة))/gi, '');
        htmlContent = splitMemoIntoSheets(htmlContent);
      } else if (generationType === 'test' || generationType === 'series') {
        htmlContent = splitTestIntoSheets(htmlContent);
      }
      // Strip <style> tags to prevent breaking the main app UI
      htmlContent = htmlContent.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
      // Strip <script> tags to prevent execution
      htmlContent = htmlContent.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
      // Prevent fixed position which breaks the React layout
      htmlContent = htmlContent.replace(/position\s*:\s*fixed/gi, 'position: absolute');
      // Also prevent viewport sizing that might cover everything
      htmlContent = htmlContent.replace(/100vw/gi, '100%').replace(/100vh/gi, '100%');

      res.json({ content: htmlContent });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during generation." });
    }
  });

  app.post("/api/expert", async (req, res) => {
    try {
      const apiKeys = getApiKeys();
      if (apiKeys.length === 0) {
        return res.status(500).json({ error: "No API keys configured" });
      }

      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array is required" });
      }

      const systemInstruction = `أنت الخبير التربوي دالي نجيب، خبير في الشؤون التربوية، البيداغوجيا، الديداكتيك، قوانين التدريس، واجبات المعلم، علم النفس التربوي، حساب الدرجات، الترقيات، وكل ما يخص مسار الأستاذ مهنياً.
يجب أن تجيب على أسئلة الأستاذ بلغة عربية سليمة وواضحة، وبأسلوب مهني وأخوي.
دائما في نهاية إجابتك، قم بطرح سؤال قصير لاختبار مدى استيعاب الأستاذ للشرح الذي قدمته له لتتأكد من فهمه، ويجب أن يكون السؤال متعلقا حصريا بالموضوع الذي سأل عنه الأستاذ للتو.`;

      let response;
      let retries = 3;
      let attempts = 0;
      let lastError;

      // Transform messages into Gemini format & clean up order
      let sanitizedMessages = messages
        .filter((m: any) => m && m.content && String(m.content).trim() !== '')
        .map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(m.content) }]
        }));

      // Gemini API REQUIRES the conversation to start with 'user' role
      const firstUserIndex = sanitizedMessages.findIndex((m: any) => m.role === 'user');
      if (firstUserIndex === -1) {
        return res.status(400).json({ error: "At least one user message is required" });
      }
      if (firstUserIndex > 0) {
        sanitizedMessages = sanitizedMessages.slice(firstUserIndex);
      }

      while (attempts < retries) {
        try {
          const apiKey = apiKeys[currentKeyIndex % apiKeys.length];
          currentKeyIndex++;

          const ai = new GoogleGenAI({ apiKey });

          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: sanitizedMessages,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          break; // Success
        } catch (error: any) {
          lastError = error;
          attempts++;
          console.error(`Expert API Attempt ${attempts} failed:`, error.message || error);
          
          if (error.status === 429) {
            continue;
          } else if (error.status === 503) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          } else if (attempts >= retries) {
            throw error;
          }
        }
      }

      if (!response) {
        throw lastError || new Error("Failed to generate content");
      }

      res.json({ content: response.text });
    } catch (error: any) {
      console.error("Gemini Expert API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during generation." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
