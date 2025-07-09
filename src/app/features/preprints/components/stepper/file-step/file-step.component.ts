import { createDispatchMap, select } from '@ngxs/store';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { debounceTime, distinctUntilChanged, EMPTY, Observable } from 'rxjs';

import { NgClass, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { StringOrNull } from '@core/helpers';
import { PreprintFileSource } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import {
  CopyFileFromProject,
  GetAvailableProjects,
  GetPreprintFilesLinks,
  GetProjectFiles,
  GetProjectFilesByLink,
  ReuploadFile,
  SetSelectedPreprintFileSource,
  SubmitPreprintSelectors,
  UploadFile,
} from '@osf/features/preprints/store/submit-preprint';
import { FilesTreeActions } from '@osf/features/project/files/models';
import { FilesTreeComponent, IconComponent } from '@shared/components';
import { OsfFile } from '@shared/models';
import { CustomConfirmationService, ToastService } from '@shared/services';

@Component({
  selector: 'osf-file-step',
  imports: [
    Button,
    TitleCasePipe,
    NgClass,
    Tooltip,
    Skeleton,
    IconComponent,
    Card,
    Select,
    ReactiveFormsModule,
    FilesTreeComponent,
  ],
  templateUrl: './file-step.component.html',
  styleUrl: './file-step.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileStepComponent implements OnInit {
  private toastService = inject(ToastService);
  private customConfirmationService = inject(CustomConfirmationService);
  private actions = createDispatchMap({
    setSelectedFileSource: SetSelectedPreprintFileSource,
    getPreprintFilesLinks: GetPreprintFilesLinks,
    uploadFile: UploadFile,
    reuploadFile: ReuploadFile,
    getAvailableProjects: GetAvailableProjects,
    getFilesForSelectedProject: GetProjectFiles,
    getProjectFilesByLink: GetProjectFilesByLink,
    copyFileFromProject: CopyFileFromProject,
  });
  private destroyRef = inject(DestroyRef);

  readonly PreprintFileSource = PreprintFileSource;

  provider = input.required<PreprintProviderDetails | undefined>();
  createdPreprint = select(SubmitPreprintSelectors.getCreatedPreprint);
  providerId = select(SubmitPreprintSelectors.getSelectedProviderId);
  selectedFileSource = select(SubmitPreprintSelectors.getSelectedFileSource);
  fileUploadLink = select(SubmitPreprintSelectors.getUploadLink);
  preprintFiles = select(SubmitPreprintSelectors.getPreprintFiles);
  arePreprintFilesLoading = select(SubmitPreprintSelectors.arePreprintFilesLoading);
  availableProjects = select(SubmitPreprintSelectors.getAvailableProjects);
  areAvailableProjectsLoading = select(SubmitPreprintSelectors.areAvailableProjectsLoading);
  projectFiles = select(SubmitPreprintSelectors.getProjectFiles);
  areProjectFilesLoading = select(SubmitPreprintSelectors.areProjectFilesLoading);
  selectedProjectId = signal<StringOrNull>(null);
  currentFolder = signal<OsfFile | null>(null);

  versionFileMode = signal<boolean>(false);

  projectNameControl = new FormControl<StringOrNull>(null);

  filesTreeActions: FilesTreeActions = {
    setCurrentFolder: (folder: OsfFile | null): Observable<void> => {
      this.currentFolder.set(folder);
      return EMPTY;
    },
    getFiles: (filesLink: string): Observable<void> => {
      return this.actions.getProjectFilesByLink(filesLink);
    },
    getRootFolderFiles: (projectId: string): Observable<void> => {
      return this.actions.getFilesForSelectedProject(projectId);
    },
  };

  nextClicked = output<void>();
  backClicked = output<void>();

  isFileSourceSelected = computed(() => {
    return this.selectedFileSource() !== PreprintFileSource.None;
  });

  ngOnInit() {
    this.actions.getPreprintFilesLinks();

    this.projectNameControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((projectNameOrId) => {
        if (this.selectedProjectId() === projectNameOrId) {
          return;
        }

        this.actions.getAvailableProjects(projectNameOrId);
      });
  }

  selectFileSource(fileSource: PreprintFileSource) {
    this.actions.setSelectedFileSource(fileSource);

    if (fileSource === PreprintFileSource.Project) {
      this.actions.getAvailableProjects(null);
    }
  }

  backButtonClicked() {
    this.backClicked.emit();
  }

  nextButtonClicked() {
    if (!this.createdPreprint()?.primaryFileId) {
      return;
    }

    this.toastService.showSuccess('Preprint saved');
    this.nextClicked.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (this.versionFileMode()) {
      this.versionFileMode.set(false);
      this.actions.reuploadFile(file);
    } else {
      this.actions.uploadFile(file);
    }
  }

  selectProject(event: SelectChangeEvent) {
    if (!(event.originalEvent instanceof PointerEvent)) {
      return;
    }

    this.selectedProjectId.set(event.value);
    this.actions.getFilesForSelectedProject(event.value);
  }

  selectProjectFile(file: OsfFile) {
    this.actions.copyFileFromProject(file);
  }

  versionFile() {
    this.customConfirmationService.confirmContinue({
      headerKey: 'Add a new preprint file',
      messageKey:
        'This will allow a new version of the preprint file to be uploaded to the preprint. The existing file will be retained as a version of the preprint.',
      onConfirm: () => {
        this.versionFileMode.set(true);
        this.actions.setSelectedFileSource(PreprintFileSource.None);
      },
      onReject: () => null,
    });
  }
}
