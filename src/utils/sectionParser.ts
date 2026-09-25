import { toPersianDigits } from './persianNumbers';

/**
 * Utility to parse Gemini output text into 14 distinct sections.
 */
export function parseSectionsFromText(fullText: string): Record<number, string> {
  const sectionsMap: Record<number, string> = {};

  // Try parsing with ---BEGIN_SECTION_X--- tags first
  for (let i = 1; i <= 14; i++) {
    const sectionRegex = new RegExp(
      `---BEGIN_SECTION_${i}---([\\s\\S]*?)(?:---END_SECTION_${i}---|---BEGIN_SECTION_${i + 1}---|$)`,
      'i'
    );
    const match = fullText.match(sectionRegex);
    if (match && match[1]?.trim()) {
      sectionsMap[i] = formatMarkdownToHtml(match[1].trim(), i);
    }
  }

  // Fallback if tags weren't strictly used (e.g. split by "بخش ۱:", "بخش :۱", "بخش ۱", etc.)
  if (Object.keys(sectionsMap).length < 5) {
    const fallbackBlocks = fullText.split(/(?=بخش\s*[:\-]?\s*\d+|بخش\s+\d+|SECTION\s+\d+)/gi);
    fallbackBlocks.forEach((block, idx) => {
      const matchNum = block.match(/(?:بخش\s*[:\-]?\s*|بخش\s+|SECTION\s+)(\d+)/i);
      const sectionNum = matchNum ? parseInt(matchNum[1], 10) : idx + 1;
      if (sectionNum >= 1 && sectionNum <= 14 && block.trim()) {
        sectionsMap[sectionNum] = formatMarkdownToHtml(block.trim(), sectionNum);
      }
    });
  }

  return sectionsMap;
}

/**
 * Formats Markdown text into clean, human-crafted VIP HTML styled for the Falaknameh template cards.
 * Strips raw AI markdown artifacts while converting numbers to Persian digits and structuring infographic widgets.
 */
