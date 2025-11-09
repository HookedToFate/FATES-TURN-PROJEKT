# AI-Native Software Development Environment Blueprint

## I. Core Philosophy: Manifesto of Prompt-Driven Development
- **Prompts as Programs:** Treat every prompt as an executable specification that unifies intent, context, and constraints for the AI swarm.
- **Human-AI Symbiosis:** Humans orchestrate strategy, architecture, and governance while AI agents execute implementation, testing, and deployment.
- **Continuous Reflection:** Embed feedback loops at every stage so outputs are inspected, critiqued, and evolved through iterative prompting.
- **Automation First:** Default to automated solutions for every operational step; manual effort is reserved for high-level decision-making and exceptional cases.
- **Transparency & Traceability:** All AI actions are logged, version-controlled, and reviewable to maintain trust, compliance, and reproducibility.
- **Scalable Expertise:** Modular AI roles encapsulate specialized knowledge, enabling rapid scaling across domains and project sizes.

## II. Key Roles & Responsibilities

### The Human Orchestrator
**Responsibilities**
- Define product vision, success metrics, and architectural guardrails via master prompts.
- Curate project context: business requirements, non-functional constraints, compliance rules, and domain knowledge.
- Evaluate AI-generated plans, code, and deployment outcomes against strategic goals.
- Craft refinement prompts that clarify misunderstandings, redirect priorities, and trigger scope adjustments.
- Maintain governance over repository hygiene, release cadence, and stakeholder communication.

**Required Skills**
- Systems thinking and ability to decompose complex objectives into coherent prompts.
- Mastery of prompt engineering patterns (chain-of-thought, role assignment, validation directives).
- Strong architectural literacy across software paradigms, cloud platforms, and DevOps practices.
- Clear written communication, with emphasis on unambiguous requirements and contextual framing.
- Competence in interpreting analytics, QA reports, and AI explanations to make strategic decisions.

### The AI Agent Swarm

#### Architect AI (Gemini)
- Parses the master prompt, extracting domain context, constraints, and success criteria.
- Proposes end-to-end architecture, including frameworks, services, data stores, and deployment topology.
- Generates a structured execution plan: milestones, GitHub Issues, task dependencies, and acceptance tests.
- Produces initial scaffolding: repository layout, boilerplate code, infrastructure manifests, and documentation skeletons.

#### Coder AI (Codex / GitHub Copilot)
- Consumes Architect AI task briefs to implement features within isolated branches.
- Writes idiomatic, maintainable code adhering to project linting and formatting standards.
- Updates tests and documentation relevant to the task scope.
- Utilizes IDE integrations to run local checks (unit tests, linters) before committing.

#### Logic & Reasoning AI (ChatGPT-5 with 5-Step Thinking)
- Tackles algorithmically complex or ambiguous tasks requiring deep reasoning.
- Performs root-cause analysis on failing tests or performance regressions.
- Refactors code for optimization, scalability, and maintainability.
- Executes self-critique loops: hypothesize, verify, correct, and document reasoning in commit messages.

#### Reviewer AI
- Activated on pull request creation via GitHub webhook.
- Runs static analysis, security scans, and style enforcement.
- Annotates diffs with actionable feedback, referencing policies and best practices.
- Emits pass/fail verdicts; blocks merges until severity thresholds are resolved.

## III. The Technology Stack & Integration

### Orchestration Cockpit
- **Environment:** GitHub Codespaces provisioned with VS Code, pre-configured extensions for AI interactions, GitHub CLI, and automation scripts.
- **Workspace Automation:** Devcontainers define dependencies, secrets management, and runtime configurations.
- **Observability:** VS Code dashboards showing task queues, AI activity logs, and CI status.

### Automated Repository
- **Hosting:** GitHub repository with protected `main` branch and enforced pull request reviews.
- **Automation Hooks:** GitHub Actions triggered on issue creation, branch push, and PR events to orchestrate AI workflows.
- **Issue Templates:** Standardized formats capturing task description, acceptance criteria, and context for AI consumption.
- **Audit Trail:** AI-generated artifacts (prompts, responses, logs) committed under `/docs/ai-logs/` for compliance.

