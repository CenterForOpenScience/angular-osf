import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { FilesService } from '@osf/shared/services/files.service';

@Component({
  selector: 'osf-file-redirect',
  imports: [],
  templateUrl: './file-redirect.component.html',
  styleUrl: './file-redirect.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileRedirectComponent {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly filesService = inject(FilesService);

  readonly fileId = this.route.snapshot.paramMap.get('fileId') ?? '';
  constructor() {
    if (this.fileId) {
      this.filesService
        .getFileGuid(this.fileId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((file) => {
          this.router.navigate([file.guid]);
        });
    }
  }
}
