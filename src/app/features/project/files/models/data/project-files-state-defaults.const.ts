import { FileProvider } from '@osf/features/project/files/models';

export const projectFilesStateDefaults = {
  files: {
    data: [],
    isLoading: false,
    error: null,
  },
  moveFileFiles: {
    data: [],
    isLoading: false,
    error: null,
  },
  currentFolder: null,
  moveFileCurrentFolder: null,
  search: '',
  sort: 'name',
  provider: FileProvider.OsfStorage,
  openedFile: {
    data: null,
    isLoading: false,
    error: null,
  },
  fileMetadata: {
    data: null,
    isLoading: false,
    error: null,
  },
  projectMetadata: {
    data: null,
    isLoading: false,
    error: null,
  },
  contributors: {
    data: null,
    isLoading: false,
    error: null,
  },
  fileRevisions: {
    data: null,
    isLoading: false,
    error: null,
  },
  tags: {
    data: [],
    isLoading: false,
    error: null,
  },
};
