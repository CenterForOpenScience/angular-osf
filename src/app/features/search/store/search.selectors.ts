import { SearchState } from '@osf/features/search/store/search.state';
import { Selector } from '@ngxs/store';
import { SearchStateModel } from '@osf/features/search/store/search.model';
import { Resource } from '@osf/features/search/models/resource.entity';

export class SearchSelectors {
  @Selector([SearchState])
  static getResources(state: SearchStateModel): Resource[] {
    return state.resources;
  }
}
