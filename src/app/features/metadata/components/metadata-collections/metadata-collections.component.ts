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
    if (!records?.length) return new Map<string, CedarMetadataRecordData>();
    const map = new Map<string, CedarMetadataRecordData>();
    for (const record of records) {
      const templateId = record.relationships?.template?.data?.id;
      if (templateId) {
        map.set(templateId, record);
      }
    }
    return map;
  });

  cedarTemplateById = computed(() => {
    const templates = this.cedarTemplates();
    if (!templates?.length) return new Map<string, CedarMetadataDataTemplateJsonApi>();
    const map = new Map<string, CedarMetadataDataTemplateJsonApi>();
    for (const template of templates) {
      map.set(template.id, template);
    }
    return map;
  });
}
