import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Gather all API keys from environment
const getApiKeys = () => {
  const keys: string[] = [];
  if (process.env.GEMINI_API_KEY) keys.push(process.env.GEMINI_API_KEY);
  
  // Also look for GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('GEMINI_API_KEY_') && process.env[key]) {
      keys.push(process.env[key] as string);
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
         

      9. **التكيف والتنظيم البيداغوجي للمذكرات حسب المادة (Pedagogical Structure per Subject)**:
         عند طلب "مذكرة درس" (memo)، يجب الهيكلة والتنظيم الحصري وفق المحطات والمراحل البيداغوجية المعتمدة رسمياً في المنظومة التربوية الجزائرية بحسب المادة:
         
         • **إذا كانت المادة رياضيات (Mathematics)**:
           تُقسم المذكرة وجوباً وبوضوح إلى 4 محطات بيداغوجية رسمية بالترتيب:
           1. **التهيئة (أو التمهيد / تقويم تشخيصي)**: تهيئة الذهن ومراجعة المكتسبات القبلية ذات الصلة بالمورد.
           2. **الوضعية التعلمية (أو وضعية الانطلاق / الاكتشاف)**: تقديم وضعية مشكلة تعلمية استكشافية، صياغة المشكل الرياضي، مع سير البحث والتحليل واكتشاف المفهوم.
           3. **الحوصلة (أو إرساء الموارد / الخلاصة والنص الرياضي)**: صياغة المورد المعرفي الجديد، التعاريف، القوانين، والمبرهنات الرياضية بدقة وبشكل مبرز داخل إطار أنيق بخط واضح ومميز.
           4. **إعادة الاستثمار (أو التقويم والتطبيق)**: تمارين تطبيقية مباشرة وسلسلة تقويمية لقياس ومدى تحكم المتعلم في المورد الرياضي المستهدف.

         • **إذا كانت المادة علوم فيزيائية وتكنولوجيا (Physics & Chemistry)**:
           تتكون المذكرة من: 1) التهيئة والوضعية المشكلة الانطلاقية. 2) النشاط التعلمي والتجريب والملاحظة. 3) إرساء الموارد المعرفية والخلاصة والقوانين. 4) التقويم وإعادة الاستثمار.

         • **إذا كانت المادة علوم الطبيعة والحياة (Natural Sciences)**:
           تتكون المذكرة من: 1) وضعية الانطلاق وتحديد المشكل العلمي. 2) التقصي والنشاطات وصياغة/اختبار الفرضيات. 3) التركيب المعرفي والخلاصة. 4) التقويم والتحقق من المكتسبات.

         • **إذا كانت مادة لغات (عربية، فرنسية، إنجليزية)**:
           تتكون المذكرة من: 1) الوضعية الانطلاقية (التهيئة). 2) الملاحظة والفهم والتحليل. 3) التركيب واستنتاج القاعدة. 4) الأجرأة والتطبيق (إعادة الاستثمار).

         • **إذا كانت مادة تاريخ / جغرافيا / تربية إسلامية / تربية مدنية**:
           تتكون المذكرة من: 1) التمهيد والوضع المشكل. 2) بناء التعلمات والتحليل. 3) المنتوج الانتقائي والخلاصة. 4) التقويم المرحلي وإعادة الاستثمار.

         في كل مرحلة من هذه المحطات، صمم عنواناً بارزاً بخلفية ملونة أنيقة، واجعل المضمون منظماً بوضوح إما في بطاقات أو في جدول سير الدرس (سير النشاطات / أنشطة المعلم / أنشطة المتعلم / مؤشرات التقويم).

      تعليمات التصميم والهيكلة العامة:
      1. ستايل التصميم (Design Style): المستخدم اختار "${designStyle}". طبق هذا النمط من خلال الألوان المتدرجة، أشكال العناوين، الزوايا المنحنية، والخطوط للفقرات والبطاقات الداخلية. 
      2. ستايل المضمون (Content Style): المستخدم اختار "${contentStyle}".
         - "مختصر هادف": استخدم نقاطاً قصيرة، جداول صغيرة مركزة، وتخلص من الحشو.
         - "مفصل": تعمق في الشرح، أضف أمثلة، تفريعات كثيرة، وجداول موسعة.
         - "مضمون عادي": توازن معتاد.
      3. **الجداول**: الجداول يجب أن تكون بعرض 100%. لون صف العناوين بـ var(--doc-color).
      4. **الأشكال والرسومات**: أضف أشكال (SVG) بسيطة فقط إذا لزم الأمر، لا تحاول توليد صور معقدة أو روابط خارجية لصور.
      5. **العلامة المائية (Watermark)**: ${includeWatermark ? 'المستخدم طلب علامة مائية. أضف عنصر <div> كأول عنصر في body. أعطه الكلاس `watermark-bg` فقط بدون أي inline styles. وضع بداخله رسمة SVG تناسب المادة.' : 'المستخدم لم يطلب علامة مائية. لا تضف أي علامة مائية.'}
      6. اللغة: التزم بلغة الوثيقة ${documentLanguage} مع ضبط اتجاه النص (RTL للعربية، LTR للغات الأجنبية).`;
      
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
      
      تنبيه بيداغوجي هام جداً:
      إذا كانت هذه الوثيقة مذكرة درس (memo)، يرجى تطبيق الهيكلة البيداغوجية الرسمية الخاصة بمادة "${teacherInfo?.subject || 'الرياضيات'}" بكل دقة (مثل: التهيئة، الوضعية التعلمية، الحوصلة، وإعادة الاستثمار لمادة الرياضيات).
      
      أخرج كود HTML مرتب، مع استخدام جدول HTML صريح للترويسة العليا لضمان توافقه التام مع Microsoft Word عند التصدير.
      اجعل التصميم يشبه النماذج الاحترافية جداً، مزخرف على الجوانب بإطارات ورسومات، ووفر المساحة (استغل كامل عرض الورقة). لا تترك هوامش فارغة ضخمة.
      هام جداً لتقليل عدد الأوراق عند الطباعة:
      - قلل الفراغات العمودية (margin, padding) بين العناصر والفقرات والجداول.
      - استغل المساحة الأفقية جيداً (يمكن استخدام شبكة grid أو flex لترتيب البطاقات جنباً إلى جنب).
      - تجنب إنشاء صفحات شبه فارغة. اجعل المحتوى متراصاً ومنسقاً بذكاء.
      - تجنب ترك أي هوامش سفلية (margin-bottom) مبالغ فيها، ولا تستخدم وسوم <br> فارغة.
      `;

      let response;
      let retries = Math.min(10, apiKeys.length);
      let attempts = 0;
      let lastError;
      let keyIdx = Math.floor(Math.random() * apiKeys.length);

      while (attempts < retries) {
        try {
          const apiKey = apiKeys[keyIdx % apiKeys.length];
          keyIdx++;

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
          break; // Success
        } catch (error: any) {
          lastError = error;
          attempts++;
          console.error(`Attempt ${attempts} failed:`, error.message);
          
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
