import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { debounceTime, distinctUntilChanged, filter, forkJoin, map, of, skip } from 'rxjs';

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
import { CustomConfirmationService, ToastService } from '@osf/shared/services';
import { UpdateSearchValue } from '@osf/shared/stores';

import { AddModeratorType, ModeratorPermission } from '../../enums';
import { ModeratorDialogAddModel, ModeratorModel } from '../../models';
import {
  AddModerator,
  DeleteModerator,
  LoadModerators,
  ModeratorsSelectors,
  UpdateModerator,
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
  providers: [DialogService],
})
export class ModeratorsListComponent implements OnInit {
  searchControl = new FormControl<string>('');

  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly dialogService = inject(DialogService);
  private readonly toastService = inject(ToastService);

  readonly providerId = toSignal(
    this.route.parent?.params.pipe(map((params) => params['providerId'])) ?? of(undefined)
  );
  readonly resourceType: Signal<ResourceType | undefined> = toSignal(
    this.route.data.pipe(map((params) => params['resourceType'])) ?? of(undefined)
  );

  moderators = signal([]);
  initialModerators = select(ModeratorsSelectors.getModerators);
  isModeratorsLoading = select(ModeratorsSelectors.isModeratorsLoading);
  currentUser = select(UserSelectors.getCurrentUser);

  isCurrentUserAdminModerator = computed(() => {
    const currentUserId = this.currentUser()?.id;
    const initialModerators = this.initialModerators();
    if (!currentUserId) return false;

    return initialModerators.some((moderator: ModeratorModel) => {
      return moderator.userId === currentUserId && moderator.permission === ModeratorPermission.Admin;
    });
  });

  actions = createDispatchMap({
    loadModerators: LoadModerators,
    updateSearchValue: UpdateSearchValue,
    addModerators: AddModerator,
    updateModerator: UpdateModerator,
    deleteModerator: DeleteModerator,
  });

  constructor() {
    effect(() => {
      this.moderators.set(JSON.parse(JSON.stringify(this.initialModerators())));

      if (this.isModeratorsLoading()) {
        this.searchControl.disable();
      } else {
        this.searchControl.enable();
      }
    });
  }

  ngOnInit(): void {
    this.setSearchSubscription();
    this.actions.loadModerators(this.providerId(), this.resourceType());
  }

  openAddModeratorDialog() {
    const addedModeratorsIds = this.initialModerators().map((x) => x.userId);

    this.dialogService
      .open(AddModeratorDialogComponent, {
        width: '448px',
        data: addedModeratorsIds,
        focusOnShow: false,
        header: this.translateService.instant('moderation.addModerator'),
        closeOnEscape: true,
        modal: true,
        closable: true,
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
    this.dialogService
      .open(InviteModeratorDialogComponent, {
        width: '448px',
        focusOnShow: false,
        header: this.translateService.instant('moderation.inviteModerator'),
        closeOnEscape: true,
        modal: true,
        closable: true,
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
      .pipe(skip(1), debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.actions.updateSearchValue(res ?? null));
  }
}
