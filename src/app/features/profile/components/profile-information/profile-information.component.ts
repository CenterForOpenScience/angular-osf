import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { EducationHistoryComponent, EmploymentHistoryComponent } from '@osf/shared/components';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { User } from '@osf/shared/models';

@Component({
  selector: 'osf-profile-information',
  imports: [Button, EmploymentHistoryComponent, EducationHistoryComponent, TranslatePipe, DatePipe, NgOptimizedImage],
  templateUrl: './profile-information.component.html',
  styleUrl: './profile-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInformationComponent {
  currentUser = input<User | null>();
  showEdit = input(false);
  editProfile = output<void>();

  readonly isMedium = toSignal(inject(IS_MEDIUM));

  isEmploymentAndEducationVisible = computed(
    () => this.currentUser()?.employment?.length || this.currentUser()?.education?.length
  );

  toProfileSettings() {
    this.editProfile.emit();
  }
}
