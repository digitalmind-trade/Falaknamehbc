import React, { useState } from 'react';
import { X, Sparkles, FileCode, CheckCircle2, ShieldAlert, Download, Copy, Check, ExternalLink } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const deployPrompt = `سلام! من سورس‌کد کامل یک اپلیکیشن فول‌استک آسترولوژی به نام "فلک‌نامه" (شامل فرانت‌اند React + Vite و بک‌اند Express با یکپارچه‌سازی پیشرفته Gemini API) را برایت فرستادم. 
لطفاً تمام کدهای این پروژه را تجزیه و تحلیل کرده و آن را در این محیط جدید به طور کامل نصب، کانفیگ، بیلد و دیپلوی کن.
توجه کن که سیستم باید روی پورت 3000 اجرا شده و متغیر محیطی GEMINI_API_KEY فعال باشد تا به درستی کار کند.`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(deployPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>راهنمای کاربری و انتقال سامانه فلک‌نامه</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed text-justify max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>۱. نحوه بارگذاری چارت Astro-Seek</span>
            </h4>
            <p>
              وارد سایت Astro-Seek شده و چارت تولد را محاسبه نمایید. سپس صفحه چارت را ذخیره کنید (یک فایل با پسوند <code>.html</code> دانلود می‌شود). فایل را در این نرم‌افزار آپلود کنید یا متن کامل صفحه را کپی کرده و در تب اول Paste نمایید.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>۲. نگارش ۳۵۰۰ الی ۴۰۰۰ کلمه‌ای بدون غلط نگارشی</span>
            </h4>
            <p>
              سیستم با پردازش سیارات، خانه‌ها، عناصر، کیفیت‌ها و جنبه‌ها، سری هوش مصنوعی Gemini را فراخوانی می‌کند تا دقیقاً ۱۴ بخش کامل طبق فرمت فاخر فلک‌نامه، با لحنی کاملاً ادبی، تخصصی و عمیق تولید کند.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>۳. خروجی تک‌فایلی خودکفا و خروجی PDF</span>
            </h4>
            <p>
              با کلیک روی دکمه «دانلود فایل HTML»، یک فایل <code>.html</code> کاملاً خودکفا ذخیره می‌شود که می‌توانید مستقیماً برای مشتری ارسال کنید. مشتری با باز کردن آن روی گوشی یا کامپیوتر، قالب فاخر با پس‌زمینه کیهانی، انیمیشن ذرات و فونت وزیرمتن را مشاهده خواهد کرد. همچنین با دکمه پرینت می‌توانید خروجی PDF تهیه فرمایید.
            </p>
          </div>

          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-3">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
              <ExternalLink className="w-4.5 h-4.5 text-amber-400" />
              <span>۴. راهنمای انتقال اپلیکیشن به Gmail جدید</span>
            </h4>
            
            <p className="text-slate-200">
              برای انتقال این برنامه به یک حساب جیمیل دیگر، مراحل زیر را دنبال کنید:
            </p>
            
            <ul className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300">
              <li>ابتدا فایل <strong className="text-amber-300">ZIP</strong> سورس‌کد کامل را از دکمه زیر دانلود کنید.</li>
              <li>پرامپت مخصوص دیپلوی در اکانت جدید را با دکمه کپی بردارید.</li>
              <li>در اکانت جیمیل جدید خود، وارد سازنده هوش مصنوعی (Google AI Studio Build) شوید.</li>
              <li>یک اپلت جدید ایجاد کنید و کدهای دانلود شده را به عنوان پروژه آپلود/ایمپورت نمایید.</li>
              <li>پرامپت کپی شده را به عنوان اولین پیام ارسال کنید تا مدل کدهای شما را سوار و دیپلوی کند.</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href="/api/download-zip"
                download="falaknameh-app.zip"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all text-center shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>دانلود سورس‌کد کامل (ZIP)</span>
              </a>

              <button
                onClick={copyPrompt}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-lg border border-amber-500/30 transition-all text-center"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">پرامپت کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>کپی پرامپت دیپلوی</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[10px] text-slate-400 font-mono select-all overflow-x-auto whitespace-pre-wrap">
              {deployPrompt}
            </div>
          </div>
        </div>

        <div className="pt-2 text-left">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors border border-slate-700"
          >
            بستن راهنما
          </button>
        </div>
      </div>
    </div>
  );
};
