import { ProjectSettingsData, ViewOnlyLink } from '@osf/features/project/settings/models';
import { UpdateNodeRequestModel } from '@shared/models';

export class GetProjectSettings {
  static readonly type = '[Settings] Get';

  constructor(public projectId: string) {}
}

export class GetProjectDetails {
  static readonly type = '[Project] Get';

  constructor(public projectId: string) {}
}

export class GetViewOnlyLinksTable {
  static readonly type = '[Link] Table Get';

  constructor(public projectId: string) {}
}

export class UpdateProjectSettings {
  static readonly type = '[Settings] Update';

  constructor(public payload: ProjectSettingsData) {}
}

export class UpdateProjectDetails {
  static readonly type = '[Settings] Update Project Details';

  constructor(public payload: UpdateNodeRequestModel) {}
}

export class CreateViewOnlyLink {
  static readonly type = '[Link] Create';

  constructor(
    public projectId: string,
    public payload: ViewOnlyLink
  ) {}
}

export class DeleteViewOnlyLink {
  static readonly type = '[Link] Delete';

  constructor(
    public projectId: string,
    public linkId: string
  ) {}
}

export class DeleteProject {
  static readonly type = '[Settings] Delete Project';

  constructor(public projectId: string) {}
}
