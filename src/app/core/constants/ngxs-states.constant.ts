import { ProviderState } from '@core/store/provider';
import { UserState } from '@core/store/user';
import { FilesState } from '@osf/features/files/store';
import { MetadataState } from '@osf/features/metadata/store';
import { ProjectMetadataState } from '@osf/features/project/metadata/store';
import { ProjectOverviewState } from '@osf/features/project/overview/store';
import { RegistrationsState } from '@osf/features/project/registrations/store';
import { AddonsState, CurrentResourceState, WikiState } from '@osf/shared/stores';
import { InstitutionsState } from '@shared/stores/institutions';
import { LicensesState } from '@shared/stores/licenses';
import { MyResourcesState } from '@shared/stores/my-resources';
import { RegionsState } from '@shared/stores/regions';

export const STATES = [
  AddonsState,
  UserState,
  ProviderState,
  MyResourcesState,
  InstitutionsState,
  ProjectOverviewState,
  WikiState,
  RegistrationsState,
  ProjectMetadataState,
  LicensesState,
  RegionsState,
  FilesState,
  MetadataState,
  CurrentResourceState,
];
