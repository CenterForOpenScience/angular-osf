import { MockComponent, MockProvider } from 'ng-mocks';

import { TieredMenu } from 'primeng/tieredmenu';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { FileMenuType } from '@osf/shared/enums/file-menu-type.enum';
import { MenuManagerService } from '@osf/shared/services/menu-manager.service';
import { FileMenuFlags } from '@shared/models/files/file-menu-action.model';

import { FileMenuComponent } from './file-menu.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileMenuComponent', () => {
  let component: FileMenuComponent;
  let fixture: ComponentFixture<FileMenuComponent>;
  let router: Router;
  let menuManager: MenuManagerService;
  let mockMenu: TieredMenu;

  beforeEach(async () => {
    mockMenu = {
      toggle: jest.fn(),
      hide: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [FileMenuComponent, OSFTestingModule, MockComponent(TieredMenu)],
      providers: [MockProvider(MenuManagerService)],
    }).compileComponents();

    fixture = TestBed.createComponent(FileMenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    menuManager = TestBed.inject(MenuManagerService);

    Object.defineProperty(component, 'menu', {
      value: () => mockMenu,
      writable: true,
      configurable: true,
    });
  });

  it('should have default values', () => {
    expect(component.isFolder()).toBe(false);
    expect(component.allowedActions()).toEqual({});
  });

  describe('menuItems computed - View Only Mode', () => {
    beforeEach(() => {
      jest.spyOn(router, 'url', 'get').mockReturnValue('/test?view_only=true');
      Object.defineProperty(window, 'location', {
        value: { search: '?view_only=true' },
        writable: true,
      });
    });

    it('should filter menu items for files in view-only mode', () => {
      const allowedActions: FileMenuFlags = {
        [FileMenuType.Download]: true,
        [FileMenuType.Embed]: true,
        [FileMenuType.Share]: true,
        [FileMenuType.Copy]: true,
        [FileMenuType.Rename]: false,
        [FileMenuType.Move]: false,
        [FileMenuType.Delete]: false,
      };

      fixture.componentRef.setInput('isFolder', false);
      fixture.componentRef.setInput('allowedActions', allowedActions);
      fixture.detectChanges();

      const menuItems = component.menuItems();
      const menuItemIds = menuItems.map((item) => item.id);

      expect(menuItemIds).toContain(FileMenuType.Download);
      expect(menuItemIds).toContain(FileMenuType.Embed);
      expect(menuItemIds).toContain(FileMenuType.Share);
      expect(menuItemIds).toContain(FileMenuType.Copy);
      expect(menuItemIds).not.toContain(FileMenuType.Rename);
      expect(menuItemIds).not.toContain(FileMenuType.Move);
      expect(menuItemIds).not.toContain(FileMenuType.Delete);
    });

    it('should return empty array when no allowed actions in view-only mode', () => {
      const allowedActions: FileMenuFlags = {
        [FileMenuType.Download]: false,
        [FileMenuType.Embed]: false,
        [FileMenuType.Share]: false,
        [FileMenuType.Copy]: false,
        [FileMenuType.Rename]: false,
        [FileMenuType.Move]: false,
        [FileMenuType.Delete]: false,
      };

      fixture.componentRef.setInput('isFolder', false);
      fixture.componentRef.setInput('allowedActions', allowedActions);
      fixture.detectChanges();

      expect(component.menuItems()).toEqual([]);
    });
  });

  describe('menuItems computed - Normal Mode', () => {
    beforeEach(() => {
      jest.spyOn(router, 'url', 'get').mockReturnValue('/test');
      Object.defineProperty(window, 'location', {
        value: { search: '' },
        writable: true,
      });
    });

    it('should filter menu items for files in normal mode', () => {
      const allowedActions: FileMenuFlags = {
        [FileMenuType.Download]: true,
        [FileMenuType.Embed]: true,
        [FileMenuType.Share]: true,
        [FileMenuType.Copy]: true,
        [FileMenuType.Rename]: true,
        [FileMenuType.Move]: true,
        [FileMenuType.Delete]: true,
      };

      fixture.componentRef.setInput('isFolder', false);
      fixture.componentRef.setInput('allowedActions', allowedActions);
      fixture.detectChanges();

      const menuItems = component.menuItems();
      const menuItemIds = menuItems.map((item) => item.id);

      expect(menuItemIds).toContain(FileMenuType.Download);
      expect(menuItemIds).toContain(FileMenuType.Embed);
      expect(menuItemIds).toContain(FileMenuType.Share);
      expect(menuItemIds).toContain(FileMenuType.Copy);
      expect(menuItemIds).toContain(FileMenuType.Rename);
      expect(menuItemIds).toContain(FileMenuType.Move);
      expect(menuItemIds).toContain(FileMenuType.Delete);
    });

    it('should filter menu items for folders in normal mode, excluding Share and Embed', () => {
      const allowedActions: FileMenuFlags = {
        [FileMenuType.Download]: true,
        [FileMenuType.Embed]: true,
        [FileMenuType.Share]: true,
        [FileMenuType.Copy]: true,
        [FileMenuType.Rename]: true,
        [FileMenuType.Move]: true,
        [FileMenuType.Delete]: true,
      };

      fixture.componentRef.setInput('isFolder', true);
      fixture.componentRef.setInput('allowedActions', allowedActions);
      fixture.detectChanges();

      const menuItems = component.menuItems();
      const menuItemIds = menuItems.map((item) => item.id);

      expect(menuItemIds).toContain(FileMenuType.Download);
      expect(menuItemIds).toContain(FileMenuType.Copy);
      expect(menuItemIds).toContain(FileMenuType.Rename);
      expect(menuItemIds).toContain(FileMenuType.Move);
      expect(menuItemIds).toContain(FileMenuType.Delete);
      expect(menuItemIds).not.toContain(FileMenuType.Embed);
      expect(menuItemIds).not.toContain(FileMenuType.Share);
    });

    it('should return empty array when no allowed actions in normal mode', () => {
      const allowedActions: FileMenuFlags = {
        [FileMenuType.Download]: false,
        [FileMenuType.Embed]: false,
        [FileMenuType.Share]: false,
        [FileMenuType.Copy]: false,
        [FileMenuType.Rename]: false,
        [FileMenuType.Move]: false,
        [FileMenuType.Delete]: false,
      };

      fixture.componentRef.setInput('isFolder', false);
      fixture.componentRef.setInput('allowedActions', allowedActions);
      fixture.detectChanges();

      expect(component.menuItems()).toEqual([]);
    });
  });

  it('should update isFolder input', () => {
    fixture.componentRef.setInput('isFolder', true);
    fixture.detectChanges();
    expect(component.isFolder()).toBe(true);
  });

  it('should update allowedActions input', () => {
    const allowedActions: FileMenuFlags = {
      [FileMenuType.Download]: true,
      [FileMenuType.Embed]: false,
      [FileMenuType.Share]: false,
      [FileMenuType.Copy]: false,
      [FileMenuType.Rename]: false,
      [FileMenuType.Move]: false,
      [FileMenuType.Delete]: false,
    };

    fixture.componentRef.setInput('allowedActions', allowedActions);
    fixture.detectChanges();
    expect(component.allowedActions()).toEqual(allowedActions);
  });

  it('should call menuManager.openMenu when onMenuToggle is called', () => {
    const openMenuSpy = jest.spyOn(menuManager, 'openMenu');
    const mockEvent = new Event('click');

    component.onMenuToggle(mockEvent);

    expect(openMenuSpy).toHaveBeenCalledWith(mockMenu, mockEvent);
  });

  it('should call menuManager.onMenuHide when onMenuHide is called', () => {
    const onMenuHideSpy = jest.spyOn(menuManager, 'onMenuHide');

    component.onMenuHide();

    expect(onMenuHideSpy).toHaveBeenCalled();
  });
});
