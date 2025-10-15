import { ProviderState } from '@core/store/provider';
import { UserState } from '@core/store/user';
import { UserEmailsState } from '@core/store/user-emails';
import { InstitutionsAdminState } from '@osf/features/admin-institutions/store';
import { FilesState } from '@osf/features/files/store';
import { MetadataState } from '@osf/features/metadata/store';
import { ProjectOverviewState } from '@osf/features/project/overview/store';
import { RegistrationsState } from '@osf/features/project/registrations/store';
import { AddonsState, CurrentResourceState, WikiState } from '@osf/shared/stores';
import { BannersState } from '@osf/shared/stores/banners';
import { GlobalSearchState } from '@shared/stores/global-search';
import { InstitutionsState } from '@shared/stores/institutions';
import { InstitutionsSearchState } from '@shared/stores/institutions-search';
import { LicensesState } from '@shared/stores/licenses';
import { LinkedProjectsState } from '@shared/stores/linked-projects';
import { MyResourcesState } from '@shared/stores/my-resources';
import { RegionsState } from '@shared/stores/regions';

export const STATES = [
  AddonsState,
  UserState,
  UserEmailsState,
  ProviderState,
  MyResourcesState,
  InstitutionsState,
  InstitutionsAdminState,
  InstitutionsSearchState,
  ProjectOverviewState,
  WikiState,
  RegistrationsState,
  LicensesState,
  RegionsState,
  FilesState,
  MetadataState,
  CurrentResourceState,
  GlobalSearchState,
  BannersState,
  LinkedProjectsState,
];
