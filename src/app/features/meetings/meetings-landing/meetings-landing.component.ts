import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

@Component({
  selector: 'osf-meetings-landing',
  imports: [SubHeaderComponent],
  templateUrl: './meetings-landing.component.html',
  styleUrl: './meetings-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingsLandingComponent {}
