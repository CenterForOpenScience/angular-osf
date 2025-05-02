import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { metadataTemplates } from '@osf/features/my-projects/project/metadata/metadata';
import { Button } from 'primeng/button';

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
