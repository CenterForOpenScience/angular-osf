import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants';
import { ResourceType } from '@osf/shared/enums';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';
import {
  ContributorsSelectors,
  FetchSelectedSubjects,
  GetAllContributors,
  SubjectsSelectors,
} from '@osf/shared/stores';

import { FieldType } from '../../enums';
import { DeleteDraft, FetchProjectChildren, RegisterDraft, RegistriesSelectors } from '../../store';
import { ConfirmRegistrationDialogComponent } from '../confirm-registration-dialog/confirm-registration-dialog.component';
import { SelectComponentsDialogComponent } from '../select-components-dialog/select-components-dialog.component';

@Component({
  selector: 'osf-review',
  imports: [TranslatePipe, Card, Message, RouterLink, Tag, Button],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ReviewComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly toastService = inject(ToastService);

  protected readonly pages = select(RegistriesSelectors.getPagesSchema);
  protected readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  protected readonly isDraftSubmitting = select(RegistriesSelectors.isDraftSubmitting);
  protected readonly stepsData = select(RegistriesSelectors.getStepsData);
  protected readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
  protected readonly contributors = select(ContributorsSelectors.getContributors);
  protected readonly subjects = select(SubjectsSelectors.getSelectedSubjects);
  protected readonly components = select(RegistriesSelectors.getRegistrationComponents);
  protected readonly FieldType = FieldType;

  protected actions = createDispatchMap({
    getContributors: GetAllContributors,
    getSubjects: FetchSelectedSubjects,
    deleteDraft: DeleteDraft,
    registerDraft: RegisterDraft,
    getProjectsComponents: FetchProjectChildren,
  });

  private readonly draftId = toSignal(this.route.params.pipe(map((params) => params['id'])) ?? of(undefined));

  protected stepsValidation = select(RegistriesSelectors.getStepsValidation);

  isDraftInvalid = computed(() => {
    return Object.values(this.stepsValidation()).some((step) => step.invalid);
  });

  constructor() {
    if (!this.contributors()?.length) {
      this.actions.getContributors(this.draftId(), ResourceType.DraftRegistration);
    }
    if (!this.subjects()?.length) {
      this.actions.getSubjects(this.draftId(), ResourceType.DraftRegistration);
    }

    let componentsLoaded = false;
    effect(() => {
      console.log('components effect triggered', this.components(), this.isDraftSubmitting());
      if (!this.isDraftSubmitting()) {
        const draftRegistrations = this.draftRegistration();
        if (draftRegistrations?.hasProject) {
          console.log('Fetching project children for draft registration', draftRegistrations.branchedFrom);
          if (!componentsLoaded) {
            this.actions.getProjectsComponents(draftRegistrations.branchedFrom!);
            componentsLoaded = true;
          }
        }
      }
    });
  }

  goBack(): void {
    const previousStep = this.pages().length;
    this.router.navigate(['../', previousStep], { relativeTo: this.route });
  }

  deleteDraft(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'registries.deleteDraft',
      messageKey: 'registries.confirmDeleteDraft',
      onConfirm: () => {
        this.actions.deleteDraft(this.draftId()).subscribe({
          next: () => {
            // [NM] TODO: clear validation state
            this.router.navigateByUrl(`/registries/${this.draftRegistration()?.providerId}new`);
          },
        });
      },
    });
  }

  confirmRegistration(): void {
    if (this.components()?.length) {
      this.openSelectComponentsForRegistrationDialog();
    } else {
      this.openConfirmRegistrationDialog();
    }
  }

  openSelectComponentsForRegistrationDialog(): void {
    this.dialogService
      .open(SelectComponentsDialogComponent, {
        width: '552px',
        focusOnShow: false,
        header: this.translateService.instant('registries.review.selectComponents.title'),
        closeOnEscape: true,
        modal: true,
        data: {
          components: this.components(),
        },
      })
      .onClose.subscribe((selectedComponents) => {
        console.log('Selected components for registration:', selectedComponents);
        if (selectedComponents) {
          this.openConfirmRegistrationDialog();
        }
      });
  }

  openConfirmRegistrationDialog(): void {
    this.dialogService
      .open(ConfirmRegistrationDialogComponent, {
        width: '552px',
        focusOnShow: false,
        header: this.translateService.instant('registries.review.confirmation.title'),
        closeOnEscape: true,
        modal: true,
        data: {
          draftId: this.draftId(),
          projectId: this.draftRegistration()?.branchedFrom,
          providerId: this.draftRegistration()?.providerId,
        },
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.toastService.showSuccess('registries.review.confirmation.successMessage');
          // [NM] TODO: Navigate to the newly created registration page
          this.router.navigate([`registries/my-registrations`]);
        } else {
          if (this.components()?.length) {
            this.openSelectComponentsForRegistrationDialog();
          }
        }
      });
  }
}
