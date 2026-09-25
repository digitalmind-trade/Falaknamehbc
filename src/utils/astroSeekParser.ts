import { NatalChartInput, PlanetPlacement } from '../types';

export const DEFAULT_SAMPLE_CHART: NatalChartInput = {
  birthDateFa: '۲۷ خرداد ۱۳۶۳',
  birthDateEn: '۱۷ ژوئن ۱۹۸۴ (17 June 1984)',
  birthTime: '۰۴:۲۰ صبح',
  birthLocation: 'ایران، تاکستان',
  ascendant: {
    sign: 'جوزا',
    signSymbol: '♊',
    degree: '۱۶°۳۷′'
  },
  mc: {
    sign: 'دلو',
    signSymbol: '♒',
    degree: '۲۵°۲۳′'
  },
  planets: [
    { name: 'خورشید', symbol: '☀️', sign: 'جوزا', signSymbol: '♊', degree: '۲۶°۰۰′', house: 'خانه اول' },
    { name: 'ماه', symbol: '🌙', sign: 'دلو', signSymbol: '♒', degree: '۶°۵۰′', house: 'خانه نهم' },
    { name: 'عطارد', symbol: '☿', sign: 'جوزا', signSymbol: '♊', degree: '۱۸°۳۶′', house: 'خانه اول' },
    { name: 'زهره', symbol: '♀', sign: 'جوزا', signSymbol: '♊', degree: '۲۶°۱۸′', house: 'خانه اول' },
    { name: 'مریخ', symbol: '♂', sign: 'عقرب', signSymbol: '♏', degree: '۱۱°۴۴′', house: 'خانه ششم', isRetrograde: true },
    { name: 'مشتری', symbol: '♃', sign: 'جدی', signSymbol: '♑', degree: '۹°۳۹′', house: 'خانه هشتم', isRetrograde: true },
    { name: 'زحل', symbol: '♄', sign: 'عقرب', signSymbol: '♏', degree: '۱۰°۱۴′', house: 'خانه ششم', isRetrograde: true },
    { name: 'اورانوس', symbol: '♅', sign: 'قوس', signSymbol: '♐', degree: '۱۰°۵۷′', house: 'خانه ششم', isRetrograde: true },
    { name: 'نپتون', symbol: '♆', sign: 'جدی', signSymbol: '♑', degree: '۰°۰۹′', house: 'خانه هفتم', isRetrograde: true },
    { name: 'پلوتو', symbol: '♇', sign: 'میزان', signSymbol: '♎', degree: '۲۹°۲۷′', house: 'خانه پنجم', isRetrograde: true },
    { name: 'گره شمالی', symbol: '☊', sign: 'جوزا', signSymbol: '♊', degree: '۵°۳۷′', house: 'خانه دوازدهم', isRetrograde: true },
    { name: 'گره جنوبی', symbol: '☋', sign: 'قوس', signSymbol: '♐', degree: '۵°۳۷′', house: 'خانه ششم', isRetrograde: true },
    { name: 'کیرون', symbol: '⚷', sign: 'جوزا', signSymbol: '♊', degree: '۴°۴۷′', house: 'خانه دوازدهم' },
    { name: 'لیلیت (ماه سیاه)', symbol: '⚸', sign: 'حوت', signSymbol: '♓', degree: '۲۱°۰۱′', house: 'خانه دهم' },
    { name: 'سهم شانس (Fortune)', symbol: '⊗', sign: 'حمل', signSymbol: '♈', degree: '۱۲°۱۵′', house: 'خانه یازدهم' },
    { name: 'ورتکس (Vertex)', symbol: '⚡', sign: 'عقرب', signSymbol: '♏', degree: '۲۲°۰۵′', house: 'خانه پنجم' }
  ],
  elements: {
    air: 'بسیار قوی (خورشید، عطارد، زهره در جوزا + ماه و MC در دلو)',
    earth: 'متوسط (مشتری و نپتون در جدی)',
    water: 'قوی (مریخ و زحل در عقرب)',
    fire: 'متوسط (اورانوس در قوس)',
    summary: 'چارت شما ترکیبی از ذهن بسیار فعال، قدرت ارتباطی بالا، عمق روانی و توانایی تحلیل شرایط پیچیده است. غلبه عنصر هوا نشان می‌دهد که ذهن، اطلاعات، ارتباطات و یادگیری نقش بسیار مهمی در مسیر زندگی شما دارند.'
  },
  qualities: {
    cardinal: 'متوسط',
    fixed: 'قوی',
    mutable: 'بسیار قوی',
    summary: 'این ترکیب نشان می‌دهد شما فردی هستید که ذهن بسیار انعطاف‌پذیری دارید و سریع با شرایط جدید هماهنگ می‌شوید، اما در موضوعاتی که برایتان اهمیت عمیق دارند، اراده و پایداری زیادی نشان می‌دهید.'
  },
  aspects: [
    '⭐ خورشید همنشین زهره',
    '⭐ خورشید همنشین عطارد',
    '⭐ خورشید مقابل نپتون',
    '⭐ خورشید تثلیث پلوتو',
    '⭐ مریخ همنشین زحل',
    '⭐ مشتری تسدیس زحل',
    '⭐ زهره تثلیث پلوتو'
  ],
  keyPlanets: [
    '⭐ خورشید در جوزا، خانه اول',
    '⭐ عطارد در جوزا، خانه اول',
    '⭐ زهره در جوزا، خانه اول',
    '⭐ طالع در جوزا',
    '⭐ مریخ و زحل در عقرب، خانه ششم'
  ],
  transitPeriod: 'مهر تا پایان اسفند ۱۴۰۵',
  targetWordCount: 3800,
  additionalInstructions: ''
};

