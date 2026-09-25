import { NatalChartInput } from '../types';
import { toPersianDigits, formatPersianDegree } from './persianNumbers';

export function buildFalaknamehHtml(
  input: NatalChartInput,
  sectionsHtmlMap: Record<number, string> | string
): string {
  const isMap = typeof sectionsHtmlMap === 'object';

  const getSection = (num: number, fallbackDefault: string): string => {
    if (isMap && (sectionsHtmlMap as Record<number, string>)[num]) {
      return (sectionsHtmlMap as Record<number, string>)[num];
    }
    return fallbackDefault;
  };

  const planetRowsHtml = input.planets
    .map(
      (p) => `
    <tr class="hover:bg-slate-800/50 transition-colors border-b border-slate-800/60">
      <td class="p-3.5 font-bold text-slate-100 flex items-center gap-2">
        <span class="text-base">${p.symbol}</span>
        <span>${p.name}</span>
      </td>
      <td class="p-3.5">
        <span class="inline-flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 text-amber-300 font-medium">
          <span>${p.signSymbol}</span>
          <span>${p.sign}</span>
        </span>
      </td>
      <td class="p-3.5 font-mono text-amber-400 font-bold text-xs md:text-sm" dir="ltr">${formatPersianDegree(p.degree)}</td>
      <td class="p-3.5 text-slate-300 text-xs md:text-sm">${toPersianDigits(p.house)}</td>
      <td class="p-3.5 text-center">
        ${
          p.isRetrograde
            ? '<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">برگشتی (R)</span>'
            : '<span class="text-slate-500 text-[11px]">مستقیم (D)</span>'
        }
      </td>
    </tr>
  `
    )
    .join('');

  const planetTableHtml = `
    <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a0f1d] mb-8 shadow-xl">
      <table class="w-full text-right text-xs sm:text-sm border-collapse">
        <thead class="bg-slate-800/80 text-amber-300 font-bold border-b border-slate-700">
          <tr>
            <th class="p-3.5">سیاره / نقطه کیهانی</th>
            <th class="p-3.5">برج فلکی</th>
            <th class="p-3.5">مختصات دقیق (درجه و دقیقه)</th>
            <th class="p-3.5">خانه (House)</th>
            <th class="p-3.5 text-center">وضعیت حرکت</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60 text-slate-200">
          ${planetRowsHtml}
          <!-- Ascendant Row -->
          <tr class="bg-amber-500/10 hover:bg-amber-500/15 font-bold border-b border-slate-800/60">
            <td class="p-3.5 text-amber-300 flex items-center gap-2">
              <span class="text-base">⬆️</span>
              <span>طالع (Ascendant - ASC)</span>
            </td>
            <td class="p-3.5">
              <span class="inline-flex items-center gap-1.5 bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30 text-amber-200">
                <span>${input.ascendant.signSymbol}</span>
                <span>${input.ascendant.sign}</span>
              </span>
            </td>
            <td class="p-3.5 font-mono text-amber-400 font-bold" dir="ltr">${formatPersianDegree(input.ascendant.degree)}</td>
            <td class="p-3.5 text-amber-300">سرآغاز خانه اول</td>
            <td class="p-3.5 text-center text-amber-400 text-xs">زاویه اصلی چارت</td>
          </tr>
          <!-- MC Row -->
          <tr class="bg-amber-500/10 hover:bg-amber-500/15 font-bold">
            <td class="p-3.5 text-amber-300 flex items-center gap-2">
              <span class="text-base">🏔️</span>
              <span>میانه آسمان (Medium Coeli - MC)</span>
            </td>
            <td class="p-3.5">
              <span class="inline-flex items-center gap-1.5 bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30 text-amber-200">
                <span>${input.mc.signSymbol}</span>
                <span>${input.mc.sign}</span>
              </span>
            </td>
            <td class="p-3.5 font-mono text-amber-400 font-bold" dir="ltr">${formatPersianDegree(input.mc.degree)}</td>
            <td class="p-3.5 text-amber-300">سرآغاز خانه دهم</td>
            <td class="p-3.5 text-center text-amber-400 text-xs">زاویه اصلی چارت</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const aspectsHtml = input.aspects
    .map((a) => `<span class="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">${toPersianDigits(a)}</span>`)
    .join('\n');

  const keyPlanetsHtml = input.keyPlanets.map((k) => `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span><span>${toPersianDigits(k)}</span></li>`).join('\n');

  const sectionsData = [
    { num: 1, numFa: '۱', icon: '🪐', title: 'مشخصات تولد و موقعیت دقیق سیارات', subtitle: 'تحلیل موقعیت دقیق سیارات، خانه‌ها، عناصر و کیفیات چارت تولد' },
    { num: 2, numFa: '۲', icon: '☀️', title: 'خورشید، هویت و ۱۰ ویژگی کلیدی', subtitle: 'شناسنامه کیهانی، ۱۰ ویژگی کلیدی و جوهره اصلی وجود' },
    { num: 3, numFa: '۳', icon: '🌙', title: 'ماه، احساسات و دنیای درونی', subtitle: 'نیازهای عاطفی، امنیت روانی و نحوه مواجهه با استرس' },
    { num: 4, numFa: '۴', icon: '⬆️', title: 'طالع، شخصیت بیرونی و مسیر ظهور', subtitle: 'برخورد اولیه با جهان، ماسک اجتماعی و مسیر فردیت' },
    { num: 5, numFa: '۵', icon: '🧠', title: 'عطارد، ذهن و شیوه تفکر', subtitle: 'الگوهای فکری، یادگیری، ارتباطات و حل مسئله' },
    { num: 6, numFa: '۶', icon: '💖', title: 'زهره، عشق، روابط و ارزش‌ها', subtitle: 'زیبایی‌شناسی، جذب عاطفی و نحوه ابراز علاقه' },
    { num: 7, numFa: '۷', icon: '⚡', title: 'مریخ، انرژی، اراده و مسیر اقدام', subtitle: 'انگیزه، قدرت عمل، غلبه بر چالش‌ها و مدیریت خشم' },
    { num: 8, numFa: '۸', icon: '💼', title: 'مشتری و زحل، شغل و موفقیت', subtitle: 'گسترش، نظم، مسئولیت‌پذیری و پتانسیل شغلی' },
    { num: 9, numFa: '۹', icon: '💍', title: 'عشق، ازدواج و پارتنر ایده‌آل', subtitle: 'سازگارترین نشان‌ها، ویژگی‌های همسر ایده‌آل و خطوط قرمز' },
    { num: 10, numFa: '۱۰', icon: '💰', title: 'ثروت، درآمد و هوش مالی', subtitle: 'بهترین روش‌های کسب درآمد، هوش مالی و تله‌های مالی' },
    { num: 11, numFa: '۱۱', icon: '🌘', title: 'سایه‌های شخصیتی و زخم‌های درونی', subtitle: 'شناخت چالش‌های پنهان، پترن‌های تکرارشونده و مسیر شفای روحی' },
    { num: 12, numFa: '۱۲', icon: '🔮', title: 'ترانزیت‌های مهم پیش رو', subtitle: 'تحلیل کامل ماه به ماه از مهر ۱۴۰۵ تا پایان اسفند ۱۴۰۵' },
    { num: 13, numFa: '۱۳', icon: '🧭', title: 'مسیر رشد و چشم‌انداز آینده', subtitle: 'رسالت شخصی، گام‌های راهبردی و چشم‌انداز ۵ ساله' },
    { num: 14, numFa: '۱۴', icon: '📜', title: 'جمع‌بندی نهایی و کلام آخر', subtitle: 'فرمان نهایی تیم تخصصی فلک‌نامه' },
  ];

  // Serialize chart input for interactive wheel JavaScript
  const serializedChartData = JSON.stringify({
    ascendant: input.ascendant,
    mc: input.mc,
    planets: input.planets,
    birthDateFa: input.birthDateFa,
    birthTime: input.birthTime,
    birthLocation: input.birthLocation
  });

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>گزارش وب فلک‌نامه - تحلیل کامل چارت تولد</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Vazirmatn', 'Tahoma', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        *, ::before, ::after { box-sizing: border-box; }
        
        body {
            font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Tahoma, sans-serif;
            background-color: #020617;
            color: #e2e8f0;
            overflow-x: hidden;
            scroll-behavior: smooth;
        }

        /* Essential Flexbox & Grid CSS Fallbacks */
        .flex { display: flex; }
        .inline-flex { display: inline-flex; }
        .flex-col { flex-direction: column; }
        .flex-row { flex-direction: row; }
        .flex-wrap { flex-wrap: wrap; }
        .flex-1 { flex: 1 1 0%; }
        .shrink-0 { flex-shrink: 0; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        
        .gap-1 { gap: 0.25rem; }
        .gap-1\.5 { gap: 0.375rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-3\.5 { gap: 0.875rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }

        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        @media (min-width: 768px) {
            .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }

        /* Color & Border Fixes */
        .border { border: 1px solid rgba(245, 158, 11, 0.25); }
        .border-slate-800 { border-color: rgba(30, 41, 59, 0.8); }
        .border-amber-500\/30 { border-color: rgba(245, 158, 11, 0.3); }
        .border-amber-500\/40 { border-color: rgba(245, 158, 11, 0.4); }
        .border-amber-500\/20 { border-color: rgba(245, 158, 11, 0.2); }
        
        .bg-\[\#020617\] { background-color: #020617; }
        .bg-\[\#0a0f1d\] { background-color: #0a0f1d; }
        .bg-\[\#0b1222\] { background-color: #0b1222; }
        .bg-slate-900 { background-color: #0f172a; }
        .bg-slate-950 { background-color: #020617; }
        
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-2xl { border-radius: 1rem; }
        .rounded-3xl { border-radius: 1.5rem; }
        .rounded-full { border-radius: 9999px; }

        /* VIP Infographic Custom Components */
        .infographic-trait-card {
            background: linear-gradient(135deg, #0d162d 0%, #091022 50%, #050a17 100%);
            border: 1px solid rgba(245, 158, 11, 0.35) !important;
            border-radius: 1.25rem;
            padding: 1.25rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .infographic-trait-card:hover {
            border-color: rgba(251, 191, 36, 0.7) !important;
            transform: translateY(-2px);
            box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.7), 0 0 25px rgba(245, 158, 11, 0.18);
        }

        .shenasnameh-infographic {
            background: linear-gradient(135deg, #0f1c3a 0%, #0a1329 50%, #060b18 100%);
            border: 2px solid rgba(245, 158, 11, 0.45) !important;
            border-radius: 1.5rem;
            padding: 1.5rem;
            box-shadow: 0 0 40px rgba(245, 158, 11, 0.2);
            margin-bottom: 2rem;
            position: relative;
            overflow: hidden;
        }

        /* VIP Callout Cards Style Rules */
        .vip-callout-card {
            direction: rtl !important;
            text-align: right !important;
            padding: 1.5rem 1.75rem !important;
            border-radius: 1.25rem !important;
            margin-top: 1.5rem !important;
            margin-bottom: 1.5rem !important;
            position: relative !important;
            overflow: hidden !important;
            box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.65) !important;
        }

        .vip-message-card {
            background: linear-gradient(135deg, #0d162d 0%, #080e1e 60%, #040814 100%) !important;
            border: 1px solid rgba(245, 158, 11, 0.45) !important;
            box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.65), 0 0 20px rgba(245, 158, 11, 0.12) !important;
        }

        .vip-solution-card {
            background: linear-gradient(135deg, #04271d 0%, #031c15 60%, #02110c 100%) !important;
            border: 1px solid rgba(16, 185, 129, 0.45) !important;
            box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.65), 0 0 20px rgba(16, 185, 129, 0.12) !important;
        }

        .vip-warning-card {
            background: linear-gradient(135deg, #350b16 0%, #260710 60%, #17040a 100%) !important;
            border: 1px solid rgba(244, 63, 94, 0.45) !important;
            box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.65), 0 0 20px rgba(244, 63, 94, 0.12) !important;
        }

        .vip-advice-card {
            background: linear-gradient(135deg, #2b1704 0%, #1f1003 60%, #140b02 100%) !important;
            border: 1px solid rgba(245, 158, 11, 0.45) !important;
            box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.65), 0 0 20px rgba(245, 158, 11, 0.12) !important;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: #f59e0b; }

        .nav-link.active {
            background-color: rgba(245, 158, 11, 0.15);
            color: #fbbf24;
            border-color: rgba(245, 158, 11, 0.4);
            font-weight: 700;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
        }

        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

        @media print {
            aside, .mobile-nav-dock, .wheel-controls { display: none !important; }
            body { background-color: #ffffff !important; color: #000000 !important; }
            .bg-\[\#0a0f1d\] { background-color: #ffffff !important; border-color: #cccccc !important; }
            .text-white, .text-slate-200, .text-slate-300 { color: #111111 !important; }
            .text-amber-400, .text-amber-300, .text-amber-500 { color: #b45309 !important; }
        }
    </style>
</head>
<body class="bg-[#020617] text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200" dir="rtl">

    <!-- Glowing top cosmic background -->
    <div class="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]"></div>

    <!-- Header Hero -->
    <header class="relative pt-16 pb-10 px-4 flex flex-col items-center justify-center text-center border-b border-slate-800/80">
        <div class="inline-flex items-center gap-2 text-amber-500 font-extrabold tracking-widest text-2xl md:text-3xl mb-4 border border-amber-500/30 bg-amber-500/10 px-6 py-2.5 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <span>✨</span>
            <span>فلک‌نامه VIP</span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            گزارش تخصصی چارت تولد و نقشه راه کیهانی
        </h1>

        <div class="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-amber-300 bg-slate-900/90 border border-amber-500/30 px-5 py-3 rounded-2xl shadow-xl max-w-2xl">
            <span class="flex items-center gap-1">📅 ${input.birthDateFa}</span>
            <span class="text-slate-600">|</span>
            <span class="flex items-center gap-1">⏰ ساعت ${input.birthTime}</span>
            <span class="text-slate-600">|</span>
            <span class="flex items-center gap-1">📍 ${input.birthLocation}</span>
        </div>
    </header>

    <!-- Interactive Animated Constellation & Natal Chart Wheel Container -->
    <section class="max-w-4xl mx-auto px-4 mt-8">
        <div class="bg-gradient-to-b from-[#0b1329] via-[#070d1e] to-[#040814] border border-amber-500/40 rounded-3xl p-5 md:p-8 shadow-[0_0_50px_rgba(245,158,11,0.12)] relative overflow-hidden text-center">
            
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 border-b border-amber-500/20 pb-4">
                <div class="text-right">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                        <h3 class="text-base md:text-lg font-black text-amber-300">
                            صورت فلکی و چارت چرخشی زنده (Natal Wheel)
                        </h3>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">
                        موقعیت دقیق سیارات، طالع و خطوط زوایای کیهانی در زمان تولد شما
                    </p>
                </div>
                
                <div class="wheel-controls flex items-center gap-2">
                    <button id="btn-toggle-aspects" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all">
                        📐 نمایش خطوط جوانب
                    </button>
                    <button id="btn-rotate-wheel" class="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all">
                        ✨ چرخش کیهانی
                    </button>
                </div>
            </div>

            <!-- Canvas Container -->
            <div class="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center">
                <canvas id="natal-wheel-canvas" class="w-full h-full cursor-pointer rounded-full shadow-2xl"></canvas>
                <!-- Tooltip Overlay -->
                <div id="wheel-tooltip" class="absolute hidden z-30 pointer-events-none bg-slate-950/95 border border-amber-400/80 text-amber-200 text-xs p-3 rounded-xl shadow-2xl backdrop-blur-md max-w-[200px] text-right"></div>
            </div>

            <div class="mt-4 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-4">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> سیارات و اجرام کیهانی</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> طالع (ASC) و MC</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> زوایای تثلیث / تسدیس</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span> زوایای تقابل / تربیع</span>
            </div>

            <!-- Complete Planets Legend Badges Grid -->
            <div class="mt-6 border-t border-amber-500/20 pt-4">
                <div class="text-xs font-bold text-amber-300 mb-2.5 flex items-center justify-center gap-1.5">
                    <span>✨ موقعیت دقیق تمام اجرام کیهانی شناسايی شده (${input.planets.length} مورد)</span>
                </div>
                <div class="flex flex-wrap justify-center gap-2 max-h-48 overflow-y-auto p-2 bg-slate-950/60 rounded-2xl border border-slate-800 scrollbar-thin">
                    ${input.planets
                      .map(
                        (p, idx) => `
                        <div class="planet-badge cursor-pointer px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/60 transition-all flex items-center gap-1.5 text-xs text-slate-200 shadow-sm" data-index="${idx}">
                            <span class="text-amber-400 font-bold">${p.symbol}</span>
                            <span class="font-bold text-slate-100">${p.name}:</span>
                            <span class="text-amber-300">${p.signSymbol} ${p.sign}</span>
                            <span class="text-slate-400 font-mono text-[11px]" dir="ltr">${p.degree}</span>
                            <span class="text-slate-400 text-[11px]">(${p.house})</span>
                            ${p.isRetrograde ? '<span class="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1 rounded border border-amber-500/30">R</span>' : ''}
                        </div>
                    `
                      )
                      .join('')}
                </div>
            </div>
        </div>
    </section>

    <!-- Main Responsive Layout -->
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 md:px-8 py-10">

        <!-- Sidebar Navigation for Desktop -->
        <aside class="hidden lg:block w-80 shrink-0">
            <div class="sticky top-8 space-y-2 bg-[#0a0f1d]/95 backdrop-blur-xl border border-amber-500/30 p-4 rounded-2xl shadow-2xl">
                <div class="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 px-3 flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span>فهرست کامل ۱۴ بخش</span>
                    <span class="text-amber-300 font-mono text-[10px] bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">۱۴/۱۴</span>
                </div>
                <nav class="space-y-1.5 max-h-[calc(100vh-160px)] overflow-y-auto pr-1 text-xs">
                    ${sectionsData
                      .map(
                        (s) => `
                        <a id="nav-link-${s.num}" href="#sec${s.num}" class="nav-link flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 border border-transparent group">
                            <span class="w-6 h-6 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs group-hover:bg-amber-500/20">${s.numFa}</span>
                            <span class="truncate font-medium text-xs">${s.title}</span>
                        </a>
                    `
                      )
                      .join('')}
                </nav>
            </div>
        </aside>

        <!-- Mobile Navigation Floating Bar -->
        <div class="mobile-nav-dock lg:hidden sticky top-4 z-40 mb-2 bg-[#0a0f1d]/95 backdrop-blur-xl border border-amber-500/40 p-2.5 rounded-2xl shadow-2xl flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            <span class="text-xs font-bold text-amber-400 px-2 shrink-0">فهرست:</span>
            ${sectionsData
              .map(
                (s) => `
                <a href="#sec${s.num}" class="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700 hover:text-amber-300 shrink-0 flex items-center gap-1.5">
                    <span class="text-amber-400 font-bold">${s.numFa}.</span>
                    <span>${s.title}</span>
                </a>
            `
              )
              .join('')}
        </div>

        <!-- Main Content Area -->
        <main class="flex-1 space-y-16 pb-32">

            <!-- Section 1 -->
            <section id="sec1" class="scroll-mt-12">
                <div class="mb-6 text-right">
                    <div class="flex items-center gap-3.5 mb-2">
                        <div class="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 shadow-lg text-xl">
                            🪐
                        </div>
                        <div>
                            <span class="text-amber-400 text-xs font-bold tracking-wide">بخش ۱ از ۱۴</span>
                            <h2 class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-amber-300 to-amber-500">
                                بخش اول: مشخصات تولد و موقعیت دقیق سیارات
                            </h2>
                        </div>
                    </div>
                    <p class="text-slate-400 text-xs md:text-sm pr-14">تحلیل موقعیت دقیق سیارات، خانه‌ها، عناصر و کیفیات چارت تولد</p>
                    <div class="h-px w-full bg-gradient-to-r from-amber-500/30 via-amber-500/10 to-transparent mt-4"></div>
                </div>

                <div class="bg-[#0a0f1d] border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-amber-500/30 transition-all duration-300 shadow-2xl relative overflow-hidden space-y-8">
                    <div class="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <!-- Planetary Table -->
                    <div>
                        <h4 class="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                            <span>✦</span> جدول موقعیت دقیق سیارات و خانه‌ها
                        </h4>
                        ${planetTableHtml}
                    </div>

                    <!-- Elements & Qualities Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                            <h4 class="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                                <span>🌬</span> عناصر غالب چارت
                            </h4>
                            <ul class="space-y-2 text-xs md:text-sm text-slate-300">
                                <li class="flex justify-between"><span>🌬 عنصر هوا:</span> <strong class="text-slate-100">${toPersianDigits(input.elements.air)}</strong></li>
                                <li class="flex justify-between"><span>🌍 عنصر خاک:</span> <strong class="text-slate-100">${toPersianDigits(input.elements.earth)}</strong></li>
                                <li class="flex justify-between"><span>💧 عنصر آب:</span> <strong class="text-slate-100">${toPersianDigits(input.elements.water)}</strong></li>
                                <li class="flex justify-between"><span>🔥 عنصر آتش:</span> <strong class="text-slate-100">${toPersianDigits(input.elements.fire)}</strong></li>
                            </ul>
                            <div class="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-200/90 text-justify mt-3 leading-relaxed">
                                <strong class="text-amber-400">جمع‌بندی عناصر:</strong> ${toPersianDigits(input.elements.summary)}
                            </div>
                        </div>

                        <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                            <h4 class="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                                <span>⚡</span> کیفیات چارت (Qualities)
                            </h4>
                            <ul class="space-y-2 text-xs md:text-sm text-slate-300">
                                <li class="flex justify-between"><span>کاردینال (آغازگر):</span> <strong class="text-slate-100">${toPersianDigits(input.qualities.cardinal)}</strong></li>
                                <li class="flex justify-between"><span>ثابت (پایدار):</span> <strong class="text-slate-100">${toPersianDigits(input.qualities.fixed)}</strong></li>
                                <li class="flex justify-between"><span>متغیر (انعطاف‌پذیر):</span> <strong class="text-slate-100">${toPersianDigits(input.qualities.mutable)}</strong></li>
                            </ul>
                            <p class="text-xs text-slate-300 text-justify leading-relaxed mt-2">${toPersianDigits(input.qualities.summary)}</p>
                            
                            <h5 class="text-amber-400 font-bold text-xs mt-4 pt-2 border-t border-slate-800">
                                📐 جنبه‌های شاخص چارت (Aspects)
                            </h5>
                            <div class="flex flex-wrap gap-2 text-xs pt-1">
                                ${aspectsHtml}
                            </div>
                        </div>
                    </div>

                    <!-- Key Planets -->
                    <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                        <h4 class="text-amber-400 font-bold text-sm mb-2 flex items-center gap-1.5">
                            <span>⭐</span> سیارات شاخص چارت
                        </h4>
                        <ul class="space-y-2 text-xs md:text-sm text-slate-300">
                            ${keyPlanetsHtml}
                        </ul>
                    </div>

                    <!-- AI Generated Section 1 Text -->
                    ${
                      getSection(1, '')
                        ? `
                    <div class="pt-6 border-t border-slate-800 text-slate-200 text-sm md:text-base leading-relaxed text-justify space-y-4">
                        ${getSection(1, '')}
                    </div>
                    `
                        : ''
                    }
                </div>
            </section>

            <!-- Sections 2 to 14 -->
            ${sectionsData
              .slice(1)
              .map(
                (sec) => `
            <section id="sec${sec.num}" class="scroll-mt-12">
                <div class="mb-6 text-right">
                    <div class="flex items-center gap-3.5 mb-2">
                        <div class="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 shadow-lg text-xl">
                            ${sec.icon}
                        </div>
                        <div>
                            <span class="text-amber-400 text-xs font-bold tracking-wide">بخش ${sec.numFa} از ۱۴</span>
                            <h2 class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-amber-300 to-amber-500">
                                بخش ${sec.numFa}: ${sec.title}
                            </h2>
                        </div>
                    </div>
                    <p class="text-slate-400 text-xs md:text-sm pr-14">${sec.subtitle}</p>
                    <div class="h-px w-full bg-gradient-to-r from-amber-500/30 via-amber-500/10 to-transparent mt-4"></div>
                </div>

                <div class="bg-[#0a0f1d] border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-amber-500/30 transition-all duration-300 shadow-2xl relative overflow-hidden space-y-6 text-slate-200 text-sm md:text-base leading-relaxed text-justify">
                    <div class="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    ${
                      sec.num === 2
                        ? `
                    <!-- VIP Infographic Cosmic Identity Banner -->
                    <div class="shenasnameh-infographic my-4 p-6 rounded-3xl bg-gradient-to-br from-[#0f1933] via-[#0a1124] to-[#060b18] border-2 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.18)] relative overflow-hidden" style="background: linear-gradient(135deg, #0f1933 0%, #0a1124 50%, #060b18 100%); border: 2px solid rgba(245, 158, 11, 0.4); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-4 mb-5" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; border-bottom: 1px solid rgba(245, 158, 11, 0.3); padding-bottom: 1rem; margin-bottom: 1.25rem;">
                            <div class="flex items-center gap-3" style="display: flex; align-items: center; gap: 0.75rem;">
                                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg" style="width: 3rem; height: 3rem; border-radius: 1rem; background: linear-gradient(135deg, #fbbf24, #d97706); color: #020617; font-size: 1.3rem; font-weight: 900; display: flex; align-items: center; justify-content: center;">
                                    ☀️
                                </div>
                                <div>
                                    <h3 class="text-lg md:text-xl font-black text-amber-300" style="color: #fcd34d; font-size: 1.15rem; font-weight: 900; margin: 0;">
                                        شناسنامه کیهانی و هویت اخترشناسی
                                    </h3>
                                    <p class="text-xs text-slate-400" style="color: #94a3b8; font-size: 0.75rem; margin-top: 0.2rem;">
                                        تاریخ تولد: ${toPersianDigits(input.birthDateFa)} • زمان: ${toPersianDigits(input.birthTime)} • مکان: ${toPersianDigits(input.birthLocation)}
                                    </p>
                                </div>
                            </div>
                            <span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/40 shadow-sm" style="padding: 0.25rem 0.75rem; border-radius: 9999px; background: rgba(245, 158, 11, 0.2); color: #fcd34d; font-weight: 800; font-size: 0.75rem; border: 1px solid rgba(245, 158, 11, 0.4);">
                                ✨ نسخه اختصاصی VIP
                            </span>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.875rem;">
                            <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-center space-y-1 hover:border-amber-400/50 transition-all" style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(51, 65, 85, 0.8); border-radius: 1rem; padding: 0.875rem; text-align: center;">
                                <span class="text-xs text-slate-400 font-medium block" style="color: #94a3b8; font-size: 0.75rem; display: block;">برج خورشیدی (جوهر)</span>
                                <span class="text-base font-black text-amber-300 block" style="color: #fcd34d; font-size: 1rem; font-weight: 900; display: block; margin-top: 0.25rem;">${(input.planets.find(p => p.name.includes('خورشید') || p.name === 'Sun')?.signSymbol || '♌')} ${(input.planets.find(p => p.name.includes('خورشید') || p.name === 'Sun')?.sign || 'اسد')}</span>
                            </div>
                            <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-center space-y-1 hover:border-amber-400/50 transition-all" style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(51, 65, 85, 0.8); border-radius: 1rem; padding: 0.875rem; text-align: center;">
                                <span class="text-xs text-slate-400 font-medium block" style="color: #94a3b8; font-size: 0.75rem; display: block;">برج ماه (احساس)</span>
                                <span class="text-base font-black text-amber-300 block" style="color: #fcd34d; font-size: 1rem; font-weight: 900; display: block; margin-top: 0.25rem;">${(input.planets.find(p => p.name.includes('ماه') || p.name === 'Moon')?.signSymbol || '♐')} ${(input.planets.find(p => p.name.includes('ماه') || p.name === 'Moon')?.sign || 'قوس')}</span>
                            </div>
                            <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-center space-y-1 hover:border-amber-400/50 transition-all" style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(51, 65, 85, 0.8); border-radius: 1rem; padding: 0.875rem; text-align: center;">
                                <span class="text-xs text-slate-400 font-medium block" style="color: #94a3b8; font-size: 0.75rem; display: block;">طالع (برج صعودی)</span>
                                <span class="text-base font-black text-amber-300 block" style="color: #fcd34d; font-size: 1rem; font-weight: 900; display: block; margin-top: 0.25rem;">${input.ascendant.signSymbol} ${input.ascendant.sign}</span>
                            </div>
                            <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-center space-y-1 hover:border-amber-400/50 transition-all" style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(51, 65, 85, 0.8); border-radius: 1rem; padding: 0.875rem; text-align: center;">
                                <span class="text-xs text-slate-400 font-medium block" style="color: #94a3b8; font-size: 0.75rem; display: block;">میانه آسمان (رسالت)</span>
                                <span class="text-base font-black text-amber-300 block" style="color: #fcd34d; font-size: 1rem; font-weight: 900; display: block; margin-top: 0.25rem;">${input.mc.signSymbol} ${input.mc.sign}</span>
                            </div>
                        </div>
                    </div>
                    `
                        : ''
                    }

                    ${getSection(
                      sec.num,
                      `<p class="text-slate-400 italic">در حال نگارش تحلیل عمیق بخش ${sec.numFa} توسط تیم فلک‌نامه...</p>`
                    )}
                </div>
            </section>
            `
              )
              .join('\n')}

            <!-- Footer -->
            <footer class="mt-20 border-t border-slate-800 pt-8 pb-16 text-center space-y-3">
                <h3 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-200 to-amber-500">
                    فلک‌نامه
                </h3>
                <p class="text-slate-400 text-xs">گزارش اختصاصی چارت تولد و نقشه راه اخترشناسی تیم فلک‌نامه</p>
                <p class="text-[10px] text-slate-600 uppercase tracking-widest pt-2">— پایان گزارش —</p>
            </footer>

        </main>
    </div>

    <!-- Interactive Canvas Natal Wheel Script -->
    <script>
        const CHART_DATA = ${serializedChartData};
        
        document.addEventListener('DOMContentLoaded', () => {
            // 1. Scroll-Spy Navigation
            const sections = document.querySelectorAll('section[id^="sec"]');
            const navLinks = document.querySelectorAll('.nav-link');

            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const secId = entry.target.getAttribute('id');
                        const num = secId.replace('sec', '');
                        
                        navLinks.forEach(link => link.classList.remove('active'));
                        const activeLink = document.getElementById('nav-link-' + num);
                        if (activeLink) {
                            activeLink.classList.add('active');
                            activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                        }
                    }
                });
            }, observerOptions);

            sections.forEach(sec => observer.observe(sec));

            // 2. Render Interactive Animated Natal Chart Wheel Canvas
            initNatalWheel();
        });

        function initNatalWheel() {
            const canvas = document.getElementById('natal-wheel-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const tooltip = document.getElementById('wheel-tooltip');

            // Responsive high DPI sizing
            const rect = canvas.getBoundingClientRect();
            const size = Math.min(rect.width || 450, 500);
            canvas.width = size * 2;
            canvas.height = size * 2;
            ctx.scale(2, 2);

            const center = size / 2;
            const radius = size * 0.42;

            const ZODIAC_SIGNS = [
                { name: 'حمل', symbol: '♈', color: '#ef4444' },
                { name: 'ثور', symbol: '♉', color: '#10b981' },
                { name: 'جوزا', symbol: '♊', color: '#3b82f6' },
                { name: 'سرطان', symbol: '♋', color: '#06b6d4' },
                { name: 'اسد', symbol: '♌', color: '#f59e0b' },
                { name: 'سنبله', symbol: '♍', color: '#84cc16' },
                { name: 'میزان', symbol: '♎', color: '#ec4899' },
                { name: 'عقرب', symbol: '♏', color: '#9333ea' },
                { name: 'قوس', symbol: '♐', color: '#f97316' },
                { name: 'جدی', symbol: '♑', color: '#64748b' },
                { name: 'دلو', symbol: '♒', color: '#0284c7' },
                { name: 'حوت', symbol: '♓', color: '#14b8a6' }
            ];

            const SIGN_OFFSETS = {
                'حمل': 0, 'Aries': 0,
                'ثور': 30, 'Taurus': 30,
                'جوزا': 60, 'Gemini': 60,
                'سرطان': 90, 'Cancer': 90,
                'اسد': 120, 'Leo': 120,
                'سنبله': 150, 'Virgo': 150,
                'میزان': 180, 'Libra': 180,
                'عقرب': 210, 'Scorpio': 210,
                'قوس': 240, 'Sagittarius': 240,
                'جدی': 270, 'Capricorn': 270,
                'دلو': 300, 'Aquarius': 300,
                'حوت': 330, 'Pisces': 330
            };

            function toEngNum(str) {
                if (!str) return '0';
                return String(str)
                    .replace(/[۰٠]/g, '0').replace(/[۱١]/g, '1').replace(/[۲٢]/g, '2')
                    .replace(/[۳٣]/g, '3').replace(/[۴٤]/g, '4').replace(/[۵٥]/g, '5')
                    .replace(/[۶٦]/g, '6').replace(/[۷٧]/g, '7').replace(/[۸٨]/g, '8')
                    .replace(/[۹٩]/g, '9');
            }

            let rotationAngle = 0;
            let showAspects = true;
            let isAnimating = true;
            let highlightedIndex = null;

            // Generate background stars
            const stars = Array.from({ length: 45 }, () => ({
                x: Math.random() * size,
                y: Math.random() * size,
                r: Math.random() * 1.5 + 0.5,
                alpha: Math.random(),
                speed: Math.random() * 0.02 + 0.005
            }));

            // Calculate exact angles for planets
            const planetNodes = (CHART_DATA.planets || []).map((p, idx) => {
                const cleanDegStr = toEngNum(p.degree || '0');
                const m = cleanDegStr.match(/(\d{1,2})/);
                const degNum = m ? parseInt(m[1], 10) : 0;
                const signOffset = SIGN_OFFSETS[p.sign] || 0;
                const totalDeg = (signOffset + (degNum % 30)) % 360;
                const rad = (totalDeg * Math.PI) / 180;
                return { ...p, totalDeg, rad, index: idx, rFactor: 0.72 };
            });

            // Prevent overlapping planet symbols by adjusting concentric radial rings
            planetNodes.sort((a, b) => a.totalDeg - b.totalDeg);
            const rings = [0.76, 0.63, 0.52];
            for (let i = 0; i < planetNodes.length; i++) {
                let ringIdx = 0;
                for (let j = 0; j < i; j++) {
                    const diff = Math.abs(planetNodes[i].totalDeg - planetNodes[j].totalDeg);
                    const minDiff = diff > 180 ? 360 - diff : diff;
                    if (minDiff < 7.5) {
                        ringIdx = (ringIdx + 1) % rings.length;
                    }
                }
                planetNodes[i].rFactor = rings[ringIdx];
            }

            function draw() {
                ctx.clearRect(0, 0, size, size);

                // Background galaxy glow
                const grad = ctx.createRadialGradient(center, center, 10, center, center, radius * 1.1);
                grad.addColorStop(0, '#0f172a');
                grad.addColorStop(0.7, '#070d1e');
                grad.addColorStop(1, '#020617');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(center, center, radius * 1.05, 0, Math.PI * 2);
                ctx.fill();

                // Draw starry particles
                stars.forEach(s => {
                    s.alpha += s.speed;
                    if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;
                    ctx.fillStyle = 'rgba(255, 255, 255, ' + (Math.abs(s.alpha) * 0.7) + ')';
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                    ctx.fill();
                });

                ctx.save();
                ctx.translate(center, center);
                ctx.rotate((rotationAngle * Math.PI) / 180);

                // Outer Zodiac Ring
                for (let i = 0; i < 12; i++) {
                    const startAngle = (i * 30 * Math.PI) / 180;
                    const endAngle = ((i + 1) * 30 * Math.PI) / 180;
                    const z = ZODIAC_SIGNS[i];

                    ctx.beginPath();
                    ctx.arc(0, 0, radius, startAngle, endAngle);
                    ctx.arc(0, 0, radius * 0.82, endAngle, startAngle, true);
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Zodiac Symbol & Text
                    const midAngle = startAngle + (15 * Math.PI) / 180;
                    const textR = radius * 0.91;
                    const tx = Math.cos(midAngle) * textR;
                    const ty = Math.sin(midAngle) * textR;

                    ctx.fillStyle = z.color;
                    ctx.font = 'bold 13px Vazirmatn, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(z.symbol, tx, ty);
                }

                // 12 House Radial Lines
                for (let i = 0; i < 12; i++) {
                    const ang = (i * 30 * Math.PI) / 180;
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(ang) * (radius * 0.48), Math.sin(ang) * (radius * 0.48));
                    ctx.lineTo(Math.cos(ang) * radius, Math.sin(ang) * radius);
                    ctx.strokeStyle = i % 3 === 0 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(148, 163, 184, 0.15)';
                    ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.8;
                    ctx.stroke();
                }

                // Inner House Circle
                ctx.beginPath();
                ctx.arc(0, 0, radius * 0.48, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw ASC & MC Angle Axis Lines
                if (CHART_DATA.ascendant && CHART_DATA.ascendant.sign) {
                    const cleanDeg = toEngNum(CHART_DATA.ascendant.degree || '0');
                    const m = cleanDeg.match(/(\d{1,2})/);
                    const degNum = m ? parseInt(m[1], 10) : 0;
                    const ascOffset = SIGN_OFFSETS[CHART_DATA.ascendant.sign] || 0;
                    const ascDeg = (ascOffset + (degNum % 30)) % 360;
                    const ascRad = (ascDeg * Math.PI) / 180;

                    ctx.beginPath();
                    ctx.moveTo(Math.cos(ascRad) * (radius * 0.25), Math.sin(ascRad) * (radius * 0.25));
                    ctx.lineTo(Math.cos(ascRad) * (radius * 0.98), Math.sin(ascRad) * (radius * 0.98));
                    ctx.strokeStyle = '#06b6d4';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    const lx = Math.cos(ascRad) * (radius * 1.04);
                    const ly = Math.sin(ascRad) * (radius * 1.04);
                    ctx.fillStyle = '#22d3ee';
                    ctx.font = 'extrabold 10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('ASC', lx, ly);
                }

                if (CHART_DATA.mc && CHART_DATA.mc.sign) {
                    const cleanDeg = toEngNum(CHART_DATA.mc.degree || '0');
                    const m = cleanDeg.match(/(\d{1,2})/);
                    const degNum = m ? parseInt(m[1], 10) : 0;
                    const mcOffset = SIGN_OFFSETS[CHART_DATA.mc.sign] || 0;
                    const mcDeg = (mcOffset + (degNum % 30)) % 360;
                    const mcRad = (mcDeg * Math.PI) / 180;

                    ctx.beginPath();
                    ctx.moveTo(Math.cos(mcRad) * (radius * 0.25), Math.sin(mcRad) * (radius * 0.25));
                    ctx.lineTo(Math.cos(mcRad) * (radius * 0.98), Math.sin(mcRad) * (radius * 0.98));
                    ctx.strokeStyle = '#f59e0b';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    const lx = Math.cos(mcRad) * (radius * 1.04);
                    const ly = Math.sin(mcRad) * (radius * 1.04);
                    ctx.fillStyle = '#fbbf24';
                    ctx.font = 'extrabold 10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('MC', lx, ly);
                }

                // Draw Aspect Lines between planets if enabled
                if (showAspects) {
                    for (let i = 0; i < planetNodes.length; i++) {
                        for (let j = i + 1; j < planetNodes.length; j++) {
                            const p1 = planetNodes[i];
                            const p2 = planetNodes[j];
                            const diff = Math.abs(p1.totalDeg - p2.totalDeg) % 360;
                            const angleDiff = diff > 180 ? 360 - diff : diff;

                            let color = null;
                            if (Math.abs(angleDiff - 120) < 6 || Math.abs(angleDiff - 60) < 5) {
                                color = 'rgba(16, 185, 129, 0.35)'; // Trine / Sextile (Green)
                            } else if (Math.abs(angleDiff - 180) < 7 || Math.abs(angleDiff - 90) < 6) {
                                color = 'rgba(244, 63, 94, 0.35)'; // Opposition / Square (Red)
                            } else if (angleDiff < 8) {
                                color = 'rgba(245, 158, 11, 0.45)'; // Conjunction (Gold)
                            }

                            if (color) {
                                const rInner = radius * 0.58;
                                const x1 = Math.cos(p1.rad) * rInner;
                                const y1 = Math.sin(p1.rad) * rInner;
                                const x2 = Math.cos(p2.rad) * rInner;
                                const y2 = Math.sin(p2.rad) * rInner;

                                ctx.beginPath();
                                ctx.moveTo(x1, y1);
                                ctx.lineTo(x2, y2);
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 1;
                                ctx.stroke();
                            }
                        }
                    }
                }

                // Plot Celestial Bodies
                planetNodes.forEach((p) => {
                    const pr = radius * p.rFactor;
                    const px = Math.cos(p.rad) * pr;
                    const py = Math.sin(p.rad) * pr;

                    const isHighlight = highlightedIndex === p.index;

                    // Glow circle
                    ctx.beginPath();
                    ctx.arc(px, py, isHighlight ? 14 : 11, 0, Math.PI * 2);
                    ctx.fillStyle = isHighlight ? 'rgba(245, 158, 11, 0.95)' : 'rgba(15, 23, 42, 0.95)';
                    ctx.fill();
                    ctx.strokeStyle = isHighlight ? '#ffffff' : '#f59e0b';
                    ctx.lineWidth = isHighlight ? 2 : 1.2;
                    ctx.stroke();

                    // Symbol
                    ctx.fillStyle = isHighlight ? '#020617' : '#fbbf24';
                    ctx.font = 'bold 11px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(p.symbol || '✦', px, py);
                });

                ctx.restore();

                if (isAnimating) {
                    rotationAngle = (rotationAngle + 0.04) % 360;
                }
                requestAnimationFrame(draw);
            }

            draw();

            // Interactivity Controls
            document.getElementById('btn-toggle-aspects')?.addEventListener('click', () => {
                showAspects = !showAspects;
            });

            document.getElementById('btn-rotate-wheel')?.addEventListener('click', () => {
                isAnimating = !isAnimating;
            });

            // Legend Badges Hover / Click Handlers
            document.querySelectorAll('.planet-badge').forEach(badge => {
                badge.addEventListener('mouseenter', (e) => {
                    const idx = parseInt(badge.getAttribute('data-index') || '0', 10);
                    highlightedIndex = idx;
                });
                badge.addEventListener('mouseleave', () => {
                    highlightedIndex = null;
                });
            });

            // Hover Tooltip on Canvas
            canvas.addEventListener('mousemove', (e) => {
                const cRect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - cRect.left;
                const mouseY = e.clientY - cRect.top;
                
                // Convert mouse pos relative to wheel center
                const dx = mouseX - cRect.width / 2;
                const dy = mouseY - cRect.height / 2;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let angle = (Math.atan2(dy, dx) * 180) / Math.PI - rotationAngle;
                if (angle < 0) angle += 360;

                // Check if hovering near any planet angle
                const matched = planetNodes.find(p => {
                    const diff = Math.abs(p.totalDeg - angle) % 360;
                    return (diff < 12 || diff > 348) && dist > cRect.width * 0.18 && dist < cRect.width * 0.45;
                });

                if (matched) {
                    highlightedIndex = matched.index;
                    tooltip.classList.remove('hidden');
                    tooltip.style.left = (mouseX + 15) + 'px';
                    tooltip.style.top = (mouseY + 15) + 'px';
                    tooltip.innerHTML =
                        '<div class="font-bold text-amber-300 border-b border-amber-500/30 pb-1 mb-1">' + matched.symbol + ' ' + matched.name + '</div>' +
                        '<div>برج: <strong>' + matched.sign + ' (' + matched.signSymbol + ')</strong></div>' +
                        '<div>درجه: <strong>' + matched.degree + '</strong></div>' +
                        '<div>موقعیت: <strong>' + matched.house + '</strong></div>' +
                        (matched.isRetrograde ? '<div class="text-amber-400 font-bold mt-1">حالت برگشتی (Rx)</div>' : '');
                } else {
                    highlightedIndex = null;
                    tooltip.classList.add('hidden');
                }
            });

            canvas.addEventListener('mouseleave', () => {
                highlightedIndex = null;
                tooltip.classList.add('hidden');
            });
        }
    </script>
</body>
</html>`;
}
