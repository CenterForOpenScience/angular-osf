import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

import { ComponentCardComponent } from '../component-card/component-card.component';

import { OverviewParentProjectComponent } from './overview-parent-project.component';

describe('OverviewParentProjectComponent', () => {
  let component: OverviewParentProjectComponent;
  let fixture: ComponentFixture<OverviewParentProjectComponent>;
  let createUrlTreeSpy: Mock;
  let serializeUrlSpy: Mock;
  let navigateSpy: Mock;

  beforeEach(() => {
    const mockUrlTree = {} as any;
    createUrlTreeSpy = vi.fn().mockReturnValue(mockUrlTree);
    serializeUrlSpy = vi.fn().mockReturnValue('/test-id');
    navigateSpy = vi.fn().mockResolvedValue(true);

    const routerMock = RouterMockBuilder.create().withCreateUrlTree(createUrlTreeSpy).build();

    routerMock.serializeUrl = serializeUrlSpy;
    routerMock.navigate = navigateSpy;

    TestBed.configureTestingModule({
      imports: [OverviewParentProjectComponent, ...MockComponents(ComponentCardComponent)],
      providers: [provideOSFCore(), MockProvider(Router, routerMock)],
    });

    fixture = TestBed.createComponent(OverviewParentProjectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', MOCK_NODE_WITH_ADMIN);
    fixture.detectChanges();
  });

  it('should create URL tree with correct path and queryParamsHandling', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.navigateToParent();

    expect(createUrlTreeSpy).toHaveBeenCalledWith(['/', MOCK_NODE_WITH_ADMIN.id], {
      queryParamsHandling: 'preserve',
    });

    windowOpenSpy.mockRestore();
  });

  it('should serialize URL tree and open in same window', () => {
    const mockUrlTree = {} as any;
    createUrlTreeSpy.mockReturnValue(mockUrlTree);
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.navigateToParent();

    expect(serializeUrlSpy).toHaveBeenCalledWith(mockUrlTree);
    expect(windowOpenSpy).toHaveBeenCalledWith('/test-id', '_self');

    windowOpenSpy.mockRestore();
  });

  it('should navigate to contributors route when action is manageContributors', () => {
    component.handleMenuAction('manageContributors');

    expect(navigateSpy).toHaveBeenCalledWith([MOCK_NODE_WITH_ADMIN.id, 'contributors']);
  });

  it('should navigate to settings route when action is settings', () => {
    component.handleMenuAction('settings');

    expect(navigateSpy).toHaveBeenCalledWith([MOCK_NODE_WITH_ADMIN.id, 'settings']);
  });

  it('should return early if projectId is undefined', () => {
    fixture.componentRef.setInput('project', { ...MOCK_NODE_WITH_ADMIN, id: undefined } as any);
    fixture.detectChanges();

    component.handleMenuAction('manageContributors');

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should not navigate for unknown actions', () => {
    navigateSpy.mockClear();

    component.handleMenuAction('unknownAction');

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
