import { Action, State, StateContext, Store } from '@ngxs/store';

import { finalize, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { NodeSubjectModel } from '@shared/models';
import { SubjectsService } from '@shared/services';
import { GetSubjects, SubjectsStateModel, UpdateProjectSubjects } from '@shared/stores';

const initialState: SubjectsStateModel = {
  highlightedSubjects: [],
  highlightedSubjectsLoading: false,
};

@State<SubjectsStateModel>({
  name: 'subjects',
  defaults: initialState,
})
@Injectable()
export class SubjectsState {
  private readonly subjectsService = inject(SubjectsService);
  private readonly store = inject(Store);

  @Action(GetSubjects)
  getSubjects(ctx: StateContext<SubjectsStateModel>) {
    ctx.patchState({ highlightedSubjectsLoading: true });
    return this.subjectsService.getSubjects().pipe(
      tap({
        next: (subjects) => {
          ctx.patchState({
            highlightedSubjects: subjects,
            highlightedSubjectsLoading: false,
          });
        },
        error: () => {
          ctx.patchState({ highlightedSubjectsLoading: false });
        },
      }),
      finalize(() => ctx.patchState({ highlightedSubjectsLoading: false }))
    );
  }

  @Action(UpdateProjectSubjects)
  updateProjectSubjects(ctx: StateContext<SubjectsStateModel>, action: UpdateProjectSubjects) {
    return this.subjectsService.updateProjectSubjects(action.projectId, action.subjectIds).pipe(
      tap({
        next: (result) => {
          const state = ctx.getState();

          return result
            .map((updatedSubject: { id: string; type: string }) => {
              const findSubjectById = (subjects: NodeSubjectModel[]): NodeSubjectModel | undefined => {
                for (const subject of subjects) {
                  if (subject.id === updatedSubject.id) {
                    return subject;
                  }
                  if (subject.children) {
                    const found = findSubjectById(subject.children);
                    if (found) {
                      return found;
                    }
                  }
                }
                return undefined;
              };

              const foundSubject = findSubjectById(state.highlightedSubjects);
              return foundSubject
                ? {
                    id: foundSubject.id,
                    text: foundSubject.text,
                  }
                : null;
            })
            .filter((subject: { id: string; text: string } | null) => subject !== null);
        },
      })
    );
  }
}
