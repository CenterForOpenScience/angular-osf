import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ComponentCardComponent } from '../component-card/component-card.component';

import { OverviewParentProjectComponent } from './overview-parent-project.component';

import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

describe('OverviewParentProjectComponent', () => {
  let component: OverviewParentProjectComponent;
  let fixture: ComponentFixture<OverviewParentProjectComponent>;
  let createUrlTreeSpy: jest.Mock;
  let serializeUrlSpy: jest.Mock;
  let navigateSpy: jest.Mock;

  beforeEach(async () => {
    const mockUrlTree = {} as any;
    createUrlTreeSpy = jest.fn().mockReturnValue(mockUrlTree);
    serializeUrlSpy = jest.fn().mockReturnValue('/test-id');
    navigateSpy = jest.fn().mockResolvedValue(true);

    const routerMock = RouterMockBuilder.create().withCreateUrlTree(createUrlTreeSpy).build();

    routerMock.serializeUrl = serializeUrlSpy;
    routerMock.navigate = navigateSpy;

    await TestBed.configureTestingModule({
      imports: [OverviewParentProjectComponent, ...MockComponents(ComponentCardComponent)],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewParentProjectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', MOCK_NODE_WITH_ADMIN);
    fixture.detectChanges();
  });

  it('should create URL tree with correct path and queryParamsHandling', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    component.navigateToParent();

    expect(createUrlTreeSpy).toHaveBeenCalledWith(['/', MOCK_NODE_WITH_ADMIN.id], {
      queryParamsHandling: 'preserve',
    });

    windowOpenSpy.mockRestore();
  });

  it('should serialize URL tree and open in same window', () => {
    const mockUrlTree = {} as any;
    createUrlTreeSpy.mockReturnValue(mockUrlTree);
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

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
