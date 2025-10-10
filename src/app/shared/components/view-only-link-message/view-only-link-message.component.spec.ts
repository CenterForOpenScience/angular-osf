import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOnlyLinkMessageComponent } from './view-only-link-message.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ViewOnlyLinkMessageComponent', () => {
  let component: ViewOnlyLinkMessageComponent;
  let fixture: ComponentFixture<ViewOnlyLinkMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOnlyLinkMessageComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOnlyLinkMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleLeaveViewOnlyView', () => {
    let originalLocation: Location;
    let mockPushState: jest.SpyInstance;
    let mockReload: jest.SpyInstance;

    beforeEach(() => {
      originalLocation = window.location;

      delete (window as any).location;
      window.location = {
        ...originalLocation,
        href: 'https://example.com/project/abc123?view_only=test123&other=param',
        reload: jest.fn(),
      } as any;

      mockPushState = jest.spyOn(window.history, 'pushState').mockImplementation(() => {});
      mockReload = window.location.reload as jest.Mock;
    });

    afterEach(() => {
      window.location = originalLocation;
      mockPushState.mockRestore();
    });

    it('should remove view_only parameter from URL', () => {
      component.handleLeaveViewOnlyView();

      expect(mockPushState).toHaveBeenCalled();
      const [, , newUrl] = mockPushState.mock.calls[0];

      expect(newUrl).not.toContain('view_only');
      expect(newUrl).toContain('other=param');
    });

    it('should call window.history.pushState with correct parameters', () => {
      component.handleLeaveViewOnlyView();

      expect(mockPushState).toHaveBeenCalledWith(null, '', expect.any(String));
    });

    it('should call window.location.reload', () => {
      component.handleLeaveViewOnlyView();

      expect(mockReload).toHaveBeenCalled();
    });

    it('should handle URL without view_only parameter', () => {
      window.location = {
        ...originalLocation,
        href: 'https://example.com/project/abc123?other=param',
        reload: jest.fn(),
      } as any;

      mockReload = window.location.reload as jest.Mock;

      expect(() => component.handleLeaveViewOnlyView()).not.toThrow();
      expect(mockPushState).toHaveBeenCalled();
      expect(mockReload).toHaveBeenCalled();
    });

    it('should handle URL with only view_only parameter', () => {
      window.location = {
        ...originalLocation,
        href: 'https://example.com/project/abc123?view_only=test123',
        reload: jest.fn(),
      } as any;

      mockReload = window.location.reload as jest.Mock;

      component.handleLeaveViewOnlyView();

      expect(mockPushState).toHaveBeenCalled();
      const [, , newUrl] = mockPushState.mock.calls[0];

      expect(newUrl).not.toContain('view_only');
      expect(newUrl).not.toContain('?');
      expect(mockReload).toHaveBeenCalled();
    });

    it('should preserve other query parameters', () => {
      window.location = {
        ...originalLocation,
        href: 'https://example.com/project/abc123?view_only=test123&param1=value1&param2=value2',
        reload: jest.fn(),
      } as any;

      mockReload = window.location.reload as jest.Mock;

      component.handleLeaveViewOnlyView();

      const [, , newUrl] = mockPushState.mock.calls[0];

      expect(newUrl).toContain('param1=value1');
      expect(newUrl).toContain('param2=value2');
      expect(newUrl).not.toContain('view_only');
    });

    it('should handle URL without query parameters', () => {
      window.location = {
        ...originalLocation,
        href: 'https://example.com/project/abc123',
        reload: jest.fn(),
      } as any;

      mockReload = window.location.reload as jest.Mock;

      expect(() => component.handleLeaveViewOnlyView()).not.toThrow();
      expect(mockPushState).toHaveBeenCalled();
      expect(mockReload).toHaveBeenCalled();
    });
  });
});
