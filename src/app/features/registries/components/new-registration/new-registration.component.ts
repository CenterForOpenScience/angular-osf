import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';

import { debounceTime, distinctUntilChanged, filter, Subject, take } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ToastService } from '@osf/shared/services/toast.service';
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
  private readonly destroyRef = inject(DestroyRef);

  readonly user = select(UserSelectors.getCurrentUser);
  readonly projects = select(RegistriesSelectors.getProjects);
  readonly providerSchemas = select(RegistriesSelectors.getProviderSchemas);
  readonly isDraftSubmitting = select(RegistriesSelectors.isDraftSubmitting);
  readonly isProvidersLoading = select(RegistriesSelectors.isProvidersLoading);
  readonly isProjectsLoading = select(RegistriesSelectors.isProjectsLoading);
  private readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);

  private readonly actions = createDispatchMap({
    getProvider: GetRegistryProvider,
    getProjects: GetProjects,
    getProviderSchemas: GetProviderSchemas,
    createDraft: CreateDraft,
  });
  private readonly providerId = this.route.snapshot.params['providerId'];
  private readonly projectId = this.route.snapshot.queryParams['projectId'];
  private readonly filter$ = new Subject<string>();

  readonly fromProject = signal(this.projectId !== undefined);
  readonly draftForm = this.fb.group({
    providerSchema: ['', Validators.required],
    project: [this.projectId || ''],
  });

  constructor() {
    this.loadInitialData();
    this.setupDefaultSchema();
    this.setupProjectFilter();
  }

  onProjectFilter(value: string) {
    this.filter$.next(value);
  }

  toggleFromProject() {
    this.fromProject.update((v) => !v);
    const projectControl = this.draftForm.get('project');
    projectControl?.setValidators(this.fromProject() ? Validators.required : null);
    projectControl?.updateValueAndValidity();
  }

  createDraft() {
    if (this.draftForm.invalid) {
      return;
    }

    const { providerSchema, project } = this.draftForm.value;

    this.actions
      .createDraft({
        registrationSchemaId: providerSchema!,
        provider: this.providerId,
        projectId: this.fromProject() ? (project ?? undefined) : undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toastService.showSuccess('registries.new.createdSuccessfully');
        this.router.navigate(['/registries/drafts/', this.draftRegistration()!.id, 'metadata']);
      });
  }

  private loadInitialData() {
    const userId = this.user()?.id;
    if (userId) {
      this.actions.getProjects(userId, '');
    }
    this.actions.getProvider(this.providerId);
    this.actions.getProviderSchemas(this.providerId);
  }

  private setupDefaultSchema() {
    toObservable(this.providerSchemas)
      .pipe(
        filter((schemas) => schemas.length > 0),
        take(1)
      )
      .subscribe((schemas) => this.draftForm.get('providerSchema')?.setValue(schemas[0].id));
  }

  private setupProjectFilter() {
    this.filter$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => {
        const currentUserId = this.user()?.id;
        if (currentUserId) {
          this.actions.getProjects(currentUserId, value);
        }
      });
  }
}
