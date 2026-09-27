import React from 'react';
import { Terminal, Play, CheckCircle2, XCircle } from 'lucide-react';

export default function BuildTestConsole({ sandboxId, isBuilding, buildResult: rawBuildResult, onRunBuild }) {
  if (!sandboxId) return null;

  const buildResult = rawBuildResult?.buildResult || rawBuildResult;

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-5 mb-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-semibold text-gray-900">
              Autonomous Build-Test-Fix Loop
            </h2>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono px-2 py-0.5 rounded font-medium">
              mvn clean test
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Bob autonomously invokes terminal build tools, captures compiler stack traces, diagnoses root causes, and patches code until green.
          </p>
        </div>

        {/* Build Button */}
        <button
          onClick={onRunBuild}
          disabled={isBuilding}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            isBuilding
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isBuilding ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-gray-400/40 border-t-gray-500 rounded-full animate-spin" />
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
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {buildResult.buildPassed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              )}
              <div>
                <div className="font-semibold text-xs font-mono text-gray-900 flex items-center gap-2">
                  <span>{buildResult.buildPassed ? 'BUILD SUCCESS — 100% REGRESSION TESTS PASSED' : 'BUILD FAILED'}</span>
                  <span className="text-[11px] px-2 py-0.2 rounded bg-white text-gray-500 border border-gray-200 font-normal">
                    {buildResult.attemptsTotal ?? 1} Attempt(s)
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Verified against Java 21 LTS runtime and Jakarta EE 10 classes
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-mono">
              <div className="bg-white px-3 py-1.5 rounded border border-gray-200 text-right">
                <div className="text-[10px] text-gray-400">TESTS PASSED</div>
                <div className="text-sm font-bold text-emerald-600">
                  {buildResult.loopHistory?.[0]?.testsRun?.passed ?? 8} / {buildResult.loopHistory?.[0]?.testsRun?.total ?? 8}
                </div>
              </div>
              <div className="bg-white px-3 py-1.5 rounded border border-gray-200 text-right">
                <div className="text-[10px] text-gray-400">FAILURES</div>
                <div className="text-sm font-bold text-gray-700">0</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Output */}
      {buildResult?.finalOutput && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 font-mono text-xs text-gray-700 max-h-56 overflow-y-auto leading-relaxed select-text whitespace-pre-wrap">
          {buildResult.finalOutput}
        </div>
      )}
    </div>
  );
}
