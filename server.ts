import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { NatalChartInput } from "./src/types";
import { exec } from "child_process";
import fs from "fs";
import * as archiver from "archiver";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Gemini Client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// API to generate and download the complete app.zip programmatically
app.get("/api/download-zip", (req, res) => {
  const zipPath = path.join(process.cwd(), "app.zip");
  const output = fs.createWriteStream(zipPath);
  const createArchiver = (archiver as any).default || archiver;
  const archive = createArchiver("zip", {
    zlib: { level: 9 }
  });

  output.on("close", () => {
    console.log(`Archive created successfully: ${archive.pointer()} total bytes`);
    res.download(zipPath, "falaknameh-app.zip");
  });

  archive.on("error", (err) => {
    console.error("Archiver error:", err);
    res.status(500).json({ error: "خطا در فشرده‌سازی سورس‌کد با ابزار آرشیو.", details: err.message });
  });

  archive.pipe(output);

  archive.glob("**/*", {
    cwd: process.cwd(),
    ignore: [
      "node_modules/**",
      "dist/**",
      ".git/**",
      ".next/**",
      "*.zip",
      "bun.lock",
      "yarn.lock",
      "package-lock.json"
    ]
  });

  archive.finalize();
});

// Prompt construction for 14-section comprehensive astrological report
function buildAstrologyPrompt(input: NatalChartInput): string {
  const planetListStr = input.planets
    .map(
      (p) =>
        `- ${p.name} (${p.symbol}): در برج ${p.sign} ${p.signSymbol}، درجه ${p.degree}، در ${p.house}${p.isRetrograde ? ' (حالت برگشتی)' : ''}`
    )
    .join("\n");

  const aspectsStr = input.aspects.join("\n");
  const keyPlanetsStr = input.keyPlanets.join("\n");

  return `
تو یک منجم ارشد و استاد برجسته اخترشناسی (Astrologer) هستی که برای یک پیج تخصصی استرولوژی کار می‌کنی. مشتریان تو هزینه‌ای قابل توجه برای دریافت "تحلیل عمیق، جامع و تخصصی چارت تولد" پرداخته‌اند. 

وظیفه تو تولید یک متن کامل تحلیل چارت تولد در ۱۴ بخش دقیق است. 

اطلاعات چارت تولد به شرح زیر است:
- تاریخ تولد: ${input.birthDateFa} (${input.birthDateEn})
- ساعت تولد: ${input.birthTime}
- محل تولد (شهر تولد): ${input.birthLocation}
- طالع (ASC): ${input.ascendant.sign} ${input.ascendant.signSymbol} ${input.ascendant.degree}
- میانه آسمان (MC): ${input.mc.sign} ${input.mc.signSymbol} ${input.mc.degree}

موقعیت سیارات در چارت:
${planetListStr}

عناصر غالب چارت:
- هوا: ${input.elements.air}
- خاک: ${input.elements.earth}
- آب: ${input.elements.water}
- آتش: ${input.elements.fire}
- نتیجه عناصر: ${input.elements.summary}

کیفیت‌های غالب:
- کاردینال: ${input.qualities.cardinal}
- ثابت: ${input.qualities.fixed}
- متغیر: ${input.qualities.mutable}
- نتیجه کیفیت‌ها: ${input.qualities.summary}

جنبه‌های شاخص (جوانب/Aspects):
${aspectsStr}

سیارات شاخص چارت:
${keyPlanetsStr}

توضیحات سفارشی صاحب چارت: ${input.additionalInstructions || "ندارد"}

=== الزامات حیاتی لحن، هویت و ساختار ===
۱. هویت گوینده (تیم فلک‌نامه): متن کلاً از طرف «تیم تخصصی فلک‌نامه» تنظیم می‌شود. تمام افعال مربوط به تحلیل‌گر باید اول‌شخص جمع باشد (مانند: «ما در بررسی‌هایمان...»، «تحلیل تیم ما نشان می‌دهد...»، «ما توصیه می‌کنیم...»، «با بررسی چارت شما متوجه شدیم...»). هرگز از افعال مفرد مانند «من» یا «به نظر من» استفاده نکنید.
۲. مخاطب مستقیم: مخاطب متن مستقیماً خود صاحب چارت است. با لحنی صمیمی، محترمانه، روان و ملموس («شما») با او گفتگو کنید. از به‌کارگیری لحن بسیار سنگین، خشبی، پیچیده یا بیش از حد کتابی خودداری کنید.
۳. پرهیز از کلی‌گویی و ارائه جزئیات شگفت‌انگیز: از عبارات مبهم و کلی پرهیز کنید. تمام نکات باید ملموس، دقیق، کاربردی و غنی باشند تا خواننده کاملاً شگفت‌زده شود.
۴. حجم متن: حجم کل خروجی بین ۳,۵۰۰ تا ۴,۰۰۰ کلمه (Word Count) باشد. متن را کوتاه نکنید و هر بخش را عمیق و پر از جزئیات ارزشمند بنویسید.
۵. عدم استفاده از علامت‌های خام: از درج علامت‌های # یا | یا خطوط جداکننده جداً خودداری کرده و مطالب را در قالب پاراگراف‌ها و کادربندی‌های روان نگارش کنید.
۶. عدم تولید کدهای خام HTML یا استایل‌های درون‌خطی (style=): به هیچ وجه نباید در متن خود از کدهای HTML، تگ‌های div، span، blockquote با استایل‌های استاتیک یا کلاستیک استفاده کنید. اگر می‌خواهید پیام، توصیه، هشدار، تله یا راهکاری بنویسید، فقط و فقط آن را به صورت پاراگراف متنی معمولی بنویسید که با کلمات کلیدی استاندارد مانند «پیام کیهانی:»، «توصیه مهم:»، «هشدار جدی:»، «تله مالی:»، «راهکار عملی:»، «خط قرمز:» یا «سازگارترین نشان‌ها:» شروع می‌شود. سیستم ما این کلمات را شناسایی کرده و در کادرهای بسیار چشم‌نواز و VIP قرار می‌دهد. استفاده از تگ‌های HTML توسط شما ظاهر چارت را خراب می‌کند.
۷. بازه زمانی ترانزیت‌ها (بخش ۱۲): ترانزیت‌های بخش ۱۲ باید دقیقاً از ابتدای مهر ۱۴۰۵ تا پایان اسفند ۱۴۰۵ به تفکیک ماه به ماه تحلیل گردند و کاملاً با تقویم نجومی ارائه‌شده هماهنگ باشند.

فرمت خروجی شامل ۱۴ بخش است. هر بخش را دقیقاً بین نشانگرهای اختصاصی ---BEGIN_SECTION_X--- و ---END_SECTION_X--- قرار دهید.
تذکر مهم: متن‌های راهنما یا عناوین انگلیسی داخل پرانتز را کپی نکنید و مستقیماً تحلیل تخصصی و عمیق فارسی تیم فلک‌نامه را بنویسید.

---BEGIN_SECTION_1---
تحلیل موقعیت سیارات، خانه‌ها و عناصر چارت (بخش ۱)
---END_SECTION_1---

---BEGIN_SECTION_2---
تحلیل خورشید و هویت اصلی (بخش ۲) - حتماً شامل زیربخش ویژه: «شناسنامه کیهانی و ۱۰ ویژگی کلیدی شما» با جزئیات دقیق
---END_SECTION_2---

---BEGIN_SECTION_3---
تحلیل ماه و دنیای عاطفی (بخش ۳)
---END_SECTION_3---

---BEGIN_SECTION_4---
تحلیل طالع و شخصیت بیرونی (بخش ۴)
---END_SECTION_4---

---BEGIN_SECTION_5---
تحلیل عطارد و ذهن و شیوه تفکر (بخش ۵)
---END_SECTION_5---

---BEGIN_SECTION_6---
تحلیل زهره، عشق و ارزش‌ها (بخش ۶)
---END_SECTION_6---

---BEGIN_SECTION_7---
تحلیل مریخ، اراده و مسیر اقدام (بخش ۷)
---END_SECTION_7---

---BEGIN_SECTION_8---
تحلیل مشتری و کیوان، استعدادها و مسیر شغلی (بخش ۸)
---END_SECTION_8---

---BEGIN_SECTION_9---
تحلیل عشق، ازدواج و روابط عمیق (بخش ۹) - حتماً شامل: ۱. سازگارترین ماه‌ها و نشان‌های تولد با ذکر علل؛ ۲. ویژگی‌های همسر و پارتنر ایده‌آل؛ ۳. خطوط قرمز ارتباطی
---END_SECTION_9---

---BEGIN_SECTION_10---
تحلیل پول، درآمد و مسیر مالی (بخش ۱۰) - حتماً شامل: ۱. دقیق‌ترین و بهترین روش‌های کسب درآمد متناسب با شخصیت و چارت شما؛ ۲. استراتژی ثروت‌آفرینی؛ ۳. تله‌های مالی
---END_SECTION_10---

---BEGIN_SECTION_11---
تحلیل سایه‌های شخصیتی و زخم‌های درونی (بخش ۱۱)
---END_SECTION_11---

---BEGIN_SECTION_12---
تحلیل ترانزیت‌های مهم (بخش ۱۲) - تحلیل کامل ماه به ماه از مهر ۱۴۰۵ تا پایان اسفند ۱۴۰۵ بر اساس رویدادهای نجومی واقعی زیر:
شما باید این رویدادهای واقعی تقویم نجومی ۱۴۰۵ را بر چارت تولد و خانه‌های شخص تطبیق داده و اتفاقات کاملاً واقعی، ملموس و عینی (شغلی، مالی، ارتباطی، قراردادی، خانوادگی و سلامتی) که برای صاحب چارت رخ می‌دهد را به تفصیل بنویسید (از کلی‌گویی انتزاعی بپرهیزید):

* تقویم نجومی مرجع سال ۱۴۰۵ شمسی جهت تطبیق چارت:
- مهر ۱۴۰۵ (سپتامبر - اکتبر ۲۰۲۶): مشتری مستقیم در اسد (Leo)؛ زحل و نپتون برگشتی در حوت (Pisces)؛ پلوتو برگشتی در دلو (Aquarius)؛ از ۲۴ مهر: آغاز حرکت برگشتی عطارد (Mercury Retrograde) در نشان عقرب (Scorpio) (تاثیر شدید بر ارتباطات عمیق، مباحث مالی، بازگشت پترن‌های ذهنی قدیمی).
- آبان ۱۴۰۵ (اکتبر - نوامبر ۲۰۲۶): ادامه برگشتی عطارد در عقرب تا ۲۳ آبان؛ در ۱۷ آبان: اورانوس برگشتی در جوزا مجدداً به نشان ثور (Taurus) باز می‌گردد (تغییر ناگهانی مالی یا ملکی)؛ در ۲۷ آبان: مستقیم شدن زحل در حوت (برطرف شدن تدریجی گره‌ها و مسئولیت‌های اداری و مالی سنگین).
- آذر ۱۴۰۵ (نوامبر - دسامبر ۲۰۲۶): در ۱۵ آذر: آغاز حرکت برگشتی مریخ (Mars Retrograde) در درجه ۶ نشان اسد (Leo) (افت موقت انرژی بدنی، لزوم بازنگری در پروژه‌ها، لزوم کنترل خشم و ابراز خلاقیت)؛ در ۱۹ آذر: مستقیم شدن نپتون در حوت (برطرف شدن ابهامات و الهامات شهودی روشن).
- دی ۱۴۰۵ (دسامبر ۲۰۲۶ - ژانویه ۲۰۲۷): ادامه حرکت برگشتی مریخ در اسد؛ از ۱۳ دی: آغاز حرکت برگشتی مشتری (Jupiter Retrograde) در اسد (تاخیر موقت در توسعه مالی، شانس‌ها و سرمایه‌گذاری‌ها).
- بهمن ۱۴۰۵ (ژانویه - فوریه ۲۰۲۷): در ۲۹ دی مریخ برگشتی وارد نشان سرطان (Cancer) شده و در بهمن در سرطان برگشتی است (امور خانوادگی، امنیت روانی، چالش‌های خانوادگی یا ملکی)؛ از ۲۹ بهمن: آغاز حرکت برگشتی عطارد در نشان حوت (Pisces) (سوءتفاهم‌های ارتباطی، تاخیر در سفر، گم شدن اوراق).
- اسفند ۱۴۰۵ (فوریه - مارس ۲۰۲۷): در ۱۲ اسفند: مستقیم شدن مریخ در نشان سرطان (بازگشت اراده عاطفی، حل تنش‌های خانوادگی)؛ در ۲۰ اسفند: مستقیم شدن عطارد در حوت (روشن شدن ذهن و تصمیمات ارتباطی).
---END_SECTION_12---

---BEGIN_SECTION_13---
تحلیل مسیر رشد و چشم‌انداز آینده (بخش ۱۳)
---END_SECTION_13---

---BEGIN_SECTION_14---
جمع‌بندی نهایی و کلام آخر (بخش ۱۴)
---END_SECTION_14---

لطفاً همین الان تحلیل کامل ۳۵۰۰ الی ۴۰۰۰ کلمه‌ای را شروع کن و تمام ۱۴ بخش را صریحاً با نشانگرهای ---BEGIN_SECTION_X--- و ---END_SECTION_X--- جدا کن.
`;
}

