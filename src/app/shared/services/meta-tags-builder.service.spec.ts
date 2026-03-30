import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { OsfFileCustomMetadata } from '@osf/features/files/models';
import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { FileDetailsModel } from '@osf/shared/models/files/file.model';

import { MetaTagsBuilderService } from './meta-tags-builder.service';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

function buildFile(overrides: Partial<FileDetailsModel> = {}): FileDetailsModel {
  return {
    id: 'file-id',
    guid: 'file-guid',
    name: 'file-name.pdf',
    kind: FileKind.File,
    path: '/file-name.pdf',
    size: 100,
    materializedPath: '/file-name.pdf',
    dateModified: '2024-01-05T00:00:00Z',
    extra: {
      hashes: {
        md5: 'md5',
        sha256: 'sha256',
      },
      downloads: 1,
    },
    lastTouched: null,
    dateCreated: '2024-01-04T00:00:00Z',
    tags: [],
    currentVersion: 1,
    showAsUnviewed: false,
    links: {
      info: 'info',
      move: 'move',
      upload: 'upload',
      delete: 'delete',
      download: 'download',
      render: 'render',
      html: 'html',
      self: 'self',
    },
    target: MOCK_PROJECT_OVERVIEW,
    ...overrides,
  };
}

describe('MetaTagsBuilderService', () => {
  let service: MetaTagsBuilderService;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetaTagsBuilderService, MockProvider(LOCALE_ID, 'en-US'), provideOSFCore()],
    });

    service = TestBed.inject(MetaTagsBuilderService);
    translateService = TestBed.inject(TranslateService);
  });

  it('buildProjectMetaTagsData should build canonical, keywords and contributors', () => {
    const meta = service.buildProjectMetaTagsData({
      project: { ...MOCK_PROJECT_OVERVIEW, tags: ['tag-1', 'tag-2'], category: 'analysis' },
      canonicalPath: 'overview',
      contributors: [MOCK_CONTRIBUTOR],
      licenseName: 'MIT',
    });

    expect(meta).toEqual(
      expect.objectContaining({
        osfGuid: 'project-1',
        title: 'Test Project',
        description: 'Test Description',
        url: 'http://localhost:4200/project-1/overview',
        canonicalUrl: 'http://localhost:4200/project-1/overview',
        license: 'MIT',
        publishedDate: '2023-01-01',
        modifiedDate: '2023-01-01',
        keywords: ['tag-1', 'tag-2', 'analysis'],
        contributors: [{ fullName: 'John Doe', givenName: 'John Doe', familyName: 'John Doe' }],
      })
    );
  });

  it('buildRegistryMetaTagsData should include doi and identifier', () => {
    const meta = service.buildRegistryMetaTagsData({
      registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      canonicalPath: 'overview',
      contributors: [MOCK_CONTRIBUTOR],
      licenseName: 'CC-BY',
    });

    expect(meta).toEqual(
      expect.objectContaining({
        osfGuid: 'test-registry-id',
        identifier: 'test-registry-id',
        doi: '10.1234/test',
        url: 'http://localhost:4200/test-registry-id',
        canonicalUrl: 'http://localhost:4200/test-registry-id/overview',
        siteName: 'OSF',
        license: 'CC-BY',
        contributors: [{ fullName: 'John Doe', givenName: 'John Doe', familyName: 'John Doe' }],
      })
    );
  });

  it('buildPreprintMetaTagsData should build provider canonical url', () => {
    const meta = service.buildPreprintMetaTagsData({
      providerId: PREPRINT_MOCK.providerId,
      preprint: PREPRINT_MOCK,
      contributors: [MOCK_CONTRIBUTOR],
    });

    expect(meta).toEqual(
      expect.objectContaining({
        osfGuid: PREPRINT_MOCK.id,
        title: PREPRINT_MOCK.title,
        canonicalUrl: `http://localhost:4200/preprints/${PREPRINT_MOCK.providerId}/${PREPRINT_MOCK.id}`,
        doi: PREPRINT_MOCK.doi,
        license: PREPRINT_MOCK.embeddedLicense?.name,
        contributors: [{ fullName: 'John Doe', givenName: 'John Doe', familyName: 'John Doe' }],
      })
    );
  });

  it('buildFileMetaTagsData should prefer custom metadata values', () => {
    const fileMetadata: OsfFileCustomMetadata = {
      id: 'metadata-1',
      language: 'en',
      resourceTypeGeneral: 'Dataset',
      title: 'Custom file title',
      description: 'Custom file description',
    };

    const meta = service.buildFileMetaTagsData({
      file: buildFile(),
      fileMetadata,
      contributors: [MOCK_CONTRIBUTOR],
    });

    expect(meta).toEqual(
      expect.objectContaining({
        osfGuid: 'file-guid',
        title: 'Custom file title',
        description: 'Custom file description',
        type: 'Dataset',
        language: 'en',
        url: 'http://localhost:4200/file-guid',
        canonicalUrl: 'http://localhost:4200/project-1/files/file-guid',
      })
    );
  });

  it('buildFileMetaTagsData should fallback when custom metadata is null', () => {
    const file = buildFile({ target: null as unknown as FileDetailsModel['target'] });
    const meta = service.buildFileMetaTagsData({
      file,
      fileMetadata: null,
      contributors: [MOCK_CONTRIBUTOR],
    });

    expect(translateService.instant).toHaveBeenCalledWith('files.metaTagDescriptionPlaceholder');
    expect(meta).toEqual(
      expect.objectContaining({
        title: 'file-name.pdf',
        description: 'files.metaTagDescriptionPlaceholder',
        canonicalUrl: 'http://localhost:4200/file-guid',
      })
    );
  });
});
