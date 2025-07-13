import { select } from '@ngxs/store';

import { ActivatedRoute } from '@angular/router';

import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { ProjectFilesSelectors } from '@osf/features/project/files/store';
import { RegistryFilesSelectors } from '@osf/features/registry/store/registry-files';
import { FilesTreeSelectors } from '@shared/tokens/files-tree-selectors.token';

export function filesTreeSelectorsFactory(route: ActivatedRoute): FilesTreeSelectors {
  const context = route.snapshot.data['context'] as 'project' | 'registry' | 'submitPreprints';

  switch (context) {
    case 'project':
      return {
        isFilesLoading: () => select(ProjectFilesSelectors.isFilesLoading),
        getFiles: () => select(ProjectFilesSelectors.getFiles),
        getCurrentFolder: () => select(ProjectFilesSelectors.getCurrentFolder),
      };
    case 'registry':
      return {
        isFilesLoading: () => select(RegistryFilesSelectors.isFilesLoading),
        getFiles: () => select(RegistryFilesSelectors.getFiles),
        getCurrentFolder: () => select(RegistryFilesSelectors.getCurrentFolder),
      };
    case 'submitPreprints':
      return {
        isFilesLoading: () => select(PreprintStepperSelectors.areProjectFilesLoading),
        getFiles: () => select(PreprintStepperSelectors.getProjectFiles),
        getCurrentFolder: () => select(PreprintStepperSelectors.getCurrentFolder),
      };
    default:
      throw new Error(`Unknown context for FilesTreeSelectors: ${context}`);
  }
}