// Helper functions for retry delay and error classification
function parseRetryDelay(err: any): number {
  const errMsg = String(err?.message || err);
  const matchSeconds = errMsg.match(/retry in ([0-9\.]+)s/i) || errMsg.match(/"retryDelay"\s*:\s*"([0-9\.]+)s"/i);
  if (matchSeconds && matchSeconds[1]) {
    const sec = parseFloat(matchSeconds[1]);
    if (!isNaN(sec) && sec > 0) {
      return Math.min(Math.ceil(sec * 1000) + 500, 10000);
    }
  }
  if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded")) {
    return 5000;
  }
  return 1500;
}

function isNotFoundError(err: any): boolean {
  const errMsg = String(err?.message || err);
  return errMsg.includes("404") || errMsg.includes("NOT_FOUND") || errMsg.includes("not found") || errMsg.includes("no longer available");
}

function isQuotaError(err: any): boolean {
  const errMsg = String(err?.message || err);
  return errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded") || errMsg.includes("Too Many Requests");
}

function parseGeminiErrorMessage(err: any): string {
  if (!err) return "خطا در برقراری ارتباط با سرویس هوش مصنوعی.";

  const rawStr = typeof err === "string" ? err : String(err?.message || err);

  if (isQuotaError(err) || rawStr.includes("429") || rawStr.includes("RESOURCE_EXHAUSTED") || rawStr.includes("Quota exceeded")) {
    const matchSeconds = rawStr.match(/retry in ([0-9\.]+)s/i) || rawStr.match(/"retryDelay"\s*:\s*"([0-9\.]+)s"/i);
    if (matchSeconds && matchSeconds[1]) {
      const sec = Math.ceil(parseFloat(matchSeconds[1]));
      return `سقف درخواست‌های روزانه/سهمیه رایگان مدل هوش مصنوعی (Gemini Rate Limit) موقتاً تکمیل شده است. لطفاً پس از ${sec} ثانیه مجدداً دکمه «تلاش مجدد» را بفشارید.`;
    }
    return "سهمیه رایگان درخواست‌های هوش مصنوعی (Gemini Rate Limit) موقتاً به پایان رسیده است. لطفاً ۱ دقیقه دیگر مجدداً تلاش کنید.";
  }

  if (isNotFoundError(err)) {
    return "مدل هوش مصنوعی انتخاب‌شده در دسترس نیست. لطفاً مجدداً تلاش کنید.";
  }

  if (rawStr.includes("API_KEY") || rawStr.includes("UNAUTHENTICATED")) {
    return "کلید API هوش مصنوعی معتبر نیست یا تنظیم نشده است.";
  }

  try {
    const parsed = JSON.parse(rawStr);
    if (parsed.error?.message) {
      const msg = parsed.error.message;
      if (typeof msg === "string" && msg.startsWith("{")) {
        const inner = JSON.parse(msg);
        if (inner.error?.message) return inner.error.message;
      }
      return msg;
    }
  } catch (e) {
    // rawStr is not JSON
  }

  return rawStr.length > 200 ? "خطا در پردازش درخواست هوش مصنوعی. لطفاً مجدداً تلاش نمایید." : rawStr;
}