### AI Model Interaction
- **Prompt Dispatch:** Custom CLI tools (`prompt-architect.sh`, `prompt-coder.sh`, `prompt-logic.sh`, `prompt-reviewer.sh`) wrap API calls.
- **Integration Points:**
  - Architect AI via Google AI Studio (Gemini API) for planning/scaffolding tasks.
  - Coder AI via OpenAI Codex or GitHub Copilot APIs for in-editor code generation and command execution.
  - Logic AI via OpenAI ChatGPT-5 API with enhanced reasoning parameters (e.g., `temperature=0.2`, `max_thought_steps=5`).
  - Reviewer AI via hosted model endpoint (Hugging Face Inference API) or custom container running static analysis pipeline.
- **Response Handling:** Outputs are serialized into JSON and fed into automation scripts that create files, open branches, or update issues.
- **Credential Management:** GitHub Codespaces secrets store API keys; CLI tools access them via environment variables.

### Model Prototyping & Fine-Tuning
- **Experimentation:** Hugging Face Spaces for interactive evaluation of reviewer or domain-specific models.
- **Dataset Management:** Versioned datasets stored in Hugging Face Datasets; synced with repository via Git LFS if needed.
- **Deployment:** Fine-tuned models pushed to Hugging Face Hub with inference endpoints integrated into CI/CD workflows.
- **Monitoring:** Usage metrics collected via Hugging Face analytics; alerts configured for drift or performance degradation.

## IV. Step-by-Step Workflow (Idea to Deployment)

1. **Phase 1: Project Initiation (Human Orchestrator)**
   - Draft `master_prompt.md` capturing project vision, constraints, user stories, acceptance tests, preferred tech stack, and delivery timeline.
   - Run `prompt-architect.sh master_prompt.md` to transmit the master prompt to the Architect AI.
   - Record AI response under `/docs/ai-logs/architect/<timestamp>.json` for traceability.

2. **Phase 2: AI-Powered Scaffolding (Architect AI)**
   - Architect AI returns: proposed architecture, repository structure, prioritized backlog, and initial boilerplate.
   - Automation script `apply-architect-plan.py` parses the response to:
     - Initialize directories and files in the Codespace.
     - Create GitHub Issues for each task using the GitHub REST API.
     - Commit scaffolding on a `scaffold/<project-name>` branch and open a pull request.
   - Human Orchestrator reviews the plan PR, requesting adjustments through refinement prompts if necessary.

3. **Phase 3: Autonomous Implementation (Coder & Logic AIs)**
   - GitHub Actions workflow `ai-task-runner.yml` listens for new issues.
   - For each issue:
     - `prompt-coder.sh` or `prompt-logic.sh` selects the appropriate AI based on issue labels (`feature`, `algo`, `bugfix`).
     - Automation creates a feature branch `ai/<issue-number>-<slug>`.
     - AI agent receives issue context, repository snapshot, and related files.
     - AI generates code, runs unit tests via `npm test`, `pytest`, or relevant command inside Codespace, and commits changes with structured messages.
     - Changes pushed to GitHub trigger PR creation via CLI or GitHub API.

4. **Phase 4: Automated Quality Assurance (Reviewer AI)**
   - GitHub webhook on PR creation invokes `prompt-reviewer.sh`, sending diff and context to Reviewer AI.
   - Reviewer AI outputs review comments, severity labels, and approval status.
   - GitHub Action posts comments and enforces merge requirements (e.g., no critical issues outstanding, tests passing).
   - Security scans (e.g., CodeQL, Dependabot) run in parallel to bolster assurance.

5. **Phase 5: Human Oversight & Iteration (Human Orchestrator)**
   - Orchestrator monitors PR dashboards, Reviewer AI feedback, and CI results.
   - Provides strategic guidance through follow-up prompts (e.g., `refinement_prompt.md`) via `prompt-architect.sh` or `prompt-logic.sh`.
   - Approves merges once criteria are satisfied; branch protection ensures code enters `main` only after Orchestrator approval.
   - Schedules releases by prompting deployment scripts or triggering GitHub Actions (`deploy.yml`) targeting environments (staging/production).
   - Conducts post-mortems documenting lessons, updated prompting strategies, and model performance insights.
