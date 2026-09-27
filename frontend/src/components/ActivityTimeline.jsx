import React from 'react';
import { Clock, CheckCircle2, Loader2, Cpu, Terminal, Send, Search, AlertCircle } from 'lucide-react';

const TYPE_STYLE = {
  scan:     { icon: Search,      color: 'text-blue-500' },
  refactor: { icon: Cpu,         color: 'text-purple-500' },
  build:    { icon: Terminal,    color: 'text-emerald-500' },
  deliver:  { icon: Send,        color: 'text-cyan-500' },
  error:    { icon: AlertCircle, color: 'text-red-500' },
};

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function ActivityTimeline({ events = [] }) {
  if (events.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-gray-400" />
        <h2 className="text-xs font-mono font-medium text-gray-700 uppercase tracking-wider">
          Pipeline Audit Timeline
        </h2>
        <span className="ml-auto text-[11px] text-gray-400 font-mono">{events.length} events logged</span>
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
              className="flex items-start gap-3 text-xs p-3 rounded-lg border border-gray-200 bg-gray-50"
            >
              {/* Icon */}
              <div className={`mt-0.5 shrink-0 ${style.color}`}>
                {isRunning
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : ev.status === 'done'
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  : ev.status === 'error'
                  ? <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                  : <Icon className="w-3.5 h-3.5" />
                }
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-gray-800 truncate">{ev.label}</span>
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">
                    {formatTime(ev.timestamp)}
                  </span>
                </div>
                {ev.detail && (
                  <p className="text-gray-500 text-[11px] mt-0.5 leading-relaxed truncate">{ev.detail}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