const ZODIAC_LOOKUP: { keys: string[]; signFa: string; signSym: string; signEn: string }[] = [
  { keys: ['aries', 'ari', 'beran', 'ber', 'حمل', '♈'], signFa: 'حمل', signSym: '♈', signEn: 'Aries' },
  { keys: ['taurus', 'tau', 'býk', 'byk', 'ثور', '♉'], signFa: 'ثور', signSym: '♉', signEn: 'Taurus' },
  { keys: ['gemini', 'gem', 'blíženci', 'blizenci', 'blí', 'bli', 'جوزا', '♊'], signFa: 'جوزا', signSym: '♊', signEn: 'Gemini' },
  { keys: ['cancer', 'can', 'rak', 'سرطان', '♋'], signFa: 'سرطان', signSym: '♋', signEn: 'Cancer' },
  { keys: ['leo', 'lev', 'اسد', '♌'], signFa: 'اسد', signSym: '♌', signEn: 'Leo' },
  { keys: ['virgo', 'vir', 'panna', 'pan', 'سنبله', '♍'], signFa: 'سنبله', signSym: '♍', signEn: 'Virgo' },
  { keys: ['libra', 'lib', 'váhy', 'vahy', 'váh', 'vah', 'میزان', '♎'], signFa: 'میزان', signSym: '♎', signEn: 'Libra' },
  { keys: ['scorpio', 'sco', 'štír', 'stir', 'ští', 'sti', 'عقرب', '♏'], signFa: 'عقرب', signSym: '♏', signEn: 'Scorpio' },
  { keys: ['sagittarius', 'sag', 'střelec', 'strelec', 'stř', 'str', 'قوس', '♐'], signFa: 'قوس', signSym: '♐', signEn: 'Sagittarius' },
  { keys: ['capricorn', 'cap', 'kozoroh', 'koz', 'جدی', '♑'], signFa: 'جدی', signSym: '♑', signEn: 'Capricorn' },
  { keys: ['aquarius', 'aqu', 'vodnář', 'vodnar', 'vod', 'دلو', '♒'], signFa: 'دلو', signSym: '♒', signEn: 'Aquarius' },
  { keys: ['pisces', 'pis', 'ryby', 'ryb', 'حوت', '♓'], signFa: 'حوت', signSym: '♓', signEn: 'Pisces' },
];

export function parseSignInfo(text: string): { signFa: string; signSym: string; signEn: string } | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  for (const item of ZODIAC_LOOKUP) {
    for (const k of item.keys) {
      if (k.length <= 3 && !/[♈-♓]/.test(k)) {
        // Use word boundary for 3-letter codes
        const regex = new RegExp(`\\b${k}\\b`, 'i');
        if (regex.test(lower)) return item;
      } else {
        if (lower.includes(k)) return item;
      }
    }
  }
  return null;
}

