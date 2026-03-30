import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CollectionSubmission } from '@osf/shared/models/collections/collections.model';

import { MetadataCollectionItemComponent } from '../metadata-collection-item/metadata-collection-item.component';

@Component({
  selector: 'osf-metadata-collections',
  imports: [TranslatePipe, Skeleton, Card, MetadataCollectionItemComponent],
  templateUrl: './metadata-collections.component.html',
  styleUrl: './metadata-collections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataCollectionsComponent {
  projectSubmissions = input<CollectionSubmission[] | null>(null);
  isProjectSubmissionsLoading = input<boolean>(false);
}
