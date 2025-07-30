import {
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CedarMetadataTemplateJsonApi,
} from '@osf/features/project/metadata/models';
import { AsyncStateModel, License } from '@shared/models';

import {
  BibliographicContributor,
  CustomItemMetadataRecord,
  RegistryInstitutionJsonApi,
  RegistryOverview,
  RegistrySubjectData,
  UserInstitution,
} from '../../models';

export interface RegistryMetadataStateModel {
  registry: AsyncStateModel<RegistryOverview | null>;
  bibliographicContributors: AsyncStateModel<BibliographicContributor[]>;
  customItemMetadata: AsyncStateModel<CustomItemMetadataRecord>;
  userInstitutions: AsyncStateModel<UserInstitution[]>;
  institutions: AsyncStateModel<RegistryInstitutionJsonApi[]>;
  subjects: AsyncStateModel<RegistrySubjectData[]>;
  cedarTemplates: AsyncStateModel<CedarMetadataTemplateJsonApi | null>;
  cedarRecord: AsyncStateModel<CedarMetadataRecord | null>;
  cedarRecords: AsyncStateModel<CedarMetadataRecordData[]>;
  license: AsyncStateModel<License | null>;
}
