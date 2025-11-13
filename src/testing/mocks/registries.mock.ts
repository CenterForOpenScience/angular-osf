import { FieldType } from '@osf/shared/enums/field-type.enum';

export const MOCK_REGISTRIES_PAGE = {
  id: 'page-1',
  title: 'Page 1',
  questions: [
    { responseKey: 'field1', fieldType: FieldType.Text, required: true },
    { responseKey: 'field2', fieldType: FieldType.Text, required: false },
  ],
} as any;

export const MOCK_STEPS_DATA = { field1: 'value1', field2: 'value2' } as any;

export const MOCK_PAGES_SCHEMA = [MOCK_REGISTRIES_PAGE];

export const MOCK_DRAFT_REGISTRATION = {
  id: 'draft-1',
  title: ' My Title ',
  description: ' Description ',
  license: { id: 'mit' },
  providerId: 'osf',
  currentUserPermissions: ['admin'],
} as any;

export const MOCK_PROVIDER_SCHEMAS = [{ id: 'schema-1' }] as any;
