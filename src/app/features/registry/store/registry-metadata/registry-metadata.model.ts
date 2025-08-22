import {
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CedarMetadataTemplateJsonApi,
} from '@osf/features/project/metadata/models';
import { AsyncStateModel, Institution, License } from '@shared/models';

import {
  BibliographicContributor,
  CustomItemMetadataRecord,
  RegistryOverview,
  RegistrySubjectData,
  UserInstitution,
} from '../../models';

export interface RegistryMetadataStateModel {
  registry: AsyncStateModel<RegistryOverview | null>;
  bibliographicContributors: AsyncStateModel<BibliographicContributor[]>;
  customItemMetadata: AsyncStateModel<CustomItemMetadataRecord>;
  userInstitutions: AsyncStateModel<UserInstitution[]>;
  institutions: AsyncStateModel<Institution[]>;
  subjects: AsyncStateModel<RegistrySubjectData[]>;
  cedarTemplates: AsyncStateModel<CedarMetadataTemplateJsonApi | null>;
  cedarRecord: AsyncStateModel<CedarMetadataRecord | null>;
  cedarRecords: AsyncStateModel<CedarMetadataRecordData[]>;
  license: AsyncStateModel<License | null>;
}
