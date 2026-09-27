# ⚡ LegacyX — AI-Powered Java Modernization Engine

<p align="center">
  <img src="https://img.shields.io/badge/Java-8%2F11%20→%2021%20LTS-orange?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Boot-2%20→%203.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/javax.*%20→%20jakarta.*-Automated-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/IBM%20Bob%202.0-Multi--Agent-0f62fe?style=for-the-badge&logo=ibm&logoColor=white" />
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge" />
</p>

<p align="center">
  <b>LegacyX</b> is an autonomous developer governance sidecar that migrates, refactors, and security-patches legacy enterprise Java applications — fully automated, end-to-end, without manual toil.
</p>

---

## 🚨 The Problem

> **65%+ of enterprise workloads remain locked to Java 8/11 and Spring Boot 2.**

Manual migrations are expensive, risky, and slow:

| Pain Point | Reality |
| :--- | :--- |
| 🔴 **Namespace breakage** | `javax.*` → `jakarta.*` touches every layer of the stack |
| 🔴 **Security exposure** | Unpatched CVEs like Log4Shell (CVSS 10.0) live undetected for months |
| 🔴 **Engineering toil** | 6–18 months of developer hours per repository, per migration |
| 🔴 **No governance gate** | No automated scoring, no audit trail, no human-in-the-loop approval |

**LegacyX solves all four.** It orchestrates IBM Bob 2.0 subagents to scan, score, refactor, verify, and deliver a GitHub Pull Request — with a Slack approval gate powered by watsonx Orchestrate — in a single pipeline run.

---

## 🏛️ System Architecture

