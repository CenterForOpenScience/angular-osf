import {
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CedarMetadataTemplateJsonApi,
  CustomItemMetadataRecord,
  UserInstitution,
} from '@osf/features/project/metadata/models';
import { ProjectOverview } from '@osf/features/project/overview/models';
import { AsyncStateModel } from '@shared/models';

import { CrossRefFunder } from '../models';

export interface MetadataStateModel {
  project: AsyncStateModel<ProjectOverview | null>;
  customItemMetadata: AsyncStateModel<CustomItemMetadataRecord | null>;
  fundersList: AsyncStateModel<CrossRefFunder[]>;
  cedarTemplates: AsyncStateModel<CedarMetadataTemplateJsonApi | null>;
  cedarRecord: AsyncStateModel<CedarMetadataRecord | null>;
  cedarRecords: AsyncStateModel<CedarMetadataRecordData[]>;
  userInstitutions: AsyncStateModel<UserInstitution[]>;
}
