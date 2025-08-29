export class CedarMetadataHelper {
  static ensureProperStructure(items: unknown): Record<string, unknown>[] {
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
      const safeItem = typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {};

      return {
        '@id': safeItem['@id'] ?? '',
        '@type': safeItem['@type'] ?? '',
        'rdfs:label': safeItem['rdfs:label'] ?? null,
      };
    });
  }

  static buildStructuredMetadata(metadata: Record<string, unknown> | undefined): Record<string, unknown> {
    const keysToFix = [
      'Constructs',
      'Assessments',
      'Project Methods',
      'Participant Types',
      'Special Populations',
      'Educational Curricula',
      'LDbaseInvestigatorORCID',
    ];

    const fixedMetadata: Record<string, unknown> = { ...metadata };

    const raw = metadata as Record<string, unknown>;

    for (const key of keysToFix) {
      const value = raw?.[key];
      if (value) {
        fixedMetadata[key] = this.ensureProperStructure(value);
      }
    }

    return fixedMetadata;
  }

  static buildEmptyMetadata(): Record<string, unknown> {
    return {
      '@context': {},
      Constructs: this.ensureProperStructure([]),
      Assessments: this.ensureProperStructure([]),
      'Project Methods': this.ensureProperStructure([]),
      'Participant Types': this.ensureProperStructure([]),
      'Special Populations': this.ensureProperStructure([]),
      'Educational Curricula': this.ensureProperStructure([]),
      LDbaseInvestigatorORCID: this.ensureProperStructure([]),
    };
  }
}