export function formatMarkdownToHtml(rawText: string, sectionNumber: number = 0): string {
  if (!rawText) return '';

  // 1. Clean section markers & redundant prompt header lines
  let text = rawText
    .replace(/---BEGIN_SECTION_\d+---/gi, '')
    .replace(/---END_SECTION_\d+---/gi, '')
    .trim();

  // Strip redundant header lines at the very start of section text (e.g. "بخش ۲: ...", "(Sun Sign & Life Purpose)", etc.)
  const headerCleanRegex = /^(?:#*\s*)?(?:بخش\s*\d+[^:\n]*[:\-\s]*[^\n]*|\([^)]+\))\n?/i;
  while (headerCleanRegex.test(text)) {
    text = text.replace(headerCleanRegex, '').trim();
  }

  // Replace "چارت زایشی" with "چارت تولد" everywhere
  text = text.replace(/چارت زایشی/g, 'چارت تولد');

  // Strip raw unpadded HTML divs with inline border styles produced directly by Gemini
  text = text.replace(/<div\s+style="[^"]*border[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (match, innerContent) => {
    return `\n${innerContent.trim()}\n`;
  });

  // 2. Pre-process Markdown Tables before splitting lines
  const tableRegex = /((?:^[ \t]*\|[^\n]+\|[ \t]*(?:\n|$))+)/gm;

  text = text.replace(tableRegex, (tableBlock) => {
    const rows = tableBlock
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (rows.length === 0) return '';

    let htmlTable =
      '\n<div class="overflow-x-auto my-6 rounded-2xl border border-slate-800 bg-[#0a0f1d] shadow-xl"><table class="w-full text-right text-xs sm:text-sm border-collapse">\n';
    let isHeader = true;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Skip markdown table separator row like |---|---| or |:---:|:---:|
      if (/^[ \t]*\|[\s\-:\t|]+\|[ \t]*$/.test(row)) {
        isHeader = false;
        continue;
      }

      const cells = row
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());

      if (cells.length === 0) continue;

      if (isHeader && i === 0) {
        htmlTable +=
          '  <thead>\n    <tr class="bg-slate-800 text-amber-300 font-bold border-b border-slate-700">\n';
        cells.forEach((cell) => {
          htmlTable += `      <th class="p-3.5">${formatInlineFormatting(cell)}</th>\n`;
        });
        htmlTable += '    </tr>\n  </thead>\n  <tbody class="divide-y divide-slate-800/80 text-slate-200">\n';
      } else {
        htmlTable += '    <tr class="hover:bg-slate-800/40 transition-colors">\n';
        cells.forEach((cell) => {
          htmlTable += `      <td class="p-3.5">${formatInlineFormatting(cell)}</td>\n`;
        });
        htmlTable += '    </tr>\n';
      }
    }

    htmlTable += '  </tbody>\n</table></div>\n';
    return htmlTable;
  });

  // Split into lines for line-by-line formatting
  const lines = text.split('\n');
  const resultLines: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';

  const closeListIfOpen = () => {
    if (inList) {
      resultLines.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // If line is part of generated HTML table, output directly
    if (
      line.startsWith('<div class="overflow-x-auto') ||
      line.startsWith('<table') ||
      line.startsWith('<thead') ||
      line.startsWith('<tbody') ||
      line.startsWith('<tr') ||
      line.startsWith('<th') ||
      line.startsWith('<td') ||
      line.startsWith('</table>') ||
      line.startsWith('</div>') ||
      line.startsWith('</thead>') ||
      line.startsWith('</tbody>')
    ) {
      closeListIfOpen();
      resultLines.push(line);
      continue;
    }

    if (!line) {
      closeListIfOpen();
      continue;
    }

    // 3. Horizontal Dividers (---, ***, ===, etc.)
    if (/^[\-\*\=_]{3,}$/.test(line)) {
      closeListIfOpen();
      resultLines.push('<div class="h-px w-full bg-gradient-to-r from-amber-500/30 via-slate-700 to-transparent my-6"></div>');
      continue;
    }

    // 4. Monthly Transit Timeline Cards (Detecting months like مرداد ۱۴۰۵: or مرداد-شهریور ۱۴۰۵)
    const transitMonthMatch = line.match(/^([•\-\*]?\s*)?((?:فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)\s*(?:[تا\-]\s*(?:فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)\s*)?(?:۱۳\d\d|۱۴\d\d|\d{4}))[:\s\-\.]*(.*)$/i);
    if (transitMonthMatch) {
      closeListIfOpen();
      const monthTitle = toPersianDigits(transitMonthMatch[2].trim());
      const monthText = formatInlineFormatting(transitMonthMatch[3].trim());
      resultLines.push(
        `<div class="my-5 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-[#0c1427] border border-amber-500/30 shadow-xl hover:border-amber-400 transition-all group"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40 shadow-sm flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>${monthTitle}</span></div><p class="text-sm md:text-base leading-relaxed text-slate-200 text-justify">${monthText}</p></div>`
      );
      continue;
    }

    // 5. Headings (#, ##, ###, ####, etc.)
    const headingMatch = line.match(/^(#{1,6})\s*(.*)$/);
    if (headingMatch) {
      closeListIfOpen();
      const level = headingMatch[1].length;
      let title = headingMatch[2].trim();
      title = title.replace(/\*\*(.*?)\*\*/g, '$1').replace(/#(.*)#/g, '$1');
      title = toPersianDigits(title);

      if (level === 1) {
        resultLines.push(
          `<div class="mt-8 mb-4 border-b border-amber-500/20 pb-2"><h3 class="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-amber-300 to-amber-500 flex items-center gap-2"><span class="text-amber-400">✦</span> ${title}</h3></div>`
        );
      } else if (level === 2) {
        resultLines.push(
          `<div class="mt-6 mb-4 p-4 rounded-2xl bg-slate-900/80 border-r-4 border-amber-500 border border-slate-800 shadow-md"><h4 class="text-base sm:text-lg font-bold text-white flex items-center gap-2"><span class="text-amber-400">✦</span> ${title}</h4></div>`
        );
      } else {
        resultLines.push(
          `<h5 class="text-sm sm:text-base font-bold text-amber-400 mt-5 mb-2 flex items-center gap-2"><span class="text-amber-500 text-xs">▫</span> ${title}</h5>`
        );
      }
      continue;
    }

// --- VIP Callout Card Builders ---
function buildVipMessageCard(titleText: string, bodyText: string, icon: string = '🔮'): string {
  const formattedTitle = formatInlineFormatting(titleText || 'پیام کیهانی به شما');
  const formattedBody = formatInlineFormatting(bodyText);
  return `
<div class="vip-callout-card vip-message-card my-8 rounded-2xl shadow-2xl relative overflow-hidden group" style="direction: rtl !important; text-align: right !important; padding: 1.85rem 2.25rem !important; border-radius: 1.5rem !important; background: linear-gradient(135deg, #0f1a36 0%, #080f21 60%, #03060f 100%) !important; border: 1px solid rgba(245, 158, 11, 0.45) !important; border-right: 5px solid #fbbf24 !important; box-shadow: 0 15px 40px -5px rgba(0, 0, 0, 0.75), 0 0 25px rgba(245, 158, 11, 0.15) !important; margin-top: 1.75rem !important; margin-bottom: 1.75rem !important;">
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; direction: rtl !important; text-align: right !important;">
        <div style="width: 2.75rem; height: 2.75rem; border-radius: 0.85rem; background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.4); color: #fcd34d; font-size: 1.35rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);">
            ${icon}
        </div>
        <h4 style="color: #fde68a !important; font-size: 1.15rem !important; font-weight: 900 !important; margin: 0 !important; padding: 0 !important; line-height: 1.4 !important; text-shadow: 0 2px 4px rgba(0,0,0,0.6); direction: rtl !important; text-align: right !important;">
            ${formattedTitle}
        </h4>
    </div>
    <p dir="rtl" style="color: #f1f5f9 !important; font-size: 0.98rem !important; line-height: 1.95 !important; text-align: justify !important; direction: rtl !important; margin: 0 !important; padding: 0 !important; opacity: 0.99; unicode-bidi: embed;">
        ${formattedBody}
    </p>
</div>
`;
}

function buildVipSolutionCard(titleText: string, bodyText: string, icon: string = '💡'): string {
  const formattedTitle = formatInlineFormatting(titleText || 'راهکار و استراتژی کلیدی');
  const formattedBody = formatInlineFormatting(bodyText);
  return `
<div class="vip-callout-card vip-solution-card my-8 rounded-2xl shadow-2xl relative overflow-hidden group" style="direction: rtl !important; text-align: right !important; padding: 1.85rem 2.25rem !important; border-radius: 1.5rem !important; background: linear-gradient(135deg, #053326 0%, #03241b 60%, #01140f 100%) !important; border: 1px solid rgba(16, 185, 129, 0.45) !important; border-right: 5px solid #10b981 !important; box-shadow: 0 15px 40px -5px rgba(0, 0, 0, 0.75), 0 0 25px rgba(16, 185, 129, 0.15) !important; margin-top: 1.75rem !important; margin-bottom: 1.75rem !important;">
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; direction: rtl !important; text-align: right !important;">
        <div style="width: 2.75rem; height: 2.75rem; border-radius: 0.85rem; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 1.35rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);">
            ${icon}
        </div>
        <h4 style="color: #a7f3d0 !important; font-size: 1.15rem !important; font-weight: 900 !important; margin: 0 !important; padding: 0 !important; line-height: 1.4 !important; text-shadow: 0 2px 4px rgba(0,0,0,0.6); direction: rtl !important; text-align: right !important;">
            ${formattedTitle}
        </h4>
    </div>
    <p dir="rtl" style="color: #ecfdf5 !important; font-size: 0.98rem !important; line-height: 1.95 !important; text-align: justify !important; direction: rtl !important; margin: 0 !important; padding: 0 !important; opacity: 0.99; unicode-bidi: embed;">
        ${formattedBody}
    </p>
</div>
`;
}

function buildVipWarningCard(titleText: string, bodyText: string, icon: string = '⚠️'): string {
  const formattedTitle = formatInlineFormatting(titleText || 'هشدار و خط قرمز');
  const formattedBody = formatInlineFormatting(bodyText);
  return `
<div class="vip-callout-card vip-warning-card my-8 rounded-2xl shadow-2xl relative overflow-hidden group" style="direction: rtl !important; text-align: right !important; padding: 1.85rem 2.25rem !important; border-radius: 1.5rem !important; background: linear-gradient(135deg, #420e1c 0%, #2e0913 60%, #1a040a 100%) !important; border: 1px solid rgba(244, 63, 94, 0.45) !important; border-right: 5px solid #f43f5e !important; box-shadow: 0 15px 40px -5px rgba(0, 0, 0, 0.75), 0 0 25px rgba(244, 63, 94, 0.15) !important; margin-top: 1.75rem !important; margin-bottom: 1.75rem !important;">
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; direction: rtl !important; text-align: right !important;">
        <div style="width: 2.75rem; height: 2.75rem; border-radius: 0.85rem; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.4); color: #fb7185; font-size: 1.35rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 15px rgba(244, 63, 94, 0.3);">
            ${icon}
        </div>
        <h4 style="color: #fecdd3 !important; font-size: 1.15rem !important; font-weight: 900 !important; margin: 0 !important; padding: 0 !important; line-height: 1.4 !important; text-shadow: 0 2px 4px rgba(0,0,0,0.6); direction: rtl !important; text-align: right !important;">
            ${formattedTitle}
        </h4>
    </div>
    <p dir="rtl" style="color: #fff1f2 !important; font-size: 0.98rem !important; line-height: 1.95 !important; text-align: justify !important; direction: rtl !important; margin: 0 !important; padding: 0 !important; opacity: 0.99; unicode-bidi: embed;">
        ${formattedBody}
    </p>
</div>
`;
}

function buildVipAdviceCard(titleText: string, bodyText: string, icon: string = '📜'): string {
  const formattedTitle = formatInlineFormatting(titleText || 'توصیه و نکته مهم');
  const formattedBody = formatInlineFormatting(bodyText);
  return `
<div class="vip-callout-card vip-advice-card my-8 rounded-2xl shadow-2xl relative overflow-hidden group" style="direction: rtl !important; text-align: right !important; padding: 1.85rem 2.25rem !important; border-radius: 1.5rem !important; background: linear-gradient(135deg, #381f07 0%, #291605 60%, #170c02 100%) !important; border: 1px solid rgba(245, 158, 11, 0.45) !important; border-right: 5px solid #fbbf24 !important; box-shadow: 0 15px 40px -5px rgba(0, 0, 0, 0.75), 0 0 25px rgba(245, 158, 11, 0.15) !important; margin-top: 1.75rem !important; margin-bottom: 1.75rem !important;">
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; direction: rtl !important; text-align: right !important;">
        <div style="width: 2.75rem; height: 2.75rem; border-radius: 0.85rem; background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; font-size: 1.35rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);">
            ${icon}
        </div>
        <h4 style="color: #fde68a !important; font-size: 1.15rem !important; font-weight: 900 !important; margin: 0 !important; padding: 0 !important; line-height: 1.4 !important; text-shadow: 0 2px 4px rgba(0,0,0,0.6); direction: rtl !important; text-align: right !important;">
            ${formattedTitle}
        </h4>
    </div>
    <p dir="rtl" style="color: #fffbeb !important; font-size: 0.98rem !important; line-height: 1.95 !important; text-align: justify !important; direction: rtl !important; margin: 0 !important; padding: 0 !important; opacity: 0.99; unicode-bidi: embed;">
        ${formattedBody}
    </p>
</div>
`;
}

    // 6. Blockquotes (> text)
    if (line.startsWith('>')) {
      closeListIfOpen();
      const quoteText = line.replace(/^>\s*/, '').trim();
      let title = 'پیام کیهانی به شما';
      let body = quoteText;
      const titleMatch = quoteText.match(/^([^:\-؛]+[:\-؛])\s*(.*)$/);
      if (titleMatch && titleMatch[1] && titleMatch[2]) {
        title = titleMatch[1].replace(/[:\-؛]/, '').trim();
        body = titleMatch[2].trim();
      }
      resultLines.push(buildVipMessageCard(title, body, '🔮'));
      continue;
    }

    // 7. Bullet lists & Numbered Items (*, -, •, 1., 1), ۱., ۲.)
    const bulletMatch = line.match(/^([•\-\*]|(?:ویژگی\s*)?[\d\u06F0-\u06F9]+[\.\)\:\-]?)\s*(.*)$/i);

    if (bulletMatch) {
      const rawMarker = bulletMatch[1];
      const isNumbered = /^[\d\u06F0-\u06F9]+[\.\)\:\-]?/.test(rawMarker) || /^ویژگی/.test(rawMarker);
      const content = bulletMatch[2];

      // If Section 2 or explicit key trait / infographic numbered card
      if (isNumbered) {
        closeListIfOpen();
        const rawNumDigits = rawMarker.replace(/[^\d\u06F0-\u06F9]/g, '');
        const numStr = toPersianDigits(rawNumDigits || String(i + 1));
        const icons = ['👑', '🔥', '💖', '👁️', '🛡️', '⚡', '💎', '🔮', '🧭', '📜', '🌟', '🌊'];
        const numVal = parseInt(rawNumDigits.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))), 10) || 1;
        const icon = icons[(numVal - 1) % icons.length] || '✦';

        let traitTitle = '';
        let traitBody = content;
        const titleMatch = content.match(/^([^:\-؛\)]+[:\-؛\)])\s*(.*)$/);
        if (titleMatch && titleMatch[1] && titleMatch[2]) {
          traitTitle = titleMatch[1].replace(/[:\-؛\)]/, '').trim();
          traitBody = titleMatch[2].trim();
        }

        resultLines.push(`
<div class="infographic-trait-card my-4 p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#0d162d] via-[#091022] to-[#050a17] shadow-xl hover:border-amber-400/60 transition-all duration-300 relative overflow-hidden group" style="direction: rtl; text-align: right; background: linear-gradient(135deg, #0d162d 0%, #091022 50%, #050a17 100%); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 1.25rem; padding: 1.25rem 1.5rem; margin-top: 1rem; margin-bottom: 1rem; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6);">
    <div style="height: 3px; width: 100%; background: linear-gradient(90deg, #f59e0b, #fbbf24, transparent); border-radius: 9999px; margin-bottom: 0.875rem; opacity: 0.85;"></div>
    <div class="flex items-start gap-4" style="display: flex; align-items: flex-start; gap: 1rem; direction: rtl; text-align: right;">
        <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-base flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]" style="min-width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.4); color: #fcd34d; font-size: 1.1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${numStr}
        </div>
        <div class="flex-1 space-y-2" style="flex: 1; direction: rtl; text-align: right;">
            ${
              traitTitle
                ? `<div class="flex items-center gap-2" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                <span style="font-size: 1.2rem; color: #fbbf24;">${icon}</span>
                <h4 class="text-base sm:text-lg font-black text-amber-200" style="color: #fde68a; font-size: 1.05rem; font-weight: 800; margin: 0; line-height: 1.4;">${formatInlineFormatting(
                  traitTitle
                )}</h4>
            </div>`
                : ''
            }
            <div class="text-slate-200 text-sm md:text-base leading-relaxed text-justify opacity-95" style="color: #e2e8f0; font-size: 0.935rem; line-height: 1.8; text-align: justify; margin: 0;">
                ${formatInlineFormatting(traitBody)}
            </div>
        </div>
    </div>
</div>
`);
        continue;
      }

      // Standard Unordered Bullet List
      const targetListType = 'ul';
      if (!inList || listType !== targetListType) {
        closeListIfOpen();
        inList = true;
        listType = targetListType;
        resultLines.push('<ul class="space-y-3 my-4 pr-1">');
      }

      const formattedContent = formatInlineFormatting(content);
      resultLines.push(
        `<li class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:bg-slate-800/50 transition-all text-slate-200 leading-relaxed text-sm md:text-base" style="direction: rtl; text-align: right; display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.875rem 1rem; border-radius: 0.75rem; background: rgba(15,23,42,0.4); border: 1px solid rgba(30,41,59,0.8); margin-bottom: 0.5rem;"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(245,158,11,0.6)]" style="width: 0.6rem; height: 0.6rem; border-radius: 9999px; background: #fbbf24; margin-top: 0.4rem; flex-shrink: 0; display: inline-block;"></span><div class="flex-1" style="flex: 1; text-align: justify;">${formattedContent}</div></li>`
      );
      continue;
    }

    // 8. Regular Paragraph or Callout Box
    closeListIfOpen();

    // Helper to split line into title and body cleanly
    const splitTitleAndBody = (rawLine: string, defaultTitle: string) => {
      let t = defaultTitle;
      let b = rawLine;
      const match = rawLine.match(/^([^:\-؛«]+[:\-؛])\s*(.*)$/);
      if (match && match[1] && match[2]) {
        t = match[1].replace(/[:\-؛]/, '').trim();
        b = match[2].trim();
      } else {
        const colIdx = rawLine.indexOf(':');
        if (colIdx > 0 && colIdx < 45) {
          t = rawLine.slice(0, colIdx).trim();
          b = rawLine.slice(colIdx + 1).trim();
        }
      }
      return { title: t, body: b };
    };

    // Special Header Banner for Identity Card Title / Key Features Header
    if (/^(?:شناسنامه کیهانی|۱۰ ویژگی کلیدی|ویژگی‌های کلیدی|شناسنامه کیهانی و ۱۰ ویژگی کلیدی)/i.test(line)) {
      const formattedHeader = formatInlineFormatting(line);
      resultLines.push(`
        <div class="my-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-r-4 border-amber-400 flex items-center gap-3 shadow-lg" style="direction: rtl; text-align: right; background: linear-gradient(90deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 100%); border-right: 4px solid #fbbf24; padding: 1.25rem 1.5rem; border-radius: 1rem; margin-top: 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.5rem;">✨</span>
          <h3 class="text-lg sm:text-xl font-black text-amber-300" style="color: #fcd34d; font-size: 1.15rem; font-weight: 900; margin: 0;">
            ${formattedHeader}
          </h3>
        </div>
      `);
      continue;
    }

    // A. Detect Celestial Messages / Planet Quotes / Quotes in «...»
    if (
      /^(?:پیام|کلام\s*آخر|درس\s*کیهانی|پیام\s*کیهانی|پیام\s*روحی|پیام\s*فرشتگان|پیام\s*آفرینش|پیام\s*طالع)/i.test(line) ||
      /^پیام\s+.*(?:[:\-؛]|«)/i.test(line) ||
      (line.startsWith('«') && line.endsWith('»'))
    ) {
      const { title, body } = splitTitleAndBody(line, 'پیام کیهانی به شما');
      const icons = ['🔮', '✨', '👑', '☀️', '🌙', '💖', '🌟'];
      const icon = icons[Math.abs(line.length) % icons.length];
      resultLines.push(buildVipMessageCard(title, body, icon));
      continue;
    }

    // B. Detect Red Warnings / Risks / Red Lines
    if (
      /^(?:هشدار|خطر|تله|خطوط?\s*قرمز|خط\s*قرمز|ریسک|نقطه\s*ضعف|چالش)/i.test(line) ||
      /^هشدار/i.test(line)
    ) {
      const { title, body } = splitTitleAndBody(line, 'هشدار و خط قرمز');
      resultLines.push(buildVipWarningCard(title, body, '⚠️'));
      continue;
    }

    // C. Detect Success / Green Opportunities / Wealth Strategy / Solutions
    if (
      /^(?:فرصت|راهکار|راهکارها|راهکارهای?\s*عملی|استراتژی|پیشنهاد|اقدام|کلید|سازگارترین|همسر\s*ایده‌آل)/i.test(line)
    ) {
      const { title, body } = splitTitleAndBody(line, 'راهکار و استراتژی کلیدی');
      resultLines.push(buildVipSolutionCard(title, body, '💡'));
      continue;
    }

    // D. Detect General Gold / Blue Callout (Advice, Notes, Rules)
    if (
      /^(?:توصیه|توصیه‌ها|توصیه\s*تیم|توصیه\s*ویژه|نکته|نکته\s*مهم|قانون|توجه|درس)/i.test(line)
    ) {
      const { title, body } = splitTitleAndBody(line, 'توصیه و نکته مهم');
      resultLines.push(buildVipAdviceCard(title, body, '📜'));
      continue;
    }

    // E. Regular Paragraph
    const formattedLine = formatInlineFormatting(line);
    const cleanLine = formattedLine.replace(/^#+\s*/, '').replace(/\|/g, '');
    if (cleanLine.length > 0) {
      resultLines.push(
        `<p class="mb-4 text-justify leading-relaxed text-slate-200 text-sm md:text-base" style="direction: rtl; text-align: justify; color: #e2e8f0; font-size: 0.935rem; line-height: 1.8; margin-bottom: 1rem;">${cleanLine}</p>`
      );
    }
  }

  closeListIfOpen();
  
  // Final pass: Convert all remaining English numbers in output HTML to Persian digits!
  return toPersianDigits(resultLines.join('\n'));
}

function formatInlineFormatting(text: string): string {
  if (!text) return '';
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300 font-bold">$1</strong>')
    .replace(/__(.*?)__/g, '<strong class="text-amber-300 font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
    .replace(/_(.*?)_/g, '<em class="text-slate-300 italic">$1</em>')
    .replace(/\|/g, '')
    .replace(/#/g, '');
  return toPersianDigits(formatted);
}

export function countWordsPersian(str: string): number {
  if (!str) return 0;
  // Strip HTML tags and count words
  const clean = str.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return 0;
  return clean.split(' ').length;
}
