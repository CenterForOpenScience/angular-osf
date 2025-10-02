import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { debounceTime, distinctUntilChanged, filter, forkJoin, map, of } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { SearchInputComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { CustomConfirmationService, CustomDialogService, ToastService } from '@osf/shared/services';

import { AddModeratorType, ModeratorPermission } from '../../enums';
import { ModeratorDialogAddModel, ModeratorModel } from '../../models';
import {
  AddModerator,
  DeleteModerator,
  LoadModerators,
  ModeratorsSelectors,
  UpdateModerator,
  UpdateModeratorsSearchValue,
} from '../../store/moderators';
import { AddModeratorDialogComponent } from '../add-moderator-dialog/add-moderator-dialog.component';
import { InviteModeratorDialogComponent } from '../invite-moderator-dialog/invite-moderator-dialog.component';
import { ModeratorsTableComponent } from '../moderators-table/moderators-table.component';

@Component({
  selector: 'osf-moderators-list',
  imports: [ModeratorsTableComponent, SearchInputComponent, Button, TranslatePipe],
  templateUrl: './moderators-list.component.html',
  styleUrl: './moderators-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeratorsListComponent implements OnInit {
  searchControl = new FormControl<string>('');

  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);

  readonly providerId = toSignal(
    this.route.parent?.params.pipe(map((params) => params['providerId'])) ?? of(undefined)
  );
  readonly resourceType: Signal<ResourceType | undefined> = toSignal(
    this.route.data.pipe(map((params) => params['resourceType'])) ?? of(undefined)
  );

  moderators = signal<ModeratorModel[]>([]);
  initialModerators = select(ModeratorsSelectors.getModerators);
  isModeratorsLoading = select(ModeratorsSelectors.isModeratorsLoading);
  currentUser = select(UserSelectors.getCurrentUser);

  isCurrentUserAdminModerator = computed(() => {
    const currentUserId = this.currentUser()?.id;
    const initialModerators = this.initialModerators();
    if (!currentUserId) return false;

    return initialModerators.some(
      (moderator: ModeratorModel) =>
        moderator.userId === currentUserId && moderator.permission === ModeratorPermission.Admin
    );
  });

  actions = createDispatchMap({
    loadModerators: LoadModerators,
    updateSearchValue: UpdateModeratorsSearchValue,
    addModerators: AddModerator,
    updateModerator: UpdateModerator,
    deleteModerator: DeleteModerator,
  });

  constructor() {
    effect(() => {
      this.moderators.set(structuredClone(this.initialModerators()));
    });
  }

  ngOnInit(): void {
    this.setSearchSubscription();
    this.actions.loadModerators(this.providerId(), this.resourceType());
  }

  openAddModeratorDialog() {
    const addedModeratorsIds = this.initialModerators().map((x) => x.userId);

    this.customDialogService
      .open(AddModeratorDialogComponent, {
        header: 'moderation.addModerator',
        width: '448px',
        data: addedModeratorsIds,
      })
      .onClose.pipe(
        filter((res: ModeratorDialogAddModel) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: ModeratorDialogAddModel) => {
        if (res.type === AddModeratorType.Invite) {
          this.openInviteModeratorDialog();
        } else {
          const addRequests = res.data.map((payload) =>
            this.actions.addModerators(this.providerId(), this.resourceType(), payload)
          );

          forkJoin(addRequests).subscribe(() => {
            this.toastService.showSuccess('moderation.toastMessages.multipleAddSuccessMessage');
          });
        }
      });
  }

  openInviteModeratorDialog() {
    this.customDialogService
      .open(InviteModeratorDialogComponent, {
        header: 'moderation.inviteModerator',
        width: '448px',
        focusOnShow: false,
      })
      .onClose.pipe(
        filter((res: ModeratorDialogAddModel) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: ModeratorDialogAddModel) => {
        if (res.type === AddModeratorType.Search) {
          this.openAddModeratorDialog();
        } else {
          this.actions.addModerators(this.providerId(), this.resourceType(), res.data[0]).subscribe({
            next: () =>
              this.toastService.showSuccess('moderation.toastMessages.addSuccessMessage', {
                name: res.data[0].fullName,
              }),
          });
        }
      });
  }

  updateModerator(item: ModeratorModel) {
    this.actions
      .updateModerator(this.providerId(), this.resourceType(), item)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toastService.showSuccess('moderation.toastMessages.updateSuccessMessage', {
          name: item.fullName,
        });
      });
  }

  removeModerator(moderator: ModeratorModel) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'moderation.removeDialog.title',
      messageParams: { name: moderator.fullName },
      messageKey: 'moderation.removeDialog.message',
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteModerator(this.providerId(), this.resourceType(), moderator.userId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () =>
              this.toastService.showSuccess('moderation.toastMessages.deleteSuccessMessage', {
                name: moderator.fullName,
              }),
          });
      },
    });
  }

  private setSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (!res) res = null;
        this.actions.updateSearchValue(res);
        this.actions.loadModerators(this.providerId(), this.resourceType());
      });
  }
}
