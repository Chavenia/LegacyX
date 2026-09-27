/**
 * LegacyX Presentation Voiceover Script & Scene Metadata for Remotion
 * Total: 7 scenes · 3 min (180s) · 5,400 frames @ 30fps
 */

export const VOICEOVER_SCENES = [
  {
    id: 'scene1',
    sceneNumber: 1,
    title: 'The Enterprise Java Modernization Challenge',
    timeRange: '0:00 – 0:25',
    startFrame: 0,
    durationInFrames: 750,
    targetDurationSec: 25,
    suggestedVoice: 'Charon',
    audioTag: '[serious]',
    audioFile: 'audio/scene1.wav',
    directorNotes: 'Pause briefly on each card before the banner appears. Let the 97.5% Faster Delivery metric land before cutting to scene 2.',
    dialogText: `Meet the problem every enterprise already knows. Over sixty-five percent of enterprise Java workloads are still locked to Java 8 or 11 — not by choice, but because the cost of migration has always outweighed the benefit. Critical CVEs like Log4Shell and Spring4Shell are sitting unpatched in production. We're talking CVSS ten-point-zero vulnerabilities with known public exploits, exposed to the open internet. And when engineering teams finally decide to act, a typical migration consumes six to eighteen months of developer time — just to move one repository. LegacyX eliminates that toil entirely. Multi-agent AST orchestration, deterministic build loops, and governance gates — delivering a ninety-seven-point-five percent faster migration cycle.`
  },
  {
    id: 'scene2',
    sceneNumber: 2,
    title: 'Dual-Layer Architecture & Pipeline',
    timeRange: '0:25 – 0:50',
    startFrame: 750,
    durationInFrames: 750,
    targetDurationSec: 25,
    suggestedVoice: 'Charon',
    audioTag: '[authoritative]',
    audioFile: 'audio/scene2.wav',
    directorNotes: 'Point to the pipeline step numbers as you name each one. Emphasise "isolated" and "governed".',
    dialogText: `LegacyX is built on two complementary layers. Layer one is the governance and visual interface — a React and Express control plane that handles repository ingestion, real-time risk scoring, an interactive diff viewer, and Slack-based approval gates. Everything a developer or architect needs to stay in control. Layer two is the execution engine, powered by IBM Bob 2.0. This is where the actual refactoring happens — isolated sandboxes, deep AST and POM parsing, and a coordinated swarm of three subagents running in parallel. Together, they form a five-step pipeline: repository ingestion, deep scan and scoring, multi-agent refactoring, deterministic build verification, and final Slack delivery with pull request creation. Every step is automated. Every step is governed.`
  },
  {
    id: 'scene3',
    sceneNumber: 3,
    title: 'Pre-Flight Scan & Risk Scorecard',
    timeRange: '0:50 – 1:20',
    startFrame: 1500,
    durationInFrames: 900,
    targetDurationSec: 30,
    suggestedVoice: 'Charon',
    audioTag: '[serious]',
    audioFile: 'audio/scene3.wav',
    directorNotes: 'The gauge animation runs as you speak. Time the "twenty-four out of one hundred" line to land as the gauge stops. The "320 hours" stat creates a strong ROI contrast — linger on it.',
    dialogText: `We point LegacyX at a real enterprise repository — account-service, branch main — and trigger the pre-flight scan. In seconds, the AST engine parses all forty-eight Java source files and the full Maven dependency graph. It applies forty-seven modernization rules and returns a score. This repository scores twenty-four out of one hundred. That's a critical debt rating. On the right, we can see exactly why: the service is running Java 8 with Spring Boot 2.7, using the old javax-dot-star namespace. It has four end-of-life dependencies, and the scanner has flagged four critical CVEs — including Log4Shell at CVSS ten-point-zero. If this were done manually, it would cost an estimated three hundred and twenty developer hours across one hundred and forty-two source files. LegacyX's OpenRewrite recipe is already queued and ready for execution.`
  },
  {
    id: 'scene4',
    sceneNumber: 4,
    title: 'IBM Bob 2.0 Multi-Agent Modernization Swarm',
    timeRange: '1:20 – 1:55',
    startFrame: 2400,
    durationInFrames: 1050,
    targetDurationSec: 35,
    suggestedVoice: 'Charon',
    audioTag: '[excitedly]',
    audioFile: 'audio/scene4.wav',
    directorNotes: 'Match pacing to the terminal scroll — the three-colour log output (blue/purple/green per agent) visually reinforces the parallel nature of the swarm. This is the demo\'s technical centrepiece; take your time.',
    dialogText: `Now Bob 2.0 takes over. Three specialised subagents are dispatched simultaneously into the isolated sandbox. Subagent Alpha is the AST core. It's scanning every Java source file, converting mutable POJOs into immutable Java 21 records, migrating all javax-dot-star imports to jakarta-dot-star, and replacing deprecated API calls with their modern equivalents. Subagent Beta owns the dependency graph. It's upgrading the Spring Boot parent POM from 2.1.8 to 3.3.4, bumping the Maven compiler release to Java 21, and — critically — patching the Log4j CVE by upgrading to version 2.23.1. Subagent Gamma handles the test suite. JUnit 4 annotations are being rewritten to JUnit Jupiter, lifecycle hooks like @Before become @BeforeEach, and Mockito 2 is upgraded to Mockito 5 with full Java 21 compatibility. You're watching one hundred and forty-two AST transformations happen autonomously — live, in real time.`
  },
  {
    id: 'scene5',
    sceneNumber: 5,
    title: 'Side-by-Side AST Code Diff Viewer',
    timeRange: '1:55 – 2:25',
    startFrame: 3450,
    durationInFrames: 900,
    targetDurationSec: 30,
    suggestedVoice: 'Charon',
    audioTag: '[analytical]',
    audioFile: 'audio/scene5.wav',
    directorNotes: 'The tab switches automatically mid-scene. Align the pom.xml commentary to the second half. The red/green colour coding makes the changes self-evident — keep commentary concise.',
    dialogText: `Let's look at what the agents actually changed. On the left: the legacy AccountDto class. Forty-eight lines of mutable boilerplate — a standard Java 8 POJO with getters, setters, and a manual equals and hashCode. It imports from the old javax.persistence and javax.validation namespaces. On the right: the modernized version. The entire class is now a single Java 21 record — five lines. Immutable by default. Thread-safe. Zero boilerplate. And the imports have been migrated to jakarta.persistence and jakarta.validation. That's a seventy-percent reduction in code, with no loss of functionality. Switching to the POM — on the left, Spring Boot 2.1.8 and Java 8 with the Log4Shell vulnerability sitting in plain sight. On the right, Spring Boot 3.3.4, Java 21 LTS, and Log4j bumped to 2.23.1 — zero critical CVEs remaining.`
  },
  {
    id: 'scene6',
    sceneNumber: 6,
    title: 'Autonomous Build-Test Verification Loop',
    timeRange: '2:25 – 2:45',
    startFrame: 4350,
    durationInFrames: 600,
    targetDurationSec: 20,
    suggestedVoice: 'Charon',
    audioTag: '[confident]',
    audioFile: 'audio/scene6.wav',
    directorNotes: 'Time "zero regressions" to coincide with the BUILD SUCCESS line appearing in the terminal. The "1 Attempt" card on the right reinforces the deterministic convergence story — reference it directly.',
    dialogText: `With the refactoring complete, LegacyX runs a full mvn clean test inside the isolated sandbox — no human involvement, no manual trigger. javac 21 compiles eighteen source files. Zero errors. Zero warnings. JUnit 5 Jupiter fires up the surefire runner. AccountServiceTest: eighteen tests, zero failures. AccountControllerTest: sixteen tests, zero failures. Total: thirty-four tests run, zero regressions, in under four seconds. Code coverage integrity sits at ninety-eight-point-four percent. And if compilation or a test had failed? Bob 2.0 would have inspected the surefire report, generated a targeted AST delta patch, and re-run — automatically. In this case, the OpenRewrite recipe converged on the first attempt.`
  },
  {
    id: 'scene7',
    sceneNumber: 7,
    title: 'Slack Delivery, Governance Approval & Outro',
    timeRange: '2:45 – 3:00',
    startFrame: 4950,
    durationInFrames: 450,
    targetDurationSec: 15,
    suggestedVoice: 'Charon',
    audioTag: '[triumphant]',
    audioFile: 'audio/scene7.wav',
    directorNotes: 'Let the finale title card hold for 2–3 seconds of silence before audio out. The GitHub URL should be the last spoken word — it is the call to action.',
    dialogText: `The final step is delivery. LegacyX posts a Block Kit governance card directly to Slack — with the full audit trail, test results, and a one-click 'Approve and Merge' button ready for the compliance officer or engineering lead. The modernization score has moved from twenty-four to ninety-eight out of one hundred. The runtime is confirmed as Java 21 LTS with Spring Boot 3.3.4. Critical CVE count: zero. Pull Request forty-two is staged and waiting. No manual toil. No regression risk. Fully auditable for SOC2 and FedRAMP compliance. Zero regressions. One hundred percent deterministic. This is LegacyX — enterprise Java modernization from Java 8 and 11 to Java 21 LTS and Spring Boot 3, fully automated, powered by IBM Bob 2.0. Open source on GitHub at github.com/Chavenia/LegacyX.`
  }
];
