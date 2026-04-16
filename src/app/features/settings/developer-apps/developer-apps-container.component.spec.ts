import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomDialogServiceMockBuilder,
  CustomDialogServiceMockType,
} from '@testing/providers/custom-dialog-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';

import { DeveloperAppAddEditFormComponent } from './components';
import { DeveloperAppsContainerComponent } from './developer-apps-container.component';

describe('DeveloperAppsContainerComponent', () => {
  let component: DeveloperAppsContainerComponent;
  let fixture: ComponentFixture<DeveloperAppsContainerComponent>;
  let routerMock: RouterMockType;
  let customDialogServiceMock: CustomDialogServiceMockType;

  function setup(url = '/settings/developer-apps') {
    routerMock = RouterMockBuilder.create().withUrl(url).build();
    customDialogServiceMock = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();

    TestBed.configureTestingModule({
      imports: [DeveloperAppsContainerComponent, MockComponent(SubHeaderComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogServiceMock),
      ],
    });

    fixture = TestBed.createComponent(DeveloperAppsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should set isBaseRoute to true when current url is base route', () => {
    setup('/settings/developer-apps');

    expect(component.isBaseRoute()).toBe(true);
  });

  it('should set isBaseRoute to false when current url is not base route', () => {
    setup('/settings/developer-apps/create');

    expect(component.isBaseRoute()).toBe(false);
  });

  it('should open create developer app dialog with expected config', () => {
    setup();

    component.createDeveloperApp();

    expect(customDialogServiceMock.open).toHaveBeenCalledWith(DeveloperAppAddEditFormComponent, {
      header: 'settings.developerApps.form.createTitle',
      width: '500px',
    });
  });
});
