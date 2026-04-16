import { MockProvider } from 'ng-mocks';

import { MenuItem } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { FileMenuType } from '@osf/shared/enums/file-menu-type.enum';
import { MenuManagerService } from '@osf/shared/services/menu-manager.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';
import { FileMenuComponent } from '@shared/components/file-menu/file-menu.component';
import { FileMenuAction, FileMenuFlags } from '@shared/models/files/file-menu-action.model';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

describe('FileMenuComponent', () => {
  let component: FileMenuComponent;
  let fixture: ComponentFixture<FileMenuComponent>;
  let menuManager: Pick<MenuManagerService, 'openMenu' | 'onMenuHide'>;
  let viewOnlyService: ViewOnlyLinkHelperMockType;

  interface SetupOverrides {
    isFolder?: boolean;
    hasViewOnly?: boolean;
    allowedActions?: Partial<FileMenuFlags>;
  }

  const ALL_ACTIONS: FileMenuFlags = {
    [FileMenuType.Download]: true,
    [FileMenuType.Copy]: true,
    [FileMenuType.Move]: true,
    [FileMenuType.Delete]: true,
    [FileMenuType.Rename]: true,
    [FileMenuType.Share]: true,
    [FileMenuType.Embed]: true,
  };

  function toFlags(overrides: Partial<FileMenuFlags> = {}): FileMenuFlags {
    return { ...ALL_ACTIONS, ...overrides };
  }

  function getMenuIds(items: MenuItem[]): string[] {
    return items.map((item) => item.id as string);
  }

  function setup(overrides: SetupOverrides = {}) {
    const routerMock: RouterMockType = RouterMockBuilder.create().build();
    viewOnlyService = ViewOnlyLinkHelperMock.simple(overrides.hasViewOnly ?? false);
    menuManager = {
      openMenu: vi.fn(),
      onMenuHide: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [FileMenuComponent],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyService),
        MockProvider(MenuManagerService, menuManager),
      ],
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    fixture = TestBed.createComponent(FileMenuComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isFolder', overrides.isFolder ?? false);
    fixture.componentRef.setInput('allowedActions', toFlags(overrides.allowedActions));
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should include all allowed actions for files without view-only', () => {
    setup({ isFolder: false, hasViewOnly: false });
    expect(getMenuIds(component.menuItems())).toEqual([
      FileMenuType.Download,
      FileMenuType.Share,
      FileMenuType.Embed,
      FileMenuType.Rename,
      FileMenuType.Move,
      FileMenuType.Copy,
      FileMenuType.Delete,
    ]);
  });

  it('should exclude share and embed for folders without view-only', () => {
    setup({ isFolder: true, hasViewOnly: false });
    expect(getMenuIds(component.menuItems())).toEqual([
      FileMenuType.Download,
      FileMenuType.Rename,
      FileMenuType.Move,
      FileMenuType.Copy,
      FileMenuType.Delete,
    ]);
  });

  it('should allow only download, embed, share and copy for files in view-only', () => {
    setup({ isFolder: false, hasViewOnly: true });
    expect(getMenuIds(component.menuItems())).toEqual([
      FileMenuType.Download,
      FileMenuType.Share,
      FileMenuType.Embed,
      FileMenuType.Copy,
    ]);
  });

  it('should allow only download and copy for folders in view-only', () => {
    setup({ isFolder: true, hasViewOnly: true });
    expect(getMenuIds(component.menuItems())).toEqual([FileMenuType.Download, FileMenuType.Copy]);
  });

  it('should filter out disabled actions', () => {
    setup({
      isFolder: false,
      hasViewOnly: false,
      allowedActions: {
        [FileMenuType.Download]: false,
        [FileMenuType.Move]: false,
        [FileMenuType.Share]: false,
      },
    });
    expect(getMenuIds(component.menuItems())).toEqual([
      FileMenuType.Embed,
      FileMenuType.Rename,
      FileMenuType.Copy,
      FileMenuType.Delete,
    ]);
  });

  it('should emit download action from menu command', () => {
    setup();
    const emitSpy = vi.spyOn(component.action, 'emit');
    const item = component.menuItems().find((menuItem) => menuItem.id === FileMenuType.Download);
    item?.command?.({} as never);
    expect(emitSpy).toHaveBeenCalledWith({ value: FileMenuType.Download, data: undefined } as FileMenuAction);
  });

  it('should emit share twitter action with data from menu command', () => {
    setup();
    const emitSpy = vi.spyOn(component.action, 'emit');
    const shareItem = component.menuItems().find((menuItem) => menuItem.id === FileMenuType.Share);
    const twitterItem = shareItem?.items?.find((menuItem) => menuItem.id === `${FileMenuType.Share}-twitter`);
    twitterItem?.command?.({} as never);
    expect(emitSpy).toHaveBeenCalledWith({
      value: FileMenuType.Share,
      data: { type: 'twitter' },
    } as FileMenuAction);
  });

  it('should delegate menu toggle to menu manager', () => {
    setup();
    const menuMock = {} as TieredMenu;
    const event = new Event('click');
    vi.spyOn(component, 'menu').mockReturnValue(menuMock);
    component.onMenuToggle(event);
    expect(menuManager.openMenu).toHaveBeenCalledWith(menuMock, event);
  });

  it('should notify menu manager on hide', () => {
    setup();
    component.onMenuHide();
    expect(menuManager.onMenuHide).toHaveBeenCalled();
  });
});
