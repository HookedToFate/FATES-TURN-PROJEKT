# Fate Projekt Orakel Copilot Blueprint

## 1. Vision and Objectives
- **Branch Context:** The `fate-orakel` branch of Fate Projekt orchestrates predictive, decision-support features that benefit from AI-assisted development.
- **Copilot Purpose:** Provide a specialized AI assistant that accelerates feature delivery on the branch by automating context gathering, task breakdown, implementation guidance, and quality checks.
- **Key Outcomes:**
  - Faster iteration cycles with automated branch intelligence.
  - Consistent architectural alignment with Fate Projekt standards.
  - Increased visibility into AI-augmented changes for human reviewers.

## 2. Core Capabilities
1. **Context Aggregator**
   - Syncs the latest branch metadata (recent commits, open issues, TODO markers).
   - Surfaces architectural decisions stored in `/docs/architecture` and relevant ADRs.
2. **Prompt Orchestrator**
   - Translates human intent (natural language tasks) into structured prompts for AI agents.
   - Maintains reusable prompt templates for recurring workflows (bugfix, feature spike, refactor).
3. **Implementation Navigator**
   - Suggests file-level change plans based on codebase topology.
   - Generates diff previews and snippet-level explanations for human validation.
4. **Quality Guardian**
   - Integrates linting, unit tests, and security scans into the AI suggestion loop.
   - Annotates risks and compliance impacts directly in pull request comments.

## 3. AI Agent Ensemble
| Agent | Model | Responsibilities |
| --- | --- | --- |
| **Branch Architect** | Gemini 1.5 Pro | Builds contextual project briefs, curates dependency graphs, proposes implementation sequences. |
| **Code Artificer** | GPT-4.1 Code Interpreter / Copilot X API | Produces code changes, refactors modules, writes tests following Pylint + MyPy standards. |
| **Logic Oracle** | Conceptual ChatGPT-5 (5-step reasoning) | Validates algorithms, optimizes performance, conducts self-consistency checks across modules. |
| **Guardian Reviewer** | Fine-tuned LLaMA-Guard | Executes static analysis, security heuristics, and policy compliance reviews before PR submission. |

## 4. System Architecture
```
┌────────────────────────┐
│ Human Orchestrator CLI │
└────────────┬───────────┘
             │ prompt events
┌────────────▼───────────┐
│ Prompt Orchestrator    │
├────────────┬───────────┤
│ Context    │ AI Router  │
│ Aggregator │            │
└──────┬─────┴──────┬────┘
       │            │
┌──────▼─────┐ ┌────▼─────────┐
│ Branch     │ │ Execution    │
│ Knowledge  │ │ Pipeline     │
│ Graph DB   │ │ (Actions)    │
└──────┬─────┘ └────┬─────────┘
       │            │
┌──────▼─────┐ ┌────▼─────────┐
│ AI Agents  │ │ GitHub Branch│
│ Ensemble   │ │ Automation   │
└────────────┘ └──────────────┘
```
- **Knowledge Graph:** Neo4j instance storing file dependencies, service interactions, and domain concepts.
- **Execution Pipeline:** GitHub Actions workflows interfacing with OpenAI/Google APIs via service accounts.
- **Security:** Secrets stored in GitHub Encrypted Secrets, rotated via HashiCorp Vault triggers.

## 5. Operational Workflow
1. **Intent Capture**
   - Human submits `orakel task "Implement prophecy endpoint"`.
   - CLI collects supporting context and opens a task issue on `fate-orakel` branch project board.
2. **Contextual Briefing**
   - Branch Architect compiles current module states, open migrations, and relevant ADRs.
   - Brief posted as issue comment + stored in `/.orakel/cache/{issue-id}.md`.
3. **Task Decomposition**
   - Prompt Orchestrator asks Logic Oracle for validation paths and edge cases.
   - Generates checklist with acceptance criteria and test strategy.
4. **Automated Implementation**
   - Code Artificer spins feature branch `orakel/{issue-id}`.
   - Applies code suggestions through PR drafts; commits include AI attribution trailer (`Co-authored-by: Fate Orakel Copilot`).
5. **Quality Enforcement**
   - Guardian Reviewer runs lint/test/security checks via GitHub Actions matrix.
   - Blocks merge if thresholds unmet, attaches remediation prompts.
6. **Human Oversight**
   - Orchestrator reviews summaries, adjusts prompts, or requests alternative solutions.
   - Merge proceeds after approvals and automated checks pass.

## 6. Integration Roadmap
- **Milestone 1: Foundations**
  - Provision GitHub App with required scopes (issues, checks, pull_requests).
  - Implement CLI scaffolding (`orakel-cli`) with auth to Codespaces + GitHub.
- **Milestone 2: Context Intelligence**
  - Build ingest pipelines for commit history, ADRs, and TODO comments into Neo4j.
  - Launch prompt template registry backed by SQLite.
- **Milestone 3: Autonomous Actions**
  - Configure GitHub Actions to trigger AI workflows on labeled issues (e.g., `orakel-auto`).
  - Implement branch protection overrides for AI-authored PRs after dual review.
- **Milestone 4: Continuous Assurance**
  - Add evaluation harness for regression suites and prompt efficacy metrics.
  - Integrate security scanning (Semgrep, Dependabot alerts) into Guardian Reviewer feedback loop.

## 7. Governance & Observability
- **Audit Trails:** Every AI action emits structured logs to OpenTelemetry collector with correlation IDs.
- **Feedback Channels:** Slack notifications for task lifecycle updates and anomaly alerts.
- **Ethical Guardrails:** Hard-stop prompts for actions touching regulated data domains; human confirmation required.
- **Metrics Dashboard:** Grafana panels tracking cycle time, defect density, prompt success rate, and human override frequency.

## 8. Future Enhancements
- Multi-agent debate framework for conflicting suggestions before human review.
- Offline simulation mode to test major refactors without touching live branches.
- Adaptive prompt tuning using reinforcement learning from pull request outcomes.
- Knowledge graph alignment with product analytics for impact-driven prioritization.

## 9. Usage Playbook
- **Bootstrap the Copilot**
  - Install `orakel-cli` within the Codespaces environment and authenticate using the Fate Projekt GitHub App token.
  - Run `orakel init` to synchronize the branch knowledge graph and generate local prompt templates under `~/.orakel/prompts`.
- **Dispatch a Task**
  - Execute `orakel task "<intent>" --labels feature,auto` to open a structured GitHub issue and kick off the Branch Architect briefing workflow.
  - Inspect the generated dossier in `/.orakel/cache/{issue-id}.md` before approving automated implementation.
- **Review & Merge**
  - Use `orakel review {pr-number}` to fetch Guardian Reviewer findings, CI results, and suggested follow-up prompts in a single report.
  - Approve, request rework, or override automation guardrails directly from the CLI; all actions are logged with correlation IDs.

