import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { DataResourcesComponent, IconComponent, TruncatedTextComponent } from '@osf/shared/components';
import { RevisionReviewStates } from '@osf/shared/enums';

import { LinkedNode, LinkedRegistration, RegistryComponentModel } from '../../models';

@Component({
  selector: 'osf-registration-links-card',
  imports: [Card, Button, TranslatePipe, DatePipe, DataResourcesComponent, TruncatedTextComponent, IconComponent],
  templateUrl: './registration-links-card.component.html',
  styleUrl: './registration-links-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationLinksCardComponent {
  readonly registrationData = input.required<LinkedRegistration | LinkedNode | RegistryComponentModel>();

  readonly updateEmitRegistrationData = output<string>();
  readonly reviewEmitRegistrationData = output<string>();

  protected readonly RevisionReviewStates = RevisionReviewStates;

  protected readonly isRegistrationData = computed(() => {
    const data = this.registrationData();
    return 'reviewsState' in data;
  });

  protected readonly isComponentData = computed(() => {
    const data = this.registrationData();
    return 'registrationSupplement' in data;
  });

  protected readonly registrationDataTyped = computed(() => {
    const data = this.registrationData();
    return this.isRegistrationData() ? (data as LinkedRegistration) : null;
  });

  protected readonly componentsDataTyped = computed(() => {
    const data = this.registrationData();
    return this.isComponentData() ? (data as RegistryComponentModel) : null;
  });
}
