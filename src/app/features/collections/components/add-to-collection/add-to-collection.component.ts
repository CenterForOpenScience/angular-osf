import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ProjectMetadataFormControls } from '@osf/features/collections/enums';
import { ProjectMetadataForm } from '@osf/features/collections/models';
import { CollectionsSelectors, GetCollectionDetails, GetCollectionProvider } from '@osf/features/collections/store';
import { GetAdminProjects } from '@osf/shared/stores';
import { LoadingSpinnerComponent, SelectComponent } from '@shared/components';
import { CustomValidators } from '@shared/utils';

@Component({
  selector: 'osf-add-to-collection-form',
  imports: [
    Button,
    LoadingSpinnerComponent,
    TranslatePipe,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    Select,
    SelectComponent,
    RouterLink,
    InputText,
    ReactiveFormsModule,
    Textarea,
  ],
  templateUrl: './add-to-collection.component.html',
  styleUrl: './add-to-collection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCollectionComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected readonly ProjectMetadataFormControls = ProjectMetadataFormControls;
  protected isProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  protected collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  protected currentUser = select(UserSelectors.getCurrentUser);
  protected providerId = signal<string>('');
  protected primaryCollectionId = computed(() => this.collectionProvider()?.primaryCollection?.id);
  protected actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
    getCollectionDetails: GetCollectionDetails,
    getAdminProjects: GetAdminProjects,
  });
  protected projectControl = new FormControl('');

  readonly projectMetadataForm = new FormGroup<ProjectMetadataForm>({
    [ProjectMetadataFormControls.Title]: new FormControl('', {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed()],
    }),
    [ProjectMetadataFormControls.Description]: new FormControl('', {
      nonNullable: true,
    }),
    [ProjectMetadataFormControls.License]: new FormControl('', {
      nonNullable: true,
    }),
    [ProjectMetadataFormControls.Tags]: new FormControl([], {
      nonNullable: true,
    }),
  });

  constructor() {
    this.initializeProvider();
    this.setupEffects();
  }

  private initializeProvider(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.providerId.set(id);
    this.actions.getCollectionProvider(id);
  }

  private setupEffects(): void {
    effect(() => {
      const collectionId = this.primaryCollectionId();
      if (collectionId) {
        this.actions.getCollectionDetails(collectionId);
      }
    });

    effect(() => {
      const currentUser = this.currentUser();
      if (currentUser) {
        this.actions.getAdminProjects(currentUser.id);
      }
    });
  }
}
