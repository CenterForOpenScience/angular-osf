import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProjectOverview } from '@osf/features/project/overview/models';

@Component({
  selector: 'osf-project-metadata-contributors',
  imports: [Button, Card, TranslatePipe],
  templateUrl: './project-metadata-contributors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataContributorsComponent {
  openEditContributorDialog = output<void>();

  currentProject = input.required<ProjectOverview | null>();
}
