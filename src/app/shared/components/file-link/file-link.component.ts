import { Tag } from 'primeng/tag';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { FilesService } from '@osf/shared/services';

@Component({
  selector: 'osf-file-link',
  imports: [Tag],
  templateUrl: './file-link.component.html',
  styleUrl: './file-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileLinkComponent {
  file = input.required<{ file_id: string; file_name: string }>();
  content = contentChild<ElementRef>('content');

  private readonly filesService = inject(FilesService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  hasProjectedContent = computed(() => !!this.content());

  navigateToFile() {
    const fileId = this.file().file_id;
    if (fileId) {
      this.filesService
        .getFileGuid(fileId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((file) => {
          this.router.navigate([file.guid]);
        });
    }
  }
}
