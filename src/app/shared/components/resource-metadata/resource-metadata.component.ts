import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TruncatedTextComponent } from '@shared/components/truncated-text/truncated-text.component';
import { OsfResourceTypes } from '@shared/constants';
import { ResourceOverview } from '@shared/models';

@Component({
  selector: 'osf-resource-metadata',
  imports: [Button, TranslatePipe, TruncatedTextComponent, RouterLink, Tag, DatePipe],
  templateUrl: './resource-metadata.component.html',
  styleUrl: './resource-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceMetadataComponent {
  currentResource = input.required<ResourceOverview | null>();

  protected readonly resourceTypes = OsfResourceTypes;
}
