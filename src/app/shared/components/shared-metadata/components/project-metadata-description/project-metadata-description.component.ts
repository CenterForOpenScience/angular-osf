import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'osf-project-metadata-description',
  imports: [Card, Button, TranslatePipe],
  templateUrl: './project-metadata-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataDescriptionComponent {
  openEditDescriptionDialog = output<void>();
  description = input.required<string>();
  readonly = input<boolean>(false);
}
