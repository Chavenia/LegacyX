import React from 'react';
import { Layers, Terminal, Cpu, RefreshCw, Server, Video } from 'lucide-react';

export default function Header({ backendConnected, onReset, isProcessing, onOpenSandboxManager, onOpenVideoDemo }) {
  return (
    <header className="bg-carbon-90 border-b border-carbon-80 px-6 py-4 sticky top-0 z-50 shadow-carbon">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-carbon-blue-60 flex items-center justify-center text-white shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                LegacyX
                <span className="text-xs bg-carbon-80 text-carbon-30 px-2 py-0.5 font-mono font-normal">v1.0.0</span>
              </h1>
              <span className="text-xs bg-carbon-purple-60/20 text-carbon-purple-60 border border-carbon-purple-60/40 px-2 py-0.5 font-mono flex items-center gap-1">
                <Cpu className="w-3 h-3" /> IBM Bob 2.0 Engine
              </span>
            </div>
            <p className="text-xs text-carbon-50">
              AI-Powered Developer Governance Sidecar & Enterprise Java Modernization
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          
          {/* Target badges */}
          <div className="hidden lg:flex items-center gap-2 border-r border-carbon-80 pr-3">
            <span className="bg-carbon-80 text-carbon-30 px-2.5 py-1 font-mono">
              Target: <strong className="text-white">Java 21 LTS</strong>
            </span>
            <span className="bg-carbon-80 text-carbon-30 px-2.5 py-1 font-mono">
              <strong className="text-white">Spring Boot 3.3.4</strong>
            </span>
            <span className="bg-carbon-80 text-carbon-30 px-2.5 py-1 font-mono">
              <strong className="text-white">Jakarta EE 10</strong>
            </span>
          </div>

          {/* Backend status pill */}
          <div className="flex items-center gap-2 bg-carbon-100 px-3 py-1.5 border border-carbon-80">
            <span className={`w-2.5 h-2.5 rounded-full ${backendConnected ? 'bg-carbon-green-50 animate-pulse' : 'bg-carbon-red-60'}`} />
            <span className="text-carbon-30 font-mono">
              API:{' '}
              {backendConnected
                ? <span className="text-carbon-green-50 font-semibold">Online :5000</span>
                : <span className="text-carbon-red-60 font-semibold">Offline</span>}
            </span>
          </div>

          {/* Video Demo modal trigger */}
          <button
            onClick={onOpenVideoDemo}
            title="Watch 3-minute LegacyX Video Demo (Remotion)"
            className="flex items-center gap-1.5 bg-carbon-blue-60 hover:bg-carbon-blue-70 text-white px-3 py-1.5 transition text-xs font-semibold cursor-pointer shadow-sm"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Demo</span>
          </button>

          {/* Sandbox Manager toggle */}
          <button
            onClick={onOpenSandboxManager}
            title="Open Sandbox Session Manager"
            className="flex items-center gap-1.5 bg-carbon-80 hover:bg-carbon-70 text-carbon-10 px-3 py-1.5 transition text-xs font-medium cursor-pointer border border-carbon-70"
          >
            <Server className="w-3.5 h-3.5 text-carbon-teal-50" />
            <span>Sandboxes</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={isProcessing}
            title="Reset Dashboard State"
            className="flex items-center gap-1.5 bg-carbon-80 hover:bg-carbon-70 text-carbon-10 px-3 py-1.5 transition disabled:opacity-50 text-xs font-medium cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
