import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';

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
  FetchAvailableProjects,
  FetchPreprintFilesLinks,
  FetchProjectFiles,
  FetchProjectFilesByLink,
  PreprintStepperSelectors,
  ReuploadFile,
  SetCurrentFolder,
  SetSelectedPreprintFileSource,
  UploadFile,
} from '@osf/features/preprints/store/preprint-stepper';
import { FilesTreeComponent, IconComponent } from '@shared/components';
import { FilesTreeActions, OsfFile } from '@shared/models';
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
    TranslatePipe,
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
    getPreprintFilesLinks: FetchPreprintFilesLinks,
    uploadFile: UploadFile,
    reuploadFile: ReuploadFile,
    getAvailableProjects: FetchAvailableProjects,
    getFilesForSelectedProject: FetchProjectFiles,
    getProjectFilesByLink: FetchProjectFilesByLink,
    copyFileFromProject: CopyFileFromProject,
    setCurrentFolder: SetCurrentFolder,
  });
  private destroyRef = inject(DestroyRef);

  readonly PreprintFileSource = PreprintFileSource;

  provider = input.required<PreprintProviderDetails | undefined>();
  preprint = select(PreprintStepperSelectors.getPreprint);
  providerId = select(PreprintStepperSelectors.getSelectedProviderId);
  selectedFileSource = select(PreprintStepperSelectors.getSelectedFileSource);
  fileUploadLink = select(PreprintStepperSelectors.getUploadLink);
  preprintFiles = select(PreprintStepperSelectors.getPreprintFiles);
  arePreprintFilesLoading = select(PreprintStepperSelectors.arePreprintFilesLoading);
  availableProjects = select(PreprintStepperSelectors.getAvailableProjects);
  areAvailableProjectsLoading = select(PreprintStepperSelectors.areAvailableProjectsLoading);
  projectFiles = select(PreprintStepperSelectors.getProjectFiles);
  areProjectFilesLoading = select(PreprintStepperSelectors.areProjectFilesLoading);
  currentFolder = select(PreprintStepperSelectors.getCurrentFolder);
  selectedProjectId = signal<StringOrNull>(null);

  versionFileMode = signal<boolean>(false);

  projectNameControl = new FormControl<StringOrNull>(null);

  filesTreeActions: FilesTreeActions = {
    setCurrentFolder: (folder: OsfFile | null): Observable<void> => {
      return this.actions.setCurrentFolder(folder);
    },
    getFiles: (filesLink: string): Observable<void> => {
      return this.actions.getProjectFilesByLink(filesLink);
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
    if (!this.preprint()?.primaryFileId) {
      return;
    }

    this.toastService.showSuccess('preprints.preprintStepper.common.successMessages.preprintSaved');
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
      headerKey: 'preprints.preprintStepper.file.versionFile.header',
      messageKey: 'preprints.preprintStepper.file.versionFile.message',
      onConfirm: () => {
        this.versionFileMode.set(true);
        this.actions.setSelectedFileSource(PreprintFileSource.None);
      },
      onReject: () => null,
    });
  }
}
