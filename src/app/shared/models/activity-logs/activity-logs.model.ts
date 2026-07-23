import { IdNameModel } from '../common/id-name.model';
import { BaseNodeModel } from '../nodes/base-node.model';
import { UserModel } from '../user/user.model';

export interface ActivityLogModel {
  id: string;
  type: string;
  action: string;
  date: string;
  foreignUser: string | null;
  params: ActivityLogParamsModel;
  embeds?: ActivityLogEmbedsModel;
  isAnonymous?: boolean;
}

interface ActivityLogEmbedsModel {
  linkedNode?: BaseNodeModel;
  originalNode?: BaseNodeModel;
  user?: UserModel;
}

interface ActivityLogParamsModel {
  addon?: string;
  anonymousLink?: boolean;
  contributors: LogContributorModel[];
  destination?: ActivityLogDestinationModel;
  file?: ActivityLogFileModel;
  githubUser?: string;
  identifiers?: ActivityLogIdentifiersModel;
  institution?: IdNameModel;
  kind?: string;
  license?: string;
  oldPage?: string;
  page?: string;
  pageId?: string;
  paramsNode: ActivityLogParamsNodeModel;
  paramsProject: null;
  path?: string;
  pointer: ActivityLogPointerModel | null;
  preprint?: string;
  preprintProvider?: string | ActivityLogPreprintProviderModel | null;
  source?: ActivityLogSourceModel;
  tag?: string;
  templateNode?: ActivityLogTemplateNodeModel | null;
  titleNew?: string;
  titleOriginal?: string;
  updatedFields?: Record<string, ActivityLogUpdatedFieldModel>;
  urls?: ActivityLogUrlsModel;
  value?: string;
  version?: string;
  wiki?: ActivityLogWikiModel;
}

interface ActivityLogDestinationModel {
  addon: string;
  materialized: string;
  url: string;
}

interface ActivityLogFileModel {
  name: string;
  url: string;
}

interface ActivityLogIdentifiersModel {
  ark?: string;
  doi?: string;
}

interface ActivityLogParamsNodeModel {
  id: string;
  title: string;
}

interface ActivityLogPointerModel {
  category: string;
  id: string;
  title: string;
  url: string;
}

interface ActivityLogPreprintProviderModel {
  name: string;
  url: string;
}

interface ActivityLogSourceModel {
  addon: string;
  materialized: string;
}

interface ActivityLogTemplateNodeModel {
  id: string;
  title: string;
  url: string;
}

interface ActivityLogUpdatedFieldModel {
  new: string;
  old: string;
}

interface ActivityLogUrlsModel {
  view: string;
}

interface ActivityLogWikiModel {
  name: string;
  url: string;
}

export interface LogContributorModel {
  id: string;
  fullName: string;
  givenName: string;
  middleNames: string;
  familyName: string;
  unregisteredName: string | null;
  active: boolean;
}
