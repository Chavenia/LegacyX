import React, { useState } from 'react';
import { FolderOpen, Trash2, Clock, RefreshCw, X, Server } from 'lucide-react';
import api from '../api';
import { useToast } from './ToastNotification';

export default function SandboxManager({ activeSandboxId, onSelectSandbox, onClose }) {
  const [sandboxes, setSandboxes] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const { toast } = useToast();

  const loadSandboxes = async () => {
    setLoading(true);
    try {
      const data = await api.listSandboxes();
      setSandboxes(data.sandboxes || []);
    } catch {
      toast({ type: 'error', title: 'Sandbox Error', message: 'Could not load sandbox list from backend.' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { loadSandboxes(); }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await (api.deleteSandbox ? api.deleteSandbox(id) : fetch(`http://localhost:5000/api/sandboxes/${id}`, { method: 'DELETE' }));
      setSandboxes(prev => (prev || []).filter(s => s.sandboxId !== id));
      toast({ type: 'success', title: 'Sandbox Cleaned', message: `Sandbox ${id.substring(0, 12)}… removed.` });
    } catch {
      toast({ type: 'error', title: 'Delete Failed', message: 'Could not clean sandbox.' });
    } finally {
      setDeleting(null);
    }
  };

  function elapsedLabel(createdAt) {
    if (!createdAt) return '—';
    const secs = Math.floor((Date.now() - new Date(createdAt)) / 1000);
    if (secs < 60) return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    return `${Math.floor(secs / 3600)}h ago`;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-start justify-end p-4">
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md flex flex-col overflow-hidden shadow-lg" style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="p-3.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-gray-800">Sandbox Session Manager</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadSandboxes}
              title="Refresh sandbox list"
              className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
          {loading && (
            <div className="text-center py-8 text-gray-400 text-xs font-mono">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-400" />
              Loading sandboxes…
            </div>
          )}

          {!loading && sandboxes?.length === 0 && (
            <div className="text-center py-10 text-xs text-gray-400">
              <FolderOpen className="w-7 h-7 mx-auto mb-2 text-gray-300" />
              No active sandboxes on disk.
            </div>
          )}

          {(sandboxes || []).map(sb => {
            const isActive = sb.sandboxId === activeSandboxId;
            return (
              <div
                key={sb.sandboxId}
                className={`border rounded-lg p-2.5 text-xs font-mono flex flex-col gap-1.5 cursor-pointer transition-colors ${
                  isActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => onSelectSandbox && onSelectSandbox(sb.sandboxId)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-medium truncate max-w-[16rem] ${isActive ? 'text-blue-600' : 'text-gray-800'}`}>
                    {sb.sandboxId}
                  </span>
                  {isActive && (
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded shrink-0">ACTIVE</span>
                  )}
                </div>
                <div className="text-gray-400 text-[11px] truncate">
                  {sb.repoUrl || sb.sandboxPath}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1 text-gray-400 text-[10px]">
                    <Clock className="w-3 h-3" /> {elapsedLabel(sb.createdAt)}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(sb.sandboxId); }}
                    disabled={deleting === sb.sandboxId}
                    className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-40 text-[11px]"
                  >
                    <Trash2 className={`w-3 h-3 ${deleting === sb.sandboxId ? 'animate-spin' : ''}`} />
                    <span>Clean</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-400 font-mono">
          Sandboxes stored in <span className="text-blue-500">/tmp/legacyx-sandbox/</span>
        </div>
      </div>
    </div>
  );
}
