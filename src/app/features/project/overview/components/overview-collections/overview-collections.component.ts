import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CedarMetadataDataTemplateJsonApi, CedarMetadataRecordDataJsonApi } from '@osf/features/metadata/models';
import { StopPropagationDirective } from '@osf/shared/directives/stop-propagation.directive';
import { CollectionSubmission } from '@osf/shared/models/collections/collection-submissions.model';
import { KeyValueModel } from '@osf/shared/models/common/key-value.model';
import { CollectionStatusSeverityPipe } from '@osf/shared/pipes/collection-status-severity.pipe';

@Component({
  selector: 'osf-overview-collections',
  imports: [
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    TranslatePipe,
    Skeleton,
    Tag,
    Button,
    StopPropagationDirective,
    RouterLink,
    CollectionStatusSeverityPipe,
  ],
  templateUrl: './overview-collections.component.html',
  styleUrl: './overview-collections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewCollectionsComponent {
  projectSubmissions = input<CollectionSubmission[] | null>(null);
  isProjectSubmissionsLoading = input<boolean>(false);
  cedarRecords = input<CedarMetadataRecordDataJsonApi[] | null>(null);
  cedarTemplates = input<CedarMetadataDataTemplateJsonApi[] | null>(null);

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

  getCedarAttributes(
    record: CedarMetadataRecordDataJsonApi,
    template: CedarMetadataDataTemplateJsonApi
  ): KeyValueModel[] {
    const { order, propertyLabels } = template.attributes.template._ui;
    const metadata = record.attributes.metadata as Record<string, unknown>;
    const attributes: KeyValueModel[] = [];

    for (const key of order) {
      const label = propertyLabels[key];
      const value = this.formatCedarValue(metadata[key]);
      if (label && value) {
        attributes.push({ key, label, value });
      }
    }

    return attributes;
  }

  private formatCedarValue(value: unknown): string {
    if (value == null) return '';

    if (Array.isArray(value)) {
      return value
        .map((item) => this.formatCedarValue(item))
        .filter(Boolean)
        .join(', ');
    }

    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      if ('@value' in obj && obj['@value'] != null) return String(obj['@value']);
      if ('rdfs:label' in obj && obj['rdfs:label'] != null) return String(obj['rdfs:label']);
      return '';
    }

    return String(value);
  }
}
