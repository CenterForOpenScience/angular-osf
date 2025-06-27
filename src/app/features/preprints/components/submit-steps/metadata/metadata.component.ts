import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContributorsComponent } from '@osf/features/preprints/components/submit-steps/metadata/contributors/contributors.component';

@Component({
  selector: 'osf-preprint-metadata',
  imports: [ContributorsComponent, Button],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataComponent {}
