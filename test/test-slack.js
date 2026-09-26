'use strict';

/**
 * test/test-slack.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Deliverable 3 — watsonx Orchestrate Slack Approval Gateway
 * Integration test for services/slackGateway.js
 *
 * Run with:   node test/test-slack.js
 *
 * The test exercises four scenarios without requiring a live Slack webhook:
 *   1. Dry-run delivery with realistic enterprise scan metrics
 *   2. Dry-run with a perfect post-modernization score (0 risk)
 *   3. buildAuditCardPayload() structure validation (Block Kit schema check)
 *   4. Missing/partial payload graceful defaults
 *
 * If SLACK_WEBHOOK_URL is set in .env, scenario 1 also attempts live delivery
 * and reports the HTTP response status.
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const { sendAuditCard, buildAuditCardPayload } = require('../services/slackGateway');

// ── ANSI helpers ──────────────────────────────────────────────────────────────
const c = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
  dim:    s => `\x1b[2m${s}\x1b[0m`,
};

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ${c.green('✓')} ${message}`);
    passed++;
  } else {
    console.log(`  ${c.red('✗')} ${message}`);
    failed++;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const DIVIDER = '═'.repeat(72);
  console.log(`\n${DIVIDER}`);
  console.log(c.bold('   🧪  LegacyX — Deliverable 3: Slack Gateway Integration Test'));
  console.log(`${DIVIDER}\n`);

  // ── Scenario 1: Full enterprise scan payload (dry-run) ───────────────────
  console.log(c.cyan('[Scenario 1] Full enterprise scan metrics — sendAuditCard()'));
  const enterprisePayload = {
    repoUrl:          'https://github.com/enterprise/order-service',
    sandboxId:        'legacyx-1701234567890-order-service',
    preFlightScore:   95,
    postFlightScore:  0,
    targetPlatform:   'Java 21 LTS + Spring Boot 3.3.4 + Jakarta EE 10',
    cveResolvedCount: 9,
    testsPassed:      '8/8 Passed',
    prUrl:            'https://github.com/enterprise/order-service/pull/42',
  };

  try {
    const result = await sendAuditCard(enterprisePayload);
    assert(result.success === true,           'result.success is true');
    assert(typeof result.mode === 'string',   'result.mode is a string');
    assert(result.payload !== null,           'result.payload is present');
    assert(result.payload.blocks?.length > 0, 'Block Kit payload has blocks');
    console.log(`  ${c.dim(`mode: "${result.mode}"`)}\n`);
  } catch (err) {
    console.log(`  ${c.red('✗')} sendAuditCard threw unexpectedly: ${err.message}`);
    failed++;
    console.log('');
  }

  // ── Scenario 2: Zero-risk post-modernization score ───────────────────────
  console.log(c.cyan('[Scenario 2] Zero-risk post-modernization card'));
  try {
    const result = await sendAuditCard({
      repoUrl:          'https://github.com/acme/payment-gateway',
      sandboxId:        'legacyx-9999-payment',
      preFlightScore:   72,
      postFlightScore:  0,
      targetPlatform:   'Java 21 LTS + Spring Boot 3.3.4 + Jakarta EE 10',
      cveResolvedCount: 4,
      testsPassed:      '24/24 Passed',
      prUrl:            'https://github.com/acme/payment-gateway/pull/7',
    });
    assert(result.success === true,    'zero-risk card delivered successfully');
    assert(result.mode !== undefined,  'mode field present');
    console.log('');
  } catch (err) {
    console.log(`  ${c.red('✗')} Scenario 2 threw: ${err.message}\n`);
    failed++;
  }

  // ── Scenario 3: Block Kit structure validation ───────────────────────────
  console.log(c.cyan('[Scenario 3] buildAuditCardPayload() — Block Kit schema validation'));
  const payload = buildAuditCardPayload({
    repoUrl:          'https://github.com/sample/repo',
    sandboxId:        'legacyx-test-123',
    preFlightScore:   88,
    postFlightScore:  5,
    targetPlatform:   'Java 21 LTS + Spring Boot 3.3.4 + Jakarta EE 10',
    cveResolvedCount: 6,
    testsPassed:      '12/12 Passed',
    prUrl:            'https://github.com/sample/repo/pull/3',
  });

  assert(typeof payload === 'object',                          'payload is an object');
  assert(typeof payload.text === 'string',                     'fallback text field present');
  assert(Array.isArray(payload.blocks),                        'blocks is an array');

  const header  = payload.blocks.find(b => b.type === 'header');
  assert(header !== undefined,                                  'header block present');
  assert(header.text?.text?.includes('LegacyX'),               'header text mentions LegacyX');

  const section = payload.blocks.find(b => b.type === 'section' && b.fields);
  assert(section !== undefined,                                 'fields section present');
  assert(Array.isArray(section.fields),                         'fields is an array');
  assert(section.fields.length >= 4,                           'at least 4 field items');

  const repoField = section.fields.find(f => f.text?.includes('Repository'));
  assert(repoField !== undefined,                               'Repository field present');
  assert(repoField.text.includes('github.com/sample/repo'),    'Repository field has correct URL');

  const scoreField = section.fields.find(f => f.text?.includes('Risk Score'));
  assert(scoreField !== undefined,                              'Risk Score field present');
  assert(scoreField.text.includes('88/100'),                   'pre-flight score in Risk Score field');
  assert(scoreField.text.includes('5/100'),                    'post-flight score in Risk Score field');

  const cveField = section.fields.find(f => f.text?.includes('Security'));
  assert(cveField !== undefined,                                'Security Patches field present');
  assert(cveField.text.includes('6 CVEs Resolved'),            'CVE count is correct');

  const actions = payload.blocks.find(b => b.type === 'actions');
  assert(actions !== undefined,                                 'actions block present');
  assert(Array.isArray(actions.elements),                      'action elements is an array');
  assert(actions.elements.length >= 2,                         'at least 2 action buttons');

  const approveBtn = actions.elements.find(e => e.action_id === 'legacyx_approve_pr');
  assert(approveBtn !== undefined,                              '"Approve & Merge PR" button present');
  assert(approveBtn.style === 'primary',                       '"Approve" button has primary style');
  assert(approveBtn.url === 'https://github.com/sample/repo/pull/3', 'PR URL set correctly on button');

  const diffBtn = actions.elements.find(e => e.action_id === 'legacyx_view_diffs');
  assert(diffBtn !== undefined,                                 '"View AST Diffs" button present');
  assert(diffBtn.url.includes('/api/diff/legacyx-test-123'),   'Diffs URL contains sandboxId');
  console.log('');

  // ── Scenario 4: Graceful defaults with missing / partial payload ──────────
  console.log(c.cyan('[Scenario 4] Graceful defaults — empty summaryPayload'));
  try {
    const result = await sendAuditCard({});
    assert(result.success === true,            'empty payload: success true');
    assert(result.payload.blocks?.length > 0,  'empty payload: blocks generated');
    const s4section = result.payload.blocks.find(b => b.type === 'section' && b.fields);
    assert(s4section !== undefined,            'empty payload: section rendered');
    console.log('');
  } catch (err) {
    console.log(`  ${c.red('✗')} Scenario 4 threw: ${err.message}\n`);
    failed++;
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(DIVIDER);
  const total = passed + failed;
  if (failed === 0) {
    console.log(c.green(c.bold(`   🎉  ALL ${total} ASSERTIONS PASSED — Slack Gateway: READY`)));
    console.log(c.dim('   Set SLACK_WEBHOOK_URL in .env to switch from dry-run to live delivery.'));
  } else {
    console.log(c.red(c.bold(`   ❌  ${failed} of ${total} assertions FAILED`)));
    console.log(c.yellow('   Review the output above and fix the flagged issues.'));
  }
  console.log(`${DIVIDER}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error(c.red('\n[test-slack] Unhandled error:'), err);
  process.exit(1);
});
