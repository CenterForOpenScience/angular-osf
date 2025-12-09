import { PageSchema } from '@osf/shared/models/registration/page-schema.model';

export const createMockPageSchema = (overrides?: Partial<PageSchema>): PageSchema => ({
  id: 'page-1',
  title: 'Test Page',
  description: 'Test description',
  questions: [
    {
      id: 'question-1',
      displayText: 'Test Question',
      required: false,
    },
  ],
  sections: [
    {
      id: 'section-1',
      title: 'Test Section',
      description: 'Section description',
      questions: [
        {
          id: 'section-question-1',
          displayText: 'Section Question',
          required: true,
        },
      ],
    },
  ],
  ...overrides,
});
