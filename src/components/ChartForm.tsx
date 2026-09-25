import React, { useState } from 'react';
import {
  Upload,
  FileCode,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Compass,
  Plus,
  Trash2,
  Sliders,
  Check,
  Zap,
} from 'lucide-react';
import { NatalChartInput, PlanetPlacement } from '../types';
import { parseAstroSeekContent } from '../utils/astroSeekParser';

interface ChartFormProps {
  chartInput: NatalChartInput;
  onChange: (updated: NatalChartInput) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

export const ChartForm: React.FC<ChartFormProps> = ({
  chartInput,
  onChange,
  onSubmit,
  isGenerating,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'details' | 'config'>('upload');
  const [pastedContent, setPastedContent] = useState('');
  const [parseStatus, setParseStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseAstroSeekContent(content);
        onChange(parsed);
        setParseStatus(`فایل "${file.name}" با موفقیت استخراج شد!`);
        setActiveTab('details');
      }
    };
    reader.readAsText(file);
  };

  const handleParsePasted = () => {
    if (!pastedContent.trim()) return;
    const parsed = parseAstroSeekContent(pastedContent);
    onChange(parsed);
    setParseStatus('اطلاعات با موفقیت از متن استخراج گردید.');
    setActiveTab('details');
  };

  const updateField = (field: keyof NatalChartInput, value: any) => {
    onChange({ ...chartInput, [field]: value });
  };

  const handlePlanetChange = (index: number, field: keyof PlanetPlacement, value: any) => {
    const updatedPlanets = [...chartInput.planets];
    updatedPlanets[index] = { ...updatedPlanets[index], [field]: value };
    onChange({ ...chartInput, planets: updatedPlanets });
  };

  const addPlanet = () => {
    const newPlanet: PlanetPlacement = {
      name: 'سیاره جدید',
      symbol: '⭐',
      sign: 'جوزا',
      signSymbol: '♊',
      degree: '۰°۰۰′',
      house: 'خانه اول',
    };
    onChange({ ...chartInput, planets: [...chartInput.planets, newPlanet] });
  };

