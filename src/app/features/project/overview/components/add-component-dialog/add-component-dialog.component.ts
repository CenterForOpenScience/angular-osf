import { select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { STORAGE_LOCATIONS } from '@osf/core/constants';
import { ComponentFormControls } from '@osf/shared/enums';
import { ComponentForm } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import { IS_XSMALL } from '@osf/shared/utils';

import { CreateComponent, GetComponents, ProjectOverviewSelectors } from '../../store';

@Component({
  selector: 'osf-add-component-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    Select,
    Textarea,
    NgOptimizedImage,
    TranslatePipe,
  ],
  templateUrl: './add-component-dialog.component.html',
  styleUrl: './add-component-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddComponentDialogComponent implements OnInit {
  private store = inject(Store);
  private translateService = inject(TranslateService);
  private toastService = inject(ToastService);
  protected isMobile = toSignal(inject(IS_XSMALL));
  protected dialogRef = inject(DynamicDialogRef);
  protected destroyRef = inject(DestroyRef);
  protected ComponentFormControls = ComponentFormControls;
  protected storageLocations = STORAGE_LOCATIONS;
  protected isSubmitting = select(ProjectOverviewSelectors.getComponentsSubmitting);
  protected currentProject = this.store.selectSignal(ProjectOverviewSelectors.getProject);

  toggleAddContributors(): void {
    const control = this.componentForm.get(ComponentFormControls.AddContributors);
    if (control) {
      control.setValue(!control.value);
    }
  }

  toggleAddTags(): void {
    const control = this.componentForm.get(ComponentFormControls.AddTags);
    if (control) {
      control.setValue(!control.value);
    }
  }

  componentForm = new FormGroup<ComponentForm>({
    [ComponentFormControls.Title]: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    [ComponentFormControls.StorageLocation]: new FormControl('us', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    [ComponentFormControls.Affiliations]: new FormControl<string[]>([], {
      nonNullable: true,
    }),
    [ComponentFormControls.Description]: new FormControl('', {
      nonNullable: true,
    }),
    [ComponentFormControls.AddContributors]: new FormControl(false, {
      nonNullable: true,
    }),
    [ComponentFormControls.AddTags]: new FormControl(false, {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.selectAllAffiliations();
  }

  selectAllAffiliations(): void {
    const allAffiliationValues = this.currentProject()?.affiliatedInstitutions?.map((aff) => aff.id) || [];
    this.componentForm.get(ComponentFormControls.Affiliations)?.setValue(allAffiliationValues);
  }

  removeAllAffiliations(): void {
    this.componentForm.get(ComponentFormControls.Affiliations)?.setValue([]);
  }

  submitForm(): void {
    if (!this.componentForm.valid) {
      this.componentForm.markAllAsTouched();
      return;
    }

    const formValue = this.componentForm.getRawValue();
    const project = this.currentProject();

    if (!project) {
      return;
    }

    const tags = formValue.addTags ? project.tags : [];

    this.store
      .dispatch(
        new CreateComponent(
          project.id,
          formValue.title,
          formValue.description,
          tags,
          formValue.storageLocation,
          formValue.affiliations,
          formValue.addContributors
        )
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.store.dispatch(new GetComponents(project.id));
          this.toastService.showSuccess(
            this.translateService.instant('project.overview.dialog.toast.addComponent.success')
          );
        },
      });
  }
}
