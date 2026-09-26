# LegacyX: AI-Powered Developer Governance Sidecar & Modernization Engine

LegacyX automates the migration, refactoring, and security upgrading of legacy enterprise Java applications (e.g., **Java 8/11 → Java 21 LTS**, **Spring Boot 2 → Spring Boot 3**, and `javax.*` → `jakarta.*` namespace shifts).

---

## 🏛️ System Architecture

LegacyX employs a dual-layer architecture:
1. **Developer Execution Layer (IBM Bob 2.0 Engine):** Coordinates multi-agent refactoring, Java AST parsing, DTO-to-Record transformations, and autonomous terminal build loops (`mvn clean test`).
2. **Governance & Visual Interface Layer (React Dashboard & Express API):** Reusable Web UI for team leads and engineering managers to input ANY repository URL, view pre-flight modernization risk scores (0–100), inspect side-by-side AST code diffs, and approve automated GitHub Pull Requests via Slack/watsonx Orchestrate.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                1. REUSABLE WEB DASHBOARD                                │
│       (React / Next.js with IBM Carbon Dark Mode UI & Interactive Diff Viewer)          │
│  • Reusable Repo URL Input Field (Supports any public/private GitHub or GitLab repo)     │
│  • Modernization Index Scorecard (0 - 100 Index Score, Java 21 target, CVE counter)     │
│  • Side-by-Side AST Diff Viewer (Red: Legacy javax/Java 8 | Green: Modern jakarta/Java 21)│
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ REST API / WebSocket
┌───────────────────────────────────────────▼─────────────────────────────────────────────┐
│                                2. BACKEND API ENGINE                                    │
│                              (Node.js / Express REST Server)                            │
│  • Cleans and manages isolated sandbox directories (/tmp/legacyx-sandbox/)              │
│  • Clones target repos dynamically via git clone using OAuth / Personal Access Tokens   │
│  • Parses ASTs, pom.xml, and dependencies to calculate pre-flight risk scores           │
│  • Interoperates with local IBM Bob 2.0 Agent Mode CLI and terminal build tools         │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Local Execution / Git Push
┌───────────────────────────────────────────▼─────────────────────────────────────────────┐
│                            3. WATSONX ORCHESTRATE & SLACK GATEWAY                       │
│  • Sends automated Slack Block Kit messages with audit scorecards and PR links          │
│  • Provides interactive approval buttons: [Approve & Merge PR] | [Request Security Audit]│
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Deliverable 1: The Backend Engine (Implemented & Tested)

### Components Overview
- `server.js`: Express REST API server running on port `5000` with CORS, large diff payload handling, and health endpoints.
- `services/sandboxManager.js`: Cross-platform isolated directory sandbox provisioning (`os.tmpdir()/legacyx-sandbox` or custom path).
- `services/gitService.js`: Dynamic git cloning, OAuth/PAT token injection, branch creation (`feature/legacyx-modernization`), and commit staging.
- `services/pomParser.js`: Maven XML parser detecting Java runtime (1.8/11/17/21), Spring Boot version, legacy `javax.*` dependencies, and test frameworks (JUnit 4 vs JUnit 5).
- `services/astParser.js`: Java lexical and AST scanner identifying `javax.*` packages, mutable DTO candidates for Java 21 Records, deprecated boxed primitive constructors (`new Integer()`), and JUnit 4 annotations.
- `services/vulnerabilityService.js`: Queries Google OSV API and cross-references known enterprise vulnerabilities (Log4Shell CVE-2021-44228, Spring4Shell CVE-2022-22965, Jackson Databind CVEs).
- `services/riskScorer.js`: Calculates the **Pre-Flight Modernization Risk Score (0-100)**, Modernization Index, effort hours, automated savings, and priority roadmap.
- `services/bobEngine.js`: **IBM Bob 2.0 Engine** orchestrator with:
  - **Subagent A:** Transforms `javax.*` → `jakarta.*`, converts mutable DTOs into Java 21 Records, cleans deprecated constructors.
  - **Subagent B:** Modernizes `pom.xml` dependencies, sets Java 21 compiler targets, bumps Spring Boot to `3.3.4`.
  - **Subagent C:** Migrates JUnit 4 tests to JUnit 5 Jupiter engine (`@Test`, `@BeforeEach`, `Assertions.*`).
  - Generates side-by-side AST diff payloads for the React Monaco Diff Viewer.
- `services/buildRunner.js`: Deterministic build-test-fix loop executing `mvn clean test` / diagnostic compiler checks with error diagnosis and auto-remediation.
- `samples/legacy-spring-app/`: Built-in enterprise Java 8 + Spring Boot 2.1 legacy sample project for instant offline verification.

---

## 🚀 Quickstart

### 1. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Run the Verification Test Suite
Executes all 11 stages of the engine (sandbox provisioning, git seeding, AST parsing, CVE detection, risk scoring, Bob 2.0 multi-agent refactoring, disk verification, build-test loop, and branch creation):
```bash
npm test
```

### 3. Start the Backend API Server
```bash
npm start
# Server starts on http://localhost:5000
```

### 4. Start the Frontend Dev Server
```bash
cd frontend
npm run dev
# UI starts on http://localhost:3000
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & sandbox directory status |
| `POST` | `/api/scan` | Ingests `{ repoUrl, branch, token }`, clones into isolated sandbox, parses AST & pom, returns 0–100 risk scorecard |
| `POST` | `/api/refactor` | Runs IBM Bob 2.0 Subagents (A, B, C), returns side-by-side AST diffs |
| `GET` | `/api/diff/:sandboxId` | Retrieves Monaco-ready diff objects for changed files |
| `POST` | `/api/build-test` | Runs autonomous build-test-fix loop (`mvn clean test`) |
| `POST` | `/api/deliver` | Creates branch `feature/legacyx-modernization`, commits refactorings, prepares watsonx Slack card |
| `GET` | `/api/sandboxes` | Lists active sandboxes |
| `DELETE` | `/api/sandboxes/:id` | Cleans up specified sandbox directory |
