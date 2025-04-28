import { HomeStateModel } from '@osf/features/home/store/home.model';
import { Action, State, StateContext } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { DashboardService } from '@osf/features/home/dashboard.service';
import { GetProjects } from '@osf/features/home/store/home.actions';
import { tap } from 'rxjs';

@State<HomeStateModel>({
  name: 'home',
  defaults: {
    projects: [],
  },
})
@Injectable()
export class HomeState {
  homeService = inject(DashboardService);

  @Action(GetProjects)
  getProjects(ctx: StateContext<HomeStateModel>) {
    return this.homeService.getProjects().pipe(
      tap((projects) => {
        ctx.patchState({ projects: projects });
      }),
    );
  }
}