LegacyX operates as a three-layer pipeline:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LAYER 1 — REUSABLE WEB DASHBOARD                   │
│              (React + Vite · IBM Carbon Dark Mode · Monaco Diff Viewer)      │
│                                                                               │
│  ┌──────────────────┐  ┌──────────────────────┐  ┌────────────────────────┐ │
│  │  RepoInput       │  │ ModernizationScorecard│  │  DiffViewer (Monaco)   │ │
│  │  Any GitHub /    │  │ 0–100 Risk Index      │  │  Red: javax (legacy)   │ │
│  │  GitLab URL +PAT │  │ CVE Counter · Effort  │  │  Green: jakarta (modern│ │
│  └──────────────────┘  └──────────────────────┘  └────────────────────────┘ │
│  ┌──────────────────┐  ┌──────────────────────┐  ┌────────────────────────┐ │
│  │  BobAgentConsole │  │  BuildTestConsole     │  │  WatsonxSlackModal     │ │
│  │  Live subagent   │  │  mvn clean test       │  │  Slack Block Kit card  │ │
│  │  log stream      │  │  output stream        │  │  preview & dispatch    │ │
│  └──────────────────┘  └──────────────────────┘  └────────────────────────┘ │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │  REST API  (http://localhost:5000)
┌─────────────────────────────────▼───────────────────────────────────────────┐
│                        LAYER 2 — BACKEND API ENGINE                          │
│                         (Node.js · Express · port 5000)                      │
│                                                                               │
│  sandboxManager → gitService → pomParser → astParser → vulnerabilityService  │
│                            ↓                                                  │
│                        riskScorer  (0–100 Pre-Flight Scorecard)               │
│                            ↓                                                  │
│              bobEngine  [Subagent A | Subagent B | Subagent C]                │
│                            ↓                                                  │
│                        buildRunner  (mvn clean test loop)                     │
│                            ↓                                                  │
│                 gitService.createBranch → commitChanges → slackGateway        │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │  Slack Webhook / watsonx Orchestrate
┌─────────────────────────────────▼───────────────────────────────────────────┐
│                    LAYER 3 — WATSONX ORCHESTRATE & SLACK GATEWAY             │
│                                                                               │
│  Block Kit Audit Card  →  [✅ Approve & Merge PR]  [🔍 View AST Diffs]      │
│  Pre-flight score · Post-flight score · CVEs resolved · Tests passed          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🤖 IBM Bob 2.0 Multi-Agent Refactoring Engine
Three autonomous subagents execute in parallel, each owning a dedicated transformation domain:

| Subagent | Responsibility | What It Does |
| :---: | :--- | :--- |
| **A** | Namespace & Records | Shifts all `javax.*` → `jakarta.*` packages; converts mutable DTO POJOs into immutable Java 21 Records; replaces deprecated boxed-primitive constructors (`new Integer(x)` → `Integer.valueOf(x)`) |
| **B** | Maven / Dependencies | Upgrades `pom.xml`: sets `<java.version>21</java.version>`, bumps `spring-boot-starter-parent` to `3.3.4`, replaces `javax.*` Maven coords with Jakarta EE 10 equivalents, bumps `maven-compiler-plugin` to `3.13.0` |
| **C** | Test Suite Migration | Migrates JUnit 4 → JUnit 5 Jupiter: `@Before/@After` → `@BeforeEach/@AfterEach`, `@BeforeClass/@AfterClass` → `@BeforeAll/@AfterAll`, `Assert.*` → `Assertions.*` |

### 📊 Pre-Flight Modernization Risk Score (0–100)
A composite 4-factor scorecard calculated before any transformation:

```
Risk Score = Java Runtime Gap (30pts)
           + Namespace & Framework Debt (35pts)
           + Security Vulnerabilities (20pts)
           + Test & Architecture Debt (15pts)
```

| Score Range | Risk Level | Meaning |
| :--- | :--- | :--- |
| 75–100 | 🔴 CRITICAL | End-of-life runtime + CVEs + full namespace overhaul required |
| 50–74  | 🟠 HIGH     | Major framework upgrade with security exposure |
| 25–49  | 🟡 MEDIUM   | Moderate namespace or test suite migration needed |
| 0–24   | 🟢 LOW      | Minor delta to Java 21 target |

### 🛡️ CVE Security Intelligence (Dual-Source)
- **Local catalog:** Log4Shell (CVE-2021-44228, CVSS 10.0), Spring4Shell (CVE-2022-22965, CVSS 9.8), Jackson Databind (CVE-2019-12384), SnakeYAML (CVE-2022-1471)
- **Live API:** [Google OSV](https://osv.dev/) queried per dependency at scan time, with graceful offline fallback

### 🔁 Autonomous Build-Test-Fix Loop
`buildRunner` executes `mvn clean test` in a retry loop (up to 3 attempts by default). On failure it:
1. Diagnoses the compiler error (`package javax.* does not exist`)
2. Auto-applies corrective patches across the sandbox tree
3. Re-runs until `BUILD SUCCESS` or retry limit is reached

Falls back to a deterministic LegacyX Java compiler check when Maven is unavailable on the host.

### 🔀 Git Delivery & PR Preparation
- Clones any public/private GitHub or GitLab repo using OAuth/PAT token injection
- Supports sample repos (`sample:legacy`) and local directories (`file://path`)
- Creates branch `feature/legacyx-modernization`, commits all changes, pushes to remote
- Produces a PR URL ready for Slack approval

### 💬 watsonx Orchestrate Slack Approval Gate
Dispatches a Slack Block Kit audit card containing pre/post-flight scores, CVE resolution count, test pass summary, and two interactive buttons:
- `✅ Approve & Merge PR` — links directly to the GitHub Pull Request
- `🔍 View AST Diffs` — links to the Monaco diff payload

Runs in **dry-run mode** (console print) when `SLACK_WEBHOOK_URL` is not set, so the full pipeline works offline.

### 🎬 Remotion Video Demo Layer
A complete programmatic video presentation built with [Remotion](https://www.remotion.dev/) — 7 animated scenes walking through the architecture, scorecard, subagent logs, diff viewer, build loop, and outro. Renders to `out/legacyx-demo.mp4`.

---

## 📁 Project Structure

```
LegacyX/
├── server.js                        # Express entry point (port 5000)
├── routes/
│   └── api.js                       # All REST endpoints wired to service layer
├── services/
│   ├── sandboxManager.js            # Isolated /tmp/legacyx-sandbox/<id>/ provisioning
│   ├── gitService.js                # Clone, branch, commit, push (OAuth/PAT)
│   ├── pomParser.js                 # pom.xml XML parser (xml2js)
│   ├── astParser.js                 # Java lexical scanner (javax, Records, JUnit 4, deprecated APIs)
│   ├── vulnerabilityService.js      # CVE detection (local catalog + Google OSV API)
│   ├── riskScorer.js                # 0–100 Pre-Flight Modernization Risk Score
│   ├── bobEngine.js                 # IBM Bob 2.0 orchestrator — Subagents A, B, C
│   ├── buildRunner.js               # mvn clean test autonomous fix loop
│   └── slackGateway.js             # Slack Block Kit audit card dispatch
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Main pipeline stepper
│   │   ├── api.js                   # Centralised fetch client
│   │   ├── components/              # 13 UI components (one per pipeline stage)
│   │   └── remotion/                # Programmatic video — 7 animated scenes
│   ├── vite.config.js
│   └── tailwind.config.js
├── samples/
│   └── legacy-spring-app/           # Built-in Java 8 + Spring Boot 2.1 sample project
│       ├── pom.xml                  # javax deps + Log4j 2.14.1 + JUnit 4.12
│       └── src/main/java/com/legacy/order/
│           ├── OrderController.java
│           ├── OrderService.java
│           ├── OrderDto.java        # Record candidate (mutable POJO)
│           └── OrderEntity.java
└── .env.example                     # All environment variables documented
```

---

## 🚀 Quickstart

### Prerequisites
- **Node.js** ≥ 18
- **Git** (on PATH)
- **Maven** ≥ 3.8 *(optional — LegacyX falls back to its own compiler check if unavailable)*

### 1. Clone & Install

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env — add GITHUB_TOKEN for private repos, SLACK_WEBHOOK_URL for live Slack delivery
```

### 3. Run the Full Verification Suite
Executes all 11 pipeline stages end-to-end against the built-in legacy sample app (no external repo needed):
```bash
npm test
```

Expected output: sandbox provisioning → git seed → AST parse → CVE scan → risk score → Bob 2.0 subagents A/B/C → disk verification → build loop → branch creation.

### 4. Start the Backend Server

```bash
npm start
# ✅ LegacyX Backend Engine Online on http://localhost:5000
```

### 5. Start the Frontend Dashboard

```bash
cd frontend
npm run dev
# UI available at http://localhost:3000
```

### 6. (Optional) Render the Demo Video

```bash
npm run remotion:studio    # open interactive Remotion Studio
npm run remotion:render    # render to frontend/out/legacyx-demo.mp4
npm run remotion:still     # export thumbnail PNG at frame 60
```

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Body / Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | — | Engine health check, sandbox directory status |
| `POST` | `/scan` | `{ repoUrl, branch?, token? }` | Clone repo into sandbox, parse AST + pom.xml, calculate pre-flight 0–100 risk scorecard |
| `POST` | `/refactor` | `{ sandboxId }` | Run IBM Bob 2.0 (Subagents A, B, C), return side-by-side AST diffs |
| `GET` | `/diff/:sandboxId` | — | Retrieve Monaco-ready diff objects for all changed files |
| `POST` | `/build-test` | `{ sandboxId, maxRetries? }` | Autonomous `mvn clean test` build-fix loop |
| `POST` | `/deliver` | `{ sandboxId, branchName?, commitMessage? }` | Create branch, commit refactorings, dispatch Slack Block Kit audit card |
| `GET` | `/sandboxes` | — | List all active sandbox sessions |
| `DELETE` | `/sandboxes/:sandboxId` | — | Clean and remove a sandbox directory |

### Example: Scan the Built-In Sample

```bash
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{ "repoUrl": "sample:legacy" }'
```

```json
{
  "success": true,
  "sandboxId": "legacy-spring-app_1720000000000",
  "scorecard": {
    "modernizationRiskScore": 87,
    "modernizationIndex": 13,
    "riskLevel": "CRITICAL",
    "targetPlatform": "Java 21 LTS + Spring Boot 3.3.4 + Jakarta EE 10",
    "estimatedEffortHours": 24,
    "estimatedHoursSavedWithLegacyX": 21,
    "cveCounter": { "total": 3, "critical": 2, "high": 1 }
  }
}
```

---

## 🎬 Remotion Video Presentation & Gemini TTS Voiceovers

LegacyX includes an enterprise 7-scene programmatic video presentation built with **Remotion v4** (`1920x1080 @ 30fps`, 3 minutes / 5,400 frames) and **Google Gemini 3.1 Flash TTS** (`gemini-3.1-flash-tts-preview`).

### 1. Generate Voiceovers with Gemini Voices
The script `scripts/generate-gemini-voiceover.mjs` maps to `LegacyX_Presentation_Script.txt` and supports Director's Chair prompting and all Gemini TTS voices:

```bash
# Generate using default voice (Charon - Informative & Authoritative Architect)
npm run voiceover:generate

# Generate with specific Gemini voices:
npm run voiceover:generate:kore    # Kore: Firm / Executive Leadership
npm run voiceover:generate:puck    # Puck: Upbeat / Dynamic Tech Speaker
npm run voiceover:generate:charon  # Charon: Informative / Technical Authority

# Or with custom voice and scene filters:
node scripts/generate-gemini-voiceover.mjs --voice=Sadaltager --scene=all
```

> **API Key Setup:** Set `GEMINI_API_KEY=your_key_here` in your `.env` file or pass `--key=YOUR_KEY`. If no key is set, the generator automatically uses the local speech synthesizer fallback so the video is immediately playable with synchronized audio.

### 2. Preview and Render Remotion Video

```bash
# Launch interactive Remotion Studio (with live audio & timeline)
npm run remotion:studio

# Render full 1080p MP4 presentation video with voiceover
npm run remotion:render
# Output: frontend/out/legacyx-demo.mp4

# Render thumbnail frame
npm run remotion:still
```

### 3. In-App Video Modal
The React Dashboard includes an interactive video player modal (`RemotionVideoModal`) with:
- Synchronized voiceover audio and animated waveform indicator
- Live subtitle captions toggle (CC)
- Gemini Voice selector (`Charon`, `Kore`, `Puck`, `Fenrir`, `Aoede`, `Sadaltager`)
- Instant chapter jump buttons for all 7 modernization scenes

---

## ⚙️ Environment Variables

| Variable | Required | Description |
| :--- | :---: | :--- |
| `PORT` | No | API server port (default: `5000`) |
| `GITHUB_TOKEN` | For private repos | Personal Access Token for GitHub/GitLab OAuth clone and PR creation |
| `SLACK_WEBHOOK_URL` | For live Slack | Incoming Webhook URL — omit to run in dry-run (console) mode |
| `SLACK_BOT_TOKEN` | Optional | OAuth bot token for advanced Slack Web API calls |
| `SLACK_CHANNEL` | Optional | Default channel for audit cards (e.g. `#engineering-governance`) |
| `LEGACYX_SANDBOX_DIR` | No | Override sandbox base directory (default: OS `tmpdir/legacyx-sandbox`) |

---

## 🧰 Tech Stack

**Backend**
- [Node.js](https://nodejs.org/) + [Express 4](https://expressjs.com/) — REST API server
- [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) — pom.xml parsing
- [diff](https://github.com/kpdecker/jsdiff) — structured patch generation for Monaco
- [axios](https://axios-http.com/) — Google OSV API + Slack webhook delivery
- [glob](https://github.com/isaacs/node-glob) — Java source file discovery

**Frontend**
- [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/) — dashboard framework
- [Tailwind CSS 3](https://tailwindcss.com/) — utility-first styling
- [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) — side-by-side AST diff viewer
- [lucide-react](https://lucide.dev/) — icon system
- [IBM Carbon Design](https://carbondesignsystem.com/) — enterprise dark mode UI language

**Demo Video**
- [Remotion 4](https://www.remotion.dev/) — programmatic React-based video rendering (7 scenes)

**Sample Project**
- Java 8 + Spring Boot 2.1.8 + `javax.*` deps + Log4j 2.14.1 (CVE-2021-44228) + JUnit 4.12

---

## 🗺️ Pipeline Walkthrough

```
  User inputs repo URL
        │
        ▼
  1. sandboxManager.createSandbox()       → isolated /tmp/legacyx-sandbox/<id>/
        │
        ▼
  2. gitService.cloneRepository()         → shallow clone with PAT/OAuth injection
        │
        ▼
  3. pomParser.parsePom()                 → Java version, Spring Boot version, deps
        │
        ▼
  4. astParser.scanRepository()           → javax refs, DTO candidates, JUnit 4, deprecated APIs
        │
        ▼
  5. vulnerabilityService.scanDependencies() → local CVE catalog + Google OSV live query
        │
        ▼
  6. riskScorer.calculateScore()          → 0–100 Pre-Flight Modernization Risk Score
        │
        ▼                                 [Dashboard shows scorecard + file audit table]
        │
  7. bobEngine.executeAgentMode()
        ├── Subagent A → javax→jakarta namespace shifts, DTO→Record, deprecated constructors
        ├── Subagent B → pom.xml: Java 21, Spring Boot 3.3.4, Jakarta deps, compiler plugin
        └── Subagent C → JUnit 4→5: @Before/@After, @BeforeClass, Assert→Assertions
        │
        ▼                                 [Dashboard shows Monaco side-by-side diff]
        │
  8. buildRunner.runBuildLoop()           → mvn clean test (auto-fix loop, up to 3 retries)
        │
        ▼                                 [Dashboard shows build console output]
        │
  9. gitService.createBranch()            → feature/legacyx-modernization
        │
 10. gitService.commitChanges()           → feat(legacyx): modernizing to Java 21...
        │
 11. slackGateway.sendAuditCard()         → Slack Block Kit card with [Approve & Merge PR] button
        │
        ▼
  ✅  Pull Request ready for human approval via Slack / watsonx Orchestrate
```

---

## 📄 License

Apache 2.0 — see [`LICENSE`](LICENSE) for details.

---

<p align="center">Built with <b>IBM Bob 2.0</b> · <b>watsonx Orchestrate</b> · <b>React</b> · <b>Node.js</b></p>
