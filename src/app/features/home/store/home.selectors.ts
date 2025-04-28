import { Selector } from '@ngxs/store';
import { HomeStateModel } from '@osf/features/home/store/home.model';
import { HomeState } from '@osf/features/home/store/home.state';
import { Project } from '@osf/features/home/models/project.entity';

export class HomeSelectors {
  @Selector([HomeState])
  static getProjects(state: HomeStateModel): Project[] {
    return state.projects;
  }
}
