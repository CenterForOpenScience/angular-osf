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

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';

import { AddModeratorType } from '../../enums';
import { ModeratorAddModel, ModeratorDialogAddModel } from '../../models';
import { ClearUsers, ModeratorsSelectors, SearchUsers, SearchUsersPageChange } from '../../store/moderators';

@Component({
  selector: 'osf-add-moderator-dialog',
  imports: [
    Button,
    Checkbox,
    FormsModule,
    TranslatePipe,
    SearchInputComponent,
    LoadingSpinnerComponent,
    CustomPaginatorComponent,
  ],
  templateUrl: './add-moderator-dialog.component.html',
  styleUrl: './add-moderator-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddModeratorDialogComponent implements OnInit, OnDestroy {
  dialogRef = inject(DynamicDialogRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly config = inject(DynamicDialogConfig);

  users = select(ModeratorsSelectors.getUsers);
  isLoading = select(ModeratorsSelectors.isUsersLoading);
  totalUsersCount = select(ModeratorsSelectors.getUsersTotalCount);
  usersNextLink = select(ModeratorsSelectors.getUsersNextLink);
  usersPreviousLink = select(ModeratorsSelectors.getUsersPreviousLink);
  isInitialState = signal(true);

  currentPage = signal(1);
  first = signal(0);
  rows = signal(10);

  selectedUsers = signal<ModeratorAddModel[]>([]);
  searchControl = new FormControl<string>('');

  actions = createDispatchMap({
    searchUsers: SearchUsers,
    searchUsersPageChange: SearchUsersPageChange,
    clearUsers: ClearUsers,
  });

  ngOnInit(): void {
    this.setSearchSubscription();
    this.selectedUsers.set([]);
  }

  ngOnDestroy(): void {
    this.actions.clearUsers();
  }

  addModerator(): void {
    const dialogData: ModeratorDialogAddModel = { data: this.selectedUsers(), type: AddModeratorType.Search };
    this.dialogRef.close(dialogData);
  }

  inviteModerator() {
    const dialogData: ModeratorDialogAddModel = { data: [], type: AddModeratorType.Invite };
    this.dialogRef.close(dialogData);
  }

  pageChanged(event: PaginatorState): void {
    if (event.page === undefined) {
      return;
    }

    const eventPageOneBased = event.page + 1;

    if (eventPageOneBased === 1) {
      const searchTerm = this.searchControl.value?.trim();

      if (searchTerm) {
        this.actions.searchUsers(searchTerm);
        this.currentPage.set(1);
        this.first.set(0);
      }

      return;
    }

    const link = eventPageOneBased > this.currentPage() ? this.usersNextLink() : this.usersPreviousLink();

    if (link) {
      this.actions.searchUsersPageChange(link);
      this.currentPage.set(eventPageOneBased);
      this.first.set(event.first ?? 0);
    }
  }

  private setSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(
        filter((searchTerm) => !!searchTerm && searchTerm.trim().length > 0),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm) => this.actions.searchUsers(searchTerm)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.isInitialState.set(false);
        this.selectedUsers.set([]);
      });
  }
}
