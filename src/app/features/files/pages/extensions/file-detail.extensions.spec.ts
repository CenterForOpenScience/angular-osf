import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ChangeDetectorRef, DestroyRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ExtensionRegistry } from '@core/services/extension-registry.service';
import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { FileActionExtension } from '@osf/shared/tokens/file-action-extensions.token';
import { FileModel } from '@shared/models/files/file.model';
import { CustomConfirmationService } from '@shared/services/custom-confirmation.service';
import { DataciteService } from '@shared/services/datacite/datacite.service';
import { ToastService } from '@shared/services/toast.service';

import { FilesSelectors } from '../../store';
import { FileDetailComponent } from '../file-detail/file-detail.component';

import { MOCK_STORE } from '@testing/mocks/mock-store.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileDetailComponent (extensions)', () => {
  let fixture: ComponentFixture<FileDetailComponent>;
  let component: FileDetailComponent;
  let registry: ExtensionRegistry | null;

  beforeEach(async () => {
    window.open = jest.fn();
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case FilesSelectors.getOpenedFile:
          return () => mockFile();
        case FilesSelectors.hasWriteAccess:
          return () => true;
        case FilesSelectors.isOpenedFileLoading:
          return () => false;
        default:
          return () => undefined;
      }
    });

    registry = null;
    await TestBed.configureTestingModule({
      imports: [FileDetailComponent, OSFTestingModule],
      providers: [
        TranslatePipe,
        TranslateService,
        { provide: ActivatedRoute, useValue: { params: of({ fileGuid: 'f1' }), snapshot: { params: {} } } },
        { provide: Router, useValue: { navigate: jest.fn(), url: '/' } },
        { provide: Store, useValue: MOCK_STORE },
        MockProvider(DataciteService, {
          logIdentifiableView: jest.fn().mockReturnValue(of(void 0)),
          logIdentifiableDownload: jest.fn().mockReturnValue(of(void 0)),
        }),
        MockProvider(CustomConfirmationService),
        MockProvider(ToastService),
        DestroyRef,
        ChangeDetectorRef,
      ],
    })
      .overrideComponent(FileDetailComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FileDetailComponent);
    component = fixture.componentInstance;
    registry = TestBed.inject(ExtensionRegistry);
    fixture.detectChanges();
  });

  afterEach(() => {
    (MOCK_STORE.selectSignal as jest.Mock).mockReset();
    if (registry) {
      (registry as unknown as { _extensions: { set: (val: FileActionExtension[]) => void } })._extensions.set([]);
    }
  });

  it('orders share menu extensions before built-in entries', () => {
    registerExtensions([
      {
        id: 'copy-link',
        label: 'Copy Link',
        icon: 'fas fa-link',
        parentId: 'share',
        position: 'start',
        command: jest.fn(),
      },
    ]);

    const shareItems = component.shareItems();
    expect(shareItems[0]?.id).toBe('copy-link');
    const labels = shareItems.slice(1).map((item) => item.label);
    expect(labels).toContain('files.detail.actions.share.email');
  });

  it('orders toolbar extensions based on position', () => {
    registerExtensions([
      {
        id: 'first',
        label: 'First',
        icon: 'fas fa-star',
        position: 'start',
        command: jest.fn(),
      },
      {
        id: 'middle',
        label: 'Middle',
        icon: 'fas fa-bolt',
        position: 1,
        command: jest.fn(),
      },
    ]);

    const toolbarExt = component.fileDetailExtensions();
    expect(toolbarExt.map((ext) => ext.id)).toEqual(['first', 'middle']);
  });

  function registerExtensions(extensions: FileActionExtension[]): void {
    (registry as unknown as { _extensions: { set: (val: FileActionExtension[]) => void } })._extensions.set([]);
    registry.register(extensions);
    fixture.detectChanges();
  }
});

function mockFile(): FileModel {
  return {
    id: 'f1',
    guid: 'f1',
    name: 'data.csv',
    kind: FileKind.File,
    path: '/data.csv',
    size: 1,
    materializedPath: '/data.csv',
    dateModified: new Date().toISOString(),
    extra: {
      hashes: { md5: '', sha256: '' },
      downloads: 0,
    },
    links: {
      info: '',
      move: '',
      upload: '',
      delete: '',
      download: '',
      render: '',
      html: '',
      self: '',
    },
    filesLink: null,
    previousFolder: false,
    provider: 'osfstorage',
    target: { id: 'n1', type: 'nodes' } as any,
  } as FileModel;
}
