import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import {
  ContributorsListComponent,
  DataResourcesComponent,
  IconComponent,
  TruncatedTextComponent,
} from '@osf/shared/components';
import { RevisionReviewStates } from '@osf/shared/enums';

import { LinkedNode, LinkedRegistration, RegistryComponentModel } from '../../models';

@Component({
  selector: 'osf-registration-links-card',
  imports: [
    Card,
    Button,
    TranslatePipe,
    DatePipe,
    DataResourcesComponent,
    TruncatedTextComponent,
    IconComponent,
    ContributorsListComponent,
  ],
  templateUrl: './registration-links-card.component.html',
  styleUrl: './registration-links-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationLinksCardComponent {
  readonly registrationData = input.required<LinkedRegistration | LinkedNode | RegistryComponentModel>();

  readonly updateEmitRegistrationData = output<string>();
  readonly reviewEmitRegistrationData = output<string>();

  readonly RevisionReviewStates = RevisionReviewStates;

  readonly isRegistrationData = computed(() => {
    const data = this.registrationData();
    return 'reviewsState' in data;
  });

  readonly isComponentData = computed(() => {
    const data = this.registrationData();
    return 'registrationSupplement' in data;
  });

  readonly registrationDataTyped = computed(() => {
    const data = this.registrationData();
    return this.isRegistrationData() ? (data as LinkedRegistration) : null;
  });

  readonly componentsDataTyped = computed(() => {
    const data = this.registrationData();
    return this.isComponentData() ? (data as RegistryComponentModel) : null;
  });
}
