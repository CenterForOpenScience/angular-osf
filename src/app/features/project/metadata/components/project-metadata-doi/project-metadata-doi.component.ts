import { TranslatePipe } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProjectOverview } from '@osf/features/project/overview/models';

@Component({
  selector: 'osf-project-metadata-doi',
  imports: [Button, Card, ConfirmDialog, TranslatePipe],
  providers: [ConfirmationService],
  templateUrl: './project-metadata-doi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataDoiComponent {
  createDoi = output<void>();
  editDoi = output<void>();

  currentProject = input.required<ProjectOverview | null>();

  constructor(private confirmationService: ConfirmationService) {}

  onCreateDoi(): void {
    this.confirmationService.confirm({
      header: 'Create DOI',
      message:
        'Are you sure you want to create a DOI for this project? A DOI is persistent and will always resolve this page.',
      acceptLabel: 'Create',
      rejectLabel: 'Cancel',
      accept: () => {
        this.createDoi.emit();
      },
    });
  }

  onEditDoi(): void {
    this.editDoi.emit();
  }
}
