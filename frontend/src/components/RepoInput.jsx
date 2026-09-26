import React, { useState } from 'react';
import { GitBranch, Key, Search, ArrowRight, Sparkles, FolderGit2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RepoInput({ onScan, isScanning, scanStep }) {
  const [repoUrl, setRepoUrl] = useState('sample:demo');
  const [branch, setBranch] = useState('main');
  const [token, setToken] = useState('');
  const [showTokenField, setShowTokenField] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      setError('Please provide a valid repository URL.');
      return;
    }
    setError(null);
    onScan(repoUrl.trim(), branch.trim(), token.trim());
  };

  const handlePresetSelect = (presetUrl) => {
    setRepoUrl(presetUrl);
    setError(null);
  };

  return (
    <div className="bg-carbon-90 border border-carbon-80 p-6 shadow-carbon mb-6">
      
      {/* Title & Instructions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-carbon-80 mb-5 gap-2">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-carbon-blue-60" />
            Target Repository Ingestion & Pre-Flight Risk Scanner
          </h2>
          <p className="text-xs text-carbon-50 mt-1">
            Input ANY public or private Git repository to allocate an isolated sandbox and parse Java ASTs.
          </p>
        </div>
        
        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-carbon-50 font-mono hidden sm:inline">Presets:</span>
          <button
            type="button"
            onClick={() => handlePresetSelect('sample:demo')}
            className="text-xs bg-carbon-80 hover:bg-carbon-70 text-carbon-teal-50 px-2.5 py-1 transition font-mono border border-carbon-70 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-carbon-teal-50" />
            <span>Sample Spring Boot 2 App</span>
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('https://github.com/gabrielrovesti/spring-boot-migration-guide')}
            className="text-xs bg-carbon-80 hover:bg-carbon-70 text-carbon-30 px-2.5 py-1 transition font-mono border border-carbon-70 cursor-pointer"
          >
            spring-boot-migration-guide
          </button>
        </div>
      </div>

      {/* Ingestion Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Primary Repo URL Input */}
        <div>
          <label className="block text-xs font-mono text-carbon-30 uppercase tracking-wider mb-1.5">
            Git Repository URL (HTTPS / SSH / Sample)
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="e.g. https://github.com/org/repo.git or sample:demo"
              disabled={isScanning}
              className="w-full bg-carbon-100 border border-carbon-70 focus:border-carbon-blue-60 text-white px-4 py-3 text-sm font-mono placeholder:text-carbon-60 outline-none transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isScanning}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-carbon-blue-60 hover:bg-carbon-blue-70 text-white px-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Scan Pre-Flight Risk</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Options Bar (Branch & PAT Token) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-4">
            
            {/* Branch */}
            <div className="flex items-center gap-1.5 text-carbon-30">
              <GitBranch className="w-3.5 h-3.5 text-carbon-50" />
              <span>Branch:</span>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                disabled={isScanning}
                className="bg-carbon-100 border border-carbon-80 text-white px-2 py-1 text-xs font-mono w-24 focus:border-carbon-blue-60 outline-none"
              />
            </div>

            {/* Token Toggle */}
            <button
              type="button"
              onClick={() => setShowTokenField(!showTokenField)}
              className="text-xs text-carbon-30 hover:text-white flex items-center gap-1 cursor-pointer underline decoration-dotted"
            >
              <Key className="w-3 h-3" />
              <span>{showTokenField ? 'Hide Auth Token' : 'Add Private Repo Token (PAT)'}</span>
            </button>

          </div>

          <div className="text-xs text-carbon-50 font-mono">
            Isolated Sandbox: <span className="text-carbon-teal-50">/tmp/legacyx-sandbox</span>
          </div>
        </div>

        {/* Optional Private PAT Input */}
        {showTokenField && (
          <div className="bg-carbon-100 p-3 border border-carbon-80 text-xs">
            <label className="block text-xs font-mono text-carbon-30 mb-1">
              Personal Access Token (for private enterprise repositories)
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_... or OAuth bearer token"
              disabled={isScanning}
              className="w-full bg-carbon-90 border border-carbon-70 text-white px-3 py-2 text-xs font-mono outline-none focus:border-carbon-blue-60"
            />
            <p className="text-[11px] text-carbon-50 mt-1">
              Tokens are injected into isolated git execution in memory and never persisted to logs.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-carbon-red-90/40 border-l-4 border-carbon-red-60 text-carbon-10 px-4 py-2 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-carbon-red-60 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Animated Scan Progress */}
        {isScanning && (
          <div className="bg-carbon-100 border border-carbon-blue-60/40 p-3 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-carbon-blue-60 animate-ping" />
              <span className="font-mono text-carbon-30">
                {scanStep || 'Allocating sandbox and cloning repository...'}
              </span>
            </div>
            <span className="text-carbon-blue-60 font-mono animate-pulse">Running AST Parsers...</span>
          </div>
        )}

      </form>
    </div>
  );
}
