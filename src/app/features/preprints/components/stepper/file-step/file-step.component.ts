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
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { PreprintFileSource, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import {
  CopyFileFromProject,
  DeletePreprintFile,
  FetchAvailableProjects,
  FetchPreprintFilesLinks,
  FetchPreprintPrimaryFile,
  FetchProjectFilesByLink,
  PreprintStepperSelectors,
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
import { FilePageLinkModel } from '@osf/shared/models/files/file-page-link.model';
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
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customConfirmationService = inject(CustomConfirmationService);

  private actions = createDispatchMap({
    setSelectedFileSource: SetSelectedPreprintFileSource,
    getPreprintFilesLinks: FetchPreprintFilesLinks,
    deletePreprintFile: DeletePreprintFile,
    uploadFile: UploadFile,
    fetchPreprintFile: FetchPreprintPrimaryFile,
    getAvailableProjects: FetchAvailableProjects,
    setProjectRootFolder: SetProjectRootFolder,
    getProjectFilesByLink: FetchProjectFilesByLink,
    copyFileFromProject: CopyFileFromProject,
    setCurrentFolder: SetPreprintStepperCurrentFolder,
  });

  readonly PreprintFileSource = PreprintFileSource;

  readonly provider = input.required<PreprintProviderDetails>();
  readonly showDeleteButton = input(false);

  readonly nextClicked = output<void>();
  readonly backClicked = output<void>();
  readonly deleteClicked = output<void>();

  readonly preprint = select(PreprintStepperSelectors.getPreprint);
  readonly selectedFileSource = select(PreprintStepperSelectors.getSelectedFileSource);
  readonly fileUploadLink = select(PreprintStepperSelectors.getUploadLink);

  readonly preprintFile = select(PreprintStepperSelectors.getPreprintFile);
  readonly isPreprintFileLoading = select(PreprintStepperSelectors.isPreprintFilesLoading);

  readonly availableProjects = select(PreprintStepperSelectors.getAvailableProjects);
  readonly areAvailableProjectsLoading = select(PreprintStepperSelectors.areAvailableProjectsLoading);

  readonly projectFiles = select(PreprintStepperSelectors.getProjectFiles);
  readonly filesTotalCount = select(PreprintStepperSelectors.getFilesTotalCount);
  readonly areProjectFilesLoading = select(PreprintStepperSelectors.areProjectFilesLoading);

  readonly currentFolder = select(PreprintStepperSelectors.getCurrentFolder);
  readonly isCurrentFolderLoading = select(PreprintStepperSelectors.isCurrentFolderLoading);
  readonly selectedProjectId = signal<StringOrNull>(null);

  readonly preprintId = computed(() => this.preprint()?.id ?? null);
  readonly primaryFileId = computed(() => this.preprint()?.primaryFileId ?? null);
  readonly preprintHasPrimaryFile = computed(() => !!this.primaryFileId());

  readonly canDeletePrimaryFile = computed(() => {
    const reviewsState = this.preprint()?.reviewsState;
    return reviewsState === ReviewsState.Initial || reviewsState === ReviewsState.Rejected;
  });

  readonly cancelSourceOptionButtonVisible = computed(
    () => !this.preprintFile() && this.selectedFileSource() !== PreprintFileSource.None && !this.isPreprintFileLoading()
  );

  readonly projectNameControl = new FormControl<StringOrNull>(null);

  readonly isFileSourceSelected = computed(() => this.selectedFileSource() !== PreprintFileSource.None);

  constructor() {
    effect(() => {
      if (!this.preprintId()) {
        return;
      }

      this.actions.getPreprintFilesLinks();
    });

    effect(() => {
      if (!this.primaryFileId()) {
        return;
      }

      if (untracked(() => this.preprintFile())) {
        return;
      }

      this.actions.fetchPreprintFile();
    });
  }

  ngOnInit() {
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
    if (!this.preprintFile() || !this.primaryFileId()) {
      return;
    }

    this.toastService.showSuccess('preprints.preprintStepper.common.successMessages.preprintSaved');
    this.nextClicked.emit();
  }

  deletePreprint() {
    this.deleteClicked.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.actions.uploadFile(file).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
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
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  selectProjectFile(file: FileModel) {
    this.actions.copyFileFromProject(file).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  deletePreprintFile() {
    const file = this.preprintFile();

    if (!file || !this.canDeletePrimaryFile()) {
      return;
    }

    this.customConfirmationService.confirmDelete({
      headerKey: 'files.dialogs.deleteFile.title',
      messageParams: { name: file.name },
      messageKey: 'files.dialogs.deleteFile.message',
      onConfirm: () => {
        this.actions
          .deletePreprintFile(file.links.delete)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.selectedProjectId.set(null);
            this.projectNameControl.setValue(null, { emitEvent: false });
            this.toastService.showSuccess('files.dialogs.deleteFile.success');
          });
      },
    });
  }

  cancelButtonClicked() {
    if (this.preprintFile()) {
      return;
    }

    this.selectedProjectId.set(null);
    this.projectNameControl.setValue(null, { emitEvent: false });
    this.actions.setSelectedFileSource(PreprintFileSource.None);
  }

  setCurrentFolder(folder: FileFolderModel) {
    if (this.currentFolder()?.id === folder.id) {
      return;
    }

    this.actions.setCurrentFolder(folder);
    this.actions.getProjectFilesByLink(folder.links.filesLink, 1);
  }

  onLoadFiles(event: FilePageLinkModel) {
    this.actions.getProjectFilesByLink(event.link, event.page);
  }
}
