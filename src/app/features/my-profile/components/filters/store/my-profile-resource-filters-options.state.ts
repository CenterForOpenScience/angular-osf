import { Action, State, StateContext, Store } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { MyProfileFiltersOptionsService } from '@osf/features/my-profile/services';
import { ResourceFiltersOptionsStateModel } from '@osf/features/search/components/filters/store';

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
} from './my-profile-resource-filters-options.actions';
import { MyProfileResourceFiltersOptionsStateModel } from './my-profile-resource-filters-options.model';

@State<MyProfileResourceFiltersOptionsStateModel>({
  name: 'myProfileResourceFiltersOptions',
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
export class MyProfileResourceFiltersOptionsState {
  readonly #store = inject(Store);
  readonly #filtersOptionsService = inject(MyProfileFiltersOptionsService);

  @Action(GetDatesCreatedOptions)
  getDatesCreated(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#filtersOptionsService.getDates().pipe(
      tap((datesCreated) => {
        ctx.patchState({ datesCreated: datesCreated });
      })
    );
  }

  @Action(GetFundersOptions)
  getFunders(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#filtersOptionsService.getFunders().pipe(
      tap((funders) => {
        ctx.patchState({ funders: funders });
      })
    );
  }

  @Action(GetSubjectsOptions)
  getSubjects(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#filtersOptionsService.getSubjects().pipe(
      tap((subjects) => {
        ctx.patchState({ subjects: subjects });
      })
    );
  }

  @Action(GetLicensesOptions)
  getLicenses(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#filtersOptionsService.getLicenses().pipe(
      tap((licenses) => {
        ctx.patchState({ licenses: licenses });
      })
    );
  }

  @Action(GetResourceTypesOptions)
  getResourceTypes(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#filtersOptionsService.getResourceTypes().pipe(
      tap((resourceTypes) => {
        ctx.patchState({ resourceTypes: resourceTypes });
      })
    );
  }

  @Action(GetInstitutionsOptions)
  getInstitutions(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#filtersOptionsService.getInstitutions().pipe(
      tap((institutions) => {
        ctx.patchState({ institutions: institutions });
      })
    );
  }

  @Action(GetProvidersOptions)
  getProviders(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#filtersOptionsService.getProviders().pipe(
      tap((providers) => {
        ctx.patchState({ providers: providers });
      })
    );
  }
  @Action(GetPartOfCollectionOptions)
  getPartOfCollection(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#filtersOptionsService.getPartOtCollections().pipe(
      tap((partOfCollection) => {
        ctx.patchState({ partOfCollection: partOfCollection });
      })
    );
  }

  @Action(GetAllOptions)
  getAllOptions() {
    this.#store.dispatch(GetDatesCreatedOptions);
    this.#store.dispatch(GetFundersOptions);
    this.#store.dispatch(GetSubjectsOptions);
    this.#store.dispatch(GetLicensesOptions);
    this.#store.dispatch(GetResourceTypesOptions);
    this.#store.dispatch(GetInstitutionsOptions);
    this.#store.dispatch(GetProvidersOptions);
    this.#store.dispatch(GetPartOfCollectionOptions);
  }
}
