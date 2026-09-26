import React, { useState } from 'react';
import { FolderOpen, Trash2, Clock, GitBranch, RefreshCw, X, Server, ExternalLink } from 'lucide-react';
import api from '../api';
import { useToast } from './ToastNotification';

/**
 * SandboxManager — floating panel showing all active sandboxes,
 * allowing the user to switch session or clean one up.
 */
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

  // Load on first open
  React.useEffect(() => { loadSandboxes(); }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.deleteSandbox ? api.deleteSandbox(id) : fetch(`http://localhost:5000/api/sandboxes/${id}`, { method: 'DELETE' });
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-end p-4">
      <div className="bg-carbon-90 border border-carbon-80 w-full max-w-md shadow-carbon-lg flex flex-col" style={{ maxHeight: '90vh' }}>
        
        {/* Header */}
        <div className="p-4 border-b border-carbon-80 bg-carbon-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-carbon-teal-50" />
            <h3 className="text-sm font-bold text-white">Sandbox Session Manager</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadSandboxes}
              title="Refresh sandbox list"
              className="text-carbon-50 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} className="text-carbon-50 hover:text-white transition cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading && (
            <div className="text-center py-8 text-carbon-50 text-xs font-mono">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-carbon-blue-60" />
              Loading sandboxes…
            </div>
          )}

          {!loading && sandboxes?.length === 0 && (
            <div className="text-center py-10 text-xs text-carbon-50">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 text-carbon-70" />
              No active sandboxes on disk.
            </div>
          )}

          {(sandboxes || []).map(sb => {
            const isActive = sb.sandboxId === activeSandboxId;
            return (
              <div
                key={sb.sandboxId}
                className={`border p-3 text-xs font-mono flex flex-col gap-2 cursor-pointer transition ${
                  isActive ? 'border-carbon-blue-60 bg-carbon-blue-80/20' : 'border-carbon-80 bg-carbon-100 hover:border-carbon-70'
                }`}
                onClick={() => onSelectSandbox && onSelectSandbox(sb.sandboxId)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-semibold truncate max-w-[16rem] ${isActive ? 'text-carbon-blue-60' : 'text-white'}`}>
                    {sb.sandboxId}
                  </span>
                  {isActive && (
                    <span className="text-[10px] bg-carbon-blue-60 text-white px-1.5 py-0.5 shrink-0">ACTIVE</span>
                  )}
                </div>
                <div className="text-carbon-50 truncate">
                  {sb.repoUrl || sb.sandboxPath}
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-carbon-60">
                    <Clock className="w-3 h-3" /> {elapsedLabel(sb.createdAt)}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(sb.sandboxId); }}
                    disabled={deleting === sb.sandboxId}
                    className="flex items-center gap-1 text-carbon-50 hover:text-carbon-red-60 transition cursor-pointer disabled:opacity-40"
                  >
                    <Trash2 className={`w-3.5 h-3.5 ${deleting === sb.sandboxId ? 'animate-spin' : ''}`} />
                    <span>Clean</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-carbon-80 bg-carbon-100 text-[10px] text-carbon-60 font-mono">
          Sandboxes stored in <span className="text-carbon-teal-50">/tmp/legacyx-sandbox/</span>
        </div>
      </div>
    </div>
  );
}
