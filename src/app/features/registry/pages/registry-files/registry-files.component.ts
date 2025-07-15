import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { TreeDragDropService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { debounceTime, EMPTY, Observable, skip } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FilesTreeActions } from '@osf/features/project/files/models';
import {
  FilesTreeComponent,
  FormSelectComponent,
  LoadingSpinnerComponent,
  SearchInputComponent,
  SubHeaderComponent,
} from '@shared/components';
import { ALL_SORT_OPTIONS } from '@shared/constants';
import { OsfFile } from '@shared/models';
import { FilesService } from '@shared/services';

import {
  GetRegistryFiles,
  SetCurrentFolder,
  SetSearch,
  SetSort,
} from '../../store/registry-files/registry-files.actions';
import { RegistryFilesSelectors } from '../../store/registry-files/registry-files.selectors';
import { GetRegistryById } from '../../store/registry-overview/registry-overview.actions';
import { RegistryOverviewSelectors } from '../../store/registry-overview/registry-overview.selectors';

@Component({
  selector: 'osf-registry-files',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    Button,
    FilesTreeComponent,
    FormSelectComponent,
    SearchInputComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './registry-files.component.html',
  styleUrl: './registry-files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, TreeDragDropService],
})
export class RegistryFilesComponent {
  protected readonly registry = select(RegistryOverviewSelectors.getRegistry);
  protected readonly isRegistryLoading = select(RegistryOverviewSelectors.isRegistryLoading);
  protected readonly files = select(RegistryFilesSelectors.getFiles);
  protected readonly isFilesLoading = select(RegistryFilesSelectors.isFilesLoading);
  protected readonly currentFolder = select(RegistryFilesSelectors.getCurrentFolder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly filesService = inject(FilesService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly actions = createDispatchMap({
    setCurrentFolder: SetCurrentFolder,
    getFiles: GetRegistryFiles,
    getRootFolderFiles: GetRegistryFiles,
    getRegistryById: GetRegistryById,
    setSearch: SetSearch,
    setSort: SetSort,
  });

  protected readonly filesTreeActions: FilesTreeActions = {
    setCurrentFolder: (folder) => this.actions.setCurrentFolder(folder),
    getFiles: (filesLink) => this.actions.getFiles(filesLink),
  };

  protected readonly searchControl = new FormControl<string>('');
  protected readonly sortControl = new FormControl(ALL_SORT_OPTIONS[0].value);

  protected isFolderOpening = signal(false);
  protected registryId = signal('');
  protected dataLoaded = signal(false);

  protected readonly sortOptions = ALL_SORT_OPTIONS;
  protected readonly provider = 'osfstorage';

  constructor() {
    this.route.parent?.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.registryId.set(id);
        if (!this.registry()) {
          this.actions.getRegistryById(id);
        }
      }
    });

    effect(() => {
      const registry = this.registry();

      if (registry) {
        this.actions.getFiles(registry.links.files).subscribe(() => this.dataLoaded.set(true));
      }
    });

    this.searchControl.valueChanges
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef), debounceTime(500))
      .subscribe((searchText) => {
        this.actions.setSearch(searchText ?? '');
        if (!this.isFolderOpening()) {
          this.updateFilesList();
        }
      });

    this.sortControl.valueChanges.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe((sort) => {
      this.actions.setSort(sort ?? '');
      if (!this.isFolderOpening()) {
        this.updateFilesList();
      }
    });
  }

  folderIsOpening(value: boolean): void {
    this.isFolderOpening.set(value);
    if (value) {
      this.searchControl.setValue('');
      this.sortControl.setValue(ALL_SORT_OPTIONS[0].value);
    }
  }

  updateFilesList(): Observable<void> {
    const currentFolder = this.currentFolder();
    if (currentFolder?.relationships.filesLink) {
      return this.actions.getFiles(currentFolder?.relationships.filesLink).pipe(takeUntilDestroyed(this.destroyRef));
    }

    const registry = this.registry();

    if (registry) {
      return this.actions.getFiles(registry.links.files);
    }

    return EMPTY;
  }

  navigateToFile(file: OsfFile) {
    this.router.navigate([file.guid], { relativeTo: this.route });
  }

  downloadFolder(): void {
    const registryId = this.registry()?.id;
    const folderId = this.currentFolder()?.id ?? '';
    const isRootFolder = !this.currentFolder()?.relationships?.parentFolderLink;

    if (registryId) {
      if (isRootFolder || !folderId) {
        const link = this.filesService.getFolderDownloadLink(registryId, this.provider, '', true);
        window.open(link, '_blank')?.focus();
      } else {
        const link = this.filesService.getFolderDownloadLink(registryId, this.provider, folderId, false);
        window.open(link, '_blank')?.focus();
      }
    }
  }
}
