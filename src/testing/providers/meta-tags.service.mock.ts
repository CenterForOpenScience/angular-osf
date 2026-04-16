import { Mocked } from 'vitest';

import { MetaTagsService } from '@osf/shared/services/meta-tags.service';

export function MetaTagsServiceMockFactory() {
  return {
    updateMetaTags: vi.fn(),
  } as unknown as Mocked<Pick<MetaTagsService, 'updateMetaTags'>>;
}
