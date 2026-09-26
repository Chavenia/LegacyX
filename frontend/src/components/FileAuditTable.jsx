import React, { useState } from 'react';
import { FileCode, Search, Filter } from 'lucide-react';

export default function FileAuditTable({ files = [], onSelectFile }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  if (!files || files.length === 0) return null;

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.filePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'JAVAX') return f.hasJavax;
    if (filter === 'RECORDS') return f.isRecordCandidate;
    if (filter === 'TESTS') return f.isTestFile;
    return true;
  });

  return (
    <div className="bg-[#121418] border border-[#23262D] rounded-xl p-5 mb-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#202227] mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-400" />
            Repository Java Source Code Audit ({files.length} Files)
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Detailed breakdown of scanned ASTs, legacy packages, and candidate modernization patterns.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search file name..."
              className="bg-[#0B0C0E] border border-[#23262D] rounded-md text-white px-2.5 py-1 text-xs font-mono outline-none focus:border-blue-500 w-44 placeholder:text-neutral-600"
            />
          </div>

          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${filter === 'ALL' ? 'bg-blue-600 text-white font-medium' : 'bg-[#14161A] text-neutral-400 hover:text-white border border-[#23262D]'}`}
          >
            All ({files.length})
          </button>
          <button
            onClick={() => setFilter('JAVAX')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${filter === 'JAVAX' ? 'bg-red-600 text-white font-medium' : 'bg-[#14161A] text-neutral-400 hover:text-white border border-[#23262D]'}`}
          >
            javax.* Shifts
          </button>
          <button
            onClick={() => setFilter('RECORDS')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${filter === 'RECORDS' ? 'bg-purple-600 text-white font-medium' : 'bg-[#14161A] text-neutral-400 hover:text-white border border-[#23262D]'}`}
          >
            Record Candidates
          </button>
          <button
            onClick={() => setFilter('TESTS')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${filter === 'TESTS' ? 'bg-emerald-600 text-white font-medium' : 'bg-[#14161A] text-neutral-400 hover:text-white border border-[#23262D]'}`}
          >
            Tests
          </button>
        </div>
      </div>

      {/* Files Table */}
      <div className="overflow-x-auto rounded-lg border border-[#23262D]">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-[#0E1013] text-neutral-400 border-b border-[#23262D] text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3.5">File Path</th>
              <th className="py-2.5 px-3.5">Lines</th>
              <th className="py-2.5 px-3.5">Modernization Findings</th>
              <th className="py-2.5 px-3.5">Target Transformation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#23262D] bg-[#121418]">
            {filteredFiles.map((file, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 px-3.5 text-neutral-200">
                  {file.filePath}
                </td>
                <td className="py-2.5 px-3.5 text-neutral-500">
                  {file.loc} LOC
                </td>
                <td className="py-2.5 px-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {file.hasJavax && (
                      <span className="bg-red-950/40 text-red-300 border border-red-800/50 rounded px-1.5 py-0.2 text-[10px]">
                        {file.javaxCount} javax.* imports
                      </span>
                    )}
                    {file.isRecordCandidate && (
                      <span className="bg-purple-950/40 text-purple-300 border border-purple-800/50 rounded px-1.5 py-0.2 text-[10px]">
                        Mutable DTO Candidate
                      </span>
                    )}
                    {file.isTestFile && (
                      <span className="bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 rounded px-1.5 py-0.2 text-[10px]">
                        JUnit 4 Suite
                      </span>
                    )}
                    {!file.hasJavax && !file.isRecordCandidate && !file.isTestFile && (
                      <span className="text-neutral-500 text-[11px]">Standard Java class</span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-3.5">
                  <span className="text-blue-400 font-medium">
                    {file.isRecordCandidate
                      ? 'Java 21 Record'
                      : file.hasJavax
                      ? 'jakarta.* namespace'
                      : file.isTestFile
                      ? 'JUnit Jupiter 5'
                      : 'JDK 21 bytecode'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
