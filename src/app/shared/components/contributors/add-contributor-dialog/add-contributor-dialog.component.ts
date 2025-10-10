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
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';

import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants';
import { AddContributorType, AddDialogState } from '@osf/shared/enums';
import { ComponentCheckboxItemModel, ContributorAddModel, ContributorDialogAddModel } from '@osf/shared/models';
import { ClearUsers, ContributorsSelectors, SearchUsers } from '@osf/shared/stores';

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

  readonly contributorNames = computed(() =>
    this.selectedUsers()
      .map((user) => user.fullName)
      .join(', ')
  );

  readonly isSearchState = computed(() => this.currentState() === AddDialogState.Search);
  readonly isDetailsState = computed(() => this.currentState() === AddDialogState.Details);
  readonly isComponentsState = computed(() => this.currentState() === AddDialogState.Components);
  readonly hasComponents = computed(() => this.components().length > 0);
  readonly buttonLabel = computed(() => (this.isComponentsState() ? 'common.buttons.done' : 'common.buttons.next'));

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

    const { components, resourceName } = this.config.data || {};

    if (components) {
      this.components.set(components);
    }

    if (resourceName) {
      this.resourceName.set(resourceName);
    }
  }

  private closeDialogWithData(): void {
    const childNodeIds = this.components()
      .filter((c) => c.checked && !c.isCurrent)
      .map((c) => c.id);

    this.dialogRef.close({
      data: this.selectedUsers(),
      type: AddContributorType.Registered,
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
}
