import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ForkProject, ProjectOverviewSelectors } from '@osf/features/project/overview/store';

@Component({
  selector: 'osf-fork-dialog',
  imports: [TranslatePipe, Button],
  templateUrl: './fork-dialog.component.html',
  styleUrl: './fork-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForkDialogComponent {
  private store = inject(Store);
  protected dialogRef = inject(DynamicDialogRef);
  protected isSubmitting = select(ProjectOverviewSelectors.getForkProjectSubmitting);

  protected handleForkConfirm(): void {
    const project = this.store.selectSnapshot(ProjectOverviewSelectors.getProject);
    if (!project) return;

    this.store
      .dispatch(new ForkProject(project.id))
      .pipe(tap(() => this.dialogRef.close()))
      .subscribe();
  }
}
