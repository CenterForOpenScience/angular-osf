import { Mocked } from 'vitest';

import { MetaTagsBuilderService } from '@osf/shared/services/meta-tags-builder.service';

type MetaTagsBuilderMethods =
  | 'buildProjectMetaTagsData'
  | 'buildRegistryMetaTagsData'
  | 'buildPreprintMetaTagsData'
  | 'buildFileMetaTagsData';

export function MetaTagsBuilderServiceMockFactory() {
  return {
    buildProjectMetaTagsData: vi.fn(),
    buildRegistryMetaTagsData: vi.fn(),
    buildPreprintMetaTagsData: vi.fn(),
    buildFileMetaTagsData: vi.fn(),
  } as unknown as Mocked<Pick<MetaTagsBuilderService, MetaTagsBuilderMethods>>;
}