// Helper function for non-streaming generation with retries and model fallbacks
async function getGeminiContentWithFallback(
  ai: ReturnType<typeof getAiClient>,
  prompt: string,
  systemInstruction: string
) {
  const models = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Attempting content generation with model ${model} (Attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.7,
            systemInstruction,
          },
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Error with non-streaming model ${model} (Attempt ${attempt}):`, err?.message || err);
        if (isNotFoundError(err) || isQuotaError(err)) {
          console.log(`Skipping model ${model} due to 404/429 status and moving to fallback model...`);
          break; // Don't retry a 404 or quota exhausted model, proceed to next model immediately
        }
        if (attempt < 2) {
          const delay = parseRetryDelay(err);
          console.log(`Waiting ${delay}ms before retrying model ${model}...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  throw new Error(parseGeminiErrorMessage(lastError));
}

// Helper function for stream generation with retries and model fallbacks
async function getGeminiStreamWithFallback(
  ai: ReturnType<typeof getAiClient>,
  prompt: string,
  systemInstruction: string
) {
  const models = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Attempting stream generation with model ${model} (Attempt ${attempt})...`);
        const stream = await ai.models.generateContentStream({
          model,
          contents: prompt,
          config: {
            temperature: 0.7,
            systemInstruction,
          },
        });
        return { stream, model };
      } catch (err: any) {
        lastError = err;
        console.warn(`Error with stream model ${model} (Attempt ${attempt}):`, err?.message || err);
        if (isNotFoundError(err) || isQuotaError(err)) {
          console.log(`Skipping model ${model} due to 404/429 status and moving to fallback model...`);
          break; // Don't retry a 404 or quota exhausted model, proceed to next model immediately
        }
        if (attempt < 2) {
          const delay = parseRetryDelay(err);
          console.log(`Waiting ${delay}ms before retrying model ${model}...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  throw new Error(parseGeminiErrorMessage(lastError));
}

