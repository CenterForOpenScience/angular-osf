import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { PageSchema } from '@osf/shared/models/registration/page-schema.model';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';

@Component({
  selector: 'osf-registry-blocks-section',
  imports: [Skeleton, RegistrationBlocksDataComponent],
  templateUrl: './registry-blocks-section.component.html',
  styleUrl: './registry-blocks-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryBlocksSectionComponent {
  schemaBlocks = input.required<PageSchema[] | null>();
  schemaResponse = input.required<SchemaResponse | null>();
  isLoading = input<boolean>(false);

  updatedFields = computed(() => (this.schemaResponse() ? this.schemaResponse()!.updatedResponseKeys : []));
}
