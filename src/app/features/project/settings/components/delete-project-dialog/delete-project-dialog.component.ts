import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DeleteProject, SettingsSelectors } from '@osf/features/project/settings/store';
import { ScientistsNames } from '@osf/shared/constants';
import { ToastService } from '@osf/shared/services';
import { CurrentResourceSelectors } from '@osf/shared/stores';
import { UserPermissions } from '@shared/enums';

@Component({
  selector: 'osf-delete-project-dialog',
  imports: [TranslatePipe, Button, InputText, FormsModule, Skeleton],
  templateUrl: './delete-project-dialog.component.html',
  styleUrl: './delete-project-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteProjectDialogComponent {
  private toastService = inject(ToastService);
  private router = inject(Router);
  dialogRef = inject(DynamicDialogRef);
  destroyRef = inject(DestroyRef);

  scientistNames = ScientistsNames;
  userInput = signal('');

  isLoading = select(CurrentResourceSelectors.isResourceWithChildrenLoading);
  isSubmitting = select(SettingsSelectors.isSettingsSubmitting);
  projects = select(CurrentResourceSelectors.getResourceWithChildren);

  hasAdminAccessForAllComponents = computed(() => {
    const projects = this.projects();
    if (!projects || !projects.length) return false;

    return projects.every((project) => {
      return project.permissions?.includes(UserPermissions.Admin);
    });
  });

  selectedScientist = computed(() => {
    const names = Object.values(this.scientistNames);
    return names[Math.floor(Math.random() * names.length)];
  });

  actions = createDispatchMap({
    deleteProject: DeleteProject,
  });

  isInputValid(): boolean {
    return this.userInput() === this.selectedScientist();
  }

  onInputChange(value: string): void {
    this.userInput.set(value);
  }

  handleDeleteProject(): void {
    const projects = this.projects();

    if (!projects || !projects.length) return;

    this.actions
      .deleteProject(projects)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close({ success: true });
          this.toastService.showSuccess('project.deleteProject.success');
          this.router.navigate(['/']);
        },
      });
  }
}
