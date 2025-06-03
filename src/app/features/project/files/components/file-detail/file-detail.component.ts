import { select, Store } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  GetFileMetadata,
  GetFileProjectContributors,
  GetFileProjectMetadata,
  GetFileTarget,
  ProjectFilesSelectors,
} from '@osf/features/project/files/store';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';

import { FileMetadataComponent } from './components/file-metadata/file-metadata.component';
import { ProjectMetadataComponent } from './components/project-metadata/project-metadata.component';

@Component({
  selector: 'osf-file-detail',
  imports: [
    SubHeaderComponent,
    RouterLink,
    LoadingSpinnerComponent,
    TranslateModule,
    FileMetadataComponent,
    ProjectMetadataComponent,
  ],
  templateUrl: './file-detail.component.html',
  styleUrl: './file-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDetailComponent {
  @HostBinding('class') classes = 'flex flex-column flex-1 gap-4 w-full h-full';
  readonly store = inject(Store);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly destroyRef = inject(DestroyRef);
  readonly sanitizer = inject(DomSanitizer);

  file = select(ProjectFilesSelectors.getOpenedFile);
  safeLink: SafeResourceUrl | null = null;

  isIframeLoading = true;

  constructor() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const guid = params['fileGuid'];
      this.store.dispatch(new GetFileTarget(guid)).subscribe(() => {
        const link = this.file().data?.links.render;
        if (link) {
          this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
        }
      });
      this.store.dispatch(new GetFileMetadata(guid));
    });

    this.route.parent?.params.subscribe((params) => {
      const projectId = params['id'];
      if (projectId) {
        this.store.dispatch(new GetFileProjectMetadata(projectId));
        this.store.dispatch(new GetFileProjectContributors(projectId));
      }
    });
  }
}
