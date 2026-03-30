import { MetaTagsBuilderService } from '@osf/shared/services/meta-tags-builder.service';

type MetaTagsBuilderMethods =
  | 'buildProjectMetaTagsData'
  | 'buildRegistryMetaTagsData'
  | 'buildPreprintMetaTagsData'
  | 'buildFileMetaTagsData';

export function MetaTagsBuilderServiceMockFactory() {
  return {
    buildProjectMetaTagsData: jest.fn(),
    buildRegistryMetaTagsData: jest.fn(),
    buildPreprintMetaTagsData: jest.fn(),
    buildFileMetaTagsData: jest.fn(),
  } as unknown as jest.Mocked<Pick<MetaTagsBuilderService, MetaTagsBuilderMethods>>;
}
