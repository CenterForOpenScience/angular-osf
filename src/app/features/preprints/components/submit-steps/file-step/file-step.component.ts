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
  HostListener,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { StringOrNull } from '@core/helpers';
import { PreprintFileSource } from '@osf/features/preprints/enums';
import {
  GetAvailableProjects,
  GetPreprintFilesLinks,
  GetProjectFiles,
  GetProjectFilesByLink,
  SetSelectedPreprintFileSource,
  SubmitPreprintSelectors,
  UploadFile,
} from '@osf/features/preprints/store/submit-preprint';
import { FilesTreeActions } from '@osf/features/project/files/models';
import { FilesTreeComponent, IconComponent } from '@shared/components';
import { OsfFile } from '@shared/models';

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
  private actions = createDispatchMap({
    setSelectedFileSource: SetSelectedPreprintFileSource,
    getPreprintFilesLinks: GetPreprintFilesLinks,
    uploadFile: UploadFile,
    getAvailableProjects: GetAvailableProjects,
    getFilesForSelectedProject: GetProjectFiles,
    getProjectFilesByLink: GetProjectFilesByLink,
  });
  private destroyRef = inject(DestroyRef);

  readonly PreprintFileSource = PreprintFileSource;

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

  isFileSourceSelected = computed(() => {
    return this.selectedFileSource() !== PreprintFileSource.None;
  });

  ngOnInit() {
    this.actions.getPreprintFilesLinks();

    this.projectNameControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.selectedProjectId.set(value);
        this.actions.getAvailableProjects(value);
      });
  }

  selectFileSource(fileSource: PreprintFileSource) {
    this.actions.setSelectedFileSource(fileSource);

    if (fileSource === PreprintFileSource.Project) {
      this.actions.getAvailableProjects(null);
    }
  }

  backButtonClicked() {
    //[RNi] TODO: implement logic of going back to the previous step
  }

  nextButtonClicked() {
    this.nextClicked.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.actions.uploadFile(file);
  }

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload($event: BeforeUnloadEvent): boolean {
    $event.preventDefault();
    return false;
  }

  selectProject(event: SelectChangeEvent) {
    if (!(event.originalEvent instanceof PointerEvent)) {
      return;
    }

    this.actions.getFilesForSelectedProject(event.value);
  }

  selectProjectFile(file: OsfFile) {
    //[RNi] TODO: implement logic of linking preprint to that file
  }
}
