import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { EducationHistoryComponent, EmploymentHistoryComponent } from '@osf/shared/components';
import { SOCIAL_LINKS } from '@osf/shared/constants';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { UserModel } from '@osf/shared/models';

import { mapUserSocials } from '../../helpers';

@Component({
  selector: 'osf-profile-information',
  imports: [Button, EmploymentHistoryComponent, EducationHistoryComponent, TranslatePipe, DatePipe, NgOptimizedImage],
  templateUrl: './profile-information.component.html',
  styleUrl: './profile-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInformationComponent {
  currentUser = input<UserModel | null>();
  showEdit = input(false);
  editProfile = output<void>();

  readonly isMedium = toSignal(inject(IS_MEDIUM));

  isEmploymentAndEducationVisible = computed(
    () => this.currentUser()?.employment?.length || this.currentUser()?.education?.length
  );

  userSocials = computed(() => mapUserSocials(this.currentUser()?.social, SOCIAL_LINKS));

  toProfileSettings() {
    this.editProfile.emit();
  }
}
