import { ProviderState } from '@core/store/provider';
import { UserState } from '@core/store/user';
import { UserEmailsState } from '@core/store/user-emails';
import { InstitutionsAdminState } from '@osf/features/admin-institutions/store';
import { FilesState } from '@osf/features/files/store';
import { MetadataState } from '@osf/features/metadata/store';
import { ProjectOverviewState } from '@osf/features/project/overview/store';
import { AddonsState } from '@osf/shared/stores/addons';
import { BannersState } from '@osf/shared/stores/banners';
import { ContributorsState } from '@osf/shared/stores/contributors';
import { CurrentResourceState } from '@osf/shared/stores/current-resource';
import { WikiState } from '@osf/shared/stores/wiki';
import { GlobalSearchState } from '@shared/stores/global-search';
import { InstitutionsState } from '@shared/stores/institutions';
import { InstitutionsSearchState } from '@shared/stores/institutions-search';
import { LicensesState } from '@shared/stores/licenses';
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
  LicensesState,
  RegionsState,
  FilesState,
  MetadataState,
  CurrentResourceState,
  GlobalSearchState,
  BannersState,
  ContributorsState,
];
