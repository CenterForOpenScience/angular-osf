import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProjectOverview } from '@osf/features/project/overview/models';

@Component({
  selector: 'osf-project-metadata-funding',
  imports: [Button, Card, TranslatePipe, DatePipe],
  templateUrl: './project-metadata-funding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataFundingComponent {
  openEditFundingDialog = output<void>();

  currentProject = input.required<ProjectOverview | null>();
}
