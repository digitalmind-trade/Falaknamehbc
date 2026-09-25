import React, { useState } from 'react';
import {
  Download,
  Copy,
  Printer,
  Code,
  Check,
  Eye,
  Edit3,
  Sparkles,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { GeneratedReport } from '../types';
import { buildFalaknamehHtml } from '../utils/templateBuilder';
import { parseSectionsFromText } from '../utils/sectionParser';

interface ReportViewProps {
  report: GeneratedReport;
  onBack: () => void;
  onRegenerate: () => void;
  onUpdateReport: (updated: GeneratedReport) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  onBack,
  onRegenerate,
  onUpdateReport,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'code'>('preview');
  const [copiedType, setCopiedType] = useState<'html' | 'text' | null>(null);

  // Compute live HTML from current sections / full text
  const sectionsMap = parseSectionsFromText(report.fullText);
  const currentHtml = buildFalaknamehHtml(report.chartInput, sectionsMap);

  const handleDownloadHtml = () => {
    const blob = new Blob([currentHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanDate = (report.chartInput.birthDateFa || 'chart').replace(/\s+/g, '_');
    link.download = `falaknameh_${cleanDate}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(currentHtml);
      setCopiedType('html');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(report.fullText);
      setCopiedType('text');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error('Copy text failed:', err);
    }
  };

  const handlePrint = () => {
    const iframe = document.getElementById('falaknameh-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Header Bar */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors"
            title="بازگشت به فرم"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                گزارش چارت تولد فلک‌نامه ({report.chartInput.birthDateFa})
              </h2>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                {report.totalWordCount} کلمه
              </span>
            </div>
            <p className="text-xs text-slate-400">
              تولید شده در: {new Date(report.createdAt).toLocaleDateString('fa-IR')}
            </p>
          </div>
        </div>

        {/* Export & Mode Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadHtml}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 border border-amber-300/30"
          >
            <Download className="w-4 h-4" />
            <span>دانلود فایل HTML</span>
          </button>

          <button
            onClick={handleCopyHtml}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-xl border border-amber-500/30 transition-all flex items-center gap-1.5"
          >
            {copiedType === 'html' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copiedType === 'html' ? 'کپی شد!' : 'کپی سورس HTML'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            {copiedType === 'text' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <FileText className="w-4 h-4 text-slate-400" />
            )}
            <span>{copiedType === 'text' ? 'کپی شد!' : 'کپی متن تحلیل'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 rounded-xl border border-slate-700 transition-colors"
            title="پرینت / ذخیره PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onRegenerate}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 rounded-xl border border-slate-700 transition-colors"
            title="تولید مجدد"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 font-medium text-xs sm:text-sm rounded-t-lg transition-all border-b-2 ${
            activeTab === 'preview'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>پیش‌نمایش زنده قالب فاخر فلک‌نامه</span>
        </button>

        <button
          onClick={() => setActiveTab('edit')}
          className={`flex items-center gap-2 px-4 py-2 font-medium text-xs sm:text-sm rounded-t-lg transition-all border-b-2 ${
            activeTab === 'edit'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>ویرایش متن تحلیل ({report.totalWordCount} کلمه)</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2 font-medium text-xs sm:text-sm rounded-t-lg transition-all border-b-2 ${
            activeTab === 'code'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>کد سورس کامل HTML</span>
        </button>
      </div>

      {/* TAB 1: PREVIEW IFRAME */}
      {activeTab === 'preview' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[750px] relative">
          <iframe
            id="falaknameh-iframe"
            srcDoc={currentHtml}
            title="فلک‌نامه چارت تولد"
            className="w-full h-full border-none"
          />
        </div>
      )}

      {/* TAB 2: EDIT TEXT */}
      {activeTab === 'edit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <p className="text-xs text-slate-400">
            در این بخش می‌توانید متن کامل تحلیل ۱۴ بخش را ویرایش کنید. هر تغییری بلافاصله در فایل HTML خروجی اعمال خواهد شد.
          </p>
          <textarea
            value={report.fullText}
            onChange={(e) => {
              const updatedText = e.target.value;
              onUpdateReport({
                ...report,
                fullText: updatedText,
                finalHtml: buildFalaknamehHtml(report.chartInput, parseSectionsFromText(updatedText)),
              });
            }}
            className="w-full h-[600px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-amber-500"
          />
        </div>
      )}

      {/* TAB 3: CODE */}
      {activeTab === 'code' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              سورس کد کامل خودکفا HTML (شامل استایل‌ها، فونت وزیرمتن و انیمیشن کیهانی)
            </span>
            <button
              onClick={handleCopyHtml}
              className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs rounded-lg flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>کپی کل HTML</span>
            </button>
          </div>
          <pre className="w-full h-[600px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-[11px] text-amber-100/80 font-mono overflow-auto whitespace-pre-wrap">
            {currentHtml}
          </pre>
        </div>
      )}
    </div>
  );
};
