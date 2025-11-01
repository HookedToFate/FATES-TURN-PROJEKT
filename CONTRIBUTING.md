# Contributing to FATES-TURN-PROJEKT

Danke fürs Mitmachen! Dieses Repo dient als Bauplan für AI-native Entwicklung. Bitte halte dich an die folgenden Konventionen, damit Menschen und AI-Agents effizient zusammenarbeiten.

## Branches & PRs
- `main` ist geschützt – arbeite immer über Branches und Pull Requests.
- Branch-Namen:
  - Scaffolding: `scaffold/<project-name>`
  - Aufgaben: `ai/<issue-number>-<slug>` (z. B. `ai/12-ping-endpoint`)
- PRs verlinken immer das zugehörige Issue und enthalten eine kurze Zusammenfassung, „Wie ausführen“ sowie ggf. „Review Notes“ (Risiken, Annahmen, Testabdeckung).

## Commits
- Prägnante Betreffzeile, gefolgt von Kontext im Body, wenn sinnvoll.
- Bei Design-/Architektur-Entscheidungen füge eine Zeile `Rationale:` hinzu.
- Optional: Conventional Commits sind willkommen, aber nicht verpflichtend.

## Tests & CI
- Wenn Code hinzugefügt/angepasst wird, liefere passende Tests.
- Python: bevorzugt `pytest`. Node: `npm test`.
- GitHub Actions (`.github/workflows/ci.yml`) führt Tests automatisch aus, sofern ein passender Stack erkannt wird.

## AI-Artefakt-Logs
- Prompts und Antworten werden als JSON unter `docs/ai-logs/<role>/YYYY-MM-DDTHHMMSS.json` abgelegt.
- Verweise in PR-Beschreibungen auf die relevanten Log-Dateien.

## Secrets & Integrationen
- Keine Secrets ins Repo commiten. Nutze Codespaces/Repo-Secrets und ENV-Variablen.
- Externe Modelle/Reviewer nur über gesicherte Konfigurationen anbinden.

## Lokale Entwicklung (Beispiele)
- Python:
  - Abhängigkeiten: `requirements.txt` (und optional `requirements-dev.txt`)
  - Tests lokal: `pytest`
- Node:
  - Abhängigkeiten: `npm ci`
  - Tests lokal: `npm test`

## Code-Struktur (Beispiele aus Blueprint)
- Python-Service: `app/main.py`, `tests/test_main.py`, `.github/workflows/ci.yml`
- Beispiel-Endpoint: `/ping` → `{ "status": "ok" }` mit Testabdeckung

## Kommunikation
- Nutze Issues für Aufgaben mit Akzeptanzkriterien.
- Halte Diskussionen und Entscheidungen im PR/Issue nachvollziehbar.

Vielen Dank für deinen Beitrag!
