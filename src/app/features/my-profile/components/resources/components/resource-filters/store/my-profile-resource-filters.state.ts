import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';

import { inject, Injectable } from '@angular/core';

import { UserSelectors } from '@core/store/user/user.selectors';
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
} from '@osf/features/my-profile/components/resources/components/resource-filters/store/my-profile-resource-filters.actions';
import { MyProfileResourceFiltersStateModel } from '@osf/features/my-profile/components/resources/components/resource-filters/store/my-profile-resource-filters.model';
import { FilterLabelsModel } from '@shared/utils/filter-labels.model';
import { resourceFiltersDefaultsModel } from '@shared/utils/resource-filters-defaults.model';

// Store for user selected filters values
@State<MyProfileResourceFiltersStateModel>({
  name: 'myProfileResourceFilters',
  defaults: resourceFiltersDefaultsModel,
})
@Injectable()
export class MyProfileResourceFiltersState implements NgxsOnInit {
  #store = inject(Store);
  #currentUser = this.#store.select(UserSelectors.getCurrentUser);

  ngxsOnInit(ctx: StateContext<MyProfileResourceFiltersStateModel>) {
    this.#currentUser.subscribe((user) => {
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
  setCreator(ctx: StateContext<MyProfileResourceFiltersStateModel>, action: SetCreator) {
    ctx.patchState({
      creator: {
        filterName: FilterLabelsModel.creator,
        label: action.name,
        value: action.id,
      },
    });
  }

  @Action(SetDateCreated)
  setDateCreated(ctx: StateContext<MyProfileResourceFiltersStateModel>, action: SetDateCreated) {
    ctx.patchState({
      dateCreated: {
        filterName: FilterLabelsModel.dateCreated,
        label: action.date,
        value: action.date,
      },
    });
  }

  @Action(SetFunder)
  setFunder(ctx: StateContext<MyProfileResourceFiltersStateModel>, action: SetFunder) {
    ctx.patchState({
      funder: {
        filterName: FilterLabelsModel.funder,
        label: action.funder,
        value: action.id,
      },
    });
  }

  @Action(SetSubject)
  setSubject(ctx: StateContext<MyProfileResourceFiltersStateModel>, action: SetSubject) {
    ctx.patchState({
      subject: {
        filterName: FilterLabelsModel.subject,
        label: action.subject,
        value: action.id,
      },
    });
  }

  @Action(SetLicense)
  setLicense(ctx: StateContext<MyProfileResourceFiltersStateModel>, action: SetLicense) {
    ctx.patchState({
      license: {
        filterName: FilterLabelsModel.license,
        label: action.license,
        value: action.id,
      },
    });
  }

  @Action(SetResourceType)
  setResourceType(ctx: StateContext<MyProfileResourceFiltersStateModel>, action: SetResourceType) {
    ctx.patchState({
      resourceType: {
        filterName: FilterLabelsModel.resourceType,
        label: action.resourceType,
        value: action.id,
      },
    });
  }

  @Action(SetInstitution)
  setInstitution(ctx: StateContext<MyProfileResourceFiltersStateModel>, action: SetInstitution) {
    ctx.patchState({
      institution: {
        filterName: FilterLabelsModel.institution,
        label: action.institution,
        value: action.id,
      },
    });
  }

  @Action(SetProvider)
  setProvider(ctx: StateContext<MyProfileResourceFiltersStateModel>, action: SetProvider) {
    ctx.patchState({
      provider: {
        filterName: FilterLabelsModel.provider,
        label: action.provider,
        value: action.id,
      },
    });
  }

  @Action(SetPartOfCollection)
  setPartOfCollection(ctx: StateContext<MyProfileResourceFiltersStateModel>, action: SetPartOfCollection) {
    ctx.patchState({
      partOfCollection: {
        filterName: FilterLabelsModel.partOfCollection,
        label: action.partOfCollection,
        value: action.id,
      },
    });
  }
}
