import React, { useState } from 'react';
import { FileCode, Search, Filter, ShieldAlert, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FileAuditTable({ files = [], onSelectFile }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'JAVAX' | 'RECORDS' | 'TESTS'

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
    <div className="bg-carbon-90 border border-carbon-80 p-6 shadow-carbon mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-carbon-80 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-carbon-blue-60" />
            Repository Java Source Code Audit ({files.length} Files)
          </h2>
          <p className="text-xs text-carbon-50 mt-1">
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
              className="bg-carbon-100 border border-carbon-80 text-white px-3 py-1.5 text-xs font-mono outline-none focus:border-carbon-blue-60 w-44"
            />
          </div>

          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1.5 transition cursor-pointer ${filter === 'ALL' ? 'bg-carbon-blue-60 text-white' : 'bg-carbon-100 text-carbon-50 hover:text-white'}`}
          >
            All ({files.length})
          </button>
          <button
            onClick={() => setFilter('JAVAX')}
            className={`px-2.5 py-1.5 transition cursor-pointer ${filter === 'JAVAX' ? 'bg-carbon-red-60 text-white' : 'bg-carbon-100 text-carbon-50 hover:text-white'}`}
          >
            javax.* Shifts
          </button>
          <button
            onClick={() => setFilter('RECORDS')}
            className={`px-2.5 py-1.5 transition cursor-pointer ${filter === 'RECORDS' ? 'bg-carbon-purple-60 text-white' : 'bg-carbon-100 text-carbon-50 hover:text-white'}`}
          >
            Record Candidates
          </button>
          <button
            onClick={() => setFilter('TESTS')}
            className={`px-2.5 py-1.5 transition cursor-pointer ${filter === 'TESTS' ? 'bg-carbon-teal-60 text-white' : 'bg-carbon-100 text-carbon-50 hover:text-white'}`}
          >
            Tests
          </button>
        </div>
      </div>

      {/* Files Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-carbon-100 text-carbon-50 border-b border-carbon-80 text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">File Path</th>
              <th className="py-2.5 px-3">Lines</th>
              <th className="py-2.5 px-3">Modernization Findings</th>
              <th className="py-2.5 px-3">Target Transformation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-carbon-80">
            {filteredFiles.map((file, idx) => (
              <tr key={idx} className="hover:bg-carbon-100/50 transition">
                <td className="py-2.5 px-3 text-white font-medium">
                  {file.filePath}
                </td>
                <td className="py-2.5 px-3 text-carbon-50">
                  {file.loc} LOC
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex flex-wrap gap-1.5">
                    {file.hasJavax && (
                      <span className="bg-carbon-red-90 text-carbon-red-60 border border-carbon-red-60/40 px-2 py-0.5 text-[10px]">
                        {file.javaxCount} javax.* imports
                      </span>
                    )}
                    {file.isRecordCandidate && (
                      <span className="bg-carbon-purple-60/20 text-carbon-purple-60 border border-carbon-purple-60/40 px-2 py-0.5 text-[10px]">
                        Java 21 Record Candidate
                      </span>
                    )}
                    {file.isTestFile && (
                      <span className="bg-carbon-orange-40/20 text-carbon-orange-40 border border-carbon-orange-40/40 px-2 py-0.5 text-[10px]">
                        JUnit 4 Suite
                      </span>
                    )}
                    {!file.hasJavax && !file.isRecordCandidate && !file.isTestFile && (
                      <span className="text-carbon-green-50 text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Compatible
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-3 text-carbon-30">
                  {file.hasJavax && 'Shift to jakarta.*'}
                  {file.isRecordCandidate && 'Convert to immutable record'}
                  {file.isTestFile && 'Migrate to JUnit 5'}
                  {!file.hasJavax && !file.isRecordCandidate && !file.isTestFile && 'Verify compilation'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
