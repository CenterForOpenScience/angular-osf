import { Action, State, StateContext } from '@ngxs/store';

import { Injectable } from '@angular/core';

import { FilterLabelsModel } from '@osf/shared/models';
import { resourceFiltersDefaults } from '@shared/constants';

import {
  ResetFiltersState,
  SetCreator,
  SetDateCreated,
  SetFunder,
  SetInstitution,
  SetLicense,
  SetPartOfCollection,
  SetProvider,
  SetResourceType,
  SetSubject,
} from './resource-filters.actions';
import { ResourceFiltersStateModel } from './resource-filters.model';

// Store for user selected filters values
@State<ResourceFiltersStateModel>({
  name: 'resourceFilters',
  defaults: resourceFiltersDefaults,
})
@Injectable()
export class ResourceFiltersState {
  @Action(SetCreator)
  setCreator(ctx: StateContext<ResourceFiltersStateModel>, action: SetCreator) {
    ctx.patchState({
      creator: {
        filterName: FilterLabelsModel.creator,
        label: action.name,
        value: action.id,
      },
    });
  }

  @Action(SetDateCreated)
  setDateCreated(ctx: StateContext<ResourceFiltersStateModel>, action: SetDateCreated) {
    ctx.patchState({
      dateCreated: {
        filterName: FilterLabelsModel.dateCreated,
        label: action.date,
        value: action.date,
      },
    });
  }

  @Action(SetFunder)
  setFunder(ctx: StateContext<ResourceFiltersStateModel>, action: SetFunder) {
    ctx.patchState({
      funder: {
        filterName: FilterLabelsModel.funder,
        label: action.funder,
        value: action.id,
      },
    });
  }

  @Action(SetSubject)
  setSubject(ctx: StateContext<ResourceFiltersStateModel>, action: SetSubject) {
    ctx.patchState({
      subject: {
        filterName: FilterLabelsModel.subject,
        label: action.subject,
        value: action.id,
      },
    });
  }

  @Action(SetLicense)
  setLicense(ctx: StateContext<ResourceFiltersStateModel>, action: SetLicense) {
    ctx.patchState({
      license: {
        filterName: FilterLabelsModel.license,
        label: action.license,
        value: action.id,
      },
    });
  }

  @Action(SetResourceType)
  setResourceType(ctx: StateContext<ResourceFiltersStateModel>, action: SetResourceType) {
    ctx.patchState({
      resourceType: {
        filterName: FilterLabelsModel.resourceType,
        label: action.resourceType,
        value: action.id,
      },
    });
  }

  @Action(SetInstitution)
  setInstitution(ctx: StateContext<ResourceFiltersStateModel>, action: SetInstitution) {
    ctx.patchState({
      institution: {
        filterName: FilterLabelsModel.institution,
        label: action.institution,
        value: action.id,
      },
    });
  }

  @Action(SetProvider)
  setProvider(ctx: StateContext<ResourceFiltersStateModel>, action: SetProvider) {
    ctx.patchState({
      provider: {
        filterName: FilterLabelsModel.provider,
        label: action.provider,
        value: action.id,
      },
    });
  }

  @Action(SetPartOfCollection)
  setPartOfCollection(ctx: StateContext<ResourceFiltersStateModel>, action: SetPartOfCollection) {
    ctx.patchState({
      partOfCollection: {
        filterName: FilterLabelsModel.partOfCollection,
        label: action.partOfCollection,
        value: action.id,
      },
    });
  }

  @Action(ResetFiltersState)
  resetState(ctx: StateContext<ResourceFiltersStateModel>) {
    ctx.patchState(resourceFiltersDefaults);
  }
}
