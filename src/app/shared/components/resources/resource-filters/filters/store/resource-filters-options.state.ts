import { Action, State, StateContext, Store } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import {
  GetAllOptions,
  GetCreatorsOptions,
  GetDatesCreatedOptions,
  GetFundersOptions,
  GetInstitutionsOptions,
  GetLicensesOptions,
  GetPartOfCollectionOptions,
  GetProvidersOptions,
  GetResourceTypesOptions,
  GetSubjectsOptions,
} from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.actions';
import { ResourceFiltersOptionsStateModel } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.model';
import { ResourceFiltersService } from '@shared/components/resources/resource-filters/resource-filters.service';

@State<ResourceFiltersOptionsStateModel>({
  name: 'resourceFiltersOptions',
  defaults: {
    creators: [],
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
export class ResourceFiltersOptionsState {
  readonly #store = inject(Store);
  readonly #resourceFiltersService = inject(ResourceFiltersService);

  @Action(GetCreatorsOptions)
  getProjects(
    ctx: StateContext<ResourceFiltersOptionsStateModel>,
    action: GetCreatorsOptions,
  ) {
    if (!action.searchName) {
      ctx.patchState({ creators: [] });
      return [];
    }

    return this.#resourceFiltersService.getCreators(action.searchName).pipe(
      tap((creators) => {
        ctx.patchState({ creators: creators });
      }),
    );
  }

  @Action(GetDatesCreatedOptions)
  getDatesCreated(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#resourceFiltersService.getDates().pipe(
      tap((datesCreated) => {
        ctx.patchState({ datesCreated: datesCreated });
      }),
    );
  }

  @Action(GetFundersOptions)
  getFunders(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#resourceFiltersService.getFunders().pipe(
      tap((funders) => {
        ctx.patchState({ funders: funders });
      }),
    );
  }

  @Action(GetSubjectsOptions)
  getSubjects(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#resourceFiltersService.getSubjects().pipe(
      tap((subjects) => {
        ctx.patchState({ subjects: subjects });
      }),
    );
  }

  @Action(GetLicensesOptions)
  getLicenses(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#resourceFiltersService.getLicenses().pipe(
      tap((licenses) => {
        ctx.patchState({ licenses: licenses });
      }),
    );
  }

  @Action(GetResourceTypesOptions)
  getResourceTypes(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#resourceFiltersService.getResourceTypes().pipe(
      tap((resourceTypes) => {
        ctx.patchState({ resourceTypes: resourceTypes });
      }),
    );
  }

  @Action(GetInstitutionsOptions)
  getInstitutions(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#resourceFiltersService.getInstitutions().pipe(
      tap((institutions) => {
        ctx.patchState({ institutions: institutions });
      }),
    );
  }

  @Action(GetProvidersOptions)
  getProviders(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#resourceFiltersService.getProviders().pipe(
      tap((providers) => {
        ctx.patchState({ providers: providers });
      }),
    );
  }
  @Action(GetPartOfCollectionOptions)
  getPartOfCollection(ctx: StateContext<ResourceFiltersOptionsStateModel>) {
    return this.#resourceFiltersService.getPartOtCollections().pipe(
      tap((partOfCollection) => {
        ctx.patchState({ partOfCollection: partOfCollection });
      }),
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
