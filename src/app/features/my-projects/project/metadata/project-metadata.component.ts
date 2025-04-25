import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { metadataTemplates } from '@osf/features/my-projects/project/metadata/metadata';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'osf-project-metadata',
  imports: [SubHeaderComponent, Button, RouterLink],
  templateUrl: './project-metadata.component.html',
  styleUrl: './project-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataComponent {
  @HostBinding('class') classes = 'flex flex-1 flex-column gap-4 w-full h-full';
  protected readonly metadataTemplates = metadataTemplates;
}
