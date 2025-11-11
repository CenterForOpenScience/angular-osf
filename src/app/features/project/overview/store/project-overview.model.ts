import { BaseNodeModel, NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { NodePreprintModel } from '@osf/shared/models/nodes/node-preprint.model';
import { NodeStorageModel } from '@osf/shared/models/nodes/node-storage.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';
import { IdentifierModel } from '@shared/models/identifiers/identifier.model';
import { Institution } from '@shared/models/institutions/institutions.models';
import { LicenseModel } from '@shared/models/license/license.model';

import { ProjectOverviewModel } from '../models';

export interface ProjectOverviewStateModel {
  project: AsyncStateModel<ProjectOverviewModel | null>;
  components: AsyncStateWithTotalCount<NodeModel[]> & {
    currentPage: number;
  };
  duplicatedProject: BaseNodeModel | null;
  parentProject: AsyncStateModel<NodeModel | null>;
  institutions: AsyncStateModel<Institution[]>;
  identifiers: AsyncStateModel<IdentifierModel[]>;
  license: AsyncStateModel<LicenseModel | null>;
  storage: AsyncStateModel<NodeStorageModel | null>;
  preprints: AsyncStateModel<NodePreprintModel[]>;
  isAnonymous: boolean;
}

export const PROJECT_OVERVIEW_DEFAULTS: ProjectOverviewStateModel = {
  project: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  components: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    currentPage: 0,
    totalCount: 0,
  },
  isAnonymous: false,
  duplicatedProject: null,
  parentProject: {
    data: null,
    isLoading: false,
    error: null,
  },
  institutions: {
    data: [],
    isLoading: false,
    error: null,
  },
  identifiers: {
    data: [],
    isLoading: false,
    error: null,
  },
  license: {
    data: null,
    isLoading: false,
    error: null,
  },
  storage: {
    data: null,
    isLoading: false,
    error: null,
  },
  preprints: {
    data: [],
    isLoading: false,
    error: null,
  },
};
