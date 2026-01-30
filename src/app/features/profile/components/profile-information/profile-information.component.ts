import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { EducationHistoryComponent } from '@osf/shared/components/education-history/education-history.component';
import { EmploymentHistoryComponent } from '@osf/shared/components/employment-history/employment-history.component';
import { SOCIAL_LINKS } from '@osf/shared/constants/social-links.const';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';
import { UserModel } from '@osf/shared/models/user/user.models';
import { SortByDatePipe } from '@osf/shared/pipes/sort-by-date.pipe';
import { Institution } from '@shared/models/institutions/institutions.models';

import { mapUserSocials } from '../../helpers';

@Component({
  selector: 'osf-profile-information',
  imports: [
    Button,
    EmploymentHistoryComponent,
    EducationHistoryComponent,
    TranslatePipe,
    DatePipe,
    NgOptimizedImage,
    SortByDatePipe,
    RouterLink,
  ],
  templateUrl: './profile-information.component.html',
  styleUrl: './profile-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInformationComponent {
  currentUser = input<UserModel | null>();

  currentUserInstitutions = input<Institution[]>();
  showEdit = input(false);
  editProfile = output<void>();

  readonly isMedium = toSignal(inject(IS_MEDIUM));

  isEmploymentAndEducationVisible = computed(
    () => this.currentUser()?.employment?.length || this.currentUser()?.education?.length
  );

  userSocials = computed(() => mapUserSocials(this.currentUser()?.social, SOCIAL_LINKS));

  orcidId = computed(() => {
    const orcid = this.currentUser()?.external_identity?.ORCID;
    return orcid?.status?.toUpperCase() === 'VERIFIED' ? orcid.id : undefined;
  });

  toProfileSettings() {
    this.editProfile.emit();
  }
}