const HOUSE_PERSIAN_NAMES: Record<number, string> = {
  1: 'خانه اول',
  2: 'خانه دوم',
  3: 'خانه سوم',
  4: 'خانه چهارم',
  5: 'خانه پنجم',
  6: 'خانه ششم',
  7: 'خانه هفتم',
  8: 'خانه هشتم',
  9: 'خانه نهم',
  10: 'خانه دهم',
  11: 'خانه یازدهم',
  12: 'خانه دوازدهم',
};

const CELESTIAL_BODIES_CONFIG: { keys: string[]; name: string; symbol: string; isAngle?: string }[] = [
  { keys: ['sun', 'slunce', 'خورشید'], name: 'خورشید', symbol: '☀️' },
  { keys: ['moon', 'měsíc', 'mesic', 'ماه'], name: 'ماه', symbol: '🌙' },
  { keys: ['mercury', 'merkur', 'عطارد'], name: 'عطارد', symbol: '☿' },
  { keys: ['venus', 'venuse', 'venuše', 'زهره'], name: 'زهره', symbol: '♀' },
  { keys: ['mars', 'مریخ'], name: 'مریخ', symbol: '♂' },
  { keys: ['jupiter', 'مشتری'], name: 'مشتری', symbol: '♃' },
  { keys: ['saturn', 'زحل'], name: 'زحل', symbol: '♄' },
  { keys: ['uranus', 'uran', 'اورانوس'], name: 'اورانوس', symbol: '♅' },
  { keys: ['neptune', 'neptun', 'نپتون'], name: 'نپتون', symbol: '♆' },
  { keys: ['pluto', 'پلوتو'], name: 'پلوتو', symbol: '♇' },
  { keys: ['true node', 'north node', 'mean node', 'n. node', 'n node', 'nnode', 'pravý uzel', 'node', 'گره شمالی', 'نود شمالی'], name: 'گره شمالی', symbol: '☊' },
  { keys: ['south node', 's. node', 's node', 'snode', 'jižní uzel', 'گره جنوبی', 'نود جنوبی'], name: 'گره جنوبی', symbol: '☋' },
  { keys: ['chiron', 'chíron', 'کیرون'], name: 'کیرون', symbol: '⚷' },
  { keys: ['black moon lilith', 'cerna luna', 'černá luna', 'lilith', 'ماه سیاه', 'لیلیت'], name: 'لیلیت (ماه سیاه)', symbol: '⚸' },
  { keys: ['pars fortunae', 'part of fortune', 'fortune', 'saham fortune', 'سهم شانس'], name: 'سهم شانس (Fortune)', symbol: '⊗' },
  { keys: ['vertex', 'vx', 'ورتکس'], name: 'ورتکس (Vertex)', symbol: '⚡' },
  { keys: ['ceres', 'سرس'], name: 'سرس', symbol: '🌾' },
  { keys: ['pallas', 'پالاس'], name: 'پالاس', symbol: '🛡️' },
  { keys: ['juno', 'جونو'], name: 'جونو', symbol: '👑' },
  { keys: ['vesta', 'وستا'], name: 'وستا', symbol: '🔥' },
  { keys: ['eros', 'اروس'], name: 'اروس', symbol: '💘' },
  { keys: ['psyche', 'سایکی'], name: 'سایکی', symbol: '🦋' },
  { keys: ['pholus', 'فولوس'], name: 'فولوس', symbol: '🍷' },
  { keys: ['nessus', 'نسوس'], name: 'نسوس', symbol: '🐍' },
  { keys: ['ascendant', 'asc', 'rising', 'طالع'], name: 'طالع (ASC)', symbol: '⬆️', isAngle: 'asc' },
  { keys: ['medium coeli', 'mc', 'midheaven', 'میانه آسمان'], name: 'میانه آسمان (MC)', symbol: '🏔️', isAngle: 'mc' },
];

