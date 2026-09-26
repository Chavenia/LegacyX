import React from 'react';
import { Clock, CheckCircle2, Loader2, Play, Cpu, Terminal, Send, Search, AlertCircle } from 'lucide-react';

/**
 * ActivityTimeline — append-only audit log of every pipeline action.
 * events: Array<{ id, type, label, detail, timestamp, status }>
 * type: 'scan' | 'refactor' | 'build' | 'deliver' | 'error'
 */

const TYPE_STYLE = {
  scan:     { icon: Search,      color: 'text-carbon-blue-60',   bg: 'bg-carbon-blue-80/30',    border: 'border-carbon-blue-60/50'   },
  refactor: { icon: Cpu,         color: 'text-carbon-purple-60', bg: 'bg-carbon-purple-60/10',  border: 'border-carbon-purple-60/50' },
  build:    { icon: Terminal,    color: 'text-carbon-teal-50',   bg: 'bg-carbon-teal-60/10',    border: 'border-carbon-teal-50/50'   },
  deliver:  { icon: Send,        color: 'text-carbon-green-50',  bg: 'bg-carbon-green-90/30',   border: 'border-carbon-green-50/50'  },
  error:    { icon: AlertCircle, color: 'text-carbon-red-60',    bg: 'bg-carbon-red-90/30',     border: 'border-carbon-red-60/50'    },
};

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function ActivityTimeline({ events = [] }) {
  if (events.length === 0) return null;

  return (
    <div className="bg-carbon-90 border border-carbon-80 shadow-carbon mb-6 overflow-hidden">
      
      {/* Header */}
      <div className="bg-carbon-100 px-5 py-3 border-b border-carbon-80 flex items-center gap-2">
        <Clock className="w-4 h-4 text-carbon-50" />
        <h2 className="text-xs font-mono font-bold text-carbon-30 uppercase tracking-wider">
          Pipeline Audit Timeline
        </h2>
        <span className="ml-auto text-[10px] text-carbon-60 font-mono">{events.length} events</span>
      </div>

      {/* Event List */}
      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {[...events].reverse().map((ev, idx) => {
          const style = TYPE_STYLE[ev.type] || TYPE_STYLE.scan;
          const Icon  = style.icon;
          const isRunning = ev.status === 'running';

          return (
            <div
              key={ev.id || idx}
              className={`flex items-start gap-3 text-xs p-3 border ${style.border} ${style.bg}`}
            >
              {/* Icon */}
              <div className={`mt-0.5 shrink-0 ${style.color}`}>
                {isRunning
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : ev.status === 'done'
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-carbon-green-50" />
                  : ev.status === 'error'
                  ? <AlertCircle className="w-3.5 h-3.5 text-carbon-red-60" />
                  : <Icon className="w-3.5 h-3.5" />
                }
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white truncate">{ev.label}</span>
                  <span className="text-[10px] text-carbon-60 font-mono shrink-0">
                    {formatTime(ev.timestamp)}
                  </span>
                </div>
                {ev.detail && (
                  <p className="text-carbon-50 text-[11px] mt-0.5 leading-relaxed truncate">{ev.detail}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
