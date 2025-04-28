import { ResourceFiltersStateModel } from '@shared/components/resources/resource-filters/store/resource-filters.model';
import { Action, State, StateContext } from '@ngxs/store';

import { Injectable } from '@angular/core';
import {
  SetCreator,
  SetDateCreated,
  SetFunder,
  SetInstitution,
  SetLicense,
  SetPartOfCollection,
  SetProvider,
  SetResourceType,
  SetSubject,
} from '@shared/components/resources/resource-filters/store/resource-filters.actions';
import { FilterLabels } from '@shared/components/resources/resource-filters/models/filter-labels';

// Store for user selected filters values
@State<ResourceFiltersStateModel>({
  name: 'resourceFilters',
  defaults: {
    creator: {
      filterName: FilterLabels.creator,
      label: undefined,
      value: undefined,
    },
    dateCreated: {
      filterName: FilterLabels.dateCreated,
      label: undefined,
      value: undefined,
    },
    funder: {
      filterName: FilterLabels.funder,
      label: undefined,
      value: undefined,
    },
    subject: {
      filterName: FilterLabels.subject,
      label: undefined,
      value: undefined,
    },
    license: {
      filterName: FilterLabels.license,
      label: undefined,
      value: undefined,
    },
    resourceType: {
      filterName: FilterLabels.resourceType,
      label: undefined,
      value: undefined,
    },
    institution: {
      filterName: FilterLabels.institution,
      label: undefined,
      value: undefined,
    },
    provider: {
      filterName: FilterLabels.provider,
      label: undefined,
      value: undefined,
    },
    partOfCollection: {
      filterName: FilterLabels.partOfCollection,
      label: undefined,
      value: undefined,
    },
  },
})
@Injectable()
export class ResourceFiltersState {
  @Action(SetCreator)
  setCreator(ctx: StateContext<ResourceFiltersStateModel>, action: SetCreator) {
    ctx.patchState({
      creator: {
        filterName: FilterLabels.creator,
        label: action.name,
        value: action.id,
      },
    });
  }

  @Action(SetDateCreated)
  setDateCreated(
    ctx: StateContext<ResourceFiltersStateModel>,
    action: SetDateCreated,
  ) {
    ctx.patchState({
      dateCreated: {
        filterName: FilterLabels.dateCreated,
        label: action.date,
        value: action.date,
      },
    });
  }

  @Action(SetFunder)
  setFunder(ctx: StateContext<ResourceFiltersStateModel>, action: SetFunder) {
    ctx.patchState({
      funder: {
        filterName: FilterLabels.funder,
        label: action.funder,
        value: action.id,
      },
    });
  }

  @Action(SetSubject)
  setSubject(ctx: StateContext<ResourceFiltersStateModel>, action: SetSubject) {
    ctx.patchState({
      subject: {
        filterName: FilterLabels.subject,
        label: action.subject,
        value: action.id,
      },
    });
  }

  @Action(SetLicense)
  setLicense(ctx: StateContext<ResourceFiltersStateModel>, action: SetLicense) {
    ctx.patchState({
      license: {
        filterName: FilterLabels.license,
        label: action.license,
        value: action.id,
      },
    });
  }

  @Action(SetResourceType)
  setResourceType(
    ctx: StateContext<ResourceFiltersStateModel>,
    action: SetResourceType,
  ) {
    ctx.patchState({
      resourceType: {
        filterName: FilterLabels.resourceType,
        label: action.resourceType,
        value: action.id,
      },
    });
  }

  @Action(SetInstitution)
  setInstitution(
    ctx: StateContext<ResourceFiltersStateModel>,
    action: SetInstitution,
  ) {
    ctx.patchState({
      institution: {
        filterName: FilterLabels.institution,
        label: action.institution,
        value: action.id,
      },
    });
  }

  @Action(SetProvider)
  setProvider(
    ctx: StateContext<ResourceFiltersStateModel>,
    action: SetProvider,
  ) {
    ctx.patchState({
      provider: {
        filterName: FilterLabels.provider,
        label: action.provider,
        value: action.id,
      },
    });
  }

  @Action(SetPartOfCollection)
  setPartOfCollection(
    ctx: StateContext<ResourceFiltersStateModel>,
    action: SetPartOfCollection,
  ) {
    ctx.patchState({
      partOfCollection: {
        filterName: FilterLabels.partOfCollection,
        label: action.partOfCollection,
        value: action.id,
      },
    });
  }
}
