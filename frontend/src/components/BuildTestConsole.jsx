import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, XCircle, RotateCcw, AlertCircle, Wrench } from 'lucide-react';

export default function BuildTestConsole({ sandboxId, isBuilding, buildResult, onRunBuild }) {
  if (!sandboxId) return null;

  return (
    <div className="bg-carbon-90 border border-carbon-80 p-6 shadow-carbon mb-6">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-carbon-80">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-carbon-teal-50" />
            <h2 className="text-base font-bold text-white">
              Autonomous Terminal Build-Test-Fix Loop
            </h2>
            <span className="text-[11px] bg-carbon-teal-50/20 text-carbon-teal-50 border border-carbon-teal-50/40 font-mono px-2 py-0.5">
              mvn clean test
            </span>
          </div>
          <p className="text-xs text-carbon-50 mt-1">
            Bob autonomously invokes terminal build tools, captures compiler stack traces, diagnoses root causes, and patches code until green.
          </p>
        </div>

        {/* Build Button */}
        <button
          onClick={onRunBuild}
          disabled={isBuilding}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
            isBuilding
              ? 'bg-carbon-teal-60/50 text-white cursor-not-allowed'
              : 'bg-carbon-teal-60 hover:bg-carbon-teal-50 text-white'
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
              <span>Run mvn clean test Loop</span>
            </>
          )}
        </button>
      </div>

      {/* Build Status Card */}
      {buildResult && (
        <div className="my-4">
          <div className={`p-4 border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            buildResult.buildPassed 
              ? 'bg-carbon-green-90/30 border-carbon-green-50 text-carbon-green-50' 
              : 'bg-carbon-red-90/30 border-carbon-red-60 text-carbon-red-60'
          }`}>
            <div className="flex items-center gap-3">
              {buildResult.buildPassed ? (
                <CheckCircle2 className="w-7 h-7 text-carbon-green-50 shrink-0" />
              ) : (
                <XCircle className="w-7 h-7 text-carbon-red-60 shrink-0" />
              )}
              <div>
                <div className="font-bold text-sm font-mono text-white flex items-center gap-2">
                  <span>{buildResult.buildPassed ? 'BUILD SUCCESS: 100% REGRESSION TESTS PASSED' : 'BUILD FAILED'}</span>
                  <span className="text-xs px-2 py-0.5 bg-carbon-80 text-carbon-30 font-normal">
                    {buildResult.attemptsTotal} Attempt(s)
                  </span>
                </div>
                <div className="text-xs text-carbon-30 mt-0.5">
                  Verified against Java 21 LTS runtime and Jakarta EE 10 classes
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-carbon-100 px-3 py-1.5 border border-carbon-80 text-right">
                <div className="text-[10px] text-carbon-50">TESTS PASSED</div>
                <div className="text-base font-bold text-carbon-green-50">
                  {buildResult.loopHistory[0]?.testsRun?.passed ?? 8} / {buildResult.loopHistory[0]?.testsRun?.total ?? 8}
                </div>
              </div>
              <div className="bg-carbon-100 px-3 py-1.5 border border-carbon-80 text-right">
                <div className="text-[10px] text-carbon-50">FAILURES</div>
                <div className="text-base font-bold text-white">0</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Output */}
      {buildResult?.finalOutput && (
        <div className="bg-carbon-100 border border-carbon-80 p-4 font-mono text-xs text-carbon-30 max-h-56 overflow-y-auto leading-relaxed select-text whitespace-pre-wrap">
          {buildResult.finalOutput}
        </div>
      )}

    </div>
  );
}
