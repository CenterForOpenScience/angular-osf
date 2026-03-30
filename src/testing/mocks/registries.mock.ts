import { FieldType } from '@osf/shared/enums/field-type.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { DraftRegistrationModel } from '@osf/shared/models/registration/draft-registration.model';
import { PageSchema } from '@osf/shared/models/registration/page-schema.model';
import { ProviderSchema } from '@osf/shared/models/registration/provider-schema.model';

export const MOCK_REGISTRIES_PAGE: PageSchema = {
  id: 'page-1',
  title: 'Page 1',
  questions: [
    { id: 'q1', displayText: 'Field 1', responseKey: 'field1', fieldType: FieldType.Text, required: true },
    { id: 'q2', displayText: 'Field 2', responseKey: 'field2', fieldType: FieldType.Text, required: false },
  ],
};

export const MOCK_REGISTRIES_PAGE_WITH_SECTIONS: PageSchema = {
  id: 'page-2',
  title: 'Page 2',
  questions: [],
  sections: [
    {
      id: 'sec-1',
      title: 'Section 1',
      questions: [
        { id: 'q3', displayText: 'Field 3', responseKey: 'field3', fieldType: FieldType.Text, required: true },
      ],
    },
  ],
};

export const MOCK_STEPS_DATA: Record<string, string> = { field1: 'value1', field2: 'value2' };

export const MOCK_PAGES_SCHEMA: PageSchema[] = [MOCK_REGISTRIES_PAGE];

export const MOCK_DRAFT_REGISTRATION: Partial<DraftRegistrationModel> = {
  id: 'draft-1',
  title: ' My Title ',
  description: ' Description ',
  license: { id: 'mit', options: null },
  providerId: 'osf',
  currentUserPermissions: [UserPermissions.Admin],
  registrationSchemaId: 'schema-1',
};

export const MOCK_PROVIDER_SCHEMAS: ProviderSchema[] = [{ id: 'schema-1', name: 'Schema 1' }];
