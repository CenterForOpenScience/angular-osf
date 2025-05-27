import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, HostBinding, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  AdvisoryGroupComponent,
  BrowseBySubjectsComponent,
  PreprintServicesComponent,
} from '@osf/features/preprints/components';
import { SearchInputComponent } from '@shared/components';

@Component({
  selector: 'osf-overview',
  imports: [
    Button,
    SearchInputComponent,
    RouterLink,
    AdvisoryGroupComponent,
    PreprintServicesComponent,
    BrowseBySubjectsComponent,
  ],
  templateUrl: './preprints-landing.component.html',
  styleUrl: './preprints-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsLandingComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';

  addPreprint() {
    // [RNi] TODO: Implement the logic to add a preprint.
  }

  searchValue = signal<string>('');
}
