// Explicit public selection. New internal plans and study notes are not published automatically.
export const publicSpecifications = [
  'README.md', '01-REUSABLE-TUTORIAL-SPECIFICATION-TEMPLATE.md',
  '02-DOCUMENT-AS-CODE-LAB-V1-SPECIFICATION.md', '03-V1-SITE-AUDIT-AND-PRIORITIZED-BACKLOG.md',
  '04-DESIGN-DECISIONS.md', 'IMPLEMENTATION-REVIEW.md', 'EDITORIAL-REVIEW.md',
  'V1-3-EDITORIAL-AUDIT.md', 'V1-3-EDITORIAL-DECISIONS.md',
  'working-methods-upgrade/README.md', 'working-methods-upgrade/01-SHARED-DESIGN-BASELINE.md',
  'working-methods-upgrade/02-PR1-AUDIENCE-AND-READER-EXPERIENCE.md',
  'working-methods-upgrade/05-CHAPTER-CHANGE-MAP.md', 'working-methods-upgrade/06-ACCEPTANCE-AND-TRACEABILITY.md',
  'working-methods-upgrade/07-AGENT-HANDOFF.md', 'working-methods-upgrade/08-REFERENCES-AND-BASELINE.md',
  'working-methods-upgrade/09-CONTENT-SAMPLES.md',
].map(name => `spec/tutorial/${name}`);
