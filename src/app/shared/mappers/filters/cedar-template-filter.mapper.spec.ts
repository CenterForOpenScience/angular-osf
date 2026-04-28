import { CedarTemplate } from '@osf/features/metadata/models';
import { FilterOperatorOption } from '@osf/shared/models/search/discaverable-filter.model';

import { CedarTemplateFilterMapper } from './cedar-template-filter.mapper';

function makeTemplate(order: string[], propertyLabels: Record<string, string>): CedarTemplate {
  return {
    '@id': 'https://repo.metadatacenter.org/templates/test',
    '@type': 'https://schema.metadatacenter.org/core/Template',
    type: 'object',
    title: 'Test Template',
    description: '',
    $schema: 'http://json-schema.org/draft-04/schema',
    '@context': {} as CedarTemplate['@context'],
    required: [],
    properties: {},
    _ui: { order, propertyLabels, propertyDescriptions: {} },
  };
}

describe('CedarTemplateFilterMapper', () => {
  describe('fromTemplate', () => {
    it('maps ordered fields with labels to DiscoverableFilter array', () => {
      const template = makeTemplate(['field1', 'field2'], { field1: 'Field One', field2: 'Field Two' });

      const result = CedarTemplateFilterMapper.fromTemplate(template);

      expect(result).toEqual([
        { key: 'field1', label: 'Field One', operator: FilterOperatorOption.AnyOf },
        { key: 'field2', label: 'Field Two', operator: FilterOperatorOption.AnyOf },
      ]);
    });

    it('skips fields with empty labels', () => {
      const template = makeTemplate(['field1', 'field2'], { field1: 'Field One', field2: '' });

      const result = CedarTemplateFilterMapper.fromTemplate(template);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('field1');
    });

    it('skips fields with whitespace-only labels', () => {
      const template = makeTemplate(['field1', 'field2'], { field1: '  ', field2: 'Field Two' });

      const result = CedarTemplateFilterMapper.fromTemplate(template);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('field2');
    });

    it('skips fields absent from propertyLabels', () => {
      const template = makeTemplate(['field1', 'unknown'], { field1: 'Field One' });

      const result = CedarTemplateFilterMapper.fromTemplate(template);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('field1');
    });

    it('preserves the order defined in _ui.order', () => {
      const template = makeTemplate(['b', 'a', 'c'], { a: 'A', b: 'B', c: 'C' });

      const result = CedarTemplateFilterMapper.fromTemplate(template);

      expect(result.map((f) => f.key)).toEqual(['b', 'a', 'c']);
    });

    it('returns an empty array when order is empty', () => {
      const template = makeTemplate([], {});

      expect(CedarTemplateFilterMapper.fromTemplate(template)).toEqual([]);
    });

    it('sets operator to AnyOf for all fields', () => {
      const template = makeTemplate(['f1', 'f2'], { f1: 'F1', f2: 'F2' });

      const result = CedarTemplateFilterMapper.fromTemplate(template);

      result.forEach((f) => expect(f.operator).toBe(FilterOperatorOption.AnyOf));
    });
  });
});
