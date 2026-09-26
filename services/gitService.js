const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitService {
  /**
   * Formats repository URL with authentication token if provided
   */
  formatAuthenticatedUrl(repoUrl, token) {
    if (!token) return repoUrl;

    try {
      const urlObj = new URL(repoUrl);
      // For GitHub / GitLab / Bitbucket OAuth or PAT
      urlObj.username = 'x-access-token';
      urlObj.password = token;
      return urlObj.toString();
    } catch {
      // If not a standard URL, return original
      return repoUrl;
    }
  }

  /**
   * Clones a repository into a specified target directory
   */
  async cloneRepository(repoUrl, targetDir, options = {}) {
    const { token = null, branch = null, depth = 1 } = options;

    if (!repoUrl) {
      throw new Error('Repository URL is required');
    }

    // Handle special built-in sample repo request
    if (repoUrl.startsWith('sample:') || repoUrl === 'demo') {
      const samplePath = path.join(__dirname, '..', 'samples', 'legacy-spring-app');
      if (fs.existsSync(samplePath)) {
        this.copyRecursiveSync(samplePath, targetDir);
        this.initGitRepo(targetDir);
        return {
          cloned: true,
          isSample: true,
          commitHash: 'demo-initial-commit',
          repoUrl,
          targetDir
        };
      }
    }

    // Handle local file / folder path if passed
    if (repoUrl.startsWith('file://') || (fs.existsSync(repoUrl) && fs.statSync(repoUrl).isDirectory())) {
      const srcPath = repoUrl.replace('file://', '');
      this.copyRecursiveSync(srcPath, targetDir);
      return {
        cloned: true,
        isLocal: true,
        commitHash: 'local-dir',
        repoUrl,
        targetDir
      };
    }

    const authUrl = this.formatAuthenticatedUrl(repoUrl, token || process.env.GITHUB_TOKEN);
    const depthFlag = depth ? `--depth ${depth}` : '';
    const cleanBranch = (branch && branch.trim() !== '' && branch !== 'default' && branch !== 'auto') ? branch.trim() : null;

    let branchFlag = cleanBranch ? `--branch ${cleanBranch}` : '';
    let cloneCmd = `git clone ${depthFlag} ${branchFlag} "${authUrl}" "${targetDir}"`.trim();

    try {
      // Execute git clone
      execSync(cloneCmd, {
        stdio: 'pipe',
        timeout: 120000,
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
      });
    } catch (err) {
      // If a specific branch was attempted and failed (e.g. main vs master), retry with the repository's default branch
      if (cleanBranch) {
        console.warn(`[LegacyX Git] Clone with branch '${cleanBranch}' failed. Retrying with remote default branch...`);
        try { fs.rmSync(targetDir, { recursive: true, force: true }); } catch {}
        try {
          const fallbackCmd = `git clone ${depthFlag} "${authUrl}" "${targetDir}"`.trim();
          execSync(fallbackCmd, {
            stdio: 'pipe',
            timeout: 120000,
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
          });
        } catch (fallbackErr) {
          const safeMessage = (fallbackErr.stderr ? fallbackErr.stderr.toString() : fallbackErr.message).replace(/https:\/\/[^@]+@/g, 'https://***@');
          throw new Error(`Git clone failed: ${safeMessage}`);
        }
      } else {
        const safeMessage = (err.stderr ? err.stderr.toString() : err.message).replace(/https:\/\/[^@]+@/g, 'https://***@');
        throw new Error(`Git clone failed: ${safeMessage}`);
      }
    }

    let commitHash = 'unknown';
    let resolvedBranch = cleanBranch || 'default';
    try {
      commitHash = execSync('git rev-parse HEAD', { cwd: targetDir, encoding: 'utf8' }).trim();
      resolvedBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: targetDir, encoding: 'utf8' }).trim();
    } catch {
      // ignore rev-parse error
    }

    return {
      cloned: true,
      commitHash,
      branch: resolvedBranch,
      repoUrl,
      targetDir
    };
  }

  /**
   * Initializes git repository if missing (used for samples or mock repositories)
   */
  initGitRepo(dir) {
    try {
      if (!fs.existsSync(path.join(dir, '.git'))) {
        execSync('git init', { cwd: dir, stdio: 'ignore' });
        execSync('git config user.name "LegacyX Modernizer"', { cwd: dir, stdio: 'ignore' });
        execSync('git config user.email "legacyx-bot@watsonx.local"', { cwd: dir, stdio: 'ignore' });
        execSync('git add -A', { cwd: dir, stdio: 'ignore' });
        execSync('git commit -m "initial legacy baseline commit"', { cwd: dir, stdio: 'ignore' });
      }
    } catch (err) {
      console.warn(`Failed to initialize git repository at ${dir}:`, err.message);
    }
  }

  /**
   * Creates and checks out a new branch for the modernization PR
   */
  createBranch(targetDir, branchName = 'feature/legacyx-modernization') {
    try {
      // Check if branch exists
      const currentBranches = execSync('git branch --list', { cwd: targetDir, encoding: 'utf8' });
      if (currentBranches.includes(branchName)) {
        execSync(`git checkout ${branchName}`, { cwd: targetDir, stdio: 'ignore' });
      } else {
        execSync(`git checkout -b ${branchName}`, { cwd: targetDir, stdio: 'ignore' });
      }
      return { success: true, branch: branchName };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Stages all changes, creates a commit, and prepares for PR
   */
  commitChanges(targetDir, commitMessage = 'feat(legacyx): automated modernization to Java 21, Spring Boot 3 & Jakarta EE') {
    try {
      execSync('git config user.name "LegacyX Bot"', { cwd: targetDir, stdio: 'ignore' });
      execSync('git config user.email "bot@legacyx.internal"', { cwd: targetDir, stdio: 'ignore' });
      execSync('git add -A', { cwd: targetDir, stdio: 'ignore' });

      // Check if there are changes to commit
      const status = execSync('git status --porcelain', { cwd: targetDir, encoding: 'utf8' });
      if (!status.trim()) {
        return { committed: false, message: 'No changes detected to commit' };
      }

      execSync(`git commit -m "${commitMessage}"`, { cwd: targetDir, stdio: 'ignore' });
      const newHash = execSync('git rev-parse HEAD', { cwd: targetDir, encoding: 'utf8' }).trim();

      return {
        committed: true,
        commitHash: newHash,
        message: commitMessage
      };
    } catch (err) {
      return { committed: false, error: err.message };
    }
  }

  /**
   * Pushes the modernization branch to remote
   */
  pushBranch(targetDir, branchName = 'feature/legacyx-modernization', remote = 'origin') {
    try {
      const pushCmd = `git push -u ${remote} ${branchName}`;
      execSync(pushCmd, { cwd: targetDir, stdio: 'pipe' });
      return { pushed: true, branch: branchName };
    } catch (err) {
      return { pushed: false, error: err.message };
    }
  }

  /**
   * Helper to recursively copy directories
   */
  copyRecursiveSync(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === '.git' || entry.name === 'target' || entry.name === 'node_modules') {
          continue;
        }
        this.copyRecursiveSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

module.exports = new GitService();
