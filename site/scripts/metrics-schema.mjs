export function projectMetrics(report, generatedAt = new Date().toISOString()) {
  const latest = report.history.at(-1);
  if (!latest) throw new Error('No committed measurements available');
  return {
    schema_version: 1, measurement_version: report.measurement_version,
    generated_at: generatedAt, source_commit: latest.source_commit, source_committed_at: latest.committed_at,
    history: report.history.map(row => ({
      source_commit: row.source_commit, committed_at: row.committed_at,
      word_count: row.word_count, chapter_count: row.chapter_count,
      draft_or_complete_chapters: row.draft_or_complete_chapters, complete_features: row.complete_features,
    })),
  };
}
