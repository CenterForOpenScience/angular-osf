import { CEDAR_TEMPLATE_FIELD_TYPE, CedarTemplate } from '@osf/features/metadata/models';
import { FilterOperatorOption } from '@osf/shared/models/search/discoverable-filter.model';

import { CedarTemplateFilterMapper } from './cedar-template-filter.mapper';

const CEDAR_BASE = 'https://schema.metadatacenter.org/properties/';

function makeTemplate(overrides: Partial<CedarTemplate> = {}): CedarTemplate {
  return {
    '@id': 'https://repo.metadatacenter.org/templates/test',
    '@type': 'https://schema.metadatacenter.org/core/Template',
    type: 'object',
    title: 'Test',
    description: '',
    $schema: 'http://json-schema.org/draft-04/schema',
    '@context': {} as never,
    required: [],
    properties: {
      '@context': {
        properties: {
          'School Type': { enum: [`${CEDAR_BASE}uuid-school-type`] },
          'Study Design': { enum: [`${CEDAR_BASE}uuid-study-design`] },
          About: { enum: [`${CEDAR_BASE}uuid-about`] },
        },
      },
      'School Type': {
        '@type': CEDAR_TEMPLATE_FIELD_TYPE,
        _valueConstraints: {
          literals: [{ label: 'High School' }, { label: 'Middle School' }],
        },
      },
      'Study Design': {
        '@type': CEDAR_TEMPLATE_FIELD_TYPE,
        _valueConstraints: {
          literals: [{ label: 'Intervention' }, { label: 'Correlational' }],
        },
      },
      About: {
        '@type': 'https://schema.metadatacenter.org/core/StaticTemplateField',
        _ui: { inputType: 'richtext' },
      },
    },
    _ui: {
      order: ['School Type', 'Study Design', 'About'],
      propertyLabels: { 'School Type': 'School Type', 'Study Design': 'Study Design', About: 'About' },
      propertyDescriptions: {},
    },
    ...overrides,
  };
}

describe('CedarTemplateFilterMapper', () => {
  describe('fromTemplate', () => {
    it('should only include TemplateField entries with literals', () => {
      const filters = CedarTemplateFilterMapper.fromTemplate(makeTemplate());

      expect(filters).toHaveLength(2);
      expect(filters.map((f) => f.key)).toEqual(['School Type', 'Study Design']);
    });

    it('should skip StaticTemplateField entries', () => {
      const filters = CedarTemplateFilterMapper.fromTemplate(makeTemplate());

      expect(filters.some((f) => f.key === 'About')).toBe(false);
    });

    it('should pre-populate options from _valueConstraints.literals', () => {
      const filters = CedarTemplateFilterMapper.fromTemplate(makeTemplate());
      const schoolType = filters.find((f) => f.key === 'School Type')!;

      expect(schoolType.options).toHaveLength(2);
      expect(schoolType.options![0]).toEqual({
        label: 'High School',
        value: 'High School',
        cardSearchResultCount: null,
      });
      expect(schoolType.options![1]).toEqual({
        label: 'Middle School',
        value: 'Middle School',
        cardSearchResultCount: null,
      });
    });

    it('should set cardSearchResultCount to null for all options', () => {
      const filters = CedarTemplateFilterMapper.fromTemplate(makeTemplate());

      filters.forEach((f) => {
        f.options?.forEach((opt) => {
          expect(opt.cardSearchResultCount).toBeNull();
        });
      });
    });

    it('should set cedarPropertyIri to the UUID from the context IRI', () => {
      const filters = CedarTemplateFilterMapper.fromTemplate(makeTemplate());
      const schoolType = filters.find((f) => f.key === 'School Type')!;
      const studyDesign = filters.find((f) => f.key === 'Study Design')!;

      expect(schoolType.cedarPropertyIri).toBe('uuid-school-type');
      expect(studyDesign.cedarPropertyIri).toBe('uuid-study-design');
    });

    it('should set operator to AnyOf', () => {
      const filters = CedarTemplateFilterMapper.fromTemplate(makeTemplate());

      filters.forEach((f) => {
        expect(f.operator).toBe(FilterOperatorOption.AnyOf);
      });
    });

    it('should use propertyLabels for the filter label', () => {
      const filters = CedarTemplateFilterMapper.fromTemplate(makeTemplate());

      expect(filters[0].label).toBe('School Type');
      expect(filters[1].label).toBe('Study Design');
    });

    it('should skip fields with no literals', () => {
      const template = makeTemplate();
      (template.properties['School Type'] as any)._valueConstraints = { literals: [] };

      const filters = CedarTemplateFilterMapper.fromTemplate(template);

      expect(filters.some((f) => f.key === 'School Type')).toBe(false);
    });

    it('should skip fields with an empty label', () => {
      const template = makeTemplate();
      template._ui.propertyLabels['School Type'] = '   ';

      const filters = CedarTemplateFilterMapper.fromTemplate(template);

      expect(filters.some((f) => f.key === 'School Type')).toBe(false);
    });

    it('should return an empty array when no filterable fields exist', () => {
      const template = makeTemplate({
        _ui: { order: ['About'], propertyLabels: { About: 'About' }, propertyDescriptions: {} },
      });

      expect(CedarTemplateFilterMapper.fromTemplate(template)).toEqual([]);
    });
  });
});