  const removePlanet = (index: number) => {
    const updatedPlanets = chartInput.planets.filter((_, i) => i !== index);
    onChange({ ...chartInput, planets: updatedPlanets });
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-xs sm:text-sm rounded-t-lg transition-all border-b-2 ${
            activeTab === 'upload'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>۱. بارگذاری / درج فایل Astro-Seek</span>
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-xs sm:text-sm rounded-t-lg transition-all border-b-2 ${
            activeTab === 'details'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>۲. بررسی مشخصات چارت ({chartInput.planets.length} سیاره)</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-xs sm:text-sm rounded-t-lg transition-all border-b-2 ${
            activeTab === 'config'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>۳. تنظیمات حجم و ترانزیت‌ها</span>
        </button>
      </div>

      {parseStatus && (
        <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{parseStatus}</span>
          </div>
          <button
            onClick={() => setParseStatus(null)}
            className="text-slate-400 hover:text-slate-200 text-xs"
          >
            بستن
          </button>
        </div>
      )}

      {/* TAB 1: UPLOAD */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload Box */}
            <div className="border-2 border-dashed border-amber-500/30 hover:border-amber-400 rounded-2xl p-6 text-center bg-slate-950/40 transition-all flex flex-col items-center justify-center min-h-[220px]">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/20">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                آپلود فایل دانلود شده Astro-Seek (.html)
              </h3>
              <p className="text-xs text-slate-400 mb-4 max-w-xs">
                فایل صفحه HTML چارت تولد دانلود شده از astroseek را اینجا رها کنید یا انتخاب کنید.
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all">
                <FileCode className="w-4 h-4" />
                <span>انتخاب فایل HTML</span>
                <input
                  type="file"
                  accept=".html,.htm,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Paste Raw HTML / Text Box */}
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>یا جای‌گذاری مستقیم سورس HTML یا متن چارت</span>
              </label>
              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder="محتوای HTML یا متن کپی شده از Astro-Seek را اینجا Paste کنید..."
                className="w-full flex-1 min-h-[160px] bg-slate-950/80 border border-slate-700 focus:border-amber-500 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none"
              />
              <button
                onClick={handleParsePasted}
                disabled={!pastedContent.trim()}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-300 text-xs font-semibold rounded-xl border border-amber-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>استخراج هوشمند اطلاعات چارت</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-1 text-amber-300">
                راهنمای سریع استفاده:
              </strong>
              اگر فایل HTML ندارید، روی دکمه <strong>"بارگذاری چارت نمونه"</strong> در بالادست صفحه کلیک کنید تا تمام مشخصات (۲۷ خرداد ۱۳۶۳) آماده گردد. اطلاعات استخراج شده را می‌توانید در تب دوم به طور کامل مشاهده و ویرایش نمایید.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILS */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Birth Metadata inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>تاریخ تولد (شمسی)</span>
              </label>
              <input
                type="text"
                value={chartInput.birthDateFa}
                onChange={(e) => updateField('birthDateFa', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold text-amber-300"
                placeholder="مثلا: ۲۷ خرداد ۱۳۶۳"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>تاریخ میلادی (استخراج شده)</span>
              </label>
              <input
                type="text"
                value={chartInput.birthDateEn}
                onChange={(e) => updateField('birthDateEn', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                placeholder="مثلا: 17 June 1984"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>ساعت تولد</span>
              </label>
              <input
                type="text"
                value={chartInput.birthTime}
                onChange={(e) => updateField('birthTime', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>محل تولد</span>
              </label>
              <input
                type="text"
                value={chartInput.birthLocation}
                onChange={(e) => updateField('birthLocation', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-slate-100"
              />
            </div>
          </div>

          {/* Ascendant & MC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
              <Compass className="w-5 h-5 text-amber-400" />
              <div className="flex-1">
                <span className="text-xs text-slate-400 block">طالع (ASC - Ascendant)</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={chartInput.ascendant.sign}
                    onChange={(e) =>
                      updateField('ascendant', { ...chartInput.ascendant, sign: e.target.value })
                    }
                    className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100"
                  />
                  <input
                    type="text"
                    value={chartInput.ascendant.signSymbol}
                    onChange={(e) =>
                      updateField('ascendant', {
                        ...chartInput.ascendant,
                        signSymbol: e.target.value,
                      })
                    }
                    className="w-10 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 text-center"
                  />
                  <input
                    type="text"
                    value={chartInput.ascendant.degree}
                    onChange={(e) =>
                      updateField('ascendant', { ...chartInput.ascendant, degree: e.target.value })
                    }
                    className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
              <Compass className="w-5 h-5 text-amber-400" />
              <div className="flex-1">
                <span className="text-xs text-slate-400 block">میانه آسمان (MC - Medium Coeli)</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={chartInput.mc.sign}
                    onChange={(e) => updateField('mc', { ...chartInput.mc, sign: e.target.value })}
                    className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100"
                  />
                  <input
                    type="text"
                    value={chartInput.mc.signSymbol}
                    onChange={(e) =>
                      updateField('mc', { ...chartInput.mc, signSymbol: e.target.value })
                    }
                    className="w-10 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 text-center"
                  />
                  <input
                    type="text"
                    value={chartInput.mc.degree}
                    onChange={(e) =>
                      updateField('mc', { ...chartInput.mc, degree: e.target.value })
                    }
                    className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Planets Table Editor */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>جدول موقعیت سیارات و خانه‌ها</span>
                <span className="text-slate-500 font-normal">({chartInput.planets.length} مورد)</span>
              </h4>
              <button
                onClick={addPlanet}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs rounded-lg border border-amber-500/30 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن سیاره</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/40">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">نماد و سیاره</th>
                    <th className="p-2.5">برج فلكی</th>
                    <th className="p-2.5">درجه</th>
                    <th className="p-2.5">خانه</th>
                    <th className="p-2.5 text-center">برگشتی (R)</th>
                    <th className="p-2.5 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {chartInput.planets.map((planet, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-2">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={planet.symbol}
                            onChange={(e) => handlePlanetChange(idx, 'symbol', e.target.value)}
                            className="w-8 bg-slate-900 border border-slate-700 rounded px-1 py-1 text-center"
                          />
                          <input
                            type="text"
                            value={planet.name}
                            onChange={(e) => handlePlanetChange(idx, 'name', e.target.value)}
                            className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={planet.sign}
                            onChange={(e) => handlePlanetChange(idx, 'sign', e.target.value)}
                            className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                          />
                          <input
                            type="text"
                            value={planet.signSymbol}
                            onChange={(e) => handlePlanetChange(idx, 'signSymbol', e.target.value)}
                            className="w-8 bg-slate-900 border border-slate-700 rounded px-1 py-1 text-center"
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={planet.degree}
                          onChange={(e) => handlePlanetChange(idx, 'degree', e.target.value)}
                          className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={planet.house}
                          onChange={(e) => handlePlanetChange(idx, 'house', e.target.value)}
                          className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={Boolean(planet.isRetrograde)}
                          onChange={(e) => handlePlanetChange(idx, 'isRetrograde', e.target.checked)}
                          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => removePlanet(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONFIG */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                دوره ترانزیت‌های ماه به ماه (بخش ۱۲)
              </label>
              <input
                type="text"
                value={chartInput.transitPeriod}
                onChange={(e) => updateField('transitPeriod', e.target.value)}
                placeholder="مثلاً: مرداد تا پایان اسفند ۱۴۰۵"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                تغییر این عبارت، بازه ترانزیت‌های بخش ۱۲ را بر اساس تاریخ شمسی تنظیم می‌کند.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                حجم و عمق نگارش (کلمات)
              </label>
              <select
                value={chartInput.targetWordCount}
                onChange={(e) => updateField('targetWordCount', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-100"
              >
                <option value={3800}>تحلیل فول عمیق و تخصصی (۳۵۰۰ الی ۴۰۰۰ کلمه)</option>
                <option value={3000}>تحلیل استاندارد (۲۵۰۰ الی ۳۰۰۰ کلمه)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                تنظیم روی ۳۵۰۰ الی ۴۰۰۰ کلمه بالاترین سطح جزئیات و ادبیات اخترشناسی را تضمین می‌کند.
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              دستورالعمل یا نکات خاص سفارش دهنده (اختیاری)
            </label>
            <textarea
              value={chartInput.additionalInstructions || ''}
              onChange={(e) => updateField('additionalInstructions', e.target.value)}
              placeholder="اگر مشتری درخواست تمرکز روی موضوع خاصی دارد (مثلاً ازدواج، مهاجرت، تغییر شغل یا بازه خاص) اینجا بنویسید..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl p-3 text-xs text-slate-100 min-h-[90px]"
            />
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          <span className="text-amber-400 font-bold">فرمت گزارش:</span> قالب فاخر فلک‌نامه با ۱۴ بخش کاملاً تفکیک شده
        </div>

        <button
          onClick={onSubmit}
          disabled={isGenerating}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-amber-300/40 disabled:opacity-50 disabled:transform-none"
        >
          <Sparkles className="w-5 h-5 text-slate-950 animate-spin" style={{ animationDuration: '3s' }} />
          <span>تولید گزارش عمیق فلک‌نامه (۳۵۰۰ الی ۴۰۰۰ کلمه)</span>
        </button>
      </div>
    </div>
  );
};