const PERSIAN_GREGORIAN_MONTHS: Record<number, string> = {
  1: 'ژانویه', 2: 'فوریه', 3: 'مارس', 4: 'آوریل', 5: 'می', 6: 'ژوئن',
  7: 'جولای', 8: 'اوت', 9: 'سپتامبر', 10: 'اکتبر', 11: 'نوامبر', 12: 'دسامبر',
};

const ENGLISH_MONTHS_MAP: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
  apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
  aug: 8, august: 8, sep: 9, september: 9, sept: 9, oct: 10, october: 10,
  nov: 11, november: 11, dec: 12, december: 12,
};

const PERSIAN_SHAMSI_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

/**
 * Converts Persian/Arabic digits to English digits
 */
export function toEnglishDigits(str: string): string {
  if (!str) return '';
  return str
    .replace(/[۰٠]/g, '0')
    .replace(/[۱١]/g, '1')
    .replace(/[۲٢]/g, '2')
    .replace(/[۳٣]/g, '3')
    .replace(/[۴٤]/g, '4')
    .replace(/[۵٥]/g, '5')
    .replace(/[۶٦]/g, '6')
    .replace(/[۷٧]/g, '7')
    .replace(/[۸٨]/g, '8')
    .replace(/[۹٩]/g, '9');
}

/**
 * Converts English digits to Persian digits
 */
export function toPersianDigits(str: string | number): string {
  if (str === undefined || str === null) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

/**
 * High-precision Gregorian to Jalali (Shamsi) converter using Intl API with mathematical fallback
 */
export function convertGregorianToShamsi(gy: number, gm: number, gd: number): { birthDateFa: string; birthDateEn: string } {
  const monthFaGreg = PERSIAN_GREGORIAN_MONTHS[gm] || '';
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthEnName = monthNamesEn[gm - 1] || '';

  const birthDateEnStr = `${toPersianDigits(gd)} ${monthFaGreg} ${toPersianDigits(gy)} (${gd} ${monthEnName} ${gy})`;

  try {
    const date = new Date(Date.UTC(gy, gm - 1, gd, 12, 0, 0));
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    let yearStr = '';
    let monthStr = '';
    let dayStr = '';

    parts.forEach(p => {
      if (p.type === 'year') yearStr = p.value;
      if (p.type === 'month') monthStr = p.value;
      if (p.type === 'day') dayStr = p.value;
    });

    const birthDateFaStr = `${toPersianDigits(dayStr)} ${monthStr} ${toPersianDigits(yearStr)}`;
    return {
      birthDateFa: birthDateFaStr,
      birthDateEn: birthDateEnStr,
    };
  } catch (e) {
    const { jy, jm, jd } = jalaliFallbackAlgorithm(gy, gm, gd);
    const mName = PERSIAN_SHAMSI_MONTHS[jm - 1] || '';
    return {
      birthDateFa: `${toPersianDigits(jd)} ${mName} ${toPersianDigits(jy)}`,
      birthDateEn: birthDateEnStr,
    };
  }
}

function jalaliFallbackAlgorithm(gy: number, gm: number, gd: number): { jy: number; jm: number; jd: number } {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;

  const gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];

  if (gm > 2 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) {
    days += 1;
  }

  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  let jm: number;
  let jd: number;

  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }

  return { jy, jm, jd };
}

