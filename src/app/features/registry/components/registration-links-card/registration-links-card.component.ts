import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { DataResourcesComponent } from '@osf/shared/components/data-resources/data-resources.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';

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

  readonly hasWriteAccess = computed(
    () => this.registrationDataTyped()?.currentUserPermissions?.includes(UserPermissions.Write) ?? false
  );
}
