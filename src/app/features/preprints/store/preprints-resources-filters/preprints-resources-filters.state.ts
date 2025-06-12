import { Action, State, StateContext } from '@ngxs/store';

import { Injectable } from '@angular/core';

import { FilterLabelsModel } from '@osf/shared/models';
import { resourceFiltersDefaults } from '@shared/constants';

import {
  ResetFiltersState,
  SetCreator,
  SetDateCreated,
  SetInstitution,
  SetLicense,
  SetProvider,
  SetSubject,
} from './preprints-resources-filters.actions';
import { PreprintsResourcesFiltersStateModel } from './preprints-resources-filters.model';

@State<PreprintsResourcesFiltersStateModel>({
  name: 'preprintsResourceFilters',
  defaults: { ...resourceFiltersDefaults },
})
@Injectable()
export class PreprintsResourcesFiltersState {
  @Action(SetCreator)
  setCreator(ctx: StateContext<PreprintsResourcesFiltersStateModel>, action: SetCreator) {
    ctx.patchState({
      creator: {
        filterName: FilterLabelsModel.creator,
        label: action.name,
        value: action.id,
      },
    });
  }

  @Action(SetDateCreated)
  setDateCreated(ctx: StateContext<PreprintsResourcesFiltersStateModel>, action: SetDateCreated) {
    ctx.patchState({
      dateCreated: {
        filterName: FilterLabelsModel.dateCreated,
        label: action.date,
        value: action.date,
      },
    });
  }

  @Action(SetSubject)
  setSubject(ctx: StateContext<PreprintsResourcesFiltersStateModel>, action: SetSubject) {
    ctx.patchState({
      subject: {
        filterName: FilterLabelsModel.subject,
        label: action.subject,
        value: action.id,
      },
    });
  }

  @Action(SetInstitution)
  setInstitution(ctx: StateContext<PreprintsResourcesFiltersStateModel>, action: SetInstitution) {
    ctx.patchState({
      institution: {
        filterName: FilterLabelsModel.institution,
        label: action.institution,
        value: action.id,
      },
    });
  }

  @Action(SetLicense)
  setLicense(ctx: StateContext<PreprintsResourcesFiltersStateModel>, action: SetLicense) {
    ctx.patchState({
      license: {
        filterName: FilterLabelsModel.license,
        label: action.license,
        value: action.id,
      },
    });
  }

  @Action(SetProvider)
  setProvider(ctx: StateContext<PreprintsResourcesFiltersStateModel>, action: SetProvider) {
    ctx.patchState({
      provider: {
        filterName: FilterLabelsModel.provider,
        label: action.provider,
        value: action.id,
      },
    });
  }

  @Action(ResetFiltersState)
  resetState(ctx: StateContext<PreprintsResourcesFiltersStateModel>) {
    ctx.patchState({ ...resourceFiltersDefaults });
  }
}
