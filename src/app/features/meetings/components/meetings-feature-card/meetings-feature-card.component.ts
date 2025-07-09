import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'osf-meetings-feature-card',
  imports: [Card, TranslatePipe],
  templateUrl: './meetings-feature-card.component.html',
  styleUrl: './meetings-feature-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingsFeatureCardComponent {
  iconSrc = input.required<string>();
  iconAlt = input.required<string>();
  titleKey = input.required<string>();
  descriptionKey = input.required<string>();
}
