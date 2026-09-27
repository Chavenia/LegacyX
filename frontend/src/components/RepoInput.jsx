import React, { useState } from 'react';
import { GitBranch, Key, Search, FolderGit2, AlertCircle } from 'lucide-react';

export default function RepoInput({ onScan, isScanning, scanStep }) {
  const [repoUrl, setRepoUrl] = useState('sample:demo');
  const [branch, setBranch] = useState('');
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
    setBranch('');
    setError(null);
  };

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-5 mb-6">
      {/* Title & Instructions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 mb-4 gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-blue-500" />
            Repository Ingestion &amp; Pre-Flight Scanner
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Input any public or private Git repository to allocate an isolated sandbox and parse Java ASTs.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono hidden sm:inline">Presets:</span>
          <button
            type="button"
            onClick={() => handlePresetSelect('sample:demo')}
            className="text-xs bg-gray-50 hover:bg-gray-100 text-blue-600 px-2.5 py-1 rounded transition-colors font-mono border border-gray-200 cursor-pointer"
          >
            Sample Spring Boot 2 App
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('https://github.com/gabrielrovesti/spring-boot-migration-guide')}
            className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-800 px-2.5 py-1 rounded transition-colors font-mono border border-gray-200 cursor-pointer"
          >
            spring-boot-migration-guide
          </button>
        </div>
      </div>

      {/* Ingestion Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">

        {/* Primary Repo URL Input */}
        <div>
          <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1.5">
            Git Repository URL (HTTPS / SSH / Sample)
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="e.g. https://github.com/org/repo.git or sample:demo"
              disabled={isScanning}
              className="w-full bg-gray-50 border border-gray-200 focus:border-blue-400 rounded-lg text-gray-900 px-3.5 py-2.5 text-sm font-mono placeholder:text-gray-400 outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isScanning}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md flex items-center gap-2 text-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Scan Pre-Flight</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Options Bar (Branch & PAT Token) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-0.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Branch:</span>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                disabled={isScanning}
                placeholder="default"
                className="bg-gray-50 border border-gray-200 focus:border-blue-400 rounded px-2 py-0.5 text-gray-900 font-mono text-xs w-28 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowTokenField(!showTokenField)}
              className="text-xs text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 font-mono cursor-pointer"
            >
              <Key className="w-3 h-3" />
              <span>{showTokenField ? 'Hide Auth Token' : '+ Add Private Git Token'}</span>
            </button>
          </div>

          {isScanning && scanStep && (
            <div className="flex items-center gap-2 text-xs text-blue-600 font-mono bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>{scanStep}</span>
            </div>
          )}
        </div>

        {/* Optional Private PAT Input */}
        {showTokenField && (
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-mono text-gray-400 mb-1">
              GitHub / GitLab Personal Access Token — Stored only in ephemeral sandbox memory
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or glpat-xxxxxxxxxxxxxxxxxxxx"
              disabled={isScanning}
              className="w-full bg-gray-50 border border-gray-200 focus:border-blue-400 rounded-lg text-gray-900 px-3 py-2 text-xs font-mono placeholder:text-gray-400 outline-none"
            />
          </div>
        )}

        {/* Validation Error Banner */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
