import { ProjectMetadataUpdatePayload } from '@shared/models';
import { Project } from '@shared/models/projects';

export class GetProjects {
  static readonly type = '[Projects] Get Projects';

  constructor(
    public userId: string,
    public params?: Record<string, unknown>
  ) {}
}

export class SetSelectedProject {
  static readonly type = '[Projects] Set Selected Project';

  constructor(public project: Project) {}
}

export class UpdateProjectMetadata {
  static readonly type = '[Projects] Update Project Metadata';

  constructor(public metadata: ProjectMetadataUpdatePayload) {}
}

export class ClearProjects {
  static readonly type = '[Projects] Clear Selected Project';
}
