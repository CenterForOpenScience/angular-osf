import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { NodeShortInfoModel } from '@shared/models/nodes/node-with-children.model';
import { UpdateNodeRequestModel } from '@shared/models/nodes/nodes-json-api.model';

import { ProjectSettingsDataJsonApi } from '../models';

export class GetProjectSettings {
  static readonly type = '[Project Settings] Get Project Settings';

  constructor(public projectId: string) {}
}

export class GetProjectDetails {
  static readonly type = '[Project] Get Project Details';

  constructor(public projectId: string) {}
}

export class UpdateProjectSettings {
  static readonly type = '[Project Settings] Update Project Settings';

  constructor(public payload: ProjectSettingsDataJsonApi) {}
}

export class UpdateProjectDetails {
  static readonly type = '[Project Settings] Update Project Details';

  constructor(public payload: UpdateNodeRequestModel) {}
}

export class GetProjectNotificationSubscriptions {
  static readonly type = '[Project Settings] Get Project Notification Subscriptions';

  constructor(public nodeId: string) {}
}

export class UpdateProjectNotificationSubscription {
  static readonly type = '[Project Settings] Update Project Notification Subscription';

  constructor(public payload: { id: string; frequency: SubscriptionFrequency }) {}
}

export class DeleteProject {
  static readonly type = '[Project Settings] Delete Project';

  constructor(public projects: NodeShortInfoModel[]) {}
}

export class DeleteInstitution {
  static readonly type = '[Project Settings] Delete Institution';

  constructor(
    public institutionId: string,
    public projectId: string
  ) {}
}
