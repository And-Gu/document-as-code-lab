/** Chapter-specific six-tile introductions, keyed by stable published chapter slug.
 * These are reader-facing summaries, not a workflow or completion state. */
export interface ChapterGlance { message: string; tiles: { title: string; detail: string }[] }
export const chapterGlances: Record<string, ChapterGlance> = {
  "01-introduction": {
    "message": "Information becomes more useful when we maintain it once and can put it to work in different ways.",
    "tiles": [
      {
        "title": "Sources",
        "detail": "Shared source information"
      },
      {
        "title": "Views",
        "detail": "Different useful presentations"
      },
      {
        "title": "Change",
        "detail": "Inspectable revisions"
      },
      {
        "title": "Review",
        "detail": "Agreed responsibilities"
      },
      {
        "title": "Reuse",
        "detail": "Less duplicated work"
      },
      {
        "title": "Value",
        "detail": "More ways to use information"
      }
    ]
  },
  "02-github-workspace": {
    "message": "People can collaborate on maintained information while keeping proposals, review, and shared changes distinct.",
    "tiles": [
      {
        "title": "Workspace",
        "detail": "A place for shared information"
      },
      {
        "title": "Roles",
        "detail": "Clear responsibilities"
      },
      {
        "title": "Propose",
        "detail": "Suggest changes safely"
      },
      {
        "title": "Compare",
        "detail": "Review what changed"
      },
      {
        "title": "Integrate",
        "detail": "Accept reviewed work"
      },
      {
        "title": "History",
        "detail": "Understand its evolution"
      }
    ]
  },
  "03-project-growth": {
    "message": "Recorded history helps us investigate change without mistaking activity for quality.",
    "tiles": [
      {
        "title": "Revisions",
        "detail": "Identify past states"
      },
      {
        "title": "Differences",
        "detail": "Compare changes"
      },
      {
        "title": "Context",
        "detail": "Understand a decision"
      },
      {
        "title": "Evidence",
        "detail": "Locate supporting records"
      },
      {
        "title": "Trends",
        "detail": "Observe development"
      },
      {
        "title": "Limits",
        "detail": "Avoid false conclusions"
      }
    ]
  },
  "04-markdown": {
    "message": "Readable source text can be edited by people and processed by tools.",
    "tiles": [
      {
        "title": "Readable",
        "detail": "Plain-text sources"
      },
      {
        "title": "Structure",
        "detail": "Clear headings and lists"
      },
      {
        "title": "Tables",
        "detail": "Simple structured values"
      },
      {
        "title": "Links",
        "detail": "Navigate related content"
      },
      {
        "title": "Preview",
        "detail": "Interpret rendered results"
      },
      {
        "title": "Reuse",
        "detail": "Repurpose maintained sources"
      }
    ]
  },
  "05-structured-content": {
    "message": "Shared field meanings let us validate, filter, and use information more reliably.",
    "tiles": [
      {
        "title": "Metadata",
        "detail": "Describe an item"
      },
      {
        "title": "Identity",
        "detail": "Stable identifiers"
      },
      {
        "title": "Definitions",
        "detail": "Agree on field meanings"
      },
      {
        "title": "Checks",
        "detail": "Detect invalid values"
      },
      {
        "title": "Selection",
        "detail": "Choose relevant records"
      },
      {
        "title": "Judgment",
        "detail": "Validity is not approval"
      }
    ]
  },
  "06-information-architecture": {
    "message": "Explicit relationships help reveal dependencies and identify what a change may affect.",
    "tiles": [
      {
        "title": "Objects",
        "detail": "Choose useful boundaries"
      },
      {
        "title": "Identity",
        "detail": "Track stable references"
      },
      {
        "title": "Relationships",
        "detail": "Connect items meaningfully"
      },
      {
        "title": "Dependencies",
        "detail": "Follow prerequisites"
      },
      {
        "title": "Impact",
        "detail": "Find review candidates"
      },
      {
        "title": "Judgment",
        "detail": "Confirm what links mean"
      }
    ]
  },
  "07-processing": {
    "message": "Repeatable rules transform shared information into useful results without automatically approving or publishing them.",
    "tiles": [
      {
        "title": "Inputs",
        "detail": "Select source material"
      },
      {
        "title": "Validation",
        "detail": "Check rules"
      },
      {
        "title": "Selection",
        "detail": "Choose needed content"
      },
      {
        "title": "Processing",
        "detail": "Apply transformations"
      },
      {
        "title": "Outputs",
        "detail": "Create results"
      },
      {
        "title": "Publication",
        "detail": "Release deliberately"
      }
    ]
  },
  "08-ai-native": {
    "message": "Useful agent assistance depends on dependable project knowledge and clearly bounded authority.",
    "tiles": [
      {
        "title": "Source map",
        "detail": "Find trusted context"
      },
      {
        "title": "Instructions",
        "detail": "Describe working methods"
      },
      {
        "title": "Language",
        "detail": "Use shared terminology"
      },
      {
        "title": "Decisions",
        "detail": "Know established rationale"
      },
      {
        "title": "Access",
        "detail": "Respect permissions"
      },
      {
        "title": "Checks",
        "detail": "Review agent proposals"
      }
    ]
  },
  "09-images": {
    "message": "Explore data through meaningful relationships, not only predefined reports.",
    "tiles": [
      {
        "title": "Questions",
        "detail": "Start with a user need"
      },
      {
        "title": "Selection",
        "detail": "Choose a perspective"
      },
      {
        "title": "Links",
        "detail": "Follow recorded relations"
      },
      {
        "title": "Dependencies",
        "detail": "Understand connected work"
      },
      {
        "title": "Impact",
        "detail": "Identify likely review areas"
      },
      {
        "title": "Evidence",
        "detail": "Return to the source"
      }
    ]
  },
  "10-data-enrichment": {
    "message": "Better data comes from questioning its quality, adding context, investigating patterns, reviewing findings, and preserving what was learned.",
    "tiles": [
      {
        "title": "Quality",
        "detail": "Check errors and gaps"
      },
      {
        "title": "Annotate",
        "detail": "Explain and classify"
      },
      {
        "title": "Enrich",
        "detail": "Combine and derive"
      },
      {
        "title": "Visualize",
        "detail": "Reveal patterns and anomalies"
      },
      {
        "title": "Review",
        "detail": "Challenge conclusions"
      },
      {
        "title": "Preserve",
        "detail": "Make future reuse possible"
      }
    ]
  },
  "10-publishing": {
    "message": "Automation turns understood processes into repeatable checks, builds, and publication.",
    "tiles": [
      {
        "title": "Events",
        "detail": "Define triggers"
      },
      {
        "title": "Checks",
        "detail": "Detect failures"
      },
      {
        "title": "Processing",
        "detail": "Run transformations"
      },
      {
        "title": "Artifacts",
        "detail": "Keep generated outputs"
      },
      {
        "title": "Delivery",
        "detail": "Publish through workflows"
      },
      {
        "title": "Monitoring",
        "detail": "Inspect actual executions"
      }
    ]
  },
  "11-beyond-github": {
    "message": "The site itself reveals how sources, components, automated builds, and learning experiences fit together.",
    "tiles": [
      {
        "title": "Sources",
        "detail": "Maintain primary information"
      },
      {
        "title": "Components",
        "detail": "Reuse presentation logic"
      },
      {
        "title": "Website",
        "detail": "Publish readable pages"
      },
      {
        "title": "Experiences",
        "detail": "Provide useful interactions"
      },
      {
        "title": "Automation",
        "detail": "Build reproducibly"
      },
      {
        "title": "Portability",
        "detail": "Apply principles elsewhere"
      }
    ]
  }
};
