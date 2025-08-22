import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';

import { CustomPaginatorComponent, LoadingSpinnerComponent, SearchInputComponent } from '@osf/shared/components';
import { AddContributorType, AddDialogState } from '@osf/shared/enums/contributors';
import { ContributorAddModel, ContributorDialogAddModel } from '@osf/shared/models';
import { ClearUsers, ContributorsSelectors, SearchUsers } from '@osf/shared/stores';

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
  ],
  templateUrl: './add-contributor-dialog.component.html',
  styleUrl: './add-contributor-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddContributorDialogComponent implements OnInit, OnDestroy {
  protected dialogRef = inject(DynamicDialogRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly config = inject(DynamicDialogConfig);

  protected users = select(ContributorsSelectors.getUsers);
  protected isLoading = select(ContributorsSelectors.isUsersLoading);
  protected totalUsersCount = select(ContributorsSelectors.getUsersTotalCount);
  protected isInitialState = signal(true);

  protected currentState = signal(AddDialogState.Search);
  protected currentPage = signal(1);
  protected first = signal(0);
  protected pageSize = signal(10);

  protected selectedUsers = signal<ContributorAddModel[]>([]);
  protected searchControl = new FormControl<string>('');

  protected actions = createDispatchMap({ searchUsers: SearchUsers, clearUsers: ClearUsers });

  get isSearchState() {
    return this.currentState() === AddDialogState.Search;
  }

  ngOnInit(): void {
    this.setSearchSubscription();
    this.selectedUsers.set([]);
  }

  ngOnDestroy(): void {
    this.actions.clearUsers();
  }

  addContributor(): void {
    if (this.currentState() === AddDialogState.Details) {
      const dialogData: ContributorDialogAddModel = { data: this.selectedUsers(), type: AddContributorType.Registered };
      this.dialogRef.close(dialogData);
    }

    this.currentState.set(AddDialogState.Details);
  }

  addUnregistered() {
    const dialogData: ContributorDialogAddModel = { data: [], type: AddContributorType.Unregistered };
    this.dialogRef.close(dialogData);
  }

  pageChanged(event: PaginatorState) {
    this.currentPage.set(event.page ? this.currentPage() + 1 : 1);
    this.first.set(event.first ?? 0);
    this.actions.searchUsers(this.searchControl.value, this.currentPage());
  }

  private setSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(
        filter((searchTerm) => !!searchTerm && searchTerm.trim().length > 0),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm) => this.actions.searchUsers(searchTerm, this.currentPage())),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.isInitialState.set(false);
        this.selectedUsers.set([]);
      });
  }
}
