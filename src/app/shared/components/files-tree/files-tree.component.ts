import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { PrimeTemplate } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Tree, TreeNodeDropEvent } from 'primeng/tree';

import { EMPTY, finalize, firstValueFrom, Observable, take } from 'rxjs';

import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { ActivatedRoute, Router } from '@angular/router';

import { MoveFileDialogComponent, RenameFileDialogComponent } from '@osf/features/files/components';
import { embedDynamicJs, embedStaticHtml } from '@osf/features/files/constants';
import { FileMenuType } from '@osf/shared/enums';
import { StopPropagationDirective } from '@shared/directives';
import { hasViewOnlyParam } from '@shared/helpers';
import { FileLabelModel, FileMenuAction, FilesTreeActions, OsfFile } from '@shared/models';
import { FileSizePipe } from '@shared/pipes';
import { CustomConfirmationService, FilesService, ToastService } from '@shared/services';

import { CustomPaginatorComponent } from '../custom-paginator/custom-paginator.component';
import { FileMenuComponent } from '../file-menu/file-menu.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

import { environment } from 'src/environments/environment';

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
  readonly dialogService = inject(DialogService);
  readonly translateService = inject(TranslateService);

  files = input.required<OsfFile[]>();
  totalCount = input<number>(0);
  isLoading = input<boolean>();
  currentFolder = input.required<OsfFile | null>();
  storage = input.required<FileLabelModel | null>();
  resourceId = input.required<string>();
  actions = input.required<FilesTreeActions>();
  viewOnly = input<boolean>(true);
  viewOnlyDownloadable = input<boolean>(false);
  provider = input<string>();
  isDragOver = signal(false);
  hasViewOnly = computed(() => {
    return hasViewOnlyParam(this.router) || this.viewOnly();
  });

  entryFileClicked = output<OsfFile>();
  folderIsOpening = output<boolean>();
  uploadFileConfirmed = output<File>();
  filesPageChange = output<number>();

  foldersStack: OsfFile[] = [];
  itemsPerPage = 10;
  first = 0;

  readonly FileMenuType = FileMenuType;

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

  ngAfterViewInit(): void {
    if (!this.viewOnly()) {
      this.dropZoneContainerRef()!.nativeElement.addEventListener('dragenter', this.dragEnterHandler);
    }
  }

  ngOnDestroy(): void {
    if (!this.viewOnly()) {
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
      this.customConfirmationService.confirmAccept({
        headerKey: 'files.dialogs.uploadFile.title',
        messageParams: { name: files[0].name },
        messageKey: 'files.dialogs.uploadFile.message',
        acceptLabelKey: 'common.buttons.upload',
        onConfirm: () => this.uploadFileConfirmed.emit(files[0]),
      });
    }
  }

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
        if (file.kind === 'file') {
          this.downloadFile(file.links.download);
        } else {
          this.downloadFolder(file.id, false);
        }
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

  private handleShareAction(file: OsfFile, shareType?: string): void {
    const emailLink = `mailto:?subject=${file.name}&body=${file.links.html}`;
    const twitterLink = `https://twitter.com/intent/tweet?url=${file.links.html}&text=${file.name}&via=OSFramework`;
    const facebookLink = `https://www.facebook.com/dialog/share?app_id=${environment.facebookAppId}&display=popup&href=${file.links.html}&redirect_uri=${file.links.html}`;

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
    this.dialogService
      .open(RenameFileDialogComponent, {
        width: '448px',
        focusOnShow: false,
        header: this.translateService.instant('files.dialogs.renameFile.title'),
        closeOnEscape: true,
        modal: true,
        closable: true,
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

  downloadFolder(folderId: string, rootFolder: boolean): void {
    const resourceId = this.resourceId();
    const storageLink = this.currentFolder()?.links?.download ?? '';
    if (resourceId && folderId) {
      if (rootFolder) {
        const link = this.filesService.getFolderDownloadLink(storageLink, '', true);
        window.open(link, '_blank')?.focus();
      } else {
        const link = this.filesService.getFolderDownloadLink(storageLink, folderId, false);
        window.open(link, '_blank')?.focus();
      }
    }
  }

  moveFile(file: OsfFile, action: string): void {
    this.actions()
      .setMoveFileCurrentFolder?.(this.currentFolder())
      .pipe(take(1))
      .subscribe(() => {
        const header =
          action === 'move'
            ? this.translateService.instant('files.dialogs.moveFile.title')
            : this.translateService.instant('files.dialogs.copyFile.title');

        this.dialogService.open(MoveFileDialogComponent, {
          width: '552px',
          focusOnShow: false,
          header: header,
          closeOnEscape: true,
          modal: true,
          closable: true,
          data: {
            file: file,
            resourceId: this.resourceId(),
            action: action,
            storageName: this.storage()?.label,
            foldersStack: [...this.foldersStack],
          },
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
    navigator.clipboard
      .writeText(embedHtml)
      .then(() => {
        this.toastService.showSuccess('files.toast.copiedToClipboard');
      })
      .catch((err) => {
        this.toastService.showError(err.message);
      });
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
    let path = dropNode?.path;
    const moveLink = dragNode?.links?.move;
    let parentFolder: OsfFile | null = null;

    if (dropNode?.previousFolder) {
      parentFolder = await firstValueFrom(this.filesService.getFolder(dropNode.relationships.parentFolderLink));
      if (!parentFolder.relationships.parentFolderLink) {
        path = '/';
      } else {
        path = parentFolder.path;
      }
    }

    if (!path) {
      throw new Error('Path is not specified!.');
    }

    this.filesService
      .moveFile(moveLink, path, this.resourceId(), this.provider()!, 'move')
      .pipe(
        take(1),
        finalize(() => {
          this.actions().setCurrentFolder(dropNode?.previousFolder ? parentFolder : dropNode);
        })
      )
      .subscribe((file) => {
        if (file.id) {
          if (dropNode?.previousFolder) {
            const filesLink = parentFolder?.relationships.filesLink;

            if (filesLink) {
              this.actions().getFiles(filesLink);
            }
          } else {
            const filesLink = dropNode?.relationships.filesLink;
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
