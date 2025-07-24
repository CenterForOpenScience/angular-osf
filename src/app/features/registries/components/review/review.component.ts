import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
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
import { InterpolatePipe } from '@osf/shared/pipes';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';
import {
  ContributorsSelectors,
  FetchSelectedSubjects,
  GetAllContributors,
  SubjectsSelectors,
} from '@osf/shared/stores';

import { FieldType } from '../../enums';
import { DeleteDraft, FetchLicenses, FetchProjectChildren, RegistriesSelectors } from '../../store';
import { ConfirmRegistrationDialogComponent } from '../confirm-registration-dialog/confirm-registration-dialog.component';
import { SelectComponentsDialogComponent } from '../select-components-dialog/select-components-dialog.component';

@Component({
  selector: 'osf-review',
  imports: [
    TranslatePipe,
    Card,
    Message,
    RouterLink,
    Tag,
    Button,
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    InterpolatePipe,
  ],
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
  protected readonly isDraftLoading = select(RegistriesSelectors.isDraftLoading);
  protected readonly stepsData = select(RegistriesSelectors.getStepsData);
  protected readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
  protected readonly contributors = select(ContributorsSelectors.getContributors);
  protected readonly subjects = select(SubjectsSelectors.getSelectedSubjects);
  protected readonly components = select(RegistriesSelectors.getRegistrationComponents);
  protected readonly license = select(RegistriesSelectors.getRegistrationLicense);
  private readonly OSF_PROVIDER_ID = 'osf';

  protected readonly FieldType = FieldType;

  protected actions = createDispatchMap({
    getContributors: GetAllContributors,
    getSubjects: FetchSelectedSubjects,
    deleteDraft: DeleteDraft,
    getProjectsComponents: FetchProjectChildren,
    fetchLicenses: FetchLicenses,
  });

  private readonly draftId = toSignal(this.route.params.pipe(map((params) => params['id'])) ?? of(undefined));

  protected stepsValidation = select(RegistriesSelectors.getStepsValidation);

  isDraftInvalid = computed(() => {
    return Object.values(this.stepsValidation()).some((step) => step.invalid);
  });

  licenseOptionsRecord = computed(() => {
    return (this.draftRegistration()?.license.options ?? {}) as Record<string, string>;
  });

  constructor() {
    if (!this.contributors()?.length) {
      this.actions.getContributors(this.draftId(), ResourceType.DraftRegistration);
    }
    if (!this.subjects()?.length) {
      this.actions.getSubjects(this.draftId(), ResourceType.DraftRegistration);
    }

    effect(() => {
      if (this.draftRegistration()) {
        this.actions.fetchLicenses(this.draftRegistration()?.providerId ?? this.OSF_PROVIDER_ID);
      }
    });

    let componentsLoaded = false;
    effect(() => {
      if (!this.isDraftSubmitting()) {
        const draftRegistrations = this.draftRegistration();
        if (draftRegistrations?.hasProject) {
          if (!componentsLoaded) {
            this.actions.getProjectsComponents(draftRegistrations?.branchedFrom?.id ?? '');
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
          parent: this.draftRegistration()?.branchedFrom,
          components: this.components(),
        },
      })
      .onClose.subscribe((selectedComponents) => {
        this.openConfirmRegistrationDialog(selectedComponents);
      });
  }

  openConfirmRegistrationDialog(components?: string[]): void {
    this.dialogService
      .open(ConfirmRegistrationDialogComponent, {
        width: '552px',
        focusOnShow: false,
        header: this.translateService.instant('registries.review.confirmation.title'),
        closeOnEscape: true,
        modal: true,
        data: {
          draftId: this.draftId(),
          projectId:
            this.draftRegistration()?.branchedFrom?.type === 'nodes'
              ? this.draftRegistration()?.branchedFrom?.id
              : null,
          providerId: this.draftRegistration()?.providerId,
          components,
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