function parseExplicitDateFromText(text: string): { gy: number; gm: number; gd: number } | null {
  const p1 = /(?:Born|Date\s*of\s*birth|Date|Datum|Narozen|Birth\s*Date|تولد)[\s:]*<b>?\s*(\d{1,2})[\.\,\s\-]+([A-Za-z]+|\d{1,2})[\.\,\s\-]+(\d{4})/i;
  const m1 = text.match(p1);
  if (m1) {
    const dVal = parseInt(m1[1], 10);
    const mRaw = m1[2].toLowerCase();
    const mVal = isNaN(Number(mRaw)) ? ENGLISH_MONTHS_MAP[mRaw] : parseInt(mRaw, 10);
    const yVal = parseInt(m1[3], 10);
    if (dVal >= 1 && dVal <= 31 && mVal >= 1 && mVal <= 12 && yVal >= 1800 && yVal <= 2100) {
      return { gy: yVal, gm: mVal, gd: dVal };
    }
  }

  const p2 = /(?:Born|Date\s*of\s*birth|Date|Datum|Narozen|Birth\s*Date|تولد)[\s:]*<b>?\s*([A-Za-z]+)\s+(\d{1,2})[\,\s]+(\d{4})/i;
  const m2 = text.match(p2);
  if (m2) {
    const mStr = m2[1].toLowerCase();
    const mVal = ENGLISH_MONTHS_MAP[mStr];
    const dVal = parseInt(m2[2], 10);
    const yVal = parseInt(m2[3], 10);
    if (dVal >= 1 && dVal <= 31 && mVal && yVal >= 1800 && yVal <= 2100) {
      return { gy: yVal, gm: mVal, gd: dVal };
    }
  }

  const p3 = /(?:Born|Date\s*of\s*birth|Date|Datum|Narozen|Birth\s*Date|تولد)[\s:]*<b>?\s*(\d{4})[\.\/\-](\d{1,2})[\.\/\-](\d{1,2})/i;
  const m3 = text.match(p3);
  if (m3) {
    const yVal = parseInt(m3[1], 10);
    const mVal = parseInt(m3[2], 10);
    const dVal = parseInt(m3[3], 10);
    if (dVal >= 1 && dVal <= 31 && mVal >= 1 && mVal <= 12 && yVal >= 1800 && yVal <= 2100) {
      return { gy: yVal, gm: mVal, gd: dVal };
    }
  }

  return null;
}

function parseGenericDatesFromText(text: string): { gy: number; gm: number; gd: number }[] {
  const results: { gy: number; gm: number; gd: number }[] = [];

  const regex1 = /(\d{1,2})\s*(?:st|nd|rd|th)?[\.\,\s\-]*\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\.\,\s\-]*\s*(\d{4})/gi;
  let match;
  while ((match = regex1.exec(text)) !== null) {
    const dVal = parseInt(match[1], 10);
    const mStr = match[2].toLowerCase();
    const mVal = ENGLISH_MONTHS_MAP[mStr];
    const yVal = parseInt(match[3], 10);
    if (dVal >= 1 && dVal <= 31 && mVal && yVal >= 1800 && yVal <= 2100) {
      results.push({ gy: yVal, gm: mVal, gd: dVal });
    }
  }

  const regex2 = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})\s*(?:st|nd|rd|th)?[\,\s]+\s*(\d{4})/gi;
  while ((match = regex2.exec(text)) !== null) {
    const mStr = match[1].toLowerCase();
    const mVal = ENGLISH_MONTHS_MAP[mStr];
    const dVal = parseInt(match[2], 10);
    const yVal = parseInt(match[3], 10);
    if (dVal >= 1 && dVal <= 31 && mVal && yVal >= 1800 && yVal <= 2100) {
      results.push({ gy: yVal, gm: mVal, gd: dVal });
    }
  }

  const regex3 = /(\d{4})[\.\/\-](\d{1,2})[\.\/\-](\d{1,2})/gi;
  while ((match = regex3.exec(text)) !== null) {
    const yVal = parseInt(match[1], 10);
    const mVal = parseInt(match[2], 10);
    const dVal = parseInt(match[3], 10);
    if (dVal >= 1 && dVal <= 31 && mVal >= 1 && mVal <= 12 && yVal >= 1800 && yVal <= 2100) {
      results.push({ gy: yVal, gm: mVal, gd: dVal });
    }
  }

  return results;
}

