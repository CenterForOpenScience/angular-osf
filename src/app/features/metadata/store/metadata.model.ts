import {
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CedarMetadataTemplateJsonApi,
  CustomItemMetadataRecord,
} from '@osf/features/metadata/models';
import { AsyncStateModel } from '@shared/models';

import { CrossRefFunder, Metadata } from '../models';

export interface MetadataStateModel {
  metadata: AsyncStateModel<Metadata | null>;
  customMetadata: AsyncStateModel<CustomItemMetadataRecord | null>;
  fundersList: AsyncStateModel<CrossRefFunder[]>;
  cedarTemplates: AsyncStateModel<CedarMetadataTemplateJsonApi | null>;
  cedarRecord: AsyncStateModel<CedarMetadataRecord | null>;
  cedarRecords: AsyncStateModel<CedarMetadataRecordData[]>;
}
