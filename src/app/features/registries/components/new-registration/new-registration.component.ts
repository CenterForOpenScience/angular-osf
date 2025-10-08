import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { SubHeaderComponent } from '@osf/shared/components';
import { ToastService } from '@osf/shared/services';
import { GetRegistryProvider } from '@shared/stores/registration-provider';

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
  private destroyRef = inject(DestroyRef);

  readonly projects = select(RegistriesSelectors.getProjects);
  readonly providerSchemas = select(RegistriesSelectors.getProviderSchemas);
  readonly isDraftSubmitting = select(RegistriesSelectors.isDraftSubmitting);
  readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  readonly isProvidersLoading = select(RegistriesSelectors.isProvidersLoading);
  readonly isProjectsLoading = select(RegistriesSelectors.isProjectsLoading);
  readonly user = select(UserSelectors.getCurrentUser);
  actions = createDispatchMap({
    getProvider: GetRegistryProvider,
    getProjects: GetProjects,
    getProviderSchemas: GetProviderSchemas,
    createDraft: CreateDraft,
  });

  readonly providerId = this.route.snapshot.params['providerId'];
  readonly projectId = this.route.snapshot.queryParams['projectId'];

  fromProject = this.projectId !== undefined;

  draftForm = this.fb.group({
    providerSchema: ['', Validators.required],
    project: [this.projectId || ''],
  });

  private filter$ = new Subject<string>();

  constructor() {
    const userId = this.user()?.id;
    if (userId) {
      this.actions.getProjects(userId, '');
    }
    this.actions.getProvider(this.providerId);
    this.actions.getProviderSchemas(this.providerId);
    effect(() => {
      const providerSchema = this.draftForm.get('providerSchema')?.value;
      if (!providerSchema) {
        this.draftForm.get('providerSchema')?.setValue(this.providerSchemas()[0]?.id);
      }
    });

    this.filter$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => {
        if (userId) {
          this.actions.getProjects(userId, value);
        }
      });
  }

  onSelectProject(projectId: string) {
    this.draftForm.patchValue({
      project: projectId,
    });
  }

  onProjectFilter(value: string) {
    this.filter$.next(value);
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
          provider: this.providerId,
          projectId: this.fromProject ? (project ?? undefined) : undefined,
        })
        .subscribe(() => {
          this.toastService.showSuccess('registries.new.createdSuccessfully');
          this.router.navigate(['/registries/drafts/', this.draftRegistration()?.id, 'metadata']);
        });
    }
  }
}
