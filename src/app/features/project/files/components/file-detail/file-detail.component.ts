import { select, Store } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  GetFileMetadata,
  GetFileProjectContributors,
  GetFileProjectMetadata,
  GetFileTarget,
  SetFileMetadata,
} from '@osf/features/project/files/store/project-files.actions';
import { ProjectFilesSelectors } from '@osf/features/project/files/store/project-files.selectors';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';

@Component({
  selector: 'osf-file-detail',
  imports: [
    SubHeaderComponent,
    RouterLink,
    Button,
    LoadingSpinnerComponent,
    DatePipe,
    Dialog,
    InputText,
    Select,
    FormsModule,
    ReactiveFormsModule,
    Skeleton,
    TranslateModule,
  ],
  templateUrl: './file-detail.component.html',
  styleUrl: './file-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDetailComponent {
  @HostBinding('class') classes = 'flex flex-column flex-1 gap-4 w-full h-full';
  readonly store = inject(Store);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly destroyRef = inject(DestroyRef);
  readonly sanitizer = inject(DomSanitizer);
  readonly fb = inject(FormBuilder);

  file = select(ProjectFilesSelectors.getOpenedFile);
  fileMetadata = select(ProjectFilesSelectors.getFileCustomMetadata);
  projectMetadata = select(ProjectFilesSelectors.getProjectMetadata);
  contributors = select(ProjectFilesSelectors.getProjectContributors);
  safeLink: SafeResourceUrl | null = null;

  isIframeLoading = true;
  editFileMetadataVisible = false;

  fileMetadataForm = new FormGroup({
    title: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    resourceType: new FormControl<string | null>(null),
    resourceLanguage: new FormControl<string | null>(null),
  });

  // TO DO: figure out where to get this options
  resourceTypes = [
    { value: 'Audiovisual' },
    { value: 'Book' },
    { value: 'BookChapter' },
    { value: 'Collection' },
    { value: 'ComputationalNotebook' },
    { value: 'ConferencePaper' },
    { value: 'ConferenceProceeding' },
    { value: 'DataPaper' },
    { value: 'Dataset' },
    { value: 'Dissertation' },
    { value: 'Event' },
    { value: 'Image' },
    { value: 'Instrument' },
    { value: 'InteractiveResource' },
    { value: 'Journal' },
    { value: 'JournalArticle' },
    { value: 'Model' },
    { value: 'OutputManagementPlan' },
    { value: 'PeerReview' },
    { value: 'PhysicalObject' },
    { value: 'Preprint' },
    { value: 'Report' },
    { value: 'Service' },
    { value: 'Software' },
    { value: 'Standard' },
    { value: 'StudyRegistration' },
    { value: 'Text' },
    { value: 'Workflow' },
    { value: 'Other' },
  ];

  // TO DO: figure out where to get this options
  languages = [
    { value: 'eng', label: 'English' },
    { value: 'ukr', label: 'Ukrainian' },
  ];

  constructor() {
    // Subscribe to route parameter changes
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const guid = params['fileGuid'];
      this.store.dispatch(new GetFileTarget(guid)).subscribe(() => {
        const link = this.file().data?.links.render;
        if (link) {
          this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
        }
      });
      this.store.dispatch(new GetFileMetadata(guid));
    });

    this.route.parent?.params.subscribe((params) => {
      const projectId = params['id'];
      if (projectId) {
        this.store.dispatch(new GetFileProjectMetadata(projectId));
        this.store.dispatch(new GetFileProjectContributors(projectId));
      }
    });

    toObservable(this.fileMetadata)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((metadata) => {
        if (metadata.data) {
          this.fileMetadataForm.patchValue({
            title: metadata.data.title,
            description: metadata.data.description,
            resourceType: metadata.data.resourceTypeGeneral,
            resourceLanguage: metadata.data.language,
          });
        }
      });
  }

  setFileMetadata() {
    if (this.fileMetadataForm.valid) {
      const formValues = {
        title: this.fileMetadataForm.get('title')?.value ?? null,
        description: this.fileMetadataForm.get('description')?.value ?? null,
        resource_type_general: this.fileMetadataForm.get('resourceType')?.value ?? null,
        language: this.fileMetadataForm.get('resourceLanguage')?.value ?? null,
      };

      const fileId = this.file().data?.id;
      if (fileId) {
        this.store.dispatch(new SetFileMetadata(formValues, fileId));
      }

      this.editFileMetadataVisible = false;
    }
  }
}
