import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { NodeSubjectModel } from '@shared/models';
import { SubjectsService } from '@shared/services';
import {
  GetChildrenSubjects,
  GetParentSubjects,
  GetSubjects,
  LoadProjectSubjects,
  SubjectsModel,
  UpdateProjectSubjects,
} from '@shared/stores/subjects';

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
  projectSubjects: {
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

  @Action(LoadProjectSubjects)
  loadProjectSubjects(ctx: StateContext<SubjectsModel>, action: LoadProjectSubjects) {
    ctx.patchState({
      projectSubjects: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.subjectsService.getProjectSubjects(action.projectId).pipe(
      tap({
        next: (subjects) => {
          ctx.patchState({
            projectSubjects: {
              data: subjects,
              error: null,
              isLoading: false,
            },
          });
        },
      }),
      catchError((error) => {
        ctx.patchState({
          projectSubjects: {
            ...ctx.getState().projectSubjects,
            isLoading: false,
            error,
          },
        });
        return throwError(() => error);
      })
    );
  }

  @Action(GetParentSubjects)
  getParentSubjects(ctx: StateContext<SubjectsModel>) {
    ctx.patchState({
      subjects: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.subjectsService.getParentSubjects().pipe(
      tap({
        next: (subjects) => {
          ctx.patchState({
            subjects: {
              data: subjects,
              error: null,
              isLoading: false,
            },
          });
        },
      }),
      catchError((error) => {
        ctx.patchState({
          subjects: {
            ...ctx.getState().subjects,
            isLoading: false,
            error,
          },
        });
        return throwError(() => error);
      })
    );
  }

  @Action(GetChildrenSubjects)
  getChildrenSubjects(ctx: StateContext<SubjectsModel>, action: GetChildrenSubjects) {
    const state = ctx.getState();

    ctx.patchState({
      subjects: {
        ...state.subjects,
        isLoading: true,
      },
    });

    return this.subjectsService.getChildrenSubjects(action.parentId).pipe(
      tap({
        next: (subjects) => {
          ctx.patchState({
            subjects: {
              data: state.subjects.data.map((x) => {
                if (x.id === action.greatParentId) {
                  return {
                    ...x,
                    children: x.children?.map((p) => (p.id === action.parentId ? { ...p, children: subjects } : p)),
                  };
                }
                if (x.id === action.parentId && !action.greatParentId) {
                  return { ...x, children: subjects };
                }
                return x;
              }),
              error: null,
              isLoading: false,
            },
          });
        },
      }),
      catchError((error) => {
        ctx.patchState({
          subjects: {
            ...ctx.getState().subjects,
            isLoading: false,
            error,
          },
        });
        return throwError(() => error);
      })
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
