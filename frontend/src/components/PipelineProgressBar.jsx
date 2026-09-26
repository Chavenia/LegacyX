import React from 'react';
import { CheckCircle2, Circle, Loader2, ChevronRight } from 'lucide-react';

/**
 * PipelineProgressBar — 5-step workflow status tracker
 * 
 * steps prop: array of { label, sublabel }
 * currentStep: 0-based index of the active step
 * completedSteps: array of step indices that are complete
 * isRunning: whether the current step is actively processing
 */
export default function PipelineProgressBar({ steps, currentStep, completedSteps = [], isRunning = false }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-carbon-90 border border-carbon-80 px-6 py-4 shadow-carbon mb-6 overflow-x-auto">
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
                  <div className={`absolute top-[1.1rem] right-1/2 h-0.5 w-1/2 -translate-y-1/2 ${
                    completedSteps.includes(idx - 1) ? 'bg-carbon-green-50' : 'bg-carbon-80'
                  }`} />
                )}
                {/* Connector right */}
                {idx < steps.length - 1 && (
                  <div className={`absolute top-[1.1rem] left-1/2 h-0.5 w-1/2 -translate-y-1/2 ${
                    isDone ? 'bg-carbon-green-50' : 'bg-carbon-80'
                  }`} />
                )}

                {/* Icon circle */}
                <div className={`relative z-10 w-9 h-9 flex items-center justify-center border-2 transition-all duration-500 ${
                  isDone    ? 'bg-carbon-green-90 border-carbon-green-50 text-carbon-green-50' :
                  isActive  ? 'bg-carbon-blue-80 border-carbon-blue-60 text-carbon-blue-60 animate-pulse' :
                  isCurrent ? 'bg-carbon-blue-80/50 border-carbon-blue-60 text-carbon-blue-60' :
                              'bg-carbon-100 border-carbon-70 text-carbon-60'
                }`}>
                  {isDone   ? <CheckCircle2 className="w-4 h-4" /> :
                   isActive ? <Loader2 className="w-4 h-4 animate-spin" /> :
                              <span className="text-xs font-mono font-bold">{idx + 1}</span>
                  }
                </div>

                {/* Label */}
                <div className="text-center px-1">
                  <div className={`text-[11px] font-semibold leading-tight ${
                    isDone ? 'text-carbon-green-50' :
                    (isActive || isCurrent) ? 'text-white' :
                    'text-carbon-50'
                  }`}>
                    {step.label}
                  </div>
                  {step.sublabel && (
                    <div className="text-[10px] text-carbon-60 mt-0.5 hidden sm:block">
                      {step.sublabel}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow between steps */}
              {idx < steps.length - 1 && (
                <ChevronRight className={`w-4 h-4 shrink-0 mx-0 ${
                  completedSteps.includes(idx) ? 'text-carbon-green-50' : 'text-carbon-80'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
