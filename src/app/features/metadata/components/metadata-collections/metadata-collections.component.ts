import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { CollectionSubmission } from '@osf/shared/models/collections/collections.models';

import { MetadataCollectionItemComponent } from '../metadata-collection-item/metadata-collection-item.component';

@Component({
  selector: 'osf-metadata-collections',
  imports: [TranslatePipe, Skeleton, Card, MetadataCollectionItemComponent],
  templateUrl: './metadata-collections.component.html',
  styleUrl: './metadata-collections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataCollectionsComponent {
  private readonly router = inject(Router);

  projectSubmissions = input<CollectionSubmission[] | null>(null);
  isProjectSubmissionsLoading = input<boolean>(false);
}
