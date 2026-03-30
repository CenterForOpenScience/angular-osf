import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { debounceTime, distinctUntilChanged, EMPTY, switchMap } from 'rxjs';

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

import { PreprintFileSource } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import {
  CopyFileFromProject,
  FetchAvailableProjects,
  FetchPreprintFilesLinks,
  FetchPreprintPrimaryFile,
  FetchProjectFilesByLink,
  PreprintStepperSelectors,
  ReuploadFile,
  SetPreprintStepperCurrentFolder,
  SetProjectRootFolder,
  SetSelectedPreprintFileSource,
  UploadFile,
} from '@osf/features/preprints/store/preprint-stepper';
import { FilesTreeComponent } from '@osf/shared/components/files-tree/files-tree.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { ClearFileDirective } from '@osf/shared/directives/clear-file.directive';
import { StringOrNull } from '@osf/shared/helpers/types.helper';
import { FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

@Component({
  selector: 'osf-file-step',
  imports: [
    Button,
    Card,
    Tooltip,
    Skeleton,
    Select,
    NgClass,
    ReactiveFormsModule,
    IconComponent,
    FilesTreeComponent,
    TitleCasePipe,
    TranslatePipe,
    ClearFileDirective,
  ],
  templateUrl: './file-step.component.html',
  styleUrl: './file-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileStepComponent implements OnInit {
  private toastService = inject(ToastService);
  private customConfirmationService = inject(CustomConfirmationService);
  private destroyRef = inject(DestroyRef);

  private actions = createDispatchMap({
    setSelectedFileSource: SetSelectedPreprintFileSource,
    getPreprintFilesLinks: FetchPreprintFilesLinks,
    uploadFile: UploadFile,
    reuploadFile: ReuploadFile,
    fetchPreprintFile: FetchPreprintPrimaryFile,
    getAvailableProjects: FetchAvailableProjects,
    setProjectRootFolder: SetProjectRootFolder,
    getProjectFilesByLink: FetchProjectFilesByLink,
    copyFileFromProject: CopyFileFromProject,
    setCurrentFolder: SetPreprintStepperCurrentFolder,
  });

  readonly PreprintFileSource = PreprintFileSource;

  provider = input.required<PreprintProviderDetails>();
  preprint = select(PreprintStepperSelectors.getPreprint);
  selectedFileSource = select(PreprintStepperSelectors.getSelectedFileSource);
  fileUploadLink = select(PreprintStepperSelectors.getUploadLink);

  preprintFile = select(PreprintStepperSelectors.getPreprintFile);
  isPreprintFileLoading = select(PreprintStepperSelectors.isPreprintFilesLoading);

  availableProjects = select(PreprintStepperSelectors.getAvailableProjects);
  areAvailableProjectsLoading = select(PreprintStepperSelectors.areAvailableProjectsLoading);

  projectFiles = select(PreprintStepperSelectors.getProjectFiles);
  filesTotalCount = select(PreprintStepperSelectors.getFilesTotalCount);
  areProjectFilesLoading = select(PreprintStepperSelectors.areProjectFilesLoading);

  currentFolder = select(PreprintStepperSelectors.getCurrentFolder);
  isCurrentFolderLoading = select(PreprintStepperSelectors.isCurrentFolderLoading);
  selectedProjectId = signal<StringOrNull>(null);

  versionFileMode = signal<boolean>(false);

  preprintHasPrimaryFile = computed(() => !!this.preprint()?.primaryFileId);

  cancelSourceOptionButtonVisible = computed(
    () => !this.preprintFile() && this.selectedFileSource() !== PreprintFileSource.None && !this.isPreprintFileLoading()
  );

  projectNameControl = new FormControl<StringOrNull>(null);

  nextClicked = output<void>();
  backClicked = output<void>();

  isFileSourceSelected = computed(() => this.selectedFileSource() !== PreprintFileSource.None);
  canProceedToNext = computed(() => !!this.preprintFile() && !this.versionFileMode());

  ngOnInit() {
    this.actions.getPreprintFilesLinks();

    if (this.preprintHasPrimaryFile() && !this.preprintFile()) {
      this.actions.fetchPreprintFile();
    }

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
    if (!this.canProceedToNext() || !this.preprint()?.primaryFileId) {
      return;
    }

    this.toastService.showSuccess('preprints.preprintStepper.common.successMessages.preprintSaved');
    this.nextClicked.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const isVersionFileMode = this.versionFileMode();

    if (isVersionFileMode) {
      this.versionFileMode.set(false);
    }

    const uploadAction = isVersionFileMode ? this.actions.reuploadFile(file) : this.actions.uploadFile(file);
    uploadAction.subscribe(() => this.actions.fetchPreprintFile());
  }

  selectProject(event: SelectChangeEvent) {
    if (!(event.originalEvent instanceof PointerEvent)) {
      return;
    }

    this.selectedProjectId.set(event.value);

    this.actions
      .setProjectRootFolder(event.value)
      .pipe(
        switchMap(() => {
          const filesLink = this.currentFolder()?.links.filesLink;
          if (filesLink) {
            return this.actions.getProjectFilesByLink(filesLink, 1);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe();
  }

  selectProjectFile(file: FileModel) {
    this.actions.copyFileFromProject(file).subscribe(() => this.actions.fetchPreprintFile());
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

  cancelButtonClicked() {
    if (this.preprintFile()) {
      return;
    }

    this.actions.setSelectedFileSource(PreprintFileSource.None);
  }

  setCurrentFolder(folder: FileFolderModel) {
    if (this.currentFolder()?.id === folder.id) {
      return;
    }

    this.actions.setCurrentFolder(folder);
    this.actions.getProjectFilesByLink(folder.links.filesLink, 1);
  }

  onLoadFiles(event: { link: string; page: number }) {
    this.actions.getProjectFilesByLink(event.link, event.page);
  }
}
