import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionRegistry } from '@core/services/extension-registry.service';
import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { FileMenuType } from '@osf/shared/enums/file-menu-type.enum';
import { FileActionExtension } from '@osf/shared/tokens/file-action-extensions.token';
import { FileModel } from '@shared/models/files/file.model';
import { FileMenuFlags } from '@shared/models/files/file-menu-action.model';

import { FileMenuComponent } from './file-menu/file-menu.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileMenuComponent (extensions)', () => {
  let component: FileMenuComponent;
  let fixture: ComponentFixture<FileMenuComponent>;
  let registry: ExtensionRegistry;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileMenuComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FileMenuComponent);
    component = fixture.componentInstance;
    registry = TestBed.inject(ExtensionRegistry);

    fixture.componentRef.setInput('file', mockFile());
    fixture.componentRef.setInput('allowedActions', allMenuFlags());
    fixture.componentRef.setInput('isFolder', false);
    fixture.componentRef.setInput('hasWriteAccess', true);
  });

  it('orders submenu and top-level extensions by position', () => {
    registerExtensions([
      {
        id: 'share-first',
        label: 'Share first',
        icon: 'fas fa-star',
        parentId: 'share',
        position: 'start',
        command: jest.fn(),
      },
      {
        id: 'toolbar-first',
        label: 'Edit external',
        icon: 'fas fa-edit',
        position: 'start',
        command: jest.fn(),
      },
      {
        id: 'toolbar-disabled',
        label: 'Disabled',
        icon: 'fas fa-ban',
        disabled: () => true,
        command: jest.fn(),
      },
    ]);

    const menuItems = component.menuItems();
    const shareMenu = menuItems.find((item) => item.id === FileMenuType.Share);
    expect(shareMenu?.items?.[0]?.id).toBe('share-first');

    expect(menuItems[0].id).toBe('toolbar-first');
    const disabled = menuItems.find((item) => item.id === 'toolbar-disabled');
    expect(disabled?.disabled).toBe(true);
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
    name: 'file.txt',
    kind: FileKind.File,
    path: '/file.txt',
    size: 1,
    materializedPath: '/file.txt',
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
  } as FileModel;
}

function allMenuFlags(): FileMenuFlags {
  return Object.values(FileMenuType).reduce(
    (acc, action) => ({
      ...acc,
      [action]: true,
    }),
    {} as FileMenuFlags
  );
}
