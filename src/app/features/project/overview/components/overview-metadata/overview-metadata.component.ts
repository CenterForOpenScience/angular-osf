import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { TruncatedTextComponent } from '@shared/components/truncated-text/truncated-text.component';

@Component({
  selector: 'osf-overview-metadata',
  imports: [Button, TranslatePipe, TruncatedTextComponent, RouterLink, Tag, DatePipe],
  templateUrl: './overview-metadata.component.html',
  styleUrl: './overview-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewMetadataComponent {
  protected currentProject = select(ProjectOverviewSelectors.getProject);
}
