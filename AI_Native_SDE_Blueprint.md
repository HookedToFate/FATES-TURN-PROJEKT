# AI-Native Software Development Environment Blueprint

## I. Core Philosophy: Manifesto of Prompt-Driven Development
- **Prompts as Programs:** Treat every prompt as an executable specification that unifies intent, context, and constraints for the AI swarm. Prompts are versioned artifacts, reviewed like code, and linked to resulting commits.
- **Human-AI Symbiosis:** Humans orchestrate strategy, architecture, and governance while AI agents execute implementation, testing, and deployment. Decision authority stays with the Human Orchestrator, execution load rests on AI.
- **Continuous Reflection:** Embed feedback loops at every stage so outputs are inspected, critiqued, and evolved through iterative prompting. Every AI action logs metadata (prompt, response, confidence) for retrospective learning.
- **Automation First:** Default to automated solutions for every operational step; manual effort is reserved for high-level decision-making and exceptional cases. Automations are codified as reusable scripts and GitHub Actions.
- **Transparency & Traceability:** All AI actions are logged, version-controlled, and reviewable to maintain trust, compliance, and reproducibility. Prompts, responses, and reviews are archived in `/docs/ai-logs/` and referenced from PR descriptions.
- **Scalable Expertise:** Modular AI roles encapsulate specialized knowledge, enabling rapid scaling across domains and project sizes. New models are onboarded by extending the role registry and wiring them into existing workflows.
- **Ethical Guardrails:** Governance policies define acceptable data usage, explainability requirements, and escalation paths when AI agents encounter ambiguous or high-risk scenarios.

## II. Key Roles & Responsibilities

### The Human Orchestrator
**Responsibilities**
- Define product vision, success metrics, and architectural guardrails via master prompts.
- Curate project context: business requirements, non-functional constraints, compliance rules, and domain knowledge.
- Evaluate AI-generated plans, code, and deployment outcomes against strategic goals.
- Craft refinement prompts that clarify misunderstandings, redirect priorities, and trigger scope adjustments.
- Maintain governance over repository hygiene, release cadence, and stakeholder communication.
- Operate the orchestration cockpit: schedule prompt dispatches, configure webhooks, and monitor pipelines.
- Facilitate post-deployment reviews, translating insights into updated prompting playbooks.

**Required Skills**
- Systems thinking and ability to decompose complex objectives into coherent prompts.
- Mastery of prompt engineering patterns (chain-of-thought, role assignment, validation directives).
- Strong architectural literacy across software paradigms, cloud platforms, and DevOps practices.
- Clear written communication, with emphasis on unambiguous requirements and contextual framing.
- Competence in interpreting analytics, QA reports, and AI explanations to make strategic decisions.
- Familiarity with compliance regimes (SOC 2, GDPR) to ensure AI activities remain auditable and lawful.

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
- Publishes a structured scorecard (readability, security, performance) that is persisted alongside PR artifacts.

## III. The Technology Stack & Integration

### Orchestration Cockpit
- **Environment:** GitHub Codespaces provisioned with VS Code, pre-configured extensions for AI interactions, GitHub CLI, and automation scripts.
- **Workspace Automation:** Devcontainers define dependencies, secrets management, and runtime configurations.
- **Observability:** VS Code dashboards showing task queues, AI activity logs, and CI status.
- **Prompt Registry:** VS Code extension surfaces a prompt catalog with templates, version history, and quick execution shortcuts.

### Automated Repository
- **Hosting:** GitHub repository with protected `main` branch and enforced pull request reviews.
- **Automation Hooks:** GitHub Actions triggered on issue creation, branch push, and PR events to orchestrate AI workflows.
- **Issue Templates:** Standardized formats capturing task description, acceptance criteria, and context for AI consumption.
- **Audit Trail:** AI-generated artifacts (prompts, responses, logs) committed under `/docs/ai-logs/` for compliance.
- **Event Bus:** GitHub webhooks forward events to an orchestration service (e.g., AWS EventBridge or Temporal) that dispatches tasks to AI agents asynchronously.

