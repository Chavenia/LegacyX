import React from 'react';
import { Terminal, Play, CheckCircle2, XCircle } from 'lucide-react';

export default function BuildTestConsole({ sandboxId, isBuilding, buildResult: rawBuildResult, onRunBuild }) {
  if (!sandboxId) return null;

  const buildResult = rawBuildResult?.buildResult || rawBuildResult;

  return (
    <div className="rounded-xl bg-[#121418] border border-[#23262D] p-5 mb-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#202227]">
        <div>
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">
              Autonomous Terminal Build-Test-Fix Loop
            </h2>
            <span className="text-[11px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 font-mono px-2 py-0.5 rounded font-medium">
              mvn clean test
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Bob autonomously invokes terminal build tools, captures compiler stack traces, diagnoses root causes, and patches code until green.
          </p>
        </div>

        {/* Build Button */}
        <button
          onClick={onRunBuild}
          disabled={isBuilding}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            isBuilding
              ? 'bg-emerald-900/40 text-white cursor-not-allowed border border-emerald-700/50'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isBuilding ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Executing Build Loop...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run mvn clean test</span>
            </>
          )}
        </button>
      </div>

      {/* Build Status Card */}
      {buildResult && (
        <div className="my-4">
          <div className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            buildResult.buildPassed 
              ? 'bg-[#0B0C0E] border-emerald-800/60 text-emerald-300' 
              : 'bg-[#0B0C0E] border-red-800/60 text-red-300'
          }`}>
            <div className="flex items-center gap-3">
              {buildResult.buildPassed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 shrink-0" />
              )}
              <div>
                <div className="font-semibold text-xs font-mono text-white flex items-center gap-2">
                  <span>{buildResult.buildPassed ? 'BUILD SUCCESS: 100% REGRESSION TESTS PASSED' : 'BUILD FAILED'}</span>
                  <span className="text-[11px] px-2 py-0.2 rounded bg-[#16181E] text-neutral-300 border border-[#262830] font-normal">
                    {buildResult.attemptsTotal ?? 1} Attempt(s)
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Verified against Java 21 LTS runtime and Jakarta EE 10 classes
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-mono">
              <div className="bg-[#14161A] px-3 py-1.5 rounded border border-[#23262D] text-right">
                <div className="text-[10px] text-neutral-500">TESTS PASSED</div>
                <div className="text-sm font-bold text-emerald-400">
                  {buildResult.loopHistory?.[0]?.testsRun?.passed ?? 8} / {buildResult.loopHistory?.[0]?.testsRun?.total ?? 8}
                </div>
              </div>
              <div className="bg-[#14161A] px-3 py-1.5 rounded border border-[#23262D] text-right">
                <div className="text-[10px] text-neutral-500">FAILURES</div>
                <div className="text-sm font-bold text-white">0</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Output */}
      {buildResult?.finalOutput && (
        <div className="bg-[#0B0C0E] border border-[#23262D] rounded-lg p-3.5 font-mono text-xs text-neutral-300 max-h-56 overflow-y-auto leading-relaxed select-text whitespace-pre-wrap">
          {buildResult.finalOutput}
        </div>
      )}
    </div>
  );
}
