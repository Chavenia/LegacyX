import React, { useState, useRef, useEffect } from 'react';
import { 
  FileCode, 
  GitCompare, 
  Copy, 
  Check, 
  Layers, 
  Sparkles, 
  ArrowLeftRight, 
  Cpu, 
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { DiffEditor } from '@monaco-editor/react';

export default function DiffViewer({ diffs = [] }) {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' | 'monaco'
  const [copied, setCopied] = useState(false);

  const leftPaneRef = useRef(null);
  const rightPaneRef = useRef(null);
  const isSyncingLeft = useRef(false);
  const isSyncingRight = useRef(false);

  const currentDiff = diffs[selectedFileIndex] || null;

  // Handle synchronized scrolling between left (legacy) and right (modern) panes
  const handleLeftScroll = () => {
    if (!isSyncingLeft.current && leftPaneRef.current && rightPaneRef.current) {
      isSyncingRight.current = true;
      rightPaneRef.current.scrollTop = leftPaneRef.current.scrollTop;
      rightPaneRef.current.scrollLeft = leftPaneRef.current.scrollLeft;
      setTimeout(() => { isSyncingRight.current = false; }, 50);
    }
  };

  const handleRightScroll = () => {
    if (!isSyncingRight.current && leftPaneRef.current && rightPaneRef.current) {
      isSyncingLeft.current = true;
      leftPaneRef.current.scrollTop = rightPaneRef.current.scrollTop;
      leftPaneRef.current.scrollLeft = rightPaneRef.current.scrollLeft;
      setTimeout(() => { isSyncingLeft.current = false; }, 50);
    }
  };

  const handleCopyModernCode = () => {
    if (currentDiff?.modernCode) {
      navigator.clipboard.writeText(currentDiff.modernCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!diffs || diffs.length === 0) {
    return (
      <div className="bg-carbon-90 border border-carbon-80 p-8 text-center text-carbon-50 shadow-carbon mb-6">
        <GitCompare className="w-12 h-12 text-carbon-70 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-white mb-1">AST Diff Viewer Awaiting Refactoring Run</h3>
        <p className="text-xs text-carbon-50 max-w-md mx-auto">
          Click <strong>[Execute Governed Modernization via Bob 2.0]</strong> above to generate side-by-side code diffs comparing legacy Java 8/javax with modern Java 21/Jakarta.
        </p>
      </div>
    );
  }

  // Helper to split lines for side-by-side rendering
  const originalLines = (currentDiff?.originalCode || '').split(/\r?\n/);
  const modernLines = (currentDiff?.modernCode || '').split(/\r?\n/);

  // Aggregate diff stats across all files
  const totalAdditions = diffs.reduce((sum, d) => sum + (d.metrics?.additions || 0), 0);
  const totalDeletions = diffs.reduce((sum, d) => sum + (d.metrics?.deletions || 0), 0);
  const transforms = [...new Set(diffs.flatMap(d => d.appliedTransforms || []))];

  return (
    <div className="bg-carbon-90 border border-carbon-80 shadow-carbon mb-6">
      
      {/* ── Diff Stats Summary Banner ───────────────────────────────── */}
      <div className="bg-carbon-100 border-b border-carbon-80 px-5 py-3 flex flex-wrap items-center gap-4 text-xs font-mono">
        <span className="text-carbon-50 font-semibold uppercase tracking-wider">Diff Summary</span>
        <span className="text-carbon-green-50">+{totalAdditions} additions</span>
        <span className="text-carbon-red-60">−{totalDeletions} deletions</span>
        <span className="text-carbon-blue-60">{diffs.length} files</span>
        <div className="flex flex-wrap gap-1 ml-auto">
          {transforms.map((t, i) => (
            <span key={i} className="bg-carbon-80 text-carbon-teal-50 border border-carbon-70 px-2 py-0.5 text-[10px]">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Diff Viewer Top Bar ─────────────────────────────────────── */}
      <div className="p-4 border-b border-carbon-80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-carbon-blue-60" />
          <h2 className="text-base font-bold text-white">
            Side-by-Side AST Diff Viewer
          </h2>
          <span className="text-xs bg-carbon-80 text-carbon-30 px-2 py-0.5 font-mono">
            {diffs.length} Files Refactored
          </span>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2 text-xs">
          
          {/* View Mode Toggle */}
          <div className="bg-carbon-100 border border-carbon-80 p-0.5 flex items-center font-mono">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 cursor-pointer transition ${viewMode === 'side-by-side' ? 'bg-carbon-blue-60 text-white font-semibold' : 'text-carbon-50 hover:text-white'}`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('monaco')}
              className={`px-3 py-1 cursor-pointer transition ${viewMode === 'monaco' ? 'bg-carbon-blue-60 text-white font-semibold' : 'text-carbon-50 hover:text-white'}`}
            >
              Monaco Diff
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyModernCode}
            className="flex items-center gap-1.5 bg-carbon-80 hover:bg-carbon-70 text-carbon-10 px-3 py-1.5 transition text-xs font-mono cursor-pointer border border-carbon-70"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-carbon-green-50" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Java 21 Code'}</span>
          </button>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-carbon-100 border-b border-carbon-80 px-3 pt-2 text-xs font-mono">
        {diffs.map((d, index) => {
          const isActive = index === selectedFileIndex;
          return (
            <button
              key={index}
              onClick={() => setSelectedFileIndex(index)}
              className={`flex items-center gap-2 px-3 py-2 border-t-2 transition cursor-pointer whitespace-nowrap ${
                isActive 
                  ? 'bg-carbon-90 border-carbon-blue-60 text-white font-semibold shadow' 
                  : 'bg-transparent border-transparent text-carbon-50 hover:text-carbon-30 hover:bg-carbon-80/40'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-carbon-blue-60' : 'text-carbon-60'}`} />
              <span>{d.fileName}</span>
              <span className="text-[10px] px-1 bg-carbon-80 rounded text-carbon-green-50">
                +{d.metrics.additions}
              </span>
              <span className="text-[10px] px-1 bg-carbon-80 rounded text-carbon-red-60">
                -{d.metrics.deletions}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active File Metadata Header */}
      {currentDiff && (
        <div className="bg-carbon-100/50 px-4 py-2.5 border-b border-carbon-80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-carbon-30">
              Path: <strong className="text-white">{currentDiff.filePath}</strong>
            </span>
            <span className="bg-carbon-purple-60/20 text-carbon-purple-60 border border-carbon-purple-60/40 px-2 py-0.5 rounded font-mono flex items-center gap-1 text-[11px]">
              <Cpu className="w-3 h-3" /> {currentDiff.subagent}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-carbon-50 font-mono text-[11px]">Transforms:</span>
            <div className="flex flex-wrap gap-1">
              {currentDiff.appliedTransforms?.map((t, i) => (
                <span key={i} className="bg-carbon-80 text-carbon-teal-50 px-2 py-0.5 text-[10px] font-mono border border-carbon-70">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Diff Area */}
      <div className="relative">
        
        {/* Monaco Diff Viewer Mode */}
        {viewMode === 'monaco' ? (
          <div className="h-[550px] w-full bg-carbon-100">
            <DiffEditor
              height="100%"
              original={currentDiff?.originalCode || ''}
              modified={currentDiff?.modernCode || ''}
              language="java"
              theme="vs-dark"
              options={{
                readOnly: true,
                renderSideBySide: true,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                fontSize: 13,
                fontFamily: '"IBM Plex Mono", monospace'
              }}
            />
          </div>
        ) : (
          /* High-Performance Side-by-Side AST View */
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-carbon-80 bg-carbon-100">
            
            {/* Left Column: Legacy Baseline */}
            <div className="flex flex-col">
              <div className="bg-carbon-red-90/50 border-b border-carbon-80 px-4 py-2 text-xs font-mono font-semibold text-carbon-red-60 flex items-center justify-between sticky top-0 z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-carbon-red-60" />
                  LEGACY BASELINE (Java 8 / javax.* / JUnit 4)
                </span>
                <span className="text-[11px] text-carbon-50">-{currentDiff?.metrics.deletions} lines</span>
              </div>
              
              <div 
                ref={leftPaneRef}
                onScroll={handleLeftScroll}
                className="h-[520px] overflow-auto font-mono text-xs leading-5 bg-carbon-100 select-text"
              >
                {originalLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isDeletedOrChanged = line.includes('javax.') || 
                                             line.includes('new Integer(') || 
                                             line.includes('1.8') || 
                                             line.includes('org.junit.Test') || 
                                             line.includes('@Before\n') ||
                                             (currentDiff?.fileName === 'OrderDto.java' && idx > 15);

                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start ${isDeletedOrChanged ? 'diff-line-delete text-red-200' : 'diff-line-normal text-carbon-30 hover:bg-carbon-90/50'}`}
                    >
                      <span className="w-12 shrink-0 select-none text-right pr-3 text-carbon-60 bg-carbon-90/40 text-[11px] py-0.5">
                        {lineNum}
                      </span>
                      <pre className="px-2 py-0.5 whitespace-pre overflow-x-visible font-mono">
                        {line || ' '}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Modernized Target */}
            <div className="flex flex-col">
              <div className="bg-carbon-green-90/50 border-b border-carbon-80 px-4 py-2 text-xs font-mono font-semibold text-carbon-green-50 flex items-center justify-between sticky top-0 z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-carbon-green-50" />
                  MODERNIZED TARGET (Java 21 LTS / jakarta.* / Records / JUnit 5)
                </span>
                <span className="text-[11px] text-carbon-green-50">+{currentDiff?.metrics.additions} lines</span>
              </div>
              
              <div 
                ref={rightPaneRef}
                onScroll={handleRightScroll}
                className="h-[520px] overflow-auto font-mono text-xs leading-5 bg-carbon-100 select-text"
              >
                {modernLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isAddedOrChanged = line.includes('jakarta.') || 
                                           line.includes('Integer.valueOf(') || 
                                           line.includes('<java.version>21</java.version>') || 
                                           line.includes('public record') || 
                                           line.includes('org.junit.jupiter') ||
                                           line.includes('3.3.4');

                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start ${isAddedOrChanged ? 'diff-line-add text-green-200' : 'diff-line-normal text-carbon-10 hover:bg-carbon-90/50'}`}
                    >
                      <span className="w-12 shrink-0 select-none text-right pr-3 text-carbon-60 bg-carbon-90/40 text-[11px] py-0.5">
                        {lineNum}
                      </span>
                      <pre className="px-2 py-0.5 whitespace-pre overflow-x-visible font-mono font-medium">
                        {line || ' '}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
