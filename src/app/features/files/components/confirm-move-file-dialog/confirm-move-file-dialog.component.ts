import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { finalize, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FilesSelectors } from '@osf/features/files/store';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { FileMenuType } from '@shared/enums/file-menu-type.enum';
import { FileModel } from '@shared/models/files/file.model';

@Component({
  selector: 'osf-move-file-dialog',
  imports: [Button, TranslatePipe],
  templateUrl: './confirm-move-file-dialog.component.html',
  styleUrl: './confirm-move-file-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmMoveFileDialogComponent {
  readonly config = inject(DynamicDialogConfig);
  readonly dialogRef = inject(DynamicDialogRef);
  private readonly filesService = inject(FilesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);
  private readonly toastService = inject(ToastService);
  private readonly customConfirmationService = inject(CustomConfirmationService);

  readonly files = select(FilesSelectors.getMoveDialogFiles);
  readonly provider = this.config.data.storageProvider;

  private fileProjectId = this.config.data.resourceId;
  protected currentFolder = this.config.data.destination;

  get dragNodeName() {
    const filesCount = this.config.data.files.length;
    if (filesCount > 1) {
      return this.translateService.instant('files.dialogs.moveFile.multipleFiles', { count: filesCount });
    } else {
      return this.config.data.files[0]?.name;
    }
  }

  copyFiles(): void {
    return this.copyOrMoveFiles(FileMenuType.Copy);
  }

  moveFiles(): void {
    return this.copyOrMoveFiles(FileMenuType.Move);
  }

  private copyOrMoveFiles(action: FileMenuType): void {
    const path = this.currentFolder.path;
    if (!path) {
      throw new Error(this.translateService.instant('files.dialogs.moveFile.pathError'));
    }
    const isMoveAction = action === FileMenuType.Move;

    const headerKey = isMoveAction ? 'files.dialogs.moveFile.movingHeader' : 'files.dialogs.moveFile.copingHeader';
    this.config.header = this.translateService.instant(headerKey);
    const files: FileModel[] = this.config.data.files;
    const totalFiles = files.length;
    let completed = 0;
    const conflictFiles: { file: FileModel; link: string }[] = [];

    files.forEach((file) => {
      const link = file.links.move;
      this.filesService
        .moveFile(link, path, this.fileProjectId, this.provider(), action)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error) => {
            if (error.status === 409) {
              conflictFiles.push({ file, link });
            } else {
              this.showErrorToast(action, error.error?.message);
            }
            return of(null);
          }),
          finalize(() => {
            completed++;
            if (completed === totalFiles) {
              if (conflictFiles.length > 0) {
                this.openReplaceMoveDialog(conflictFiles, path, action);
              } else {
                this.showSuccessToast(action);
                this.config.header = this.translateService.instant('files.dialogs.moveFile.title');
                this.completeMove();
              }
            }
          })
        )
        .subscribe();
    });
  }

  private openReplaceMoveDialog(
    conflictFiles: { file: FileModel; link: string }[],
    path: string,
    action: string
  ): void {
    this.customConfirmationService.confirmDelete({
      headerKey: conflictFiles.length > 1 ? 'files.dialogs.replaceFile.multiple' : 'files.dialogs.replaceFile.single',
      messageKey: 'files.dialogs.replaceFile.message',
      messageParams: {
        name: conflictFiles.map((c) => c.file.name).join(', '),
      },
      acceptLabelKey: 'common.buttons.replace',
      onConfirm: () => {
        const replaceRequests$ = conflictFiles.map(({ link }) =>
          this.filesService.moveFile(link, path, this.fileProjectId, this.provider(), action, true).pipe(
            takeUntilDestroyed(this.destroyRef),
            catchError(() => of(null))
          )
        );
        forkJoin(replaceRequests$).subscribe({
          next: () => {
            this.showSuccessToast(action);
            this.completeMove();
          },
        });
      },
      onReject: () => {
        const totalFiles = this.config.data.files.length;
        if (totalFiles > conflictFiles.length) {
          this.showErrorToast(action);
        }
        this.completeMove();
      },
    });
  }

  private showSuccessToast(action: string) {
    const messageType = action === 'move' ? 'moveFile' : 'copyFile';
    this.toastService.showSuccess(`files.dialogs.${messageType}.success`);
  }

  private showErrorToast(action: string, errorMessage?: string) {
    const messageType = action === 'move' ? 'moveFile' : 'copyFile';
    this.toastService.showError(errorMessage ?? `files.dialogs.${messageType}.error`);
  }

  private completeMove(): void {
    this.dialogRef.close(true);
  }
}