function extractBirthDateFromTextOrDoc(htmlOrText: string, doc: Document | null): { gy: number; gm: number; gd: number } | null {
  const cleanText = toEnglishDigits(htmlOrText);

  if (doc) {
    const denElem = doc.querySelector('input[name="narozeni_den"], select[name="narozeni_den"], [name="narozeni_den"]') as any;
    const mesicElem = doc.querySelector('input[name="narozeni_mesic"], select[name="narozeni_mesic"], [name="narozeni_mesic"]') as any;
    const rokElem = doc.querySelector('input[name="narozeni_rok"], select[name="narozeni_rok"], [name="narozeni_rok"]') as any;

    if (denElem && mesicElem && rokElem) {
      const dVal = parseInt(denElem.value || denElem.getAttribute('value') || '0', 10);
      const mVal = parseInt(mesicElem.value || mesicElem.getAttribute('value') || '0', 10);
      const yVal = parseInt(rokElem.value || rokElem.getAttribute('value') || '0', 10);
      if (dVal >= 1 && dVal <= 31 && mVal >= 1 && mVal <= 12 && yVal >= 1800 && yVal <= 2099) {
        return { gy: yVal, gm: mVal, gd: dVal };
      }
    }

    const natalTable = doc.querySelector('.vypocet-table, .nazo-horoskop-vypocet, .horoskop-vypocet-table, .lh20, #horoskop_form');
    if (natalTable && natalTable.textContent) {
      const tableText = toEnglishDigits(natalTable.textContent);
      const match = parseExplicitDateFromText(tableText);
      if (match) return match;

      const genericInTable = parseGenericDatesFromText(tableText);
      if (genericInTable.length > 0) return genericInTable[0];
    }
  }

  const explicitMatch = parseExplicitDateFromText(cleanText);
  if (explicitMatch) {
    return explicitMatch;
  }

  const genericMatches = parseGenericDatesFromText(cleanText);
  if (genericMatches.length > 0) {
    const currentYear = new Date().getFullYear();
    const historic = genericMatches.find(m => m.gy <= currentYear - 1);
    if (historic) return historic;
    return genericMatches[0];
  }

  return null;
}

function extractBirthTime(cleanText: string, doc: Document | null): string {
  if (doc) {
    const hodina = doc.querySelector('input[name="narozeni_hodina"], [name="narozeni_hodina"]') as any;
    const minuta = doc.querySelector('input[name="narozeni_minuta"], [name="narozeni_minuta"]') as any;
    if (hodina && minuta) {
      const hVal = hodina.value || hodina.getAttribute('value') || '0';
      const mVal = minuta.value || minuta.getAttribute('value') || '0';
      const h = toPersianDigits(hVal.padStart(2, '0'));
      const m = toPersianDigits(mVal.padStart(2, '0'));
      return `${h}:${m}`;
    }
  }

  const timeMatch = cleanText.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/i);
  if (timeMatch) {
    const h = toPersianDigits(timeMatch[1].padStart(2, '0'));
    const m = toPersianDigits(timeMatch[2]);
    const ampm = timeMatch[3] ? (timeMatch[3].toUpperCase() === 'AM' ? ' صبح' : ' عصر') : '';
    return `${h}:${m}${ampm}`;
  }
  return '۰۴:۲۰ صبح';
}

/**
 * Extracts all celestial bodies (planets, asteroids, nodes, angles) with exact coordinates
 */
export function parseAstroSeekContent(htmlOrText: string): NatalChartInput {
  const result: NatalChartInput = JSON.parse(JSON.stringify(DEFAULT_SAMPLE_CHART));
  result.rawHtmlContent = htmlOrText;

  if (!htmlOrText || htmlOrText.trim().length === 0) {
    return result;
  }

  let doc: Document | null = null;
  if (typeof DOMParser !== 'undefined') {
    try {
      doc = new DOMParser().parseFromString(htmlOrText, 'text/html');
    } catch (e) {}
  }

  // 1. Extract Birth Date & Convert Gregorian to Solar Hijri (Shamsi)
  const parsedDate = extractBirthDateFromTextOrDoc(htmlOrText, doc);
  if (parsedDate) {
    const converted = convertGregorianToShamsi(parsedDate.gy, parsedDate.gm, parsedDate.gd);
    result.birthDateFa = converted.birthDateFa;
    result.birthDateEn = converted.birthDateEn;
  }

  // 3. Extract Time & Location
  const cleanText = toEnglishDigits(htmlOrText);
  result.birthTime = extractBirthTime(cleanText, doc);

  const locMatch = cleanText.match(/Location:\s*([^\n<,]+(?:,\s*[^\n<]+)?)/i) ||
                   cleanText.match(/Born in:\s*([^\n<]+)/i) ||
                   cleanText.match(/City:\s*([^\n<]+)/i);
  if (locMatch && locMatch[1].trim()) {
    result.birthLocation = locMatch[1].trim();
  }

  // 4. Multi-stage Planet & Celestial Bodies Extraction
  const extractedPlanets: PlanetPlacement[] = [];
  const foundKeys = new Set<string>();

  // Process rows from HTML DOM if available (extract cell text with spaces to avoid text collision)
  if (doc) {
    const tableRows = Array.from(doc.querySelectorAll('tr, .vypocet-row, .horoskop-vypocet-row'));
    tableRows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('td, th')).map(c => c.textContent?.trim()).filter(Boolean);
      const rowText = cells.length > 0 
        ? toEnglishDigits(cells.join('   ')) 
        : toEnglishDigits(row.textContent || '');
      parseRowOrLine(rowText, extractedPlanets, foundKeys, result);
    });
  }

  // Fallback / Supplementary: Line-by-line text scan
  const lines = cleanText.split('\n');
  lines.forEach(line => {
    if (line.trim().length > 3) {
      parseRowOrLine(line, extractedPlanets, foundKeys, result);
    }
  });

  if (extractedPlanets.length > 0) {
    result.planets = extractedPlanets;
  }

  // 5. Compute Element & Quality balances
  computeElementsAndQualities(result);

  return result;
}

