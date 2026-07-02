import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { CedarMetadataDataTemplateJsonApi, CedarMetadataRecordData } from '@osf/features/metadata/models';
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
  cedarRecords = input<CedarMetadataRecordData[] | null>(null);
  cedarTemplates = input<CedarMetadataDataTemplateJsonApi[] | null>(null);
  isCedarMode = input<boolean>(false);

  cedarRecordByTemplateId = computed(() => {
    const records = this.cedarRecords();
    return new Map(
      records?.flatMap((record) => {
        const templateId = record.relationships?.template?.data?.id;
        return templateId ? [[templateId, record] as const] : [];
      }) ?? []
    );
  });

  cedarTemplateById = computed(() => {
    const templates = this.cedarTemplates();
    return new Map(templates?.map((t) => [t.id, t] as const) ?? []);
  });
}
