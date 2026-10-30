import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { NodeMenuAction } from '@osf/shared/enums/node-menu-action.enum';

import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';

import { ComponentCardComponent } from '../component-card/component-card.component';

import { OverviewParentProjectComponent } from './overview-parent-project.component';

describe('OverviewParentProjectComponent', () => {
  let component: OverviewParentProjectComponent;
  let fixture: ComponentFixture<OverviewParentProjectComponent>;
  let routerMock: RouterMockType;

  const mockUrlTree = {} as UrlTree;

  beforeEach(() => {
    routerMock = RouterMockBuilder.create()
      .withCreateUrlTree(vi.fn().mockReturnValue(mockUrlTree))
      .withSerializeUrl(vi.fn().mockReturnValue('/test-id-1'))
      .withNavigate(vi.fn().mockResolvedValue(true))
      .build();

    TestBed.configureTestingModule({
      imports: [OverviewParentProjectComponent, ...MockComponents(ComponentCardComponent)],
      providers: [provideOSFCore(), MockProvider(Router, routerMock)],
    });

    fixture = TestBed.createComponent(OverviewParentProjectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', MOCK_NODE_WITH_ADMIN);
    fixture.detectChanges();
  });

  it('should open the parent project in the same window', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.navigateToParent();

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/', MOCK_NODE_WITH_ADMIN.id], {
      queryParamsHandling: 'preserve',
    });
    expect(routerMock.serializeUrl).toHaveBeenCalledWith(mockUrlTree);
    expect(windowOpenSpy).toHaveBeenCalledWith('/test-id-1', '_self');

    windowOpenSpy.mockRestore();
  });

  it('should navigate to contributors route when action is manageContributors', () => {
    component.handleMenuAction(NodeMenuAction.ManageContributors);

    expect(routerMock.navigate).toHaveBeenCalledWith([MOCK_NODE_WITH_ADMIN.id, 'contributors']);
  });

  it('should navigate to settings route when action is settings', () => {
    component.handleMenuAction(NodeMenuAction.Settings);

    expect(routerMock.navigate).toHaveBeenCalledWith([MOCK_NODE_WITH_ADMIN.id, 'settings']);
  });

  it('should not navigate when the project id is empty', () => {
    fixture.componentRef.setInput('project', { ...MOCK_NODE_WITH_ADMIN, id: '' });
    fixture.detectChanges();

    component.handleMenuAction(NodeMenuAction.ManageContributors);

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should show a skeleton while the parent project is loading', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p-skeleton')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('osf-component-card')).toBeNull();
  });
});
