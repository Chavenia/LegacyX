import React from 'react';
import { Layers, Terminal, Cpu, RefreshCw, Server, Video } from 'lucide-react';

export default function Header({ backendConnected, onReset, isProcessing, onOpenSandboxManager, onOpenVideoDemo }) {
  return (
    <header className="bg-[#0E1013] border-b border-[#23262D] px-6 py-3.5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            LX
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                LegacyX
                <span className="text-[11px] bg-[#16181E] text-neutral-400 px-2 py-0.5 rounded font-mono font-medium border border-[#262830]">
                  v1.0.0
                </span>
              </h1>
              <span className="text-[11px] bg-purple-950/40 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded font-mono flex items-center gap-1.5 font-medium">
                <Cpu className="w-3 h-3 text-purple-400" /> IBM Bob 2.0 Engine
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Autonomous Developer Governance Sidecar &amp; Enterprise Java Modernization
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          
          {/* Target badges */}
          <div className="hidden lg:flex items-center gap-2 border-r border-[#23262D] pr-3">
            <span className="bg-[#14161A] text-neutral-300 px-2.5 py-1 rounded font-mono border border-[#23262D]">
              Target: <strong className="text-white">Java 21 LTS</strong>
            </span>
            <span className="bg-[#14161A] text-neutral-300 px-2.5 py-1 rounded font-mono border border-[#23262D]">
              <strong className="text-white">Spring Boot 3.3.4</strong>
            </span>
            <span className="bg-[#14161A] text-neutral-300 px-2.5 py-1 rounded font-mono border border-[#23262D]">
              <strong className="text-white">Jakarta EE 10</strong>
            </span>
          </div>

          {/* Backend status pill */}
          <div className="flex items-center gap-2 bg-[#14161A] px-2.5 py-1.5 rounded-lg border border-[#23262D]">
            <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-neutral-400 font-mono text-[11px]">
              API:{' '}
              {backendConnected
                ? <span className="text-emerald-400 font-medium">Online :5000</span>
                : <span className="text-red-400 font-medium">Offline</span>}
            </span>
          </div>

          {/* Video Demo modal trigger */}
          <button
            onClick={onOpenVideoDemo}
            title="Watch 3-minute LegacyX Video Demo (Remotion)"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors text-xs font-medium cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>3-Min Video Demo</span>
          </button>

          {/* Sandbox Manager toggle */}
          <button
            onClick={onOpenSandboxManager}
            title="Open Sandbox Session Manager"
            className="flex items-center gap-1.5 bg-[#14161A] hover:bg-[#1C1F26] text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors text-xs font-medium cursor-pointer border border-[#23262D]"
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sandboxes</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={isProcessing}
            title="Reset Dashboard State"
            className="flex items-center gap-1.5 bg-[#14161A] hover:bg-[#1C1F26] text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 text-xs font-medium cursor-pointer border border-[#23262D]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
