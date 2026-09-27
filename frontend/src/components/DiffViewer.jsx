import React, { useState, useRef } from 'react';
import {
  FileCode,
  GitCompare,
  Copy,
  Check,
  Cpu
} from 'lucide-react';
import { DiffEditor } from '@monaco-editor/react';

export default function DiffViewer({ diffs = [] }) {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [viewMode, setViewMode] = useState('side-by-side');
  const [copied, setCopied] = useState(false);

  const leftPaneRef  = useRef(null);
  const rightPaneRef = useRef(null);
  const isSyncingLeft  = useRef(false);
  const isSyncingRight = useRef(false);

  const currentDiff = diffs[selectedFileIndex] || null;

  const handleLeftScroll = () => {
    if (!isSyncingLeft.current && leftPaneRef.current && rightPaneRef.current) {
      isSyncingRight.current = true;
      rightPaneRef.current.scrollTop  = leftPaneRef.current.scrollTop;
      rightPaneRef.current.scrollLeft = leftPaneRef.current.scrollLeft;
      setTimeout(() => { isSyncingRight.current = false; }, 50);
    }
  };

  const handleRightScroll = () => {
    if (!isSyncingRight.current && leftPaneRef.current && rightPaneRef.current) {
      isSyncingLeft.current = true;
      leftPaneRef.current.scrollTop  = rightPaneRef.current.scrollTop;
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
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center mb-6">
        <GitCompare className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
        <h3 className="text-sm font-semibold text-gray-700 mb-1">AST Diff Viewer — Awaiting Refactoring Run</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          Execute modernization via Bob 2.0 to generate side-by-side code diffs comparing legacy Java 8/javax with modern Java 21/Jakarta.
        </p>
      </div>
    );
  }

  const originalLines = (currentDiff?.originalCode || '').split(/\r?\n/);
  const modernLines   = (currentDiff?.modernCode   || '').split(/\r?\n/);

  const totalAdditions = diffs.reduce((sum, d) => sum + (d.metrics?.additions || 0), 0);
  const totalDeletions = diffs.reduce((sum, d) => sum + (d.metrics?.deletions || 0), 0);
  const transforms = [...new Set(diffs.flatMap(d => d.appliedTransforms || []))];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">

      {/* Diff Stats Summary Banner */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center gap-4 text-xs font-mono">
        <span className="text-gray-500 font-semibold uppercase tracking-wider">Diff Summary</span>
        <span className="text-emerald-600 font-medium">+{totalAdditions} additions</span>
        <span className="text-red-500 font-medium">−{totalDeletions} deletions</span>
        <span className="text-blue-600 font-medium">{diffs.length} files</span>
        <div className="flex flex-wrap gap-1 ml-auto">
          {transforms.map((t, i) => (
            <span key={i} className="bg-white text-blue-700 border border-blue-200 rounded px-2 py-0.5 text-[10px]">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Diff Viewer Top Bar */}
      <div className="p-3.5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <GitCompare className="w-4 h-4 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-900">
            Side-by-Side AST Diff Viewer
          </h2>
          <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded font-mono">
            {diffs.length} Files Refactored
          </span>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2 text-xs">
          {/* View Mode Toggle */}
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-0.5 flex items-center font-mono">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${viewMode === 'side-by-side' ? 'bg-blue-600 text-white font-medium' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('monaco')}
              className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${viewMode === 'monaco' ? 'bg-blue-600 text-white font-medium' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Monaco Diff
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyModernCode}
            className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg transition-colors text-xs font-mono cursor-pointer border border-gray-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-gray-50 border-b border-gray-200 px-2 pt-1.5 text-xs font-mono">
        {diffs.map((d, index) => {
          const isActive = index === selectedFileIndex;
          return (
            <button
              key={index}
              onClick={() => setSelectedFileIndex(index)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-t border-t-2 transition-colors cursor-pointer whitespace-nowrap text-xs ${
                isActive
                  ? 'bg-white border-blue-500 text-gray-900 font-medium'
                  : 'bg-transparent border-transparent text-gray-500 hover:text-gray-800 hover:bg-white/60'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
              <span>{d.fileName}</span>
              <span className="text-[10px] px-1 py-0.2 bg-emerald-50 border border-emerald-200 rounded text-emerald-700">
                +{d.metrics.additions}
              </span>
              <span className="text-[10px] px-1 py-0.2 bg-red-50 border border-red-200 rounded text-red-600">
                -{d.metrics.deletions}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active File Metadata Header */}
      {currentDiff && (
        <div className="bg-gray-50 px-3.5 py-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-gray-500">
              Path: <strong className="text-gray-800 font-normal">{currentDiff.filePath}</strong>
            </span>
            <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-mono flex items-center gap-1 text-[11px]">
              <Cpu className="w-3 h-3 text-purple-500" /> {currentDiff.subagent}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-mono text-[11px]">Transforms:</span>
            <div className="flex flex-wrap gap-1">
              {currentDiff.appliedTransforms?.map((t, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-mono border border-blue-200 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Diff Area */}
      <div className="relative">
        {viewMode === 'monaco' ? (
          <div className="h-[520px] w-full">
            <DiffEditor
              height="100%"
              original={currentDiff?.originalCode || ''}
              modified={currentDiff?.modernCode || ''}
              language="java"
              theme="vs"
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
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white">

            {/* Left Column: Legacy Baseline */}
            <div className="flex flex-col">
              <div className="bg-red-50 border-b border-gray-200 px-3.5 py-1.5 text-xs font-mono font-medium text-red-700 flex items-center justify-between sticky top-0 z-10">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  LEGACY (Java 8 / javax.* / JUnit 4)
                </span>
                <span className="text-[11px] text-gray-400">-{currentDiff?.metrics.deletions} lines</span>
              </div>
              <div
                ref={leftPaneRef}
                onScroll={handleLeftScroll}
                className="h-[500px] overflow-auto font-mono text-xs leading-5 bg-white select-text"
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
                      className={`flex items-start px-2 py-0.5 hover:bg-gray-50 ${
                        isDeletedOrChanged ? 'diff-line-delete text-red-800' : 'text-gray-500'
                      }`}
                    >
                      <span className="w-8 shrink-0 text-right pr-3 select-none text-gray-300 text-[10px]">
                        {lineNum}
                      </span>
                      <span className="w-4 shrink-0 select-none text-red-400 font-bold">
                        {isDeletedOrChanged ? '−' : ' '}
                      </span>
                      <pre className="font-mono text-xs overflow-visible whitespace-pre text-gray-700">
                        {line}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Modernized Java 21 */}
            <div className="flex flex-col">
              <div className="bg-emerald-50 border-b border-gray-200 px-3.5 py-1.5 text-xs font-mono font-medium text-emerald-700 flex items-center justify-between sticky top-0 z-10">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  MODERNIZED (Java 21 / Spring Boot 3.3.4 / Jakarta)
                </span>
                <span className="text-[11px] text-gray-400">+{currentDiff?.metrics.additions} lines</span>
              </div>
              <div
                ref={rightPaneRef}
                onScroll={handleRightScroll}
                className="h-[500px] overflow-auto font-mono text-xs leading-5 bg-white select-text"
              >
                {modernLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isAddedOrChanged = line.includes('jakarta.') ||
                                          line.includes('Integer.valueOf(') ||
                                          line.includes('<java.version>21') ||
                                          line.includes('record ') ||
                                          line.includes('org.junit.jupiter') ||
                                          line.includes('@BeforeEach');
                  return (
                    <div
                      key={idx}
                      className={`flex items-start px-2 py-0.5 hover:bg-gray-50 ${
                        isAddedOrChanged ? 'diff-line-add text-emerald-800' : 'text-gray-600'
                      }`}
                    >
                      <span className="w-8 shrink-0 text-right pr-3 select-none text-gray-300 text-[10px]">
                        {lineNum}
                      </span>
                      <span className="w-4 shrink-0 select-none text-emerald-500 font-bold">
                        {isAddedOrChanged ? '+' : ' '}
                      </span>
                      <pre className="font-mono text-xs overflow-visible whitespace-pre text-gray-700">
                        {line}
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