### AI Model Interaction
- **Prompt Dispatch:** Custom CLI tools (`prompt-architect.sh`, `prompt-coder.sh`, `prompt-logic.sh`, `prompt-reviewer.sh`) wrap API calls.
- **Integration Points:**
  - Architect AI via Google AI Studio (Gemini API) for planning/scaffolding tasks.
  - Coder AI via OpenAI Codex or GitHub Copilot APIs for in-editor code generation and command execution.
  - Logic AI via OpenAI ChatGPT-5 API with enhanced reasoning parameters (e.g., `temperature=0.2`, `max_thought_steps=5`).
  - Reviewer AI via hosted model endpoint (Hugging Face Inference API) or custom container running static analysis pipeline.
- **Response Handling:** Outputs are serialized into JSON and fed into automation scripts that create files, open branches, or update issues.
- **Credential Management:** GitHub Codespaces secrets store API keys; CLI tools access them via environment variables.
- **Concurrency Controls:** A task router prioritizes prompts, enforces rate limits, and retries failed calls with exponential backoff and circuit breakers.

### Model Prototyping & Fine-Tuning
- **Experimentation:** Hugging Face Spaces for interactive evaluation of reviewer or domain-specific models.
- **Dataset Management:** Versioned datasets stored in Hugging Face Datasets; synced with repository via Git LFS if needed.
- **Deployment:** Fine-tuned models pushed to Hugging Face Hub with inference endpoints integrated into CI/CD workflows.
- **Monitoring:** Usage metrics collected via Hugging Face analytics; alerts configured for drift or performance degradation.
- **Evaluation Harness:** Automated benchmarking scripts compare candidate models against regression suites and log results to `/docs/ai-logs/evals/`.

## IV. Step-by-Step Workflow (Idea to Deployment)

1. **Phase 1: Project Initiation (Human Orchestrator)**
   - Draft `master_prompt.md` capturing project vision, constraints, user stories, acceptance tests, preferred tech stack, and delivery timeline.
   - Run `prompt-architect.sh master_prompt.md` to transmit the master prompt to the Architect AI.
   - Record AI response under `/docs/ai-logs/architect/<timestamp>.json` for traceability, linking the artifact in the master prompt via front-matter metadata.

2. **Phase 2: AI-Powered Scaffolding (Architect AI)**
   - Architect AI returns: proposed architecture, repository structure, prioritized backlog, and initial boilerplate.
   - Automation script `apply-architect-plan.py` parses the response to:
     - Initialize directories and files in the Codespace.
     - Create GitHub Issues for each task using the GitHub REST API.
     - Commit scaffolding on a `scaffold/<project-name>` branch and open a pull request.
   - Human Orchestrator reviews the plan PR, requesting adjustments through refinement prompts if necessary and updating the prompt registry with lessons learned.

3. **Phase 3: Autonomous Implementation (Coder & Logic AIs)**
   - GitHub Actions workflow `ai-task-runner.yml` listens for new issues.
   - For each issue:
     - `prompt-coder.sh` or `prompt-logic.sh` selects the appropriate AI based on issue labels (`feature`, `algo`, `bugfix`).
     - Automation creates a feature branch `ai/<issue-number>-<slug>`.
     - AI agent receives issue context, repository snapshot, and related files.
     - AI generates code, runs unit tests via `npm test`, `pytest`, or relevant command inside Codespace, and commits changes with structured messages.
     - Commit messages follow the pattern `AI <role>: <issue-title>` and embed links to prompt-response logs for auditability.
     - Changes pushed to GitHub trigger PR creation via CLI or GitHub API.
     - Workflow `ai-pr-curator.yml` enriches the PR description with prompt excerpts, test results, and Reviewer AI scorecard summaries.

4. **Phase 4: Automated Quality Assurance (Reviewer AI)**
   - GitHub webhook on PR creation invokes `prompt-reviewer.sh`, sending diff and context to Reviewer AI.
   - Reviewer AI outputs review comments, severity labels, and approval status.
   - GitHub Action posts comments and enforces merge requirements (e.g., no critical issues outstanding, tests passing).
   - Security scans (e.g., CodeQL, Dependabot) run in parallel to bolster assurance.
   - Reviewer AI findings are mirrored into a knowledge base (e.g., Notion or Confluence) tagged by component to inform future prompts.

