import {
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CedarMetadataTemplateJsonApi,
  CustomItemMetadataRecord,
  UserInstitution,
} from '@osf/features/project/metadata/models';
import { ProjectOverview } from '@osf/features/project/overview/models';

import { CrossRefFunder } from '../models';

export interface MetadataStateModel {
  project: ProjectOverview | null;
  projectLoading: boolean;
  customItemMetadata: CustomItemMetadataRecord | null;
  customItemMetadataLoading: boolean;
  fundersList: CrossRefFunder[];
  fundersLoading: boolean;
  loading: boolean;
  error: string | null;
  cedarTemplates: CedarMetadataTemplateJsonApi | null;
  cedarTemplatesLoading: boolean;
  cedarRecord: CedarMetadataRecord | null;
  cedarRecordLoading: boolean;
  cedarRecords: CedarMetadataRecordData[];
  cedarRecordsLoading: boolean;
  userInstitutions: UserInstitution[];
  userInstitutionsLoading: boolean;
}
