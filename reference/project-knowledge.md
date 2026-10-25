# Project Source Map

This map describes the current repository. [AGENTS.md](../AGENTS.md) is the working-instructions entry point; this guide explains where information belongs. Neither grants tool permissions.

| Subject | Maintained home | Derived result or check |
| --- | --- | --- |
| Chapter text and stable IDs | `docs/`; [chapter conventions](../CONTRIBUTING.md#chapter-conventions) | Astro reads these files directly; filename and chapter number determine order |
| Terminology and writing | [Glossary](../GLOSSARY.md), [contribution guide](../CONTRIBUTING.md) | Editorial review |
| Tutorial intent and rationale | [Specification register](../spec/tutorial/README.md), [dated design decisions](../spec/tutorial/04-DESIGN-DECISIONS.md) | Owner review; proposed details remain open |
| Procedure examples | [Showcase sources](../examples/onboarding-showcase/README.md) | Fixed handbook and review chart; separate browser practice copies |
| Structured records and rules | [Requirement guide](record-processing.md), [contract records and schema](../examples/contract-explorer/README.md) | Explicitly configured processors and validation tests |
| Website and learning components | [Site guide](../site/README.md), `site/src/` | Astro check, build, and site tests |
| Presentation definitions | [Presentation guide](../presentations/README.md) | HTML slides and notes generated during site build |
| Automation and release | [Automation guide](automation-quality.md), `.github/workflows/` | PR checks, artifacts, Pages deployment |
| History and operational evidence | [Measurement guide](growth-measurement.md), `data/features.json` | Build-time dashboard snapshots; fixed historical charts remain unchanged |

The [product specification](../spec/tutorial/02-DOCUMENT-AS-CODE-LAB-V1-SPECIFICATION.md) owns the current audience and reader promise; the [dated decision register](../spec/tutorial/04-DESIGN-DECISIONS.md) records their rationale. The [working-methods register](../spec/tutorial/working-methods-upgrade/README.md) coordinates implementation packages, without replacing those authorities. Selected public planning pages are explicitly listed in `site/src/lib/public-specifications.ts`; adding a private/internal file does not authorize portal publication.

## Authority and Identity

Chapter IDs survive reordering; their current convention lives in [CONTRIBUTING.md](../CONTRIBUTING.md#chapter-conventions). Record schemas define permitted fields and relationship types for their own datasets, not for every file in the repository. A generated report, browser practice edit, or decision proposal does not replace its maintained source.

The decision register records the owner-supplied design direction on 19 October 2026 and the audience decision on 25 October 2026. It is not a reconstructed history of earlier architecture approvals. The current architecture can also be inspected in [Chapter 11](../docs/11-beyond-github.md).

## Route a Maintenance Task

For a chapter change, start with its `docs/` file, then inspect relevant linked examples, diagram sources, and presentation citations. For a schema change, identify the processor that loads it and the selected record files before editing. Consult the [verification instructions](../AGENTS.md#verification-and-publication), run affected tests, and report changed, checked-unchanged, and unverified items.

**Return:** [Chapter 8: Making Information Usable by AI Agents](../docs/08-ai-native.md).
