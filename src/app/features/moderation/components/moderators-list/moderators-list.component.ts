import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { TablePageEvent } from 'primeng/table';

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

import { ProviderSelectors } from '@core/store/provider';
import { UserSelectors } from '@core/store/user';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { TableParameters } from '@shared/models/table-parameters.model';

import { AddModeratorType } from '../../enums';
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
  moderatorsTotalCount = select(ModeratorsSelectors.getModeratorsTotalCount);
  hasAdminAccess = select(ProviderSelectors.hasAdminAccess);
  currentUser = select(UserSelectors.getCurrentUser);

  readonly tableParams = computed<TableParameters>(() => ({
    ...DEFAULT_TABLE_PARAMS,
    totalRecords: this.moderatorsTotalCount(),
    paginator: this.moderatorsTotalCount() > DEFAULT_TABLE_PARAMS.rows,
  }));

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

  pageChanged(event: TablePageEvent) {
    const page = Math.floor(event.first / event.rows) + 1;
    const pageSize = event.rows;

    this.actions.loadModerators(this.providerId(), this.resourceType(), page, pageSize);
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
