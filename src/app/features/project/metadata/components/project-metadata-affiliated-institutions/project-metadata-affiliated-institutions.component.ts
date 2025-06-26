import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProjectOverview } from '@osf/features/project/overview/models';

@Component({
  selector: 'osf-project-metadata-affiliated-institutions',
  imports: [Button, Card, TranslatePipe],
  templateUrl: './project-metadata-affiliated-institutions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataAffiliatedInstitutionsComponent {
  openEditAffiliatedInstitutionsDialog = output<void>();

  currentProject = input.required<ProjectOverview | null>();
}
