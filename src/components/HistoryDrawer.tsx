import React from 'react';
import { X, Trash2, Download, Eye, Calendar, User, FileText } from 'lucide-react';
import { GeneratedReport } from '../types';
import { buildFalaknamehHtml } from '../utils/templateBuilder';
import { parseSectionsFromText } from '../utils/sectionParser';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reports: GeneratedReport[];
  onSelectReport: (report: GeneratedReport) => void;
  onDeleteReport: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  onDeleteReport,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const downloadReportHtml = (report: GeneratedReport) => {
    const html = buildFalaknamehHtml(
      report.chartInput,
      parseSectionsFromText(report.fullText)
    );
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const name = (report.chartInput.birthDateFa || 'chart').replace(/\s+/g, '_');
    link.download = `falaknameh_${name}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-r border-slate-800 w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">تاریخچه گزارش‌های ذخیره شده</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          {reports.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              هیچ گزارشی هنوز ذخیره نشده است. پس از تولید گزارش، سوابق در مرورگر ذخیره می‌گردند.
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 rounded-xl transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>چارت تولد: {report.chartInput.birthDateFa}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <span>مکان: {report.chartInput.birthLocation}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                      {report.totalWordCount} کلمه
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => {
                        onSelectReport(report);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold rounded-lg border border-amber-500/30 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>مشاهده</span>
                    </button>

                    <button
                      onClick={() => downloadReportHtml(report)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                      title="دانلود فایل HTML"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteReport(report.id)}
                      className="p-1 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {reports.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={onClearHistory}
              className="w-full py-2 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>پاکسازی کل تاریخچه</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
