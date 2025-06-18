import { select, Store } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';

import { ProjectFilesSelectors } from '@osf/features/project/files/store';

@Component({
  selector: 'osf-project-metadata',
  imports: [DatePipe, TranslateModule],
  templateUrl: './project-metadata.component.html',
  styleUrl: './project-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataComponent {
  readonly store = inject(Store);
  readonly destroyRef = inject(DestroyRef);

  projectMetadata = select(ProjectFilesSelectors.getProjectMetadata);
  contributors = select(ProjectFilesSelectors.getProjectContributors);
}