/**
 * Helper to match and parse a single row or line for any celestial body or angle
 */
function parseRowOrLine(
  lineText: string,
  extractedPlanets: PlanetPlacement[],
  foundKeys: Set<string>,
  result: NatalChartInput
): void {
  const lineLower = lineText.toLowerCase();

  // Match Zodiac Sign first using robust lookup
  const signInfo = parseSignInfo(lineText);
  if (!signInfo) return;

  const signFa = signInfo.signFa;
  const signSym = signInfo.signSym;

  // Match Degree & Minutes (e.g. 26°00', 26° 00', 26 deg 00, 26.15, 26°)
  const degMatch = lineText.match(/(\d{1,2})°\s*(\d{1,2})?['′]?/i) ||
                   lineText.match(/(\d{1,2})\s*(?:deg|درجه)\s*(\d{1,2})?/i) ||
                   lineText.match(/(\d{1,2})[\.\,](\d{1,2})°?/) ||
                   lineText.match(/(\d{1,2})\s*°/);
  let degStr = '۰۰°۰۰′';
  if (degMatch) {
    const deg = degMatch[1] || '0';
    const min = degMatch[2] || '00';
    degStr = `${toPersianDigits(deg)}°${toPersianDigits(min.padStart(2, '0'))}′`;
  }

  // Match House (e.g. 1st house, House 1, house 1, 1st, 1. house)
  const houseMatch = lineText.match(/(\d{1,2})(?:st|nd|rd|th)?\s*house/i) ||
                     lineText.match(/house\s*(\d{1,2})/i) ||
                     lineText.match(/in\s*(\d{1,2})/i) ||
                     lineText.match(/\b(\d{1,2})\.\s*dům/i);
  let houseStr = 'خانه اول';
  if (houseMatch) {
    const houseNum = parseInt(houseMatch[1], 10);
    houseStr = HOUSE_PERSIAN_NAMES[houseNum] || `خانه ${toPersianDigits(houseNum)}`;
  } else {
    // Fallback number search for house in tabular columns
    const numbersInLine = lineText.match(/\b([1-9]|1[0-2])\b/g);
    if (numbersInLine && numbersInLine.length > 0) {
      const houseNum = parseInt(numbersInLine[numbersInLine.length - 1], 10);
      if (houseNum >= 1 && houseNum <= 12) {
        houseStr = HOUSE_PERSIAN_NAMES[houseNum] || `خانه ${toPersianDigits(houseNum)}`;
      }
    }
  }

  // Match Retrograde
  const isRetro = /\bR\b|\(R\)|\bRx\b|℞|\bRetrograde\b|\bZpětný\b/i.test(lineText);

  // Check known celestial body configs
  for (const cfg of CELESTIAL_BODIES_CONFIG) {
    const matchedKey = cfg.keys.find(k => {
      if (k.length <= 3) {
        return new RegExp(`\\b${k}\\b`, 'i').test(lineLower);
      }
      return lineLower.includes(k);
    });
    if (!matchedKey) continue;

    // Avoid duplicate parsing of the same body
    if (foundKeys.has(cfg.name)) continue;

    if (cfg.isAngle === 'asc') {
      result.ascendant = { sign: signFa, signSymbol: signSym, degree: degStr };
      foundKeys.add(cfg.name);
      return;
    }

    if (cfg.isAngle === 'mc') {
      result.mc = { sign: signFa, signSymbol: signSym, degree: degStr };
      foundKeys.add(cfg.name);
      return;
    }

    foundKeys.add(cfg.name);
    extractedPlanets.push({
      name: cfg.name,
      symbol: cfg.symbol,
      sign: signFa,
      signSymbol: signSym,
      degree: degStr,
      house: houseStr,
      isRetrograde: isRetro
    });

    return;
  }
}

/**
 * Computes element & quality balances dynamically based on chart planets
 */
function computeElementsAndQualities(input: NatalChartInput): void {
  if (!input.planets || input.planets.length === 0) return;

  const AIR_SIGNS = ['جوزا', 'میزان', 'دلو'];
  const EARTH_SIGNS = ['ثور', 'سنبله', 'جدی'];
  const WATER_SIGNS = ['سرطان', 'عقرب', 'حوت'];
  const FIRE_SIGNS = ['حمل', 'اسد', 'قوس'];

  const CARDINAL_SIGNS = ['حمل', 'سرطان', 'میزان', 'جدی'];
  const FIXED_SIGNS = ['ثور', 'اسد', 'عقرب', 'دلو'];
  const MUTABLE_SIGNS = ['جوزا', 'سنبله', 'قوس', 'حوت'];

  let airCount = 0, earthCount = 0, waterCount = 0, fireCount = 0;
  let cardinalCount = 0, fixedCount = 0, mutableCount = 0;

  const airPlanets: string[] = [];
  const earthPlanets: string[] = [];
  const waterPlanets: string[] = [];
  const firePlanets: string[] = [];

  input.planets.forEach(p => {
    if (AIR_SIGNS.includes(p.sign)) { airCount++; airPlanets.push(`${p.name} در ${p.sign}`); }
    else if (EARTH_SIGNS.includes(p.sign)) { earthCount++; earthPlanets.push(`${p.name} در ${p.sign}`); }
    else if (WATER_SIGNS.includes(p.sign)) { waterCount++; waterPlanets.push(`${p.name} در ${p.sign}`); }
    else if (FIRE_SIGNS.includes(p.sign)) { fireCount++; firePlanets.push(`${p.name} در ${p.sign}`); }

    if (CARDINAL_SIGNS.includes(p.sign)) cardinalCount++;
    else if (FIXED_SIGNS.includes(p.sign)) fixedCount++;
    else if (MUTABLE_SIGNS.includes(p.sign)) mutableCount++;
  });

  const getStrengthText = (cnt: number) => {
    if (cnt >= 4) return 'بسیار قوی';
    if (cnt >= 2) return 'متوسط تا قوی';
    if (cnt === 1) return 'متوسط';
    return 'ضعیف';
  };

  input.elements = {
    air: `${getStrengthText(airCount)}${airPlanets.length > 0 ? ` (${airPlanets.join('، ')})` : ''}`,
    earth: `${getStrengthText(earthCount)}${earthPlanets.length > 0 ? ` (${earthPlanets.join('، ')})` : ''}`,
    water: `${getStrengthText(waterCount)}${waterPlanets.length > 0 ? ` (${waterPlanets.join('، ')})` : ''}`,
    fire: `${getStrengthText(fireCount)}${firePlanets.length > 0 ? ` (${firePlanets.join('، ')})` : ''}`,
    summary: `چارت بر اساس تحلیل تعادل چهار عنصر (هوا: ${airCount}، آب: ${waterCount}، خاک: ${earthCount}، آتش: ${fireCount}) تنظیم گردیده است.`
  };

  input.qualities = {
    cardinal: getStrengthText(cardinalCount),
    fixed: getStrengthText(fixedCount),
    mutable: getStrengthText(mutableCount),
    summary: `توزیع کیفیت‌های سه گانه چارت: کاردینال (${cardinalCount})، ثابت (${fixedCount}) و متغیر (${mutableCount}) می باشد.`
  };
}
