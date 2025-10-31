import {
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CedarMetadataTemplateJsonApi,
  CustomItemMetadataRecord,
} from '@osf/features/metadata/models';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

import { CrossRefFunder, MetadataModel } from '../models';

export interface MetadataStateModel {
  metadata: AsyncStateModel<MetadataModel | null>;
  customMetadata: AsyncStateModel<CustomItemMetadataRecord | null>;
  fundersList: AsyncStateModel<CrossRefFunder[]>;
  cedarTemplates: AsyncStateModel<CedarMetadataTemplateJsonApi | null>;
  cedarRecord: AsyncStateModel<CedarMetadataRecord | null>;
  cedarRecords: AsyncStateModel<CedarMetadataRecordData[]>;
}

export const METADATA_STATE_DEFAULTS: MetadataStateModel = {
  metadata: {
    data: null,
    isLoading: false,
    error: null,
  },
  customMetadata: {
    data: null,
    isLoading: false,
    error: null,
  },
  fundersList: {
    data: [],
    isLoading: false,
    error: null,
  },
  cedarTemplates: {
    data: null,
    isLoading: false,
    error: null,
  },
  cedarRecord: {
    data: null,
    isLoading: false,
    error: null,
  },
  cedarRecords: {
    data: [],
    isLoading: false,
    error: null,
  },
};
