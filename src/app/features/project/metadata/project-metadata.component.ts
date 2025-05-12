import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { metadataTemplates } from '@osf/features/project/metadata/metadata';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

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
