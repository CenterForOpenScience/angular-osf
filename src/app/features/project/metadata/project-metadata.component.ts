import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { SubHeaderComponent } from '@osf/shared/components';

import { metadataTemplates } from './models';

@Component({
  selector: 'osf-project-metadata',
  imports: [SubHeaderComponent, Button],
  templateUrl: './project-metadata.component.html',
  styleUrl: './project-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataComponent {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full h-full';
  protected readonly metadataTemplates = metadataTemplates;
}
