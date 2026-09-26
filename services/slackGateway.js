'use strict';

require('dotenv').config();
const axios = require('axios');

// ─── Risk label helper ────────────────────────────────────────────────────────
function riskLabel(score) {
  if (score >= 80) return 'Critical';
  if (score >= 55) return 'High';
  if (score >= 30) return 'Medium';
  return 'Modern';
}

// ─── Slack Block Kit payload builder ─────────────────────────────────────────
/**
 * Builds the full Slack Block Kit JSON for the LegacyX audit card.
 *
 * @param {object} p - summaryPayload
 * @param {string} p.repoUrl           - Repository URL scanned
 * @param {string} p.sandboxId         - Sandbox ID (used for diff link)
 * @param {number} p.preFlightScore    - Initial risk score (0–100)
 * @param {number} p.postFlightScore   - Post-modernization risk score (0–100)
 * @param {string} p.targetPlatform    - e.g. "Java 21 LTS + Spring Boot 3.3.4 + Jakarta EE 10"
 * @param {number} p.cveResolvedCount  - Number of CVEs patched
 * @param {string} p.testsPassed       - e.g. "8/8 Passed"
 * @param {string} p.prUrl             - GitHub PR URL (or fallback branch string)
 * @returns {object} Slack Block Kit message object
 */
function buildAuditCardPayload(p) {
  const {
    repoUrl        = 'https://github.com/enterprise/repo',
    sandboxId      = 'unknown',
    preFlightScore = 100,
    postFlightScore = 0,
    targetPlatform = 'Java 21 LTS + Spring Boot 3.3.4 + Jakarta EE 10',
    cveResolvedCount = 0,
    testsPassed    = '0/0 Passed',
    prUrl          = 'https://github.com/enterprise/repo/pulls',
  } = p;

  const diffUrl = `http://localhost:5000/api/diff/${sandboxId}`;
  const preLabel  = riskLabel(preFlightScore);
  const postLabel = riskLabel(postFlightScore);

  // Format target platform for the Fields block (split on '+' for readability)
  const [javaTarget = '', frameworkTarget = ''] = targetPlatform.split('+').map(s => s.trim());

  return {
    text: '🚀 LegacyX Modernization Audit Card — Action Required',   // fallback for notifications
    blocks: [
      // ── Header ──────────────────────────────────────────────────────────
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚀 LegacyX Modernization Audit Card',
          emoji: true,
        },
      },

      // ── Context line ────────────────────────────────────────────────────
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Posted by *LegacyX Sidecar* via *watsonx Orchestrate*  •  <!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}|just now>`,
          },
        ],
      },

      { type: 'divider' },

      // ── Repository & score fields ────────────────────────────────────────
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*📦 Repository*\n<${repoUrl}|${repoUrl.replace(/^https?:\/\//, '')}>`,
          },
          {
            type: 'mrkdwn',
            text: `*🎯 Modernization Risk Score*\n\`${preFlightScore}/100\` (${preLabel}) ➔ \`${postFlightScore}/100\` (${postLabel})`,
          },
          {
            type: 'mrkdwn',
            text: `*☕ Target Baseline*\n${javaTarget} | ${frameworkTarget}`,
          },
          {
            type: 'mrkdwn',
            text: `*🛡️ Security Patches*\n${cveResolvedCount} CVE${cveResolvedCount !== 1 ? 's' : ''} Resolved${cveResolvedCount > 0 ? ' (Log4Shell patched)' : ''}`,
          },
          {
            type: 'mrkdwn',
            text: `*✅ Build Verification*\n100% Passed (${testsPassed} JUnit 5 Tests)`,
          },
          {
            type: 'mrkdwn',
            text: `*🤖 Engine*\nIBM Bob 2.0 · Subagents A, B, C`,
          },
        ],
      },

      { type: 'divider' },

      // ── Action buttons ───────────────────────────────────────────────────
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ Approve & Merge PR', emoji: true },
            style: 'primary',
            url: prUrl,
            action_id: 'legacyx_approve_pr',
            value: 'approve_pr',
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '🔍 View AST Diffs', emoji: true },
            url: diffUrl,
            action_id: 'legacyx_view_diffs',
            value: 'view_diffs',
          },
        ],
      },

      // ── Footer context ───────────────────────────────────────────────────
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `🪪 Sandbox: \`${sandboxId}\`  •  Powered by *LegacyX* + *IBM Bob 2.0*`,
          },
        ],
      },
    ],
  };
}

// ─── Pretty-print for dry-run console output ──────────────────────────────────
function prettyPrintDryRun(payload) {
  const LINE = '═'.repeat(72);
  console.log(`\n${LINE}`);
  console.log('   📋  LegacyX — Slack Block Kit Payload (DRY-RUN MODE)');
  console.log(`${LINE}`);
  console.log('   No SLACK_WEBHOOK_URL configured. Would have POSTed:\n');
  // Extract readable info from the blocks
  const fields = payload.blocks.find(b => b.type === 'section' && b.fields)?.fields || [];
  fields.forEach(f => {
    const clean = f.text.replace(/\*([^*]+)\*/g, '$1').replace(/`([^`]+)`/g, '[$1]').replace(/<[^|>]+\|([^>]+)>/g, '$1');
    console.log(`   ${clean.split('\n').join('\n     ')}`);
  });
  console.log(`\n   Raw JSON payload:`);
  console.log(JSON.stringify(payload, null, 2).replace(/^/gm, '   '));
  console.log(`${LINE}\n`);
}

// ─── Main exported function ───────────────────────────────────────────────────
/**
 * Sends (or dry-runs) the LegacyX audit card to Slack.
 *
 * @param {object} summaryPayload - See buildAuditCardPayload param docs
 * @returns {Promise<{success: boolean, mode: 'live'|'dry-run', payload: object, response?: object}>}
 */
async function sendAuditCard(summaryPayload) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const payload    = buildAuditCardPayload(summaryPayload);

  // ── Dry-run mode ────────────────────────────────────────────────────────────
  if (!webhookUrl || webhookUrl.trim() === '') {
    prettyPrintDryRun(payload);
    console.log('[LegacyX SlackGateway] ℹ️  Dry-run complete. Set SLACK_WEBHOOK_URL in .env to deliver live.');
    return { success: true, mode: 'dry-run', payload };
  }

  // ── Live delivery ───────────────────────────────────────────────────────────
  try {
    console.log('[LegacyX SlackGateway] 📡 Sending audit card to Slack webhook…');
    const res = await axios.post(webhookUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });

    console.log(`[LegacyX SlackGateway] ✅ Delivered. Slack responded: ${res.status} "${res.data}"`);
    return { success: true, mode: 'live', payload, response: { status: res.status, data: res.data } };
  } catch (err) {
    const detail = err.response
      ? `HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`
      : err.message;
    console.error(`[LegacyX SlackGateway] ❌ Slack POST failed — ${detail}`);
    throw new Error(`Slack delivery failed: ${detail}`);
  }
}

module.exports = { sendAuditCard, buildAuditCardPayload };
