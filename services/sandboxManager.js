const fs = require('fs');
const path = require('path');
const os = require('os');

class SandboxManager {
  constructor(baseDir = null) {
    // Default to OS temp directory or user-configured sandbox path
    // Cross-platform compatible (supports Windows and Linux /tmp/legacyx-sandbox)
    if (baseDir) {
      this.baseDir = baseDir;
    } else if (process.env.LEGACYX_SANDBOX_DIR) {
      this.baseDir = process.env.LEGACYX_SANDBOX_DIR;
    } else {
      this.baseDir = path.join(os.tmpdir(), 'legacyx-sandbox');
    }

    this.ensureBaseDir();
  }

  ensureBaseDir() {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * Generates a safe folder name based on a repository URL or name
   */
  getRepoFolderName(repoUrl) {
    if (!repoUrl) return 'legacy-project-' + Date.now();
    const cleanUrl = repoUrl.trim().replace(/\.git$/, '');
    const parts = cleanUrl.split(/[/:]/);
    const repoName = parts[parts.length - 1] || 'repo';
    return repoName.replace(/[^a-zA-Z0-9-_]/g, '_');
  }

  /**
   * Creates or resets an isolated sandbox directory for a given repository
   */
  createSandbox(repoUrl, customId = null) {
    this.ensureBaseDir();
    const folderName = customId ? `session_${customId}` : `${this.getRepoFolderName(repoUrl)}_${Date.now()}`;
    const targetPath = path.join(this.baseDir, folderName);

    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }

    fs.mkdirSync(targetPath, { recursive: true });

    return {
      sandboxId: folderName,
      sandboxPath: targetPath,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Retrieves an existing sandbox path
   */
  getSandboxPath(sandboxId) {
    const fullPath = path.join(this.baseDir, sandboxId);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Sandbox directory not found: ${sandboxId}`);
    }
    return fullPath;
  }

  /**
   * Cleans a specific sandbox directory
   */
  cleanSandbox(sandboxId) {
    const fullPath = path.join(this.baseDir, sandboxId);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      return { success: true, message: `Sandbox ${sandboxId} cleaned successfully.` };
    }
    return { success: false, message: `Sandbox ${sandboxId} did not exist.` };
  }

  /**
   * Cleans all sandboxes older than maxAgeMs (default 24 hours) or completely
   */
  cleanAllSandboxes(forceAll = false, maxAgeMs = 24 * 60 * 60 * 1000) {
    this.ensureBaseDir();
    const entries = fs.readdirSync(this.baseDir, { withFileTypes: true });
    const now = Date.now();
    let cleanedCount = 0;

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const dirPath = path.join(this.baseDir, entry.name);
        try {
          const stats = fs.statSync(dirPath);
          if (forceAll || (now - stats.mtimeMs > maxAgeMs)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
            cleanedCount++;
          }
        } catch (err) {
          console.warn(`Failed to inspect/remove sandbox directory: ${dirPath}`, err.message);
        }
      }
    }

    return {
      success: true,
      cleanedCount,
      sandboxDir: this.baseDir
    };
  }

  /**
   * Returns metadata about current sandboxes
   */
  listSandboxes() {
    this.ensureBaseDir();
    const entries = fs.readdirSync(this.baseDir, { withFileTypes: true });
    const list = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const dirPath = path.join(this.baseDir, entry.name);
        try {
          const stats = fs.statSync(dirPath);
          list.push({
            id: entry.name,
            path: dirPath,
            createdAt: stats.birthtime,
            lastModified: stats.mtime
          });
        } catch {
          // ignore stat errors
        }
      }
    }

    return {
      sandboxCount: list.length,
      baseDir: this.baseDir,
      sandboxes: list
    };
  }
}

module.exports = new SandboxManager();
