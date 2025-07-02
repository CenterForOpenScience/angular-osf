import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import { ToastService } from '@osf/shared/services';

import { CreateDraft, GetProjects, GetProviders, RegistriesSelectors } from '../../store';

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
  protected readonly projects = select(RegistriesSelectors.getProjects);
  protected readonly providers = select(RegistriesSelectors.getProviders);
  protected readonly isDraftSubmitting = select(RegistriesSelectors.isDraftSubmitting);
  protected readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  protected readonly isProvidersLoading = select(RegistriesSelectors.isProvidersLoading);
  protected actions = createDispatchMap({
    getProjects: GetProjects,
    getProviders: GetProviders,
    createDraft: CreateDraft,
  });
  fromProject = false;

  draftForm = this.fb.group({
    provider: ['', Validators.required],
    project: [''],
  });

  constructor() {
    this.actions.getProjects();
    this.actions.getProviders();
    effect(() => {
      const provider = this.draftForm.get('provider')?.value;
      if (!provider) {
        this.draftForm.get('provider')?.setValue(this.providers()[0]?.id);
      }
    });
  }

  onSelectProject(projectId: string) {
    this.draftForm.patchValue({
      project: projectId,
    });
  }

  onSelectProvider(providerId: string) {
    this.draftForm.patchValue({
      provider: providerId,
    });
  }

  toggleFromProject() {
    this.fromProject = !this.fromProject;
    this.draftForm.get('project')?.setValidators(this.fromProject ? Validators.required : null);
    this.draftForm.get('project')?.updateValueAndValidity();
  }

  createDraft() {
    const { provider, project } = this.draftForm.value;

    if (this.draftForm.valid) {
      this.actions
        .createDraft({
          registrationSchemaId: provider!,
          projectId: this.fromProject ? (project ?? undefined) : undefined,
        })
        .subscribe(() => {
          this.toastService.showSuccess('Draft created successfully');
          this.router.navigate(['/registries/drafts/', this.draftRegistration()?.id, 'metadata']);
        });
    }
  }
}
