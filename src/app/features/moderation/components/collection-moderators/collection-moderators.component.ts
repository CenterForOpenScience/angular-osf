import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { debounceTime, distinctUntilChanged, filter, skip } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

import { EducationHistoryComponent, EmploymentHistoryComponent, SearchInputComponent } from '@osf/shared/components';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';

import { AddModeratorType } from '../../enums';
import { ModeratorDialogAddModel, ModeratorModel } from '../../models';
import {
  AddCollectionModerator,
  DeleteCollectionModerator,
  LoadCollectionModerators,
  ModerationSelectors,
  UpdateCollectionModerator,
  UpdateCollectionSearchValue,
} from '../../store';
import { AddModeratorDialogComponent } from '../add-moderator-dialog/add-moderator-dialog.component';
import { CollectionModeratorsListComponent } from '../collection-moderators-list/collection-moderators-list.component';
import { InviteModeratorDialogComponent } from '../invite-moderator-dialog/invite-moderator-dialog.component';

@Component({
  selector: 'osf-collection-moderators',
  imports: [CollectionModeratorsListComponent, SearchInputComponent, Button, TranslatePipe],
  templateUrl: './collection-moderators.component.html',
  styleUrl: './collection-moderators.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class CollectionModeratorsComponent implements OnInit {
  protected searchControl = new FormControl<string>('');

  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly dialogService = inject(DialogService);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);

  providerId = signal('');

  moderators = signal([]);
  initialModerators = select(ModerationSelectors.getCollectionModerators);
  isModeratorsLoading = select(ModerationSelectors.isModeratorsLoading);

  protected actions = createDispatchMap({
    loadModerators: LoadCollectionModerators,
    updateSearchValue: UpdateCollectionSearchValue,
    addModerators: AddCollectionModerator,
    updateModerator: UpdateCollectionModerator,
    deleteModerator: DeleteCollectionModerator,
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
    this.actions.loadModerators(this.providerId());
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
          // [NS] TODO: Implement logic
          this.toastService.showSuccess('moderation.toastMessages.multipleAddSuccessMessage');
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
          // [NS] TODO: Implement logic
          this.toastService.showSuccess('moderation.toastMessages.addSuccessMessage', {
            name: res.data[0].fullName,
          });
        }
      });
  }

  updateModerator(item: ModeratorModel) {
    // this.loaderService.show();

    this.toastService.showSuccess('moderation.toastMessages.updateSuccessMessage', {
      name: item.fullName,
    });
  }

  removeModerator(moderator: ModeratorModel) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'moderation.removeDialog.title',
      messageParams: { name: moderator.fullName },
      messageKey: 'moderation.removeDialog.message',
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.toastService.showSuccess('moderation.toastMessages.deleteSuccessMessage', { name: moderator.fullName });
      },
    });
  }

  openEmploymentHistory(moderator: ModeratorModel) {
    this.dialogService.open(EmploymentHistoryComponent, {
      width: '552px',
      data: moderator.employment,
      focusOnShow: false,
      header: this.translateService.instant('project.contributors.table.headers.employment'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  openEducationHistory(moderator: ModeratorModel) {
    this.dialogService.open(EducationHistoryComponent, {
      width: '552px',
      data: moderator.education,
      focusOnShow: false,
      header: this.translateService.instant('project.contributors.table.headers.education'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  private setSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(skip(1), debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.actions.updateSearchValue(res ?? null));
  }
}
