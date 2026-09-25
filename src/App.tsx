import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChartForm } from './components/ChartForm';
import { GenerationProgressModal } from './components/GenerationProgressModal';
import { ReportView } from './components/ReportView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { HelpModal } from './components/HelpModal';
import { NatalChartInput, GeneratedReport } from './types';
import { DEFAULT_SAMPLE_CHART } from './utils/astroSeekParser';
import { parseSectionsFromText, countWordsPersian } from './utils/sectionParser';
import { buildFalaknamehHtml } from './utils/templateBuilder';

export function App() {
  const [chartInput, setChartInput] = useState<NatalChartInput>(DEFAULT_SAMPLE_CHART);
  const [currentReport, setCurrentReport] = useState<GeneratedReport | null>(null);
  
  // Generation Progress states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [streamText, setStreamText] = useState('');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);

  // History & Help states
  const [historyReports, setHistoryReports] = useState<GeneratedReport[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('falaknameh_history_v1');
      if (saved) {
        setHistoryReports(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history helper
  const saveReportToHistory = (report: GeneratedReport) => {
    setHistoryReports((prev) => {
      const filtered = prev.filter((r) => r.id !== report.id);
      const updated = [report, ...filtered].slice(0, 30); // Keep last 30 reports
      try {
        localStorage.setItem('falaknameh_history_v1', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save failed', e);
      }
      return updated;
    });
  };

  const deleteReportFromHistory = (id: string) => {
    setHistoryReports((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem('falaknameh_history_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearHistory = () => {
    setHistoryReports([]);
    try {
      localStorage.removeItem('falaknameh_history_v1');
    } catch (e) {}
  };

  const handleLoadSample = () => {
    setChartInput(DEFAULT_SAMPLE_CHART);
    setCurrentReport(null);
  };

  // Start Generation Flow via SSE stream
  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setIsProgressModalOpen(true);
    setStatusMessage('برقراری ارتباط با مدل هوش مصنوعی برای تولید تحلیل چارت...');
    setStreamText('');
    setGenerationError(null);
    setIsGenerationComplete(false);

    let accumulated = '';

    const finalizeReport = (finalContent: string) => {
      setStreamText(finalContent);
      const totalWords = countWordsPersian(finalContent);

      const sectionsMap = parseSectionsFromText(finalContent);
      const sectionsList = Object.entries(sectionsMap).map(([numStr, html]) => ({
        sectionNumber: Number(numStr),
        titleFa: `بخش ${numStr}`,
        titleEn: `Section ${numStr}`,
        contentMarkdown: html,
      }));

      const finalHtml = buildFalaknamehHtml(chartInput, sectionsMap);

      const newReport: GeneratedReport = {
        id: `rep_${Date.now()}`,
        createdAt: new Date().toISOString(),
        chartInput: { ...chartInput },
        sections: sectionsList,
        fullText: finalContent,
        finalHtml,
        totalWordCount: totalWords,
      };

      setCurrentReport(newReport);
      saveReportToHistory(newReport);

      setIsGenerationComplete(true);
      setStatusMessage('تحلیل کامل فلک‌نامه با موفقیت آماده گردید!');
    };

    try {
      const response = await fetch('/api/generate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chartInput),
      });

      if (!response.ok) {
        throw new Error(`خطای سرور: HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('پاسخ سرور فاقد جریان داده است.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let isDoneHandled = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // keep remaining partial line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim();
            if (!dataStr) continue;

            try {
              const payload = JSON.parse(dataStr);
              if (payload.type === 'ping') {
                // Heartbeat to keep connection alive
                continue;
              } else if (payload.type === 'start') {
                setStatusMessage(payload.message || 'در حال نگارش تحلیل عمیق ۱۴ بخش...');
              } else if (payload.type === 'chunk') {
                accumulated += payload.text;
                setStreamText(accumulated);
                const count = countWordsPersian(accumulated);
                setStatusMessage(`تولید هوشمند... (${count} کلمه نگارش شده است)`);
              } else if (payload.type === 'done') {
                isDoneHandled = true;
                const finalContent = payload.fullText || accumulated;
                finalizeReport(finalContent);
                break;
              } else if (payload.type === 'error') {
                setGenerationError(payload.error || 'خطایی در نگارش رخ داد.');
              }
            } catch (err) {
              // Partial JSON slice, ignore
            }
          }
        }
      }

      // Natural stream completion fallback if type === 'done' was missed
      if (!isDoneHandled && accumulated.trim().length > 100) {
        finalizeReport(accumulated);
      }
    } catch (err: any) {
      console.error('Generation failed:', err);

      // If we already accumulated a significant amount of text before network disconnect, save it!
      if (accumulated.trim().length > 150) {
        finalizeReport(accumulated);
        setStatusMessage('تحلیل تا حد امکان ذخیره گردید.');
        setGenerationError(null);
      } else {
        // Fallback: try non-streaming endpoint
        try {
          setStatusMessage('ارتباط استریم قطع شد. در حال تلاش مجدد با کانال مستقیم...');
          const fallbackRes = await fetch('/api/generate-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chartInput),
          });
          const fallbackData = await fallbackRes.json();
          if (fallbackData.success && fallbackData.fullText) {
            finalizeReport(fallbackData.fullText);
            setGenerationError(null);
            return;
          }
        } catch (fallbackErr: any) {
          console.error('Fallback generation also failed:', fallbackErr);
        }
        setGenerationError(err.message || 'خطا در برقراری ارتباط با سرور.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col dir-rtl">
      {/* Navbar Header */}
      <Header
        onLoadSample={handleLoadSample}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        savedCount={historyReports.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {currentReport ? (
          <ReportView
            report={currentReport}
            onBack={() => setCurrentReport(null)}
            onRegenerate={handleStartGeneration}
            onUpdateReport={(updated) => {
              setCurrentReport(updated);
              saveReportToHistory(updated);
            }}
          />
        ) : (
          <ChartForm
            chartInput={chartInput}
            onChange={setChartInput}
            onSubmit={handleStartGeneration}
            isGenerating={isGenerating}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>فلک‌نامه</p>
      </footer>

      {/* Progress & Live Stream Modal */}
      <GenerationProgressModal
        isOpen={isProgressModalOpen}
        statusMessage={statusMessage}
        streamText={streamText}
        error={generationError}
        onClose={() => setIsProgressModalOpen(false)}
        onViewReport={() => {
          setIsProgressModalOpen(false);
        }}
        onRetry={handleStartGeneration}
        isComplete={isGenerationComplete}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        reports={historyReports}
        onSelectReport={(report) => {
          setCurrentReport(report);
          setChartInput(report.chartInput);
        }}
        onDeleteReport={deleteReportFromHistory}
        onClearHistory={clearHistory}
      />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;
