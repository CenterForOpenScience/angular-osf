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
  editDoi = output<void>();

  currentProject = input.required<ProjectOverview | null>();

  onCreateDoi(): void {
    this.editDoi.emit();
  }

  onEditDoi(): void {
    this.editDoi.emit();
  }
}
