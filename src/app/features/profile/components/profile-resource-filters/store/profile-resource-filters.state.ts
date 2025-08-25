import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';

import { inject, Injectable } from '@angular/core';

import { UserSelectors } from '@osf/core/store/user';
import { FilterLabelsModel } from '@osf/shared/models';
import { resourceFiltersDefaults } from '@shared/constants';

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
} from './profile-resource-filters.actions';
import { ProfileResourceFiltersStateModel } from './profile-resource-filters.model';

@State<ProfileResourceFiltersStateModel>({
  name: 'profileResourceFilters',
  defaults: resourceFiltersDefaults,
})
@Injectable()
export class ProfileResourceFiltersState implements NgxsOnInit {
  store = inject(Store);
  currentUser = this.store.select(UserSelectors.getCurrentUser);

  ngxsOnInit(ctx: StateContext<ProfileResourceFiltersStateModel>) {
    this.currentUser.subscribe((user) => {
      if (user) {
        ctx.patchState({
          creator: {
            filterName: FilterLabelsModel.creator,
            label: undefined,
            value: user.iri,
          },
        });
      }
    });
  }

  @Action(SetCreator)
  setCreator(ctx: StateContext<ProfileResourceFiltersStateModel>, action: SetCreator) {
    ctx.patchState({
      creator: {
        filterName: FilterLabelsModel.creator,
        label: action.name,
        value: action.id,
      },
    });
  }

  @Action(SetDateCreated)
  setDateCreated(ctx: StateContext<ProfileResourceFiltersStateModel>, action: SetDateCreated) {
    ctx.patchState({
      dateCreated: {
        filterName: FilterLabelsModel.dateCreated,
        label: action.date,
        value: action.date,
      },
    });
  }

  @Action(SetFunder)
  setFunder(ctx: StateContext<ProfileResourceFiltersStateModel>, action: SetFunder) {
    ctx.patchState({
      funder: {
        filterName: FilterLabelsModel.funder,
        label: action.funder,
        value: action.id,
      },
    });
  }

  @Action(SetSubject)
  setSubject(ctx: StateContext<ProfileResourceFiltersStateModel>, action: SetSubject) {
    ctx.patchState({
      subject: {
        filterName: FilterLabelsModel.subject,
        label: action.subject,
        value: action.id,
      },
    });
  }

  @Action(SetLicense)
  setLicense(ctx: StateContext<ProfileResourceFiltersStateModel>, action: SetLicense) {
    ctx.patchState({
      license: {
        filterName: FilterLabelsModel.license,
        label: action.license,
        value: action.id,
      },
    });
  }

  @Action(SetResourceType)
  setResourceType(ctx: StateContext<ProfileResourceFiltersStateModel>, action: SetResourceType) {
    ctx.patchState({
      resourceType: {
        filterName: FilterLabelsModel.resourceType,
        label: action.resourceType,
        value: action.id,
      },
    });
  }

  @Action(SetInstitution)
  setInstitution(ctx: StateContext<ProfileResourceFiltersStateModel>, action: SetInstitution) {
    ctx.patchState({
      institution: {
        filterName: FilterLabelsModel.institution,
        label: action.institution,
        value: action.id,
      },
    });
  }

  @Action(SetProvider)
  setProvider(ctx: StateContext<ProfileResourceFiltersStateModel>, action: SetProvider) {
    ctx.patchState({
      provider: {
        filterName: FilterLabelsModel.provider,
        label: action.provider,
        value: action.id,
      },
    });
  }

  @Action(SetPartOfCollection)
  setPartOfCollection(ctx: StateContext<ProfileResourceFiltersStateModel>, action: SetPartOfCollection) {
    ctx.patchState({
      partOfCollection: {
        filterName: FilterLabelsModel.partOfCollection,
        label: action.partOfCollection,
        value: action.id,
      },
    });
  }
}
