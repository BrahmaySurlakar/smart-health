'use client';
// ============================================================
// Arogya AI Command Center — Reports Tab
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Download, Sparkles, Check, CheckCircle2,
  Calendar, RefreshCw, BarChart2, Info, ArrowUpRight, ShieldCheck
} from 'lucide-react';
import { generateReports } from '@/data/generators';
import { Report } from '@/types';
import { formatDate } from '@/lib/utils';

export default function ReportsTab() {
  const [reports, setReports] = useState<Report[]>(generateReports());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const triggerReportGeneration = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newReport: Report = {
              id: Math.random().toString(36).substring(2, 9),
              type: 'daily',
              title: `Daily Operations Briefing — ${new Date().toLocaleDateString('en-IN')}`,
              generatedAt: new Date().toISOString(),
              generatedBy: 'AI System',
              period: 'Today',
              status: 'Ready',
            };
            setReports(prevList => [newReport, ...prevList]);
            setIsGenerating(false);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  return (
    <div className="space-y-6 text-xs text-gray-800 dark:text-gray-200">
      
      {/* Upper Grid: Executive Briefing & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Executive Daily Brief Summary */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800/80 pb-2.5">
            <h3 className="font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              Executive Operations Summary — Today
            </h3>
            <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>

          <div className="space-y-3 text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
            <p>
              Today OPD patient load was **142 patients** (representing an **18% increase** over yesterday). Average OPD wait times spiked to **32 minutes** due to the absence of scheduled physician Dr. Rajesh Sharma.
            </p>
            <p>
              **Critical Supply Concerns:** ORS packets stock is critically low (remaining count: 48 units). Recommend finalizing the inter-facility stock redistribution transfer from PHC Sultanpur (excess stock: 2,000 units) to avoid stockouts.
            </p>
            <p>
              **Disease Surveillance:** 14 active cases of suspected Dengue clusters mapped across Rampur and Sultanpur villages. Local vector fogging campaigns have been scheduled by ANM frontline units.
            </p>
          </div>
        </div>

        {/* Generate Custom Report Simulator Card */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <h4 className="font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-500" />
              AI Report Compiler
            </h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Compile clinical logs, attendance registers, and disease telemetry data into a consolidated facility index report.
            </p>
          </div>

          <div className="space-y-3">
            {isGenerating ? (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                  <span>Generating Report...</span>
                  <span>{generationProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 transition-all duration-150" style={{ width: `${generationProgress}%` }} />
                </div>
              </div>
            ) : (
              <button
                onClick={triggerReportGeneration}
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-500/5 cursor-pointer text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Compile Daily Briefing</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Compiled Reports Table */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-50/50 dark:bg-zinc-900/50">
                <th className="p-4 pl-6">Report Title</th>
                <th className="p-4">Period Covered</th>
                <th className="p-4">Compiled By</th>
                <th className="p-4">Generated Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/40 dark:hover:bg-zinc-950/20 transition-colors">
                  <td className="p-4 pl-6 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                    <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{report.title}</span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">{report.period}</td>
                  <td className="p-4 text-gray-500">{report.generatedBy}</td>
                  <td className="p-4 text-gray-500">{formatDate(report.generatedAt)}</td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-bold">
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => alert(`Simulating PDF download for: ${report.title}`)}
                      className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
