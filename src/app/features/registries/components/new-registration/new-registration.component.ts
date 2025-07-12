import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import { ToastService } from '@osf/shared/services';

import { CreateDraft, GetProjects, GetProviderSchemas, RegistriesSelectors } from '../../store';

@Component({
  selector: 'osf-new-registration',
  imports: [SubHeaderComponent, TranslatePipe, Card, Button, ReactiveFormsModule, Select],
  templateUrl: './new-registration.component.html',
  styleUrl: './new-registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewRegistrationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly projects = select(RegistriesSelectors.getProjects);
  protected readonly providerSchemas = select(RegistriesSelectors.getProviderSchemas);
  protected readonly isDraftSubmitting = select(RegistriesSelectors.isDraftSubmitting);
  protected readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  protected readonly isProvidersLoading = select(RegistriesSelectors.isProvidersLoading);
  protected actions = createDispatchMap({
    getProjects: GetProjects,
    getProviderSchemas: GetProviderSchemas,
    createDraft: CreateDraft,
  });

  protected readonly providerId = this.route.snapshot.params['providerId'];

  fromProject = false;

  draftForm = this.fb.group({
    providerSchema: ['', Validators.required],
    project: [''],
  });

  constructor() {
    this.actions.getProjects();
    this.actions.getProviderSchemas(this.providerId);
    effect(() => {
      const providerSchema = this.draftForm.get('providerSchema')?.value;
      if (!providerSchema) {
        this.draftForm.get('providerSchema')?.setValue(this.providerSchemas()[0]?.id);
      }
    });
  }

  onSelectProject(projectId: string) {
    this.draftForm.patchValue({
      project: projectId,
    });
  }

  onSelectProviderSchema(providerSchemaId: string) {
    this.draftForm.patchValue({
      providerSchema: providerSchemaId,
    });
  }

  toggleFromProject() {
    this.fromProject = !this.fromProject;
    this.draftForm.get('project')?.setValidators(this.fromProject ? Validators.required : null);
    this.draftForm.get('project')?.updateValueAndValidity();
  }

  createDraft() {
    const { providerSchema, project } = this.draftForm.value;

    if (this.draftForm.valid) {
      this.actions
        .createDraft({
          registrationSchemaId: providerSchema!,
          projectId: this.fromProject ? (project ?? undefined) : undefined,
        })
        .subscribe(() => {
          this.toastService.showSuccess('Draft created successfully');
          this.router.navigate(['/registries/drafts/', this.draftRegistration()?.id, 'metadata']);
        });
    }
  }
}
