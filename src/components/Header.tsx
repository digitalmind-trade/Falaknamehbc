import React from 'react';
import { Sparkles, FileText, History, HelpCircle, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onLoadSample: () => void;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadSample,
  onOpenHistory,
  onOpenHelp,
  savedCount,
}) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-black text-xl border border-amber-300/30">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                فلک‌نامه
              </h1>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20 font-sans">
                نسخه تخصصی 4.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              سامانه هوشمند تحلیل عمیق چارت تولد آسترولوژی (۳۵۰۰ الی ۴۰۰۰ کلمه)
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>هوش مصنوعی آماده تولید است</span>
          </div>

          <button
            onClick={onLoadSample}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-amber-500/30 transition-all hover:border-amber-400 shadow-sm"
            title="تکمیل سریع فرم با نمونه نمونه داده چارت ۲۷ خرداد ۱۳۶۳"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>بارگذاری چارت نمونه</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all hover:border-slate-600 relative"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>تاریخچه گزارش‌ها</span>
            {savedCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border border-slate-700 transition-colors"
            title="راهنمای استفاده"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
