import { Action, State, StateContext, Store } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ProfileFiltersOptionsService } from '@osf/features/profile/services/profile-resource-filters.service';

import {
  GetAllOptions,
  GetDatesCreatedOptions,
  GetFundersOptions,
  GetInstitutionsOptions,
  GetLicensesOptions,
  GetPartOfCollectionOptions,
  GetProvidersOptions,
  GetResourceTypesOptions,
  GetSubjectsOptions,
} from './profile-resource-filters-options.actions';
import { ProfileResourceFiltersOptionsStateModel } from './profile-resource-filters-options.model';

@State<ProfileResourceFiltersOptionsStateModel>({
  name: 'profileResourceFiltersOptions',
  defaults: {
    datesCreated: [],
    funders: [],
    subjects: [],
    licenses: [],
    resourceTypes: [],
    institutions: [],
    providers: [],
    partOfCollection: [],
  },
})
@Injectable()
export class ProfileResourceFiltersOptionsState {
  readonly store = inject(Store);
  readonly filtersOptionsService = inject(ProfileFiltersOptionsService);

  @Action(GetDatesCreatedOptions)
  getDatesCreated(ctx: StateContext<ProfileResourceFiltersOptionsStateModel>) {
    return this.filtersOptionsService.getDates().pipe(
      tap((datesCreated) => {
        ctx.patchState({ datesCreated: datesCreated });
      })
    );
  }

  @Action(GetFundersOptions)
  getFunders(ctx: StateContext<ProfileResourceFiltersOptionsStateModel>) {
    return this.filtersOptionsService.getFunders().pipe(
      tap((funders) => {
        ctx.patchState({ funders: funders });
      })
    );
  }

  @Action(GetSubjectsOptions)
  getSubjects(ctx: StateContext<ProfileResourceFiltersOptionsStateModel>) {
    return this.filtersOptionsService.getSubjects().pipe(
      tap((subjects) => {
        ctx.patchState({ subjects: subjects });
      })
    );
  }

  @Action(GetLicensesOptions)
  getLicenses(ctx: StateContext<ProfileResourceFiltersOptionsStateModel>) {
    return this.filtersOptionsService.getLicenses().pipe(
      tap((licenses) => {
        ctx.patchState({ licenses: licenses });
      })
    );
  }

  @Action(GetResourceTypesOptions)
  getResourceTypes(ctx: StateContext<ProfileResourceFiltersOptionsStateModel>) {
    return this.filtersOptionsService.getResourceTypes().pipe(
      tap((resourceTypes) => {
        ctx.patchState({ resourceTypes: resourceTypes });
      })
    );
  }

  @Action(GetInstitutionsOptions)
  getInstitutions(ctx: StateContext<ProfileResourceFiltersOptionsStateModel>) {
    return this.filtersOptionsService.getInstitutions().pipe(
      tap((institutions) => {
        ctx.patchState({ institutions: institutions });
      })
    );
  }

  @Action(GetProvidersOptions)
  getProviders(ctx: StateContext<ProfileResourceFiltersOptionsStateModel>) {
    return this.filtersOptionsService.getProviders().pipe(
      tap((providers) => {
        ctx.patchState({ providers: providers });
      })
    );
  }
  @Action(GetPartOfCollectionOptions)
  getPartOfCollection(ctx: StateContext<ProfileResourceFiltersOptionsStateModel>) {
    return this.filtersOptionsService.getPartOtCollections().pipe(
      tap((partOfCollection) => {
        ctx.patchState({ partOfCollection: partOfCollection });
      })
    );
  }

  @Action(GetAllOptions)
  getAllOptions() {
    this.store.dispatch(GetDatesCreatedOptions);
    this.store.dispatch(GetFundersOptions);
    this.store.dispatch(GetSubjectsOptions);
    this.store.dispatch(GetLicensesOptions);
    this.store.dispatch(GetResourceTypesOptions);
    this.store.dispatch(GetInstitutionsOptions);
    this.store.dispatch(GetProvidersOptions);
    this.store.dispatch(GetPartOfCollectionOptions);
  }
}
