import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RegistrationReviewStates, RegistryStatus, RevisionReviewStates } from '@osf/shared/enums';
import { RegistrationCard } from '@osf/shared/models';

import { DataResourcesComponent } from '../data-resources/data-resources.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'osf-registration-card',
  imports: [Card, Button, TranslatePipe, DatePipe, RouterLink, StatusBadgeComponent, DataResourcesComponent],
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
  readonly updateRegistration = output<string>();
  readonly continueUpdate = output<{ id: string; unapproved: boolean }>();

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

  continueUpdateHandler(): void {
    this.continueUpdate.emit({
      id: this.registrationData().id,
      unapproved: this.registrationData().revisionState === RevisionReviewStates.Unapproved,
    });
  }
}
