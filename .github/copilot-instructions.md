# Copilot Instructions — FATES-TURN-PROJEKT

Kurzfassung: Dieses Repo ist ein Bauplan für AI-native Softwareentwicklung. Lies `README.md` und vor allem `AI_Native_SDE_Blueprint.md`. Befolge die untenstehenden, repo-spezifischen Arbeitsweisen, damit du als AI-Agent sofort wirksam wirst.

## Big Picture (aus dem Blueprint)
- Rollen: Human Orchestrator (Strategie), Architect AI (Plan/Scaffold), Coder AI (Implementierung), Logic & Reasoning AI (Analyse/Refactor), Reviewer AI (Qualität).
- Schutz: `main` ist geschützt; Arbeit erfolgt über Branches + PRs.
- Nachvollziehbarkeit: Prompts/Antworten werden unter `docs/ai-logs/<role>/YYYY-MM-DDTHHMMSS.json` abgelegt.

## Arbeitsweise für AI-Agents
- Kontextaufnahme: Lies in `AI_Native_SDE_Blueprint.md` die Abschnitte „Workflow“ und „Roles“. Übernimm Constraints, Namensmuster und CI-Erwartungen.
- Branch/PR-Konventionen:
  - Scaffolding: `scaffold/<project-name>`
  - Aufgaben: `ai/<issue-number>-<slug>` (z. B. `ai/12-ping-endpoint`)
  - Commits: prägnant; füge bei Designentscheidungen eine Zeile `Rationale:` an.
- Artefakt-Protokollierung: Lege Prompt + Antwort als JSON unter `docs/ai-logs/<role>/` ab (inkl. Timestamp). Verweise im PR darauf.
- CI/Tests: Wenn du Code erzeugst, füge passende CI hinzu (siehe Blueprint-Beispiel). Wähle Runner nach Stack (z. B. Python: `pytest`; Node: `npm test`).
- IDE/Tools: `.vscode/settings.json` aktiviert erweitertes Denken in Copilot Chat. Nutze dies für kurze, nachvollziehbare Denk-Schritte; ins Repo kommen nur Ergebnisse.

## Projekt-spezifische Konventionen
- Issues: Pro Aufgabe ein Issue mit Akzeptanzkriterien. Automatisierung kann folgen, dokumentiere die Schritte im PR.
- Strukturmuster (aus dem Blueprint). Beispiel Python-Service:
  - Code: `app/main.py`
  - Tests: `tests/test_main.py`
  - Abhängigkeiten: `requirements.txt`
  - CI: `.github/workflows/ci.yml` mit Test-Job (z. B. Python 3.11 + pytest)
- Beispiel-Endpoint (aus dem Blueprint): `/ping` → `{ "status": "ok" }`, plus Tests. Nutze dies als Minimalbeispiel für neue Services.
- Prompts im Repo: Master/Refinement-Prompts können als `master_prompt.md` bzw. `refinement_prompt.md` im Root liegen, wenn sie die Arbeit steuern.

## Integrationen und Sicherheit
- Externe Modelle/Keys: Keine Secrets ins Repo. Wenn Integrationen (Gemini/ChatGPT/Reviewer) nötig sind, verweise auf Codespaces/Repo-Secrets und nutze ENV-Platzhalter.
- Reviewer-Workflow: Falls kein automatischer Reviewer aktiv ist, ergänze im PR eine kurze „Review Notes“-Sektion (Risiken, Annahmen, Testabdeckung).

## Erfolgsnachweis pro Aufgabe (Contract)
- Inputs: verlinktes Issue/Prompt + relevante Blueprint-Abschnitte.
- Outputs: Code/Docs/Tests + CI + `docs/ai-logs/...json` + PR mit klarer Zusammenfassung und "Wie ausführen".
- Checks: Lokale Tests grün; CI-Dateien vorhanden; Branch-Konvention befolgt; keine Secrets; Verweis auf genutzte Blueprint-Stellen.

Hinweise
- Dokumentiere nur tatsächlich umgesetzte Muster. Bei Abweichungen vom Blueprint (z. B. anderer Stack) begründe unter `Rationale:` und passe CI/Tests entsprechend an.

Spezial-Profile
- Für eine domänenspezifische RP-Fantasy-Charakter-Generator-KI siehe `.github/copilot-instructions.rp-fantasy-character-creator.md`.
