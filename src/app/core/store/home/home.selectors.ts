import { Selector } from '@ngxs/store';
import { HomeStateModel } from '@core/store/home/home.model';
import { HomeState } from '@core/store/home/home.state';
import { Project } from '@osf/features/home/models/project.entity';

export class HomeSelectors {
  @Selector([HomeState])
  static getProjects(state: HomeStateModel): Project[] {
    return state.projects;
  }

  @Selector([HomeState])
  static getNoteworthy(state: HomeStateModel): Project[] {
    return state.noteworthy;
  }

  @Selector([HomeState])
  static getMostPopular(state: HomeStateModel): Project[] {
    return state.mostPopular;
  }
}
