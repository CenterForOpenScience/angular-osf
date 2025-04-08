import { ResourceFiltersStateModel } from '@shared/components/resources/resource-filters/store/resource-filters.model';
import { Action, State, StateContext } from '@ngxs/store';
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
import { ResourceType } from '@osf/features/search/models/resource-type.enum';

@State<ResourceFiltersStateModel>({
  name: 'resourceFilters',
  defaults: {
    creator: '',
    dateCreated: new Date(),
    funder: '',
    subject: '',
    license: '',
    resourceType: ResourceType.Null,
    institution: '',
    provider: '',
    partOfCollection: '',
  },
})
export class ResourceFiltersState {
  @Action(SetCreator)
  setCreator(ctx: StateContext<ResourceFiltersStateModel>, action: SetCreator) {
    ctx.patchState({ creator: action.payload });
  }

  @Action(SetDateCreated)
  setDateCreated(
    ctx: StateContext<ResourceFiltersStateModel>,
    action: SetDateCreated,
  ) {
    ctx.patchState({ dateCreated: action.payload });
  }

  @Action(SetFunder)
  setFunder(ctx: StateContext<ResourceFiltersStateModel>, action: SetFunder) {
    ctx.patchState({ funder: action.payload });
  }

  @Action(SetSubject)
  setSubject(ctx: StateContext<ResourceFiltersStateModel>, action: SetSubject) {
    ctx.patchState({ subject: action.payload });
  }

  @Action(SetLicense)
  setLicense(ctx: StateContext<ResourceFiltersStateModel>, action: SetLicense) {
    ctx.patchState({ license: action.payload });
  }

  @Action(SetResourceType)
  setResourceType(
    ctx: StateContext<ResourceFiltersStateModel>,
    action: SetResourceType,
  ) {
    ctx.patchState({ resourceType: action.payload });
  }

  @Action(SetInstitution)
  setInstitution(
    ctx: StateContext<ResourceFiltersStateModel>,
    action: SetInstitution,
  ) {
    ctx.patchState({ institution: action.payload });
  }

  @Action(SetProvider)
  setProvider(
    ctx: StateContext<ResourceFiltersStateModel>,
    action: SetProvider,
  ) {
    ctx.patchState({ provider: action.payload });
  }

  @Action(SetPartOfCollection)
  setPartOfCollection(
    ctx: StateContext<ResourceFiltersStateModel>,
    action: SetPartOfCollection,
  ) {
    ctx.patchState({ partOfCollection: action.payload });
  }
}
