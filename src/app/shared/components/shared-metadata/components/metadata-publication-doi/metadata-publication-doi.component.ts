import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Identifier } from '@osf/shared/models';

@Component({
  selector: 'osf-metadata-publication-doi',
  imports: [Button, Card, TranslatePipe],
  templateUrl: './metadata-publication-doi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataPublicationDoiComponent {
  openEditPublicationDoiDialog = output<void>();

  identifiers = input<Identifier[]>([]);
  hideEditDoi = input<boolean>(false);
}
