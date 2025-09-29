import { ProjectModel } from '@shared/models/projects';

export const MOCK_PROJECT: ProjectModel = {
  id: 'project-1',
  type: 'nodes',
  title: 'Test Project',
  dateModified: '2024-01-01T00:00:00.000Z',
  isPublic: true,
  licenseId: 'MIT',
  licenseOptions: null,
  description: 'A test project for unit testing',
  tags: ['test', 'mock'],
  filesLink: '/project-1/files/',
};
