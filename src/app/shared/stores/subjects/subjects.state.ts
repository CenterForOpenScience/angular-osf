import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SubjectModel } from '@shared/models';
import { SubjectsService } from '@shared/services';

import {
  FetchChildrenSubjects,
  FetchSelectedSubjects,
  FetchSubjects,
  UpdateResourceSubjects,
} from './subjects.actions';
import { SubjectsModel } from './subjects.model';

const initialState: SubjectsModel = {
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
  selectedSubjects: {
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

  @Action(FetchSubjects)
  fetchSubjects(ctx: StateContext<SubjectsModel>, { providerId, resourceType, search }: FetchSubjects) {
    if (!resourceType) {
      return;
    }

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

    return this.subjectsService.getSubjects(resourceType, providerId, search).pipe(
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

  @Action(FetchSelectedSubjects)
  fetchSelectedSubjects(ctx: StateContext<SubjectsModel>, { resourceId, resourceType }: FetchSelectedSubjects) {
    if (!resourceType) {
      return;
    }

    ctx.patchState({
      selectedSubjects: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.subjectsService.getResourceSubjects(resourceId, resourceType).pipe(
      tap((subjects) => {
        ctx.patchState({
          selectedSubjects: {
            data: subjects,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'selectedSubjects', error))
    );
  }

  @Action(UpdateResourceSubjects)
  updateResourceSubjects(
    ctx: StateContext<SubjectsModel>,
    { resourceId, resourceType, subjects }: UpdateResourceSubjects
  ) {
    if (!resourceType) {
      return;
    }

    ctx.patchState({
      selectedSubjects: {
        ...ctx.getState().selectedSubjects,
        isLoading: true,
        error: null,
      },
    });

    return this.subjectsService.updateResourceSubjects(resourceId, resourceType, subjects).pipe(
      tap(() => {
        ctx.patchState({
          selectedSubjects: {
            data: subjects,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'selectedSubjects', error))
    );
  }

  private updateSubjectChildren(
    subjects: SubjectModel[],
    parentId: string,
    newChildren: SubjectModel[]
  ): SubjectModel[] {
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
