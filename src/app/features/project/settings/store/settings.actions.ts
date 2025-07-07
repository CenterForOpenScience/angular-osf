import { UpdateNodeRequestModel } from '@shared/models';

import { ProjectSettingsData } from '../models';

export class GetProjectSettings {
  static readonly type = '[Settings] Get Project Settings';

  constructor(public projectId: string) {}
}

export class GetProjectDetails {
  static readonly type = '[Project] Get Project Details';

  constructor(public projectId: string) {}
}

export class UpdateProjectSettings {
  static readonly type = '[Settings] Update Project Settings';

  constructor(public payload: ProjectSettingsData) {}
}

export class UpdateProjectDetails {
  static readonly type = '[Settings] Update Project Details';

  constructor(public payload: UpdateNodeRequestModel) {}
}

export class DeleteProject {
  static readonly type = '[Settings] Delete Project';

  constructor(public projectId: string) {}
}
