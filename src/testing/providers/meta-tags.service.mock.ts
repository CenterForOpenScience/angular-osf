import { MetaTagsService } from '@osf/shared/services/meta-tags.service';

export function MetaTagsServiceMockFactory() {
  return {
    updateMetaTags: jest.fn(),
  } as unknown as jest.Mocked<Pick<MetaTagsService, 'updateMetaTags'>>;
}
