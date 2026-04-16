import { MockProvider } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';

import { ViewOnlyLinkMessageComponent } from './view-only-link-message.component';

describe('ViewOnlyLinkMessageComponent', () => {
  let fixture: ComponentFixture<ViewOnlyLinkMessageComponent>;
  let component: ViewOnlyLinkMessageComponent;
  let routerMock: RouterMockType;

  function setup(platformId: 'browser' | 'server' = 'browser') {
    routerMock = RouterMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [ViewOnlyLinkMessageComponent],
      providers: [provideOSFCore(), MockProvider(Router, routerMock), MockProvider(PLATFORM_ID, platformId)],
    });

    fixture = TestBed.createComponent(ViewOnlyLinkMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should navigate with merged query params in browser', () => {
    setup();

    component.handleLeaveViewOnlyView();

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      queryParams: { view_only: null },
      queryParamsHandling: 'merge',
    });
  });

  it('should not navigate on server platform', () => {
    setup('server');

    component.handleLeaveViewOnlyView();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