5. **Phase 5: Human Oversight & Iteration (Human Orchestrator)**
   - Orchestrator monitors PR dashboards, Reviewer AI feedback, and CI results.
   - Provides strategic guidance through follow-up prompts (e.g., `refinement_prompt.md`) via `prompt-architect.sh` or `prompt-logic.sh`.
   - Approves merges once criteria are satisfied; branch protection ensures code enters `main` only after Orchestrator approval.
   - Schedules releases by prompting deployment scripts or triggering GitHub Actions (`deploy.yml`) targeting environments (staging/production).
   - Conducts post-mortems documenting lessons, updated prompting strategies, and model performance insights, capturing them in `/docs/ai-logs/postmortems/`.

## V. Example Project Walkthrough: "API Service"

### Project Goal
Create a REST API using Python and FastAPI that has two endpoints: `/ping` returning `{"status": "ok"}` and `/items/{item_id}` returning a JSON object with the item ID.

### Master Prompt (Human Orchestrator)
```markdown
# Project Vision
Build a minimal FastAPI service deployable via Docker.

# Functional Requirements
- Endpoint: GET /ping → returns {"status": "ok"}
- Endpoint: GET /items/{item_id} → returns {"item_id": <string>} as JSON.

# Non-Functional Requirements
- Python 3.11
- Use FastAPI and Uvicorn.
- Provide unit tests with pytest.
- Include Dockerfile for local development.

# Constraints
- Follow PEP 8 formatting.
- Use poetry for dependency management.
- Provide GitHub Actions workflow for running tests.

# Deliverables
- Repository scaffold with src/tests layout.
- requirements documented in README.
- Initial issues created for implementation tasks.
```

### Simulated Architect AI Response
```
Repository Structure:
- README.md (updated with setup instructions)
- pyproject.toml
- poetry.lock (generated after `poetry install`)
- app/
  - __init__.py
  - main.py
- tests/
  - __init__.py
  - test_main.py
- Dockerfile
- .github/workflows/ci.yml
- docs/ai-logs/architect/2024-06-01_plan.json
- docs/ai-logs/prompts/master_prompt.md

GitHub Issues (auto-created via GitHub REST API):
1. #1 Setup FastAPI project scaffold and dependencies. *(Labels: `feature`, `fastapi`, `ai-coder`)*
2. #2 Implement /ping endpoint with tests. *(Labels: `feature`, `http`)*
3. #3 Implement /items/{item_id} endpoint with tests. *(Labels: `feature`, `validation`, `logic-ai`)*
4. #4 Create Dockerfile and update README with run instructions. *(Labels: `devex`, `documentation`)*

Key Files:
- app/main.py
- tests/test_main.py
- Dockerfile
- .github/workflows/ci.yml
- README.md (bootstrap instructions)
```

### Generated Files

`app/main.py`
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/ping")
def ping():
    return {"status": "ok"}


@app.get("/items/{item_id}")
def read_item(item_id: str):
    return {"item_id": item_id}
```

`requirements.txt`
```text
fastapi==0.110.0
uvicorn[standard]==0.29.0
pytest==8.1.1
httpx==0.27.0
python-dotenv==1.0.1
```

`tests/test_main.py`
```python
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_ping():
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_read_item():
    response = client.get("/items/123")
    assert response.status_code == 200
    assert response.json() == {"item_id": "123"}
```

`.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: ["*"]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      - name: Run tests
        run: pytest
```

### Refinement Prompt Example (Human Orchestrator)
```markdown
Update the FastAPI service to add Pydantic validation for the `/items/{item_id}` endpoint:
- Require `item_id` to be an integer greater than zero.
- Return a JSON response with fields `item_id` (int) and `description` (string).
- Update tests to cover validation errors when `item_id` is non-numeric or <= 0.
- Ensure README documents the new validation behavior and example responses.
```

Automation steps:
- Orchestrator saves the prompt as `refinement_prompt.md` and runs `prompt-logic.sh refinement_prompt.md`.
- Logic AI updates `app/main.py`, adjusts tests, and ensures CI passes before opening a PR.
- Reviewer AI validates changes; Orchestrator approves merge upon satisfaction.
- Post-merge automation updates the prompt registry with a changelog entry noting validation improvements.
