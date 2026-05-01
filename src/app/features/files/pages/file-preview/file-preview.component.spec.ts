import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { FileDetailsModel } from '@osf/shared/models/files/file.model';
import { BaseNodeModel } from '@osf/shared/models/nodes/base-node.model';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

import { FilesSelectors, GetFile } from '../../store';

import { FilePreviewComponent } from './file-preview.component';

interface SetupOverrides extends BaseSetupOverrides {
  hasViewOnlyParam?: boolean;
  viewOnlyParam?: string | null;
  renderLink?: string;
}

describe('FilePreviewComponent', () => {
  let component: FilePreviewComponent;
  let fixture: ComponentFixture<FilePreviewComponent>;
  let store: Store;
  let mockRouter: RouterMockType;
  let viewOnlyService: ViewOnlyLinkHelperMockType;

  const encodedDownloadUrl = 'https://files.osf.io/v1/resources/abc/providers/osfstorage/file.txt';
  const defaultRenderLink = `https://mfr.osf.io/render?url=${encodeURIComponent(encodedDownloadUrl)}`;

  function buildFileDetailsModel(renderLink: string): FileDetailsModel {
    return {
      id: 'file-1',
      guid: 'file-guid-1',
      name: 'file.txt',
      kind: FileKind.File,
      path: '/file.txt',
      size: 128,
      materializedPath: '/file.txt',
      dateModified: '2026-01-01T00:00:00.000Z',
      dateCreated: '2026-01-01T00:00:00.000Z',
      lastTouched: null,
      tags: [],
      currentVersion: 1,
      showAsUnviewed: false,
      extra: {
        hashes: {
          md5: 'md5',
          sha256: 'sha256',
        },
        downloads: 1,
      },
      links: {
        info: '',
        move: '',
        upload: '',
        delete: '',
        download: '',
        render: renderLink,
        html: '',
        self: '',
      },
      target: {} as unknown as BaseNodeModel,
    };
  }

  const defaultSignals: SignalOverride[] = [
    { selector: FilesSelectors.isOpenedFileLoading, value: false },
    { selector: FilesSelectors.getOpenedFile, value: buildFileDetailsModel(defaultRenderLink) },
  ];

  function setup(overrides: SetupOverrides = {}) {
    const route = ActivatedRouteMockBuilder.create()
      .withParams(overrides.routeParams ?? { fileGuid: 'file-1' })
      .build();
    mockRouter = RouterMockBuilder.create().withUrl('/files/file-1/preview').build();
    viewOnlyService = ViewOnlyLinkHelperMock.simple(overrides.hasViewOnlyParam ?? false);
    viewOnlyService.getViewOnlyParam = vi.fn().mockReturnValue(overrides.viewOnlyParam ?? null);

    const signals = mergeSignalOverrides(defaultSignals, [
      {
        selector: FilesSelectors.getOpenedFile,
        value: buildFileDetailsModel(overrides.renderLink ?? defaultRenderLink),
      },
      ...(overrides.selectorOverrides ?? []),
    ]);

    TestBed.configureTestingModule({
      imports: [FilePreviewComponent],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, route),
        MockProvider(Router, mockRouter),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyService),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(FilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch get file action with route file guid on init', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetFile('file-1'));
  });

  it('should keep mfr url unchanged when render link has no nested url param', () => {
    setup({ renderLink: 'https://mfr.osf.io/render' });
    (store.dispatch as Mock).mockClear();

    const result = component.getMfrUrlWithVersion('2');

    expect(result).toBe('https://mfr.osf.io/render');
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should append version param to nested download url', () => {
    setup();

    const result = component.getMfrUrlWithVersion('3');

    expect(result).toContain('https://mfr.osf.io/render?');
    expect(result).toContain(encodeURIComponent('version=3'));
  });

  it('should append view only param when present', () => {
    setup({ hasViewOnlyParam: true, viewOnlyParam: 'view-token-1' });

    const result = component.getMfrUrlWithVersion();

    expect(result).toContain(encodeURIComponent('view_only=view-token-1'));
  });

  it('should return null for empty render link', () => {
    setup({ renderLink: '' });

    const result = component.getMfrUrlWithVersion();

    expect(result).toBeNull();
  });
});