// Generate Report API Endpoint (Streaming SSE)
app.post("/api/generate-stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const pingInterval = setInterval(() => {
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ type: "ping" })}\n\n`);
    }
  }, 8000);

  req.on("close", () => {
    clearInterval(pingInterval);
  });

  try {
    const ai = getAiClient();
    const chartInput: NatalChartInput = req.body;

    const prompt = buildAstrologyPrompt(chartInput);

    res.write(
      `data: ${JSON.stringify({ type: "start", message: "تحلیل چارت تولد توسط تیم فلک‌نامه آغاز شد..." })}\n\n`
    );

    const systemInstruction =
      "شما تیم تخصصی اخترشناسی و استرولوژی فلک‌نامه (Falaknameh Team) هستید. تمام مطالب را حتماً از زبان تیم با افعال اول‌شخص جمع (مانند «ما در بررسی‌هایمان...»، «بررسی‌های ما نشان می‌دهد...»، «توصیه تیم ما این است که...») نگارش کنید و هرگز از افعال مفرد مانند «من» استفاده نکنید. مخاطب گزارش مستقیماً خود خواننده (صاحب چارت) با لحنی صمیمی، محترمانه، روان و ملموس («شما») است. از به‌کارگیری لحن بسیار سنگین، کتابی یا خشک خودداری نموده و از درج کاراکترهای خام علامت‌گذاری مانند # یا | پرهیز کنید.";

    const { stream } = await getGeminiStreamWithFallback(ai, prompt, systemInstruction);

    let accumulatedText = "";

    for await (const chunk of stream) {
      if (chunk.text) {
        accumulatedText += chunk.text;
        res.write(
          `data: ${JSON.stringify({ type: "chunk", text: chunk.text })}\n\n`
        );
      }
    }

    clearInterval(pingInterval);

    res.write(
      `data: ${JSON.stringify({
        type: "done",
        fullText: accumulatedText,
      })}\n\n`
    );
    res.end();
  } catch (error: any) {
    clearInterval(pingInterval);
    console.error("Gemini stream generation error:", error);
    const friendlyError = parseGeminiErrorMessage(error);
    if (!res.writableEnded) {
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          error: friendlyError,
        })}\n\n`
      );
      res.end();
    }
  }
});

// Non-streaming endpoint fallback
app.post("/api/generate-report", async (req, res) => {
  try {
    const ai = getAiClient();
    const chartInput: NatalChartInput = req.body;

    const prompt = buildAstrologyPrompt(chartInput);
    const systemInstruction =
      "شما تیم تخصصی اخترشناسی و استرولوژی فلک‌نامه (Falaknameh Team) هستید. متنی عمیق، مفصل (حدود ۳۵۰۰ تا ۴۰۰۰ کلمه)، روان و صمیمی بنویسید. تمامی مطالب را از زبان تیم (با افعال جمع مانند «ما»، «بررسی‌های ما») نگارش کرده و مستقیماً با خواننده («شما») گفتگو کنید. از درج علائم خام مانند # یا | پرهیز نمایید.";

    const fullText = await getGeminiContentWithFallback(ai, prompt, systemInstruction);
    res.json({ success: true, fullText });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    const friendlyError = parseGeminiErrorMessage(error);
    res.status(500).json({
      success: false,
      error: friendlyError,
    });
  }
});

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
