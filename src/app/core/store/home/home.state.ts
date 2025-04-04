import { HomeStateModel } from '@core/store/home/home.model';
import { Action, State, StateContext } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { DashboardService } from '@osf/features/home/dashboard.service';
import {
  GetMostPopular,
  GetNoteworthy,
  GetProjects,
} from '@core/store/home/home.actions';
import { tap } from 'rxjs';

@State<HomeStateModel>({
  name: 'home',
  defaults: {
    projects: [],
    noteworthy: [],
    mostPopular: [],
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

  @Action(GetMostPopular)
  getMostPopular(ctx: StateContext<HomeStateModel>) {
    return this.homeService.getMostPopular().pipe(
      tap((mostPopular) => {
        ctx.patchState({ mostPopular: mostPopular });
      }),
    );
  }

  @Action(GetNoteworthy)
  GetNoteworthy(ctx: StateContext<HomeStateModel>) {
    return this.homeService.getNoteworthy().pipe(
      tap((noteworthy) => {
        ctx.patchState({ noteworthy: noteworthy });
      }),
    );
  }
}
