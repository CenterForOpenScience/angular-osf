import { TranslatePipe } from '@ngx-translate/core';

import { PrimeTemplate, TreeDragDropService } from 'primeng/api';
import { Tree, TreeLazyLoadEvent, TreeNodeDropEvent, TreeNodeSelectEvent } from 'primeng/tree';

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { FileMenuComponent } from '@osf/shared/components/file-menu/file-menu.component';
import { FilesDropZoneComponent } from '@osf/shared/components/files-drop-zone/files-drop-zone.component';
import { FilesTreeRowComponent } from '@osf/shared/components/files-tree-row/files-tree-row.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { FileMenuType } from '@osf/shared/enums/file-menu-type.enum';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { appendDownloadTrackingParams } from '@osf/shared/helpers/download-link.helper';
import { FileTreeMapper } from '@osf/shared/mappers/files/file-tree.mapper';
import { FilesMapper } from '@osf/shared/mappers/files/files.mapper';
import { FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { FileLabelModel } from '@osf/shared/models/files/file-label.model';
import { FileMenuAction, FileMenuFlags } from '@osf/shared/models/files/file-menu-action.model';
import { FilePageLinkModel } from '@osf/shared/models/files/file-page-link.model';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { FilesService } from '@osf/shared/services/files.service';
import { FilesShareEmbedService } from '@osf/shared/services/files-share-embed.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { MoveCopyAction } from '../../enums/move-copy-action.enum';
import { DropMovePayload } from '../../models/files-actions-options.model';
import { MenuMoveCopyPayload } from '../../models/menu-move-copy.model';

@Component({
  selector: 'osf-files-tree-explorer',
  imports: [
    PrimeTemplate,
    TranslatePipe,
    Tree,
    LoadingSpinnerComponent,
    FilesDropZoneComponent,
    FilesTreeRowComponent,
    FileMenuComponent,
  ],
  providers: [TreeDragDropService],
  templateUrl: './files-tree-explorer.component.html',
  styleUrl: './files-tree-explorer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesTreeExplorerComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly filesService = inject(FilesService);
  private readonly dataciteService = inject(DataciteService);
  private readonly filesShareEmbedService = inject(FilesShareEmbedService);
  private readonly viewOnlyService = inject(ViewOnlyLinkHelperService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly files = input.required<FileModel[]>();
  readonly currentFolder = input.required<FileFolderModel>();
  readonly storage = input.required<FileLabelModel | null>();

  readonly totalCount = input<number>(0);
  readonly isLoading = input<boolean>(false);
  readonly resourceId = input.required<string>();
  readonly resourceType = input<CurrentResourceType>(CurrentResourceType.Projects);
  readonly viewOnly = input<boolean>(true);
  readonly allowedMenuActions = input<FileMenuFlags>({} as FileMenuFlags);
  readonly supportUpload = input<boolean>(true);
  readonly selectedFiles = input<FileModel[]>([]);
  readonly scrollHeight = input<string>('300px');
  readonly selectionMode = input<'multiple' | null>('multiple');

  readonly fileOpened = output<FileModel>();
  readonly uploadFiles = output<File[] | File>();
  readonly currentFolderChanged = output<FileFolderModel>();
  readonly deleteFile = output<FileModel>();
  readonly renameFile = output<FileModel>();
  readonly loadFiles = output<FilePageLinkModel>();
  readonly fileSelected = output<FileModel>();
  readonly fileUnselected = output<FileModel>();
  readonly dropMove = output<DropMovePayload>();
  readonly menuMoveCopy = output<MenuMoveCopyPayload>();

  foldersStack = model<FileFolderModel[]>([]);
  lastSelectedFile: FileModel | null = null;

  readonly itemsPerPage = 10;
  readonly virtualScrollItemSize = 46;

  readonly isLoadingMore = signal(false);

  readonly hasViewOnly = computed(() => this.viewOnlyService.hasViewOnlyParam(this.router) || this.viewOnly());
  readonly canUpload = computed(() => !this.hasViewOnly() && this.supportUpload());

  readonly nodes = computed(() => {
    const currentFolder = this.currentFolder();
    const files = this.files();

    const values = this.foldersStack().length
      ? ([{ ...currentFolder, previousFolder: true }, ...files] as FileModel[])
      : files;

    return FileTreeMapper.toTreeNodes(values);
  });

  readonly selectedNodes = computed(() => FileTreeMapper.toTreeNodes(this.selectedFiles()));

  constructor() {
    effect(() => {
      const storageChanged = this.storage();
      if (storageChanged) {
        this.foldersStack.set([]);
      }
    });

    effect(() => {
      if (!this.isLoading()) {
        this.isLoadingMore.set(false);
      }
    });
  }

  onDropFiles(fileArray: File[]): void {
    this.uploadFiles.emit(fileArray);
  }

  deleteEntry(file: FileModel): void {
    this.deleteFile.emit(file);
  }

  openEntry(file: FileModel | FileFolderModel) {
    if (file.kind === FileKind.File) {
      this.fileOpened.emit(file);
    } else {
      const current = this.currentFolder();
      this.foldersStack.update((stack) => [...stack, current]);
      const folder = FilesMapper.mapFileToFolder(file as FileModel);
      this.currentFolderChanged.emit(folder);
    }
  }

  openParentFolder() {
    const stack = this.foldersStack();
    const previous = stack[stack.length - 1];
    this.foldersStack.set(stack.slice(0, -1));

    this.currentFolderChanged.emit(previous);
  }

  onFileMenuAction(action: FileMenuAction, file: FileModel): void {
    const { value, data } = action;

    switch (value) {
      case FileMenuType.Download:
        this.downloadFileOrFolder(file);
        break;
      case FileMenuType.Delete:
        this.deleteEntry(file);
        break;
      case FileMenuType.Share:
        this.handleShareAction(file, data?.type);
        break;
      case FileMenuType.Embed:
        this.handleEmbedAction(file, data?.type);
        break;
      case FileMenuType.Rename:
        this.renameFile.emit(file);
        break;
      case FileMenuType.Move:
        this.menuMoveCopy.emit({ file, action: MoveCopyAction.Move });
        break;
      case FileMenuType.Copy:
        this.menuMoveCopy.emit({ file, action: MoveCopyAction.Copy });
        break;
    }
  }

  downloadFileOrFolder(file: FileModel) {
    this.dataciteService
      .logFileDownload(this.resourceId(), this.resourceType())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    if (file.kind === FileKind.File) {
      this.downloadFile(file.links.download);
    } else {
      this.downloadFolder(file.links.upload);
    }
  }

  downloadFile(link: string): void {
    if (this.isBrowser) {
      window.open(appendDownloadTrackingParams(link, 'files'))?.focus();
    }
  }

  downloadFolder(downloadLink: string): void {
    if (downloadLink) {
      const link = this.filesService.getFolderDownloadLink(downloadLink, 'zip');
      window.open(link, '_blank')?.focus();
    }
  }

  onLazyLoad(event: TreeLazyLoadEvent) {
    const loaded = this.files().length;
    if (event.last >= loaded - 1) {
      this.loadNextPage();
    }
  }

  onNodeSelect(event: TreeNodeSelectEvent) {
    const files = this.files();
    const selectedNode = event.node.data as FileModel;

    if (!selectedNode) {
      return;
    }

    if ((event.originalEvent as PointerEvent).shiftKey && this.lastSelectedFile) {
      const lastIndex = files.indexOf(this.lastSelectedFile);
      const currentIndex = files.indexOf(selectedNode);
      if (lastIndex == currentIndex) {
        return;
      }

      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);

      for (const file of files.slice(start, end)) {
        this.fileSelected.emit(file);
      }
    }

    this.fileSelected.emit(selectedNode);
    this.lastSelectedFile = selectedNode;
  }

  onNodeDrop(event: TreeNodeDropEvent) {
    const dropFile = event.dropNode?.data as FileModel;

    if (dropFile?.kind !== FileKind.Folder) {
      return;
    }

    const selectedFiles = this.selectedFiles();
    const dragFile = event.dragNode?.data as FileModel;

    if (!dragFile) {
      return;
    }

    const filesToMove = selectedFiles.includes(dragFile) ? selectedFiles : [...selectedFiles, dragFile];

    if (!selectedFiles.includes(dragFile)) {
      this.fileSelected.emit(dragFile);
    }

    this.dropMove.emit({ files: filesToMove, destination: dropFile });
  }

  onNodeUnselect(event: TreeNodeSelectEvent) {
    const unselectedNode = event.node.data as FileModel;

    if (!unselectedNode) {
      return;
    }

    this.fileUnselected.emit(unselectedNode);
  }

  private loadNextPage(): void {
    const total = this.totalCount();
    const loaded = this.files().length;
    const nextPage = Math.floor(loaded / this.itemsPerPage) + 1;

    if (!this.isLoadingMore() && loaded < total) {
      this.isLoadingMore.set(true);
      this.loadFiles.emit({ link: this.currentFolder()?.links.filesLink ?? '', page: nextPage });
    }
  }

  private handleShareAction(file: FileModel, shareType?: string): void {
    const shareAction = this.filesShareEmbedService.getShareLink(file, shareType);
    if (!shareAction || !this.isBrowser) {
      return;
    }

    if (shareAction.target === '_self') {
      window.location.href = shareAction.link;
      return;
    }

    window.open(shareAction.link, shareAction.target, 'noopener,noreferrer');
  }

  private handleEmbedAction(file: FileModel, embedType?: string): void {
    this.filesShareEmbedService.copyEmbedToClipboard(file.links.render, embedType);
  }
}
