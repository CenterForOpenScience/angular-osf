import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';

import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { AddContributorType } from '@osf/shared/enums/contributors/add-contributor-type.enum';
import { AddDialogState } from '@osf/shared/enums/contributors/add-dialog-state.enum';
import { ClearUsers, ContributorsSelectors, SearchUsers } from '@osf/shared/stores/contributors';
import { ComponentCheckboxItemModel } from '@shared/models/component-checkbox-item.model';
import { ContributorAddModel } from '@shared/models/contributors/contributor-add.model';
import { ContributorDialogAddModel } from '@shared/models/contributors/contributor-dialog-add.model';

import { ComponentsSelectionListComponent } from '../../components-selection-list/components-selection-list.component';
import { CustomPaginatorComponent } from '../../custom-paginator/custom-paginator.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '../../search-input/search-input.component';
import { AddContributorItemComponent } from '../add-contributor-item/add-contributor-item.component';

@Component({
  selector: 'osf-add-contributor-dialog',
  imports: [
    Button,
    Checkbox,
    FormsModule,
    TranslatePipe,
    SearchInputComponent,
    LoadingSpinnerComponent,
    CustomPaginatorComponent,
    AddContributorItemComponent,
    ComponentsSelectionListComponent,
  ],
  templateUrl: './add-contributor-dialog.component.html',
  styleUrl: './add-contributor-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddContributorDialogComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(DynamicDialogRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly actions = createDispatchMap({ searchUsers: SearchUsers, clearUsers: ClearUsers });

  readonly users = select(ContributorsSelectors.getUsers);
  readonly isLoading = select(ContributorsSelectors.isUsersLoading);
  readonly totalUsersCount = select(ContributorsSelectors.getUsersTotalCount);

  readonly searchControl = new FormControl<string>('');
  readonly isInitialState = signal(true);
  readonly currentState = signal(AddDialogState.Search);
  readonly currentPage = signal(1);
  readonly first = signal(0);
  readonly pageSize = signal(DEFAULT_TABLE_PARAMS.rows);
  readonly selectedUsers = signal<ContributorAddModel[]>([]);
  readonly components = signal<ComponentCheckboxItemModel[]>([]);
  readonly resourceName = signal<string>('');
  readonly parentResourceName = signal<string>('');
  readonly allowAddingContributorsFromParentProject = signal<boolean>(false);

  readonly contributorNames = computed(() =>
    this.selectedUsers()
      .map((user) => user.fullName)
      .join(', ')
  );

  readonly isSearchState = computed(() => this.currentState() === AddDialogState.Search);
  readonly isDetailsState = computed(() => this.currentState() === AddDialogState.Details);
  readonly isComponentsState = computed(() => this.currentState() === AddDialogState.Components);
  readonly hasComponents = computed(() => this.components().length > 1);
  readonly buttonLabel = computed(() =>
    (this.isDetailsState() && !this.hasComponents()) || this.isComponentsState()
      ? 'common.buttons.done'
      : 'common.buttons.next'
  );

  constructor() {
    this.setupEffects();
  }

  ngOnInit(): void {
    this.initializeDialogData();
    this.setSearchSubscription();
  }

  ngOnDestroy(): void {
    this.actions.clearUsers();
  }

  addContributor(): void {
    const state = this.currentState();

    if (state === AddDialogState.Search) {
      this.currentState.set(AddDialogState.Details);
      return;
    }

    if (state === AddDialogState.Details) {
      this.currentState.set(this.hasComponents() ? AddDialogState.Components : AddDialogState.Search);

      if (!this.hasComponents()) {
        this.closeDialogWithData();
      }
      return;
    }

    if (state === AddDialogState.Components) {
      this.closeDialogWithData();
    }
  }

  addSourceProjectContributors(): void {
    this.closeDialogWithData(AddContributorType.ParentProject);
  }

  addUnregistered(): void {
    this.dialogRef.close({
      data: [],
      type: AddContributorType.Unregistered,
    });
  }

  pageChanged(event: PaginatorState): void {
    this.currentPage.set(event.page ? this.currentPage() + 1 : 1);
    this.first.set(event.first ?? 0);
    this.actions.searchUsers(this.searchControl.value, this.currentPage());
  }

  private initializeDialogData(): void {
    this.selectedUsers.set([]);

    const { components, resourceName, parentResourceName, allowAddingContributorsFromParentProject } =
      this.config.data || {};

    if (components) {
      this.components.set(components);
    }

    if (resourceName) {
      this.resourceName.set(resourceName);
    }

    if (allowAddingContributorsFromParentProject) {
      this.allowAddingContributorsFromParentProject.set(allowAddingContributorsFromParentProject);
    }

    if (parentResourceName) {
      this.parentResourceName.set(parentResourceName);
    }
  }

  private closeDialogWithData(AddContributorTypeValue = AddContributorType.Registered): void {
    const childNodeIds = this.components()
      .filter((c) => c.checked && !c.isCurrent)
      .map((c) => c.id);

    const filteredUsers = this.selectedUsers().filter((user) => !user.disabled);

    this.dialogRef.close({
      data: filteredUsers,
      type: AddContributorTypeValue,
      childNodeIds: childNodeIds.length > 0 ? childNodeIds : undefined,
    } as ContributorDialogAddModel);
  }

  private setSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(
        filter((searchTerm) => !!searchTerm && searchTerm.trim().length > 0),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
          this.resetPagination();
          return this.actions.searchUsers(searchTerm, this.currentPage());
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.isInitialState.set(false);
        this.selectedUsers.set([]);
      });
  }

  private resetPagination(): void {
    this.currentPage.set(1);
    this.first.set(0);
  }

  private setupEffects(): void {
    effect(() => {
      const usersList = this.users();

      if (usersList.length > 0) {
        const checkedUsers = usersList.filter((user) => user.checked);

        if (checkedUsers.length > 0) {
          this.selectedUsers.set(checkedUsers);
        }
      }
    });
  }
}
