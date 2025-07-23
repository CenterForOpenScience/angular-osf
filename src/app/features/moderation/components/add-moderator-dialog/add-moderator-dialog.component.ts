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

import { AddModeratorType } from '../../enums';
import { ModeratorAddModel, ModeratorDialogAddModel } from '../../models';
import { ClearUsers, ModeratorsSelectors, SearchUsers } from '../../store/moderators';

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
  protected dialogRef = inject(DynamicDialogRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly config = inject(DynamicDialogConfig);

  protected users = select(ModeratorsSelectors.getUsers);
  protected isLoading = select(ModeratorsSelectors.isUsersLoading);
  protected totalUsersCount = select(ModeratorsSelectors.getUsersTotalCount);
  protected isInitialState = signal(true);

  protected currentPage = signal(1);
  protected first = signal(0);
  protected rows = signal(10);

  protected selectedUsers = signal<ModeratorAddModel[]>([]);
  protected searchControl = new FormControl<string>('');

  protected actions = createDispatchMap({ searchUsers: SearchUsers, clearUsers: ClearUsers });

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
