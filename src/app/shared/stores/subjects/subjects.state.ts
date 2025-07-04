import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SUBJECTS_SERVICE } from '@osf/shared/tokens/subjects.token';
import { ISubjectsService, NodeSubjectModel, Subject } from '@shared/models';
import { SubjectsService } from '@shared/services';

import { FetchChildrenSubjects, FetchSubjects, GetSubjects, UpdateProjectSubjects } from './subjects.actions';
import { SubjectsModel } from './subjects.model';

const initialState: SubjectsModel = {
  highlightedSubjects: {
    data: [],
    isLoading: false,
    error: null,
  },
  subjects: {
    data: [],
    isLoading: false,
    error: null,
  },
  searchedSubjects: {
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
  private readonly projectSubjectsService = inject(SubjectsService);
  private readonly subjectsService = inject<ISubjectsService>(SUBJECTS_SERVICE);

  @Action(FetchSubjects)
  fetchSubjects(ctx: StateContext<SubjectsModel>, { providerId, search }: FetchSubjects) {
    ctx.patchState({
      subjects: {
        ...ctx.getState().subjects,
        isLoading: true,
        error: null,
      },
      searchedSubjects: {
        ...ctx.getState().searchedSubjects,
        isLoading: search ? true : false,
        error: null,
      },
    });

    return this.subjectsService.getSubjects(providerId, search).pipe(
      tap((subjects) => {
        if (search) {
          ctx.patchState({
            searchedSubjects: {
              data: subjects,
              isLoading: false,
              error: null,
            },
          });
        } else {
          ctx.patchState({
            subjects: {
              data: subjects,
              isLoading: false,
              error: null,
            },
          });
        }
      }),
      catchError((error) => this.handleError(ctx, 'subjects', error))
    );
  }

  @Action(FetchChildrenSubjects)
  fetchSubjectsChildren(ctx: StateContext<SubjectsModel>, { parentId }: FetchChildrenSubjects) {
    ctx.patchState({
      subjects: {
        ...ctx.getState().subjects,
        isLoading: true,
        error: null,
      },
    });

    return this.subjectsService.getChildrenSubjects(parentId).pipe(
      tap((children) => {
        const state = ctx.getState();
        const updatedSubjects = this.updateSubjectChildren(state.subjects.data, parentId, children);
        ctx.patchState({
          subjects: {
            data: updatedSubjects,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'subjects', error))
    );
  }

  @Action(GetSubjects)
  getSubjects(ctx: StateContext<SubjectsModel>) {
    ctx.patchState({
      highlightedSubjects: {
        data: [],
        isLoading: true,
        error: null,
      },
    });
    return this.projectSubjectsService.getSubjects().pipe(
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
    return this.projectSubjectsService.updateProjectSubjects(action.projectId, action.subjectIds).pipe(
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

  private updateSubjectChildren(subjects: Subject[], parentId: string, newChildren: Subject[]): Subject[] {
    return subjects.map((subject) => {
      if (subject.id === parentId) {
        return { ...subject, children: newChildren };
      }

      if (subject.children && subject.children.length > 0) {
        return {
          ...subject,
          children: this.updateSubjectChildren(subject.children, parentId, newChildren),
        };
      }

      return subject;
    });
  }

  private handleError(ctx: StateContext<SubjectsModel>, section: keyof SubjectsModel, error: Error) {
    ctx.patchState({
      [section]: {
        ...ctx.getState()[section],
        isLoading: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }
}
