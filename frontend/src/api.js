import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // Check backend server health
  checkHealth: async () => {
    try {
      const res = await apiClient.get('/health');
      return { connected: true, data: res.data };
    } catch (err) {
      return { connected: false, error: err.message };
    }
  },

  // Scan repository
  scanRepo: async (repoUrl, branch = '', token = '') => {
    const res = await apiClient.post('/scan', { repoUrl, branch, token });
    return res.data;
  },
  scanRepository: async (repoUrl, branch = '', token = '') => {
    const res = await apiClient.post('/scan', { repoUrl, branch, token });
    return res.data;
  },

  // Run IBM Bob 2.0 Agent refactoring
  refactor: async (sandboxId) => {
    const res = await apiClient.post('/refactor', { sandboxId });
    return res.data;
  },
  refactorSandbox: async (sandboxId) => {
    const res = await apiClient.post('/refactor', { sandboxId });
    return res.data;
  },

  // Get diffs
  getDiffs: async (sandboxId) => {
    const res = await apiClient.get(`/diff/${sandboxId}`);
    return res.data;
  },

  // Run autonomous build-test loop
  buildTest: async (sandboxId, maxRetries = 3) => {
    const res = await apiClient.post('/build-test', { sandboxId, maxRetries });
    return res.data;
  },
  buildAndTestSandbox: async (sandboxId, maxRetries = 3) => {
    const res = await apiClient.post('/build-test', { sandboxId, maxRetries });
    return res.data;
  },

  // Deliver branch & prepare watsonx Slack card
  deliver: async (sandboxId, branchName, commitMessage) => {
    const res = await apiClient.post('/deliver', { sandboxId, branchName, commitMessage });
    return res.data;
  },
  deliverPullRequest: async (sandboxId, branchName, commitMessage) => {
    const res = await apiClient.post('/deliver', { sandboxId, branchName, commitMessage });
    return res.data;
  },

  // List sandboxes
  listSandboxes: async () => {
    const res = await apiClient.get('/sandboxes');
    return res.data;
  },

  // Delete sandbox
  deleteSandbox: async (sandboxId) => {
    const res = await apiClient.delete(`/sandboxes/${sandboxId}`);
    return res.data;
  }
};

export default api;
