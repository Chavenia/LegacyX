import React from 'react';
import { CheckCircle2, Loader2, ChevronRight } from 'lucide-react';

export default function PipelineProgressBar({ steps, currentStep, completedSteps = [], isRunning = false }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-[#121418] border border-[#23262D] rounded-xl px-5 py-3.5 mb-6 overflow-x-auto">
      {/* Track */}
      <div className="flex items-center gap-0 min-w-max mx-auto w-full">
        {steps.map((step, idx) => {
          const isDone    = completedSteps.includes(idx);
          const isActive  = idx === currentStep && isRunning;
          const isPending = !isDone && idx !== currentStep;
          const isCurrent = idx === currentStep && !isRunning && !isDone;

          return (
            <React.Fragment key={idx}>
              {/* Step node */}
              <div className="flex flex-col items-center gap-1.5 relative" style={{ minWidth: '7rem' }}>
                
                {/* Connector left */}
                {idx > 0 && (
                  <div className={`absolute top-[1.1rem] right-1/2 h-[1.5px] w-1/2 -translate-y-1/2 ${
                    completedSteps.includes(idx - 1) ? 'bg-emerald-600' : 'bg-[#23262D]'
                  }`} />
                )}
                {/* Connector right */}
                {idx < steps.length - 1 && (
                  <div className={`absolute top-[1.1rem] left-1/2 h-[1.5px] w-1/2 -translate-y-1/2 ${
                    isDone ? 'bg-emerald-600' : 'bg-[#23262D]'
                  }`} />
                )}

                {/* Icon circle */}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                  isDone    ? 'bg-emerald-950/60 border-emerald-600 text-emerald-400' :
                  isActive  ? 'bg-blue-950/60 border-blue-500 text-blue-400' :
                  isCurrent ? 'bg-[#181A1F] border-blue-500 text-blue-300' :
                              'bg-[#0B0C0E] border-[#262830] text-neutral-500'
                }`}>
                  {isDone   ? <CheckCircle2 className="w-4 h-4" /> :
                   isActive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                              <span className="text-xs font-mono font-medium">{idx + 1}</span>
                  }
                </div>

                {/* Label */}
                <div className="text-center px-1">
                  <div className={`text-[11px] font-medium leading-tight ${
                    isDone ? 'text-emerald-400' :
                    (isActive || isCurrent) ? 'text-white' :
                    'text-neutral-400'
                  }`}>
                    {step.label}
                  </div>
                  {step.sublabel && (
                    <div className="text-[10px] text-neutral-500 mt-0.5 hidden sm:block font-mono">
                      {step.sublabel}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow between steps */}
              {idx < steps.length - 1 && (
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 mx-0 ${
                  completedSteps.includes(idx) ? 'text-emerald-600' : 'text-[#2B2E35]'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
