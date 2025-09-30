import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Institution } from '@osf/shared/models';

@Component({
  selector: 'osf-settings-project-affiliation',
  imports: [Card, Button, NgOptimizedImage, TranslatePipe],
  templateUrl: './settings-project-affiliation.component.html',
  styleUrl: './settings-project-affiliation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsProjectAffiliationComponent {
  affiliations = input<Institution[]>([]);
  removed = output<Institution>();
  canEdit = input<boolean>(false);

  removeAffiliation(affiliation: Institution) {
    this.removed.emit(affiliation);
  }
}
