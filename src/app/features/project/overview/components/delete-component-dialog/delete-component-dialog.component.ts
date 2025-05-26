import { select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { DeleteComponent, GetComponents, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { ToastService } from '@shared/services';
import { ScientistsNames } from '@shared/utils/scientists.const';

@Component({
  selector: 'osf-delete-component-dialog',
  imports: [TranslatePipe, Button, InputText, FormsModule],
  templateUrl: './delete-component-dialog.component.html',
  styleUrl: './delete-component-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteComponentDialogComponent {
  private store = inject(Store);
  private dialogConfig = inject(DynamicDialogConfig);
  private translateService = inject(TranslateService);
  private toastService = inject(ToastService);
  protected dialogRef = inject(DynamicDialogRef);
  protected destroyRef = inject(DestroyRef);
  private componentId = signal(this.dialogConfig.data.componentId);
  protected scientistNames = ScientistsNames;
  protected currentProject = select(ProjectOverviewSelectors.getProject);
  protected isSubmitting = select(ProjectOverviewSelectors.getComponentsSubmitting);
  protected userInput = signal('');
  protected selectedScientist = computed(() => {
    const names = Object.values(this.scientistNames);
    return names[Math.floor(Math.random() * names.length)];
  });

  protected isInputValid(): boolean {
    return this.userInput() === this.selectedScientist();
  }

  protected onInputChange(value: string): void {
    this.userInput.set(value);
  }

  protected handleDeleteComponent(): void {
    const project = this.currentProject();
    const componentId = this.componentId();

    if (!componentId || !project) return;

    this.store
      .dispatch(new DeleteComponent(componentId))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.store.dispatch(new GetComponents(project.id));
          this.toastService.showSuccess(
            this.translateService.instant('project.overview.dialog.toast.deleteComponent.success')
          );
        },
      });
  }
}
