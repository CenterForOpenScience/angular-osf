import { SubjectModel } from '@osf/shared/models/subject/subject.model';

export const SUBJECTS_MOCK: SubjectModel[] = [
  {
    id: 'subject-1',
    name: 'Mathematics',
    iri: 'https://example.com/subjects/mathematics',
    children: [],
    parent: null,
    expanded: false,
  },
  {
    id: 'subject-2',
    name: 'Physics',
    iri: 'https://example.com/subjects/physics',
    children: [],
    parent: null,
    expanded: false,
  },
];
