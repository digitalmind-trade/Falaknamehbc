import React from 'react';
import { Sparkles, Loader2, CheckCircle, AlertCircle, Eye, RefreshCw } from 'lucide-react';
import { countWordsPersian } from '../utils/sectionParser';

interface GenerationProgressModalProps {
  isOpen: boolean;
  statusMessage: string;
  streamText: string;
  error: string | null;
  onClose: () => void;
  onViewReport: () => void;
  onRetry?: () => void;
  isComplete: boolean;
}

export const GenerationProgressModal: React.FC<GenerationProgressModalProps> = ({
  isOpen,
  statusMessage,
  streamText,
  error,
  onClose,
  onViewReport,
  onRetry,
  isComplete,
}) => {
  if (!isOpen) return null;

  const currentWordCount = countWordsPersian(streamText);
  const progressPercent = Math.min(100, Math.round((currentWordCount / 3700) * 100));

  // Determine section progress
  const sectionMatches = (streamText.match(/بخش\s*:\s*\d+|---BEGIN_SECTION_\d+---/gi) || []).length;
  const sectionsDetected = Math.min(14, sectionMatches);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Glow backdrop effect */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              {isComplete ? (
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              ) : (
                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {isComplete ? 'گزارش فلک‌نامه با موفقیت تولید شد!' : 'در حال نگارش تحلیل عمیق ۱۴ بخش...'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{statusMessage}</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-500/10 text-amber-300 rounded-full border border-amber-500/20">
            {currentWordCount} کلمه
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>پیشرفت نگارش (هدف: ۳۵۰۰ تا ۴۰۰۰ کلمه)</span>
            <span className="font-bold text-amber-300">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 14 Sections Tracker */}
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">
            وضعیت بخش‌های ۱۴ گانه:
          </span>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px]">
            {Array.from({ length: 14 }).map((_, idx) => {
              const secNum = idx + 1;
              const isDone = sectionsDetected >= secNum || isComplete;
              return (
                <div
                  key={secNum}
                  className={`py-1 rounded font-mono transition-all border ${
                    isDone
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}
                >
                  بخش {secNum}
                </div>
              );
            })}
          </div>
        </div>

        {/* Streaming text preview box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 max-h-48 overflow-y-auto text-xs text-slate-300 font-mono leading-relaxed space-y-1">
          {streamText ? (
            <div className="whitespace-pre-wrap">{streamText}</div>
          ) : (
            <div className="text-slate-500 italic flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>آماده‌سازی مدل هوش مصنوعی برای تولید تحلیل...</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {error && onRetry && (
            <button
              onClick={onRetry}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md shadow-amber-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>تلاش مجدد</span>
            </button>
          )}

          {isComplete ? (
            <button
              onClick={onViewReport}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>مشاهده و دانلود گزارش فلک‌نامه</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700"
            >
              بستن پنجره (ادامه در پس‌زمینه)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
