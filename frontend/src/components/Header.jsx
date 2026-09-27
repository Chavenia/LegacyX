import React from 'react';
import { Cpu, RefreshCw, Server, Video } from 'lucide-react';

export default function Header({ backendConnected, onReset, isProcessing, onOpenSandboxManager, onOpenVideoDemo }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
                LegacyX
                <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono font-medium border border-gray-200">
                  v1.0.0
                </span>
              </h1>
              <span className="text-[11px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-mono flex items-center gap-1.5 font-medium">
                <Cpu className="w-3 h-3 text-purple-500" /> IBM Bob 2.0
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Enterprise Java Modernization &amp; Governance
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">

          {/* Target badges */}
          <div className="hidden lg:flex items-center gap-2 border-r border-gray-200 pr-3">
            <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded font-mono border border-gray-200">
              Target: <strong className="text-gray-900">Java 21 LTS</strong>
            </span>
            <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded font-mono border border-gray-200">
              <strong className="text-gray-900">Spring Boot 3.3.4</strong>
            </span>
            <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded font-mono border border-gray-200">
              <strong className="text-gray-900">Jakarta EE 10</strong>
            </span>
          </div>

          {/* Backend status pill */}
          <div className="flex items-center gap-2 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
            <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-gray-500 font-mono text-[11px]">
              API:{' '}
              {backendConnected
                ? <span className="text-emerald-600 font-medium">Online :5000</span>
                : <span className="text-red-500 font-medium">Offline</span>}
            </span>
          </div>

          {/* Video Demo modal trigger */}
          <button
            onClick={onOpenVideoDemo}
            title="Watch 3-minute LegacyX Video Demo"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors text-xs font-medium cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Demo Video</span>
          </button>

          {/* Sandbox Manager toggle */}
          <button
            onClick={onOpenSandboxManager}
            title="Open Sandbox Session Manager"
            className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium cursor-pointer border border-gray-200"
          >
            <Server className="w-3.5 h-3.5 text-gray-400" />
            <span>Sandboxes</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={isProcessing}
            title="Reset Dashboard State"
            className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 text-xs font-medium cursor-pointer border border-gray-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
