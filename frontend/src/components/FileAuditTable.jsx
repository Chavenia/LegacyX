import React, { useState } from 'react';
import { FileCode, Search } from 'lucide-react';

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
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 overflow-hidden">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-500" />
            Java Source Code Audit ({files.length} Files)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
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
              className="bg-gray-50 border border-gray-200 rounded-md text-gray-800 px-2.5 py-1 text-xs font-mono outline-none focus:border-blue-400 w-44 placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${filter === 'ALL' ? 'bg-blue-600 text-white font-medium' : 'bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200'}`}
          >
            All ({files.length})
          </button>
          <button
            onClick={() => setFilter('JAVAX')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${filter === 'JAVAX' ? 'bg-red-600 text-white font-medium' : 'bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200'}`}
          >
            javax.* Shifts
          </button>
          <button
            onClick={() => setFilter('RECORDS')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${filter === 'RECORDS' ? 'bg-purple-600 text-white font-medium' : 'bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200'}`}
          >
            Record Candidates
          </button>
          <button
            onClick={() => setFilter('TESTS')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${filter === 'TESTS' ? 'bg-emerald-600 text-white font-medium' : 'bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200'}`}
          >
            Tests
          </button>
        </div>
      </div>

      {/* Files Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3.5">File Path</th>
              <th className="py-2.5 px-3.5">Lines</th>
              <th className="py-2.5 px-3.5">Modernization Findings</th>
              <th className="py-2.5 px-3.5">Target Transformation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredFiles.map((file, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="py-2.5 px-3.5 text-gray-700">
                  {file.filePath}
                </td>
                <td className="py-2.5 px-3.5 text-gray-400">
                  {file.loc} LOC
                </td>
                <td className="py-2.5 px-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {file.hasJavax && (
                      <span className="bg-red-50 text-red-700 border border-red-200 rounded px-1.5 py-0.2 text-[10px]">
                        {file.javaxCount} javax.* imports
                      </span>
                    )}
                    {file.isRecordCandidate && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 rounded px-1.5 py-0.2 text-[10px]">
                        Mutable DTO Candidate
                      </span>
                    )}
                    {file.isTestFile && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-1.5 py-0.2 text-[10px]">
                        JUnit 4 Suite
                      </span>
                    )}
                    {!file.hasJavax && !file.isRecordCandidate && !file.isTestFile && (
                      <span className="text-gray-400 text-[11px]">Standard Java class</span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-3.5">
                  <span className="text-blue-600 font-medium">
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
