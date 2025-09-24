import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { tap } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CreateSchemaResponse, FetchAllSchemaResponses, RegistriesSelectors } from '@osf/features/registries/store';
import { RegistrationReviewStates, RegistryStatus, RevisionReviewStates } from '@osf/shared/enums';
import { RegistrationCard } from '@osf/shared/models';

import { DataResourcesComponent } from '../data-resources/data-resources.component';
import { IconComponent } from '../icon/icon.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'osf-registration-card',
  imports: [
    Card,
    Button,
    TranslatePipe,
    DatePipe,
    RouterLink,
    StatusBadgeComponent,
    DataResourcesComponent,
    IconComponent,
  ],
  templateUrl: './registration-card.component.html',
  styleUrl: './registration-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationCardComponent {
  RegistrationStatus = RegistryStatus;
  RevisionReviewStates = RevisionReviewStates;
  RegistrationReviewStates = RegistrationReviewStates;
  readonly isDraft = input<boolean>(false);
  readonly registrationData = input.required<RegistrationCard>();
  readonly deleteDraft = output<string>();

  private router = inject(Router);
  schemaResponse = select(RegistriesSelectors.getSchemaResponse);

  actions = createDispatchMap({
    getSchemaResponse: FetchAllSchemaResponses,
    createSchemaResponse: CreateSchemaResponse,
  });

  get isAccepted(): boolean {
    return this.registrationData().reviewsState === RegistrationReviewStates.Accepted;
  }

  get isPending(): boolean {
    return this.registrationData().reviewsState === RegistrationReviewStates.Pending;
  }

  get isApproved(): boolean {
    return this.registrationData().revisionState === RevisionReviewStates.Approved;
  }

  get isUnapproved(): boolean {
    return this.registrationData().revisionState === RevisionReviewStates.Unapproved;
  }

  get isInProgress(): boolean {
    return this.registrationData().revisionState === RevisionReviewStates.RevisionInProgress;
  }

  get isEmbargo(): boolean {
    return this.registrationData().reviewsState === RegistrationReviewStates.Embargo;
  }

  get isRootRegistration(): boolean {
    const registration = this.registrationData();
    return !registration.rootParentId || registration.id === registration.rootParentId;
  }

  get showButtons(): boolean {
    return this.isRootRegistration && (this.isAccepted || this.isPending || this.isEmbargo);
  }

  updateRegistration(id: string): void {
    this.actions
      .createSchemaResponse(id)
      .pipe(tap(() => this.navigateToJustificationPage()))
      .subscribe();
  }

  continueUpdateRegistration(id: string): void {
    const unapproved = this.registrationData().revisionState === RevisionReviewStates.Unapproved;
    this.actions
      .getSchemaResponse(id)
      .pipe(
        tap(() => {
          if (unapproved) {
            this.navigateToJustificationReview();
          } else {
            this.navigateToJustificationPage();
          }
        })
      )
      .subscribe();
  }

  private navigateToJustificationPage(): void {
    const revisionId = this.schemaResponse()?.id;
    this.router.navigate([`/registries/revisions/${revisionId}/justification`]);
  }

  private navigateToJustificationReview(): void {
    const revisionId = this.schemaResponse()?.id;
    this.router.navigate([`/registries/revisions/${revisionId}/review`]);
  }
}
