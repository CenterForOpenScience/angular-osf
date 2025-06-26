import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { NodeSubjectModel } from '@shared/models';
import { SubjectsService } from '@shared/services';
import { GetSubjects, SubjectsModel, UpdateProjectSubjects } from '@shared/stores/subjects';

const initialState: SubjectsModel = {
  highlightedSubjects: {
    data: [],
    isLoading: false,
    error: null,
  },
};

@State<SubjectsModel>({
  name: 'subjects',
  defaults: initialState,
})
@Injectable()
export class SubjectsState {
  private readonly subjectsService = inject(SubjectsService);

  @Action(GetSubjects)
  getSubjects(ctx: StateContext<SubjectsModel>) {
    ctx.patchState({
      highlightedSubjects: {
        data: [],
        isLoading: true,
        error: null,
      },
    });
    return this.subjectsService.getSubjects().pipe(
      tap({
        next: (subjects) => {
          ctx.patchState({
            highlightedSubjects: {
              data: subjects,
              error: null,
              isLoading: false,
            },
          });
        },
      }),
      catchError((error) => {
        ctx.patchState({
          highlightedSubjects: {
            ...ctx.getState().highlightedSubjects,
            isLoading: false,
            error,
          },
        });
        return throwError(() => error);
      }),
      catchError((error) => {
        ctx.patchState({
          highlightedSubjects: {
            ...ctx.getState().highlightedSubjects,
            isLoading: false,
            error,
          },
        });
        return throwError(() => error);
      })
    );
  }

  @Action(UpdateProjectSubjects)
  updateProjectSubjects(ctx: StateContext<SubjectsModel>, action: UpdateProjectSubjects) {
    return this.subjectsService.updateProjectSubjects(action.projectId, action.subjectIds).pipe(
      tap({
        next: (result) => {
          const state = ctx.getState();

          const updatedSubjects = result
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

              const foundSubject = findSubjectById(state.highlightedSubjects.data);
              return foundSubject
                ? {
                    id: foundSubject.id,
                    text: foundSubject.text,
                  }
                : null;
            })
            .filter((subject: { id: string; text: string } | null) => subject !== null);

          return updatedSubjects;
        },
      })
    );
  }
}
