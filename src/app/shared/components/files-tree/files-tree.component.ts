import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PrimeTemplate } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Tree, TreeNodeDropEvent } from 'primeng/tree';

import { EMPTY, finalize, Observable, take } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  HostBinding,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { MoveFileDialogComponent } from '@osf/features/files/components/move-file-dialog/move-file-dialog.component';
import { RenameFileDialogComponent } from '@osf/features/files/components/rename-file-dialog/rename-file-dialog.component';
import { embedDynamicJs, embedStaticHtml } from '@osf/features/files/constants';
import { StopPropagationDirective } from '@osf/shared/directives';
import { FileMenuType } from '@osf/shared/enums';
import { hasViewOnlyParam } from '@osf/shared/helpers';
import { FileLabelModel, FileMenuAction, FileMenuFlags, FilesTreeActions, OsfFile } from '@osf/shared/models';
import { FileSizePipe } from '@osf/shared/pipes';
import { CustomConfirmationService, CustomDialogService, FilesService, ToastService } from '@osf/shared/services';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { CurrentResourceSelectors } from '@shared/stores';

import { CustomPaginatorComponent } from '../custom-paginator/custom-paginator.component';
import { FileMenuComponent } from '../file-menu/file-menu.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'osf-files-tree',
  imports: [
    DatePipe,
    FileSizePipe,
    PrimeTemplate,
    TranslatePipe,
    Tree,
    LoadingSpinnerComponent,
    FileMenuComponent,
    StopPropagationDirective,
    CustomPaginatorComponent,
  ],
  templateUrl: './files-tree.component.html',
  styleUrl: './files-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesTreeComponent implements OnDestroy, AfterViewInit {
  @HostBinding('class') classes = 'relative';
  private dropZoneContainerRef = viewChild<ElementRef>('dropZoneContainer');
  readonly filesService = inject(FilesService);
  readonly router = inject(Router);
  readonly toastService = inject(ToastService);
  readonly route = inject(ActivatedRoute);
  readonly customConfirmationService = inject(CustomConfirmationService);
  readonly customDialogService = inject(CustomDialogService);
  readonly dataciteService = inject(DataciteService);

  private readonly destroyRef = inject(DestroyRef);
  private readonly environment = inject(ENVIRONMENT);
  readonly clipboard = inject(Clipboard);

  files = input.required<OsfFile[]>();
  totalCount = input<number>(0);
  isLoading = input<boolean>();
  currentFolder = input.required<OsfFile | null>();
  storage = input.required<FileLabelModel | null>();
  resourceId = input.required<string>();
  actions = input.required<FilesTreeActions>();
  viewOnly = input<boolean>(true);
  provider = input<string>();
  allowedMenuActions = input<FileMenuFlags>({} as FileMenuFlags);
  supportUpload = input<boolean>(true);
  isDragOver = signal(false);
  hasViewOnly = computed(() => hasViewOnlyParam(this.router) || this.viewOnly());

  readonly resourceMetadata = select(CurrentResourceSelectors.getCurrentResource);

  entryFileClicked = output<OsfFile>();
  folderIsOpening = output<boolean>();
  uploadFilesConfirmed = output<File[] | File>();
  filesPageChange = output<number>();

  foldersStack: OsfFile[] = [];
  itemsPerPage = 10;
  first = 0;

  readonly FileMenuType = FileMenuType;

  get isSomeFileActionAllowed(): boolean {
    return Object.keys(this.allowedMenuActions()).length > 0;
  }

  readonly nodes = computed(() => {
    const currentFolder = this.currentFolder();
    const files = this.files();
    const hasParent = this.foldersStack.length > 0;
    if (hasParent) {
      return [
        {
          ...currentFolder,
          previousFolder: hasParent,
        },
        ...files,
      ] as OsfFile[];
    } else {
      return [...files];
    }
  });

  constructor() {
    effect(() => {
      const currentFolder = this.currentFolder();
      if (currentFolder) {
        this.updateFilesList(currentFolder).subscribe(() => this.folderIsOpening.emit(false));
      }
    });

    effect(() => {
      const storageChanged = this.storage();
      if (storageChanged) {
        this.foldersStack = [];
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.viewOnly()) {
      this.dropZoneContainerRef()?.nativeElement?.addEventListener('dragenter', this.dragEnterHandler);
    }
  }

  ngOnDestroy(): void {
    if (this.dropZoneContainerRef()?.nativeElement) {
      this.dropZoneContainerRef()!.nativeElement.removeEventListener('dragenter', this.dragEnterHandler);
    }
  }

  private dragEnterHandler = (event: DragEvent) => {
    if (event.dataTransfer?.types?.includes('Files') && !this.viewOnly()) {
      this.isDragOver.set(true);
    }
  };

  onDragOver(event: DragEvent) {
    if (this.viewOnly()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'copy';
    this.isDragOver.set(true);
  }

  onDragLeave(event: Event) {
    if (this.viewOnly()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    if (this.viewOnly()) {
      return;
    }

    const files = event.dataTransfer?.files;

    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const isMultiple = files.length > 1;

      this.customConfirmationService.confirmAccept({
        headerKey: isMultiple ? 'files.dialogs.uploadFiles.title' : 'files.dialogs.uploadFile.title',
        messageParams: isMultiple ? { count: files.length } : { name: files[0].name },
        messageKey: isMultiple ? 'files.dialogs.uploadFiles.message' : 'files.dialogs.uploadFile.message',
        acceptLabelKey: 'common.buttons.upload',
        onConfirm: () => this.uploadFilesConfirmed.emit(fileArray),
      });
    }
  }

  openEntry(file: OsfFile) {
    if (file.kind === 'file') {
      if (file.guid) {
        this.entryFileClicked.emit(file);
      } else {
        this.filesService.getFileGuid(file.id).subscribe((file) => {
          this.entryFileClicked.emit(file);
        });
      }
    } else {
      const current = this.currentFolder();
      if (current) {
        this.foldersStack.push(current);
      }
      this.resetPagination();
      this.actions().setFilesIsLoading?.(true);
      this.folderIsOpening.emit(true);
      this.actions().setCurrentFolder(file);
    }
  }

  openParentFolder() {
    const previous = this.foldersStack.pop();
    if (previous) {
      this.actions().setCurrentFolder(previous);
    }
  }

  onFileMenuAction(action: FileMenuAction, file: OsfFile): void {
    const { value, data } = action;

    switch (value) {
      case FileMenuType.Download:
        this.downloadFileOrFolder(file);
        break;
      case FileMenuType.Delete:
        this.confirmDelete(file);
        break;
      case FileMenuType.Share:
        this.handleShareAction(file, data?.type);
        break;
      case FileMenuType.Embed:
        this.handleEmbedAction(file, data?.type);
        break;
      case FileMenuType.Rename:
        this.confirmRename(file);
        break;
      case FileMenuType.Move:
        this.moveFile(file, FileMenuType.Move);
        break;
      case FileMenuType.Copy:
        this.moveFile(file, FileMenuType.Copy);
        break;
    }
  }

  downloadFileOrFolder(file: OsfFile) {
    const resourceType = this.resourceMetadata()?.type ?? 'nodes';
    this.dataciteService
      .logFileDownload(this.resourceId(), resourceType)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    if (file.kind === 'file') {
      this.downloadFile(file.links.download);
    } else {
      this.downloadFolder(file.links.download);
    }
  }

  private handleShareAction(file: OsfFile, shareType?: string): void {
    const emailLink = `mailto:?subject=${file.name}&body=${file.links.html}`;
    const twitterLink = `https://twitter.com/intent/tweet?url=${file.links.html}&text=${file.name}&via=OSFramework`;
    const facebookLink = `https://www.facebook.com/dialog/share?app_id=${this.environment.facebookAppId}&display=popup&href=${file.links.html}&redirect_uri=${file.links.html}`;

    switch (shareType) {
      case 'email':
        this.openLink(emailLink);
        break;
      case 'twitter':
        this.openLinkNewTab(twitterLink);
        break;
      case 'facebook':
        this.openLinkNewTab(facebookLink);
        break;
    }
  }

  private handleEmbedAction(file: OsfFile, embedType?: string): void {
    let embedHtml = '';
    if (embedType === 'dynamic') {
      embedHtml = embedDynamicJs.replace('ENCODED_URL', file.links.render);
    } else if (embedType === 'static') {
      embedHtml = embedStaticHtml.replace('ENCODED_URL', file.links.render);
    }

    if (embedHtml) {
      this.copyToClipboard(embedHtml);
    }
  }

  confirmDelete(file: OsfFile): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'files.dialogs.deleteFile.title',
      messageParams: { name: file.name },
      messageKey: 'files.dialogs.deleteFile.message',
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => this.deleteEntry(file.links.delete),
    });
  }

  deleteEntry(link: string): void {
    this.actions().setFilesIsLoading?.(true);
    this.actions().deleteEntry?.(this.resourceId(), link);
  }

  confirmRename(file: OsfFile): void {
    this.customDialogService
      .open(RenameFileDialogComponent, {
        header: 'files.dialogs.renameFile.title',
        width: '448px',
        data: {
          currentName: file.name,
        },
      })
      .onClose.subscribe((newName: string) => {
        if (newName) {
          this.renameEntry(newName, file);
        }
      });
  }

  renameEntry(newName: string, file: OsfFile): void {
    if (newName.trim() && file.links.upload) {
      this.actions().setFilesIsLoading?.(true);
      this.actions().renameEntry?.(this.resourceId(), file.links.upload, newName);
    }
  }

  downloadFile(link: string): void {
    window.open(link)?.focus();
  }

  openLink(link: string): void {
    window.location.href = link;
  }

  openLinkNewTab(link: string): void {
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  downloadFolder(downloadLink: string): void {
    if (downloadLink) {
      const link = this.filesService.getFolderDownloadLink(downloadLink, '', false);
      window.open(link, '_blank')?.focus();
    }
  }

  moveFile(file: OsfFile, action: string): void {
    this.actions()
      .setMoveFileCurrentFolder?.(this.currentFolder())
      .pipe(take(1))
      .subscribe(() => {
        const header = action === 'move' ? 'files.dialogs.moveFile.title' : 'files.dialogs.copyFile.title';

        this.customDialogService
          .open(MoveFileDialogComponent, {
            header,
            width: '552px',
            data: {
              file: file,
              resourceId: this.resourceId(),
              action: action,
              storageName: this.storage()?.label,
              foldersStack: [...this.foldersStack],
              fileFolderId: this.currentFolder()?.id,
            },
          })
          .onClose.subscribe((foldersStack) => {
            this.resetPagination();
            if (foldersStack) {
              this.foldersStack = [...foldersStack];
            }
          });
      });
  }

  updateFilesList(currentFolder: OsfFile): Observable<void> {
    if (currentFolder?.relationships?.filesLink) {
      return this.actions().getFiles(currentFolder?.relationships.filesLink);
    }
    return EMPTY;
  }

  copyToClipboard(embedHtml: string): void {
    this.clipboard.copy(embedHtml);
    this.toastService.showSuccess('files.detail.toast.copiedToClipboard');
  }

  async dropNode(event: TreeNodeDropEvent) {
    const dragNode = event.dragNode as OsfFile;
    const dropNode = event.dropNode as OsfFile;

    this.customConfirmationService.confirmAccept({
      headerKey: 'files.dialogs.moveFile.title',
      messageParams: {
        dragNodeName: dragNode.name,
        dropNodeName: dropNode.previousFolder ? 'parent folder' : dropNode.name,
      },
      messageKey: 'files.dialogs.moveFile.message',
      onConfirm: async () => {
        await this.dropFileToFolder(event);
      },
      onReject: () => {
        const filesLink = this.currentFolder()?.relationships.filesLink;
        if (filesLink) {
          this.actions().getFiles(filesLink);
        }
      },
    });
  }

  async dropFileToFolder(event: TreeNodeDropEvent): Promise<void> {
    this.actions().setFilesIsLoading?.(true);

    const dropNode = event.dropNode as OsfFile;
    const dragNode = event.dragNode as OsfFile;
    const moveLink = dragNode?.links?.move;
    let targetFolder: OsfFile | null = null;
    let path = '';

    if (dropNode?.previousFolder) {
      if (this.foldersStack.length > 0) {
        targetFolder = this.foldersStack[this.foldersStack.length - 1];
        path = targetFolder?.path || '/';
      } else {
        path = '/';
      }
    } else {
      targetFolder = dropNode;
      path = dropNode?.path || '/';
    }

    if (!path) {
      throw new Error('Path is not specified!.');
    }

    this.filesService
      .moveFile(moveLink, path, this.resourceId(), this.provider()!, 'move')
      .pipe(
        take(1),
        finalize(() => {
          if (dropNode?.previousFolder) {
            if (this.foldersStack.length > 0) {
              this.foldersStack.pop();
            }
            this.actions().setCurrentFolder(targetFolder);
          } else {
            if (this.currentFolder()) {
              this.foldersStack.push(this.currentFolder()!);
            }
            this.actions().setCurrentFolder(targetFolder);
          }
        })
      )
      .subscribe((file) => {
        if (file.id) {
          const filesLink = targetFolder?.relationships.filesLink;
          if (filesLink) {
            this.actions().getFiles(filesLink);
          }
        }
      });
  }

  resetPagination() {
    this.first = 0;
    this.filesPageChange.emit(1);
  }

  onFilesPageChange(event: PaginatorState): void {
    this.filesPageChange.emit(event.page! + 1);
    this.first = event.first!;
  }
}
