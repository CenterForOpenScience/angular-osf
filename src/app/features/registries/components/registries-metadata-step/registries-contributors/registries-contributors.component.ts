import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { filter, forkJoin, map, of } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsTableComponent,
} from '@osf/shared/components/contributors';
import { AddContributorType, ContributorPermission, ResourceType } from '@osf/shared/enums';
import { findChangedItems } from '@osf/shared/helpers';
import { ContributorDialogAddModel, ContributorModel } from '@osf/shared/models';
import { CustomConfirmationService, CustomDialogService, ToastService } from '@osf/shared/services';
import {
  AddContributor,
  ContributorsSelectors,
  DeleteContributor,
  GetAllContributors,
  UpdateContributor,
} from '@osf/shared/stores';

@Component({
  selector: 'osf-registries-contributors',
  imports: [FormsModule, TableModule, ContributorsTableComponent, TranslatePipe, Card, Button],
  templateUrl: './registries-contributors.component.html',
  styleUrl: './registries-contributors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesContributorsComponent implements OnInit {
  control = input.required<FormControl>();

  readonly destroyRef = inject(DestroyRef);
  readonly customDialogService = inject(CustomDialogService);
  readonly toastService = inject(ToastService);
  readonly customConfirmationService = inject(CustomConfirmationService);

  private readonly route = inject(ActivatedRoute);
  private readonly draftId = toSignal(this.route.params.pipe(map((params) => params['id'])) ?? of(undefined));

  currentUser = select(UserSelectors.getCurrentUser);

  isCurrentUserAdminContributor = computed(() => {
    const currentUserId = this.currentUser()?.id;
    const initialContributors = this.initialContributors();
    if (!currentUserId) return false;

    return initialContributors.some((contributor: ContributorModel) => {
      return contributor.userId === currentUserId && contributor.permission === ContributorPermission.Admin;
    });
  });

  initialContributors = select(ContributorsSelectors.getContributors);
  contributors = signal([]);

  readonly isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);

  actions = createDispatchMap({
    getContributors: GetAllContributors,
    deleteContributor: DeleteContributor,
    updateContributor: UpdateContributor,
    addContributor: AddContributor,
  });

  get hasChanges(): boolean {
    return JSON.stringify(this.initialContributors()) !== JSON.stringify(this.contributors());
  }

  constructor() {
    effect(() => {
      this.contributors.set(JSON.parse(JSON.stringify(this.initialContributors())));
    });
  }

  ngOnInit(): void {
    this.actions.getContributors(this.draftId(), ResourceType.DraftRegistration);
  }

  onFocusOut() {
    // [NM] TODO: make request to update contributor if changed
    if (this.control()) {
      this.control().markAsTouched();
      this.control().markAsDirty();
      this.control().updateValueAndValidity();
    }
  }

  cancel() {
    this.contributors.set(JSON.parse(JSON.stringify(this.initialContributors())));
  }

  save() {
    const updatedContributors = findChangedItems(this.initialContributors(), this.contributors(), 'id');

    const updateRequests = updatedContributors.map((payload) =>
      this.actions.updateContributor(this.draftId(), ResourceType.DraftRegistration, payload)
    );

    forkJoin(updateRequests).subscribe(() => {
      this.toastService.showSuccess('project.contributors.toastMessages.multipleUpdateSuccessMessage');
    });
  }

  openAddContributorDialog() {
    const addedContributorIds = this.initialContributors().map((x) => x.userId);

    this.customDialogService
      .open(AddContributorDialogComponent, {
        header: 'project.contributors.addDialog.addRegisteredContributor',
        width: '448px',
        data: addedContributorIds,
      })
      .onClose.pipe(
        filter((res: ContributorDialogAddModel) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: ContributorDialogAddModel) => {
        if (res.type === AddContributorType.Unregistered) {
          this.openAddUnregisteredContributorDialog();
        } else {
          const addRequests = res.data.map((payload) =>
            this.actions.addContributor(this.draftId(), ResourceType.DraftRegistration, payload)
          );

          forkJoin(addRequests).subscribe(() => {
            this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage');
          });
        }
      });
  }

  openAddUnregisteredContributorDialog() {
    this.customDialogService
      .open(AddUnregisteredContributorDialogComponent, {
        header: 'project.contributors.addDialog.addUnregisteredContributor',
        width: '448px',
      })
      .onClose.pipe(
        filter((res: ContributorDialogAddModel) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: ContributorDialogAddModel) => {
        if (res.type === AddContributorType.Registered) {
          this.openAddContributorDialog();
        } else {
          const params = { name: res.data[0].fullName };

          this.actions.addContributor(this.draftId(), ResourceType.DraftRegistration, res.data[0]).subscribe({
            next: () => this.toastService.showSuccess('project.contributors.toastMessages.addSuccessMessage', params),
          });
        }
      });
  }

  removeContributor(contributor: ContributorModel) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteContributor(this.draftId(), ResourceType.DraftRegistration, contributor.userId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () =>
              this.toastService.showSuccess('project.contributors.removeDialog.successMessage', {
                name: contributor.fullName,
              }),
          });
      },
    });
  }
}
