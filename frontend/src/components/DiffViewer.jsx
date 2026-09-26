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
      <div className="bg-[#121418] border border-[#23262D] rounded-xl p-8 text-center text-neutral-400 mb-6">
        <GitCompare className="w-10 h-10 text-neutral-600 mx-auto mb-2.5" />
        <h3 className="text-sm font-semibold text-white mb-1">AST Diff Viewer Awaiting Refactoring Run</h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
          Execute modernization via Bob 2.0 to generate side-by-side code diffs comparing legacy Java 8/javax with modern Java 21/Jakarta.
        </p>
      </div>
    );
  }

  const originalLines = (currentDiff?.originalCode || '').split(/\r?\n/);
  const modernLines = (currentDiff?.modernCode || '').split(/\r?\n/);

  const totalAdditions = diffs.reduce((sum, d) => sum + (d.metrics?.additions || 0), 0);
  const totalDeletions = diffs.reduce((sum, d) => sum + (d.metrics?.deletions || 0), 0);
  const transforms = [...new Set(diffs.flatMap(d => d.appliedTransforms || []))];

  return (
    <div className="bg-[#121418] border border-[#23262D] rounded-xl overflow-hidden mb-6">
      
      {/* Diff Stats Summary Banner */}
      <div className="bg-[#0E1013] border-b border-[#23262D] px-4 py-2.5 flex flex-wrap items-center gap-4 text-xs font-mono">
        <span className="text-neutral-400 font-semibold uppercase tracking-wider">Diff Summary</span>
        <span className="text-emerald-400 font-medium">+{totalAdditions} additions</span>
        <span className="text-red-400 font-medium">−{totalDeletions} deletions</span>
        <span className="text-blue-400 font-medium">{diffs.length} files</span>
        <div className="flex flex-wrap gap-1 ml-auto">
          {transforms.map((t, i) => (
            <span key={i} className="bg-[#16181E] text-cyan-300 border border-[#262830] rounded px-2 py-0.5 text-[10px]">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Diff Viewer Top Bar */}
      <div className="p-3.5 border-b border-[#23262D] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <GitCompare className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">
            Side-by-Side AST Diff Viewer
          </h2>
          <span className="text-xs bg-[#16181E] text-neutral-300 border border-[#262830] px-2 py-0.5 rounded font-mono">
            {diffs.length} Files Refactored
          </span>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2 text-xs">
          
          {/* View Mode Toggle */}
          <div className="bg-[#0B0C0E] border border-[#23262D] rounded-lg p-0.5 flex items-center font-mono">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${viewMode === 'side-by-side' ? 'bg-blue-600 text-white font-medium' : 'text-neutral-400 hover:text-white'}`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('monaco')}
              className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${viewMode === 'monaco' ? 'bg-blue-600 text-white font-medium' : 'text-neutral-400 hover:text-white'}`}
            >
              Monaco Diff
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyModernCode}
            className="flex items-center gap-1.5 bg-[#16181E] hover:bg-[#202228] text-white px-3 py-1.5 rounded-lg transition-colors text-xs font-mono cursor-pointer border border-[#262830]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-[#0E1013] border-b border-[#23262D] px-2 pt-1.5 text-xs font-mono">
        {diffs.map((d, index) => {
          const isActive = index === selectedFileIndex;
          return (
            <button
              key={index}
              onClick={() => setSelectedFileIndex(index)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-t border-t-2 transition-colors cursor-pointer whitespace-nowrap text-xs ${
                isActive 
                  ? 'bg-[#121418] border-blue-500 text-white font-medium' 
                  : 'bg-transparent border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-neutral-500'}`} />
              <span>{d.fileName}</span>
              <span className="text-[10px] px-1 py-0.2 bg-emerald-950/60 border border-emerald-800/50 rounded text-emerald-400">
                +{d.metrics.additions}
              </span>
              <span className="text-[10px] px-1 py-0.2 bg-red-950/60 border border-red-800/50 rounded text-red-400">
                -{d.metrics.deletions}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active File Metadata Header */}
      {currentDiff && (
        <div className="bg-[#101216] px-3.5 py-2 border-b border-[#23262D] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-neutral-400">
              Path: <strong className="text-white font-normal">{currentDiff.filePath}</strong>
            </span>
            <span className="bg-purple-950/50 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded font-mono flex items-center gap-1 text-[11px]">
              <Cpu className="w-3 h-3 text-purple-400" /> {currentDiff.subagent}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-mono text-[11px]">Transforms:</span>
            <div className="flex flex-wrap gap-1">
              {currentDiff.appliedTransforms?.map((t, i) => (
                <span key={i} className="bg-[#16181E] text-cyan-300 px-2 py-0.5 text-[10px] font-mono border border-[#262830] rounded">
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
          <div className="h-[520px] w-full bg-[#0B0C0E]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#23262D] bg-[#0B0C0E]">
            
            {/* Left Column: Legacy Baseline */}
            <div className="flex flex-col">
              <div className="bg-red-950/30 border-b border-[#23262D] px-3.5 py-1.5 text-xs font-mono font-medium text-red-300 flex items-center justify-between sticky top-0 z-10">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  LEGACY BASELINE (Java 8 / javax.* / JUnit 4)
                </span>
                <span className="text-[11px] text-neutral-400">-{currentDiff?.metrics.deletions} lines</span>
              </div>
              
              <div 
                ref={leftPaneRef}
                onScroll={handleLeftScroll}
                className="h-[500px] overflow-auto font-mono text-xs leading-5 bg-[#0B0C0E] select-text"
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
                      className={`flex items-start px-2 py-0.5 hover:bg-white/5 ${
                        isDeletedOrChanged ? 'diff-line-delete text-red-200' : 'text-neutral-400'
                      }`}
                    >
                      <span className="w-8 shrink-0 text-right pr-3 select-none text-neutral-600 text-[10px]">
                        {lineNum}
                      </span>
                      <span className="w-4 shrink-0 select-none text-red-400 font-bold">
                        {isDeletedOrChanged ? '−' : ' '}
                      </span>
                      <pre className="font-mono text-xs overflow-visible whitespace-pre">
                        {line}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Modernized Java 21 */}
            <div className="flex flex-col">
              <div className="bg-emerald-950/30 border-b border-[#23262D] px-3.5 py-1.5 text-xs font-mono font-medium text-emerald-300 flex items-center justify-between sticky top-0 z-10">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  MODERNIZED (Java 21 LTS / Spring Boot 3.3.4 / Jakarta)
                </span>
                <span className="text-[11px] text-neutral-400">+{currentDiff?.metrics.additions} lines</span>
              </div>

              <div 
                ref={rightPaneRef}
                onScroll={handleRightScroll}
                className="h-[500px] overflow-auto font-mono text-xs leading-5 bg-[#080B09] select-text"
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
                      className={`flex items-start px-2 py-0.5 hover:bg-white/5 ${
                        isAddedOrChanged ? 'diff-line-add text-emerald-200' : 'text-neutral-300'
                      }`}
                    >
                      <span className="w-8 shrink-0 text-right pr-3 select-none text-neutral-600 text-[10px]">
                        {lineNum}
                      </span>
                      <span className="w-4 shrink-0 select-none text-emerald-400 font-bold">
                        {isAddedOrChanged ? '+' : ' '}
                      </span>
                      <pre className="font-mono text-xs overflow-visible whitespace-pre">
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
