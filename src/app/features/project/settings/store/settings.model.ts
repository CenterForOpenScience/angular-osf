import { PaginatedViewOnlyLinksModel, ProjectSettingsModel } from '@osf/features/project/settings/models';
import { NodeData } from '@shared/models';
import { AsyncStateModel } from '@shared/models/store';

export interface SettingsStateModel {
  settings: AsyncStateModel<ProjectSettingsModel>;
  projectDetails: AsyncStateModel<NodeData>;
  viewOnlyLinks: AsyncStateModel<PaginatedViewOnlyLinksModel>;
}
