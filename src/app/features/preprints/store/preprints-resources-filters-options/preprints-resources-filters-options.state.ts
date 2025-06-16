import { Action, State, StateContext, Store } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { PreprintsFiltersOptionsService } from '@osf/features/preprints/services';
import { PreprintsDiscoverSelectors } from '@osf/features/preprints/store/preprints-discover';

import {
  GetAllOptions,
  GetCreatorsOptions,
  GetDatesCreatedOptions,
  GetInstitutionsOptions,
  GetLicensesOptions,
  GetProvidersOptions,
  GetSubjectsOptions,
} from './preprints-resources-filters-options.actions';
import { PreprintsResourceFiltersOptionsStateModel } from './preprints-resources-filters-options.model';

@State<PreprintsResourceFiltersOptionsStateModel>({
  name: 'preprintsResourceFiltersOptions',
  defaults: {
    creators: [],
    datesCreated: [],
    subjects: [],
    licenses: [],
    providers: [],
    institutions: [],
  },
})
@Injectable()
export class PreprintsResourcesFiltersOptionsState {
  readonly store = inject(Store);
  readonly resourceFiltersService = inject(PreprintsFiltersOptionsService);

  @Action(GetCreatorsOptions)
  getCreatorsOptions(ctx: StateContext<PreprintsResourceFiltersOptionsStateModel>, action: GetCreatorsOptions) {
    if (!action.searchName) {
      ctx.patchState({ creators: [] });
      return [];
    }

    return this.resourceFiltersService.getCreators(action.searchName).pipe(
      tap((creators) => {
        ctx.patchState({ creators: creators });
      })
    );
  }

  @Action(GetDatesCreatedOptions)
  getDatesCreated(ctx: StateContext<PreprintsResourceFiltersOptionsStateModel>) {
    return this.resourceFiltersService.getDates().pipe(
      tap((datesCreated) => {
        ctx.patchState({ datesCreated: datesCreated });
      })
    );
  }

  @Action(GetSubjectsOptions)
  getSubjects(ctx: StateContext<PreprintsResourceFiltersOptionsStateModel>) {
    return this.resourceFiltersService.getSubjects().pipe(
      tap((subjects) => {
        ctx.patchState({ subjects: subjects });
      })
    );
  }

  @Action(GetInstitutionsOptions)
  getInstitutions(ctx: StateContext<PreprintsResourceFiltersOptionsStateModel>) {
    return this.resourceFiltersService.getInstitutions().pipe(
      tap((institutions) => {
        ctx.patchState({ institutions: institutions });
      })
    );
  }

  @Action(GetLicensesOptions)
  getLicenses(ctx: StateContext<PreprintsResourceFiltersOptionsStateModel>) {
    return this.resourceFiltersService.getLicenses().pipe(
      tap((licenses) => {
        ctx.patchState({ licenses: licenses });
      })
    );
  }

  @Action(GetProvidersOptions)
  getProviders(ctx: StateContext<PreprintsResourceFiltersOptionsStateModel>) {
    return this.resourceFiltersService.getProviders().pipe(
      tap((providers) => {
        ctx.patchState({ providers: providers });
      })
    );
  }

  @Action(GetAllOptions)
  getAllOptions() {
    if (!this.store.selectSnapshot(PreprintsDiscoverSelectors.getIri)) {
      return;
    }
    this.store.dispatch(GetDatesCreatedOptions);
    this.store.dispatch(GetSubjectsOptions);
    this.store.dispatch(GetLicensesOptions);
    this.store.dispatch(GetProvidersOptions);
    this.store.dispatch(GetInstitutionsOptions);
  }
}
