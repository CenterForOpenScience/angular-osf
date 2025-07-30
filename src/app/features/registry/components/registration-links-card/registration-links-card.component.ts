import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { LinkedNode, LinkedRegistration } from '@osf/features/registry/models';
import { DataResourcesComponent, TruncatedTextComponent } from '@shared/components';
import { RevisionReviewStates } from '@shared/enums';

@Component({
  selector: 'osf-registration-links-card',
  imports: [Card, Button, TranslatePipe, DatePipe, DataResourcesComponent, TruncatedTextComponent],
  templateUrl: './registration-links-card.component.html',
  styleUrl: './registration-links-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationLinksCardComponent {
  readonly registrationData = input.required<LinkedRegistration | LinkedNode>();
  readonly updateEmitRegistrationData = output<string>();
  readonly reviewEmitRegistrationData = output<string>();

  protected readonly RevisionReviewStates = RevisionReviewStates;

  protected readonly isRegistrationData = computed(() => {
    const data = this.registrationData();
    return 'reviewsState' in data;
  });

  protected readonly registrationDataTyped = computed(() => {
    const data = this.registrationData();
    return this.isRegistrationData() ? (data as LinkedRegistration) : null;
  });

  protected readonly hasResources = computed(() => {
    const regData = this.registrationDataTyped();
    if (!regData) return false;
    return (
      regData.hasData || regData.hasAnalyticCode || regData.hasMaterials || regData.hasPapers || regData.hasSupplements
    );
  });
}
