import { provideStore } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ConfirmationService } from 'primeng/api';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { DeveloperAppsState } from '../../store';

import { DeveloperAppDetailsComponent } from './developer-app-details.component';

describe('DeveloperAppDetailsComponent', () => {
  let component: DeveloperAppDetailsComponent;
  let fixture: ComponentFixture<DeveloperAppDetailsComponent>;
  let router: Router;
  let customConfirmationService: CustomConfirmationService;

  const mockRouter = {
    url: '/test/path',
    events: of(new NavigationEnd(1, '/test/path', '/test/path')),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperAppDetailsComponent, MockPipe(TranslatePipe)],
      providers: [
        ConfirmationService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([DeveloperAppsState]),
        MockProvider(TranslateService),
        MockProvider(ActivatedRoute, { params: of({ id: 'test-client-id' }) }),
        MockProvider(Router, mockRouter),
        MockProvider(CustomConfirmationService),
        MockProvider(ToastService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperAppDetailsComponent);
    component = fixture.componentInstance;

    customConfirmationService = TestBed.inject(CustomConfirmationService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not dispatch delete when user cancels confirmation', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    jest.spyOn(customConfirmationService, 'confirmDelete').mockImplementation(() => {
      // Simulate cancelling the confirmation
    });

    component.deleteApp();

    expect(customConfirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'settings.developerApps.confirmation.delete.title',
      headerParams: { name: undefined },
      messageKey: 'settings.developerApps.confirmation.delete.message',
      onConfirm: expect.any(Function),
    });
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should not dispatch resetClientSecret when user cancels confirmation', () => {
    jest.spyOn(customConfirmationService, 'confirmDelete').mockImplementation(() => {
      // Simulate cancelling the confirmation
    });

    component.resetClientSecret();

    expect(customConfirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'settings.developerApps.confirmation.resetSecret.title',
      headerParams: { name: undefined },
      messageKey: 'settings.developerApps.confirmation.resetSecret.message',
      acceptLabelKey: 'settings.developerApps.details.clientSecret.reset',
      onConfirm: expect.any(Function),
    });
  });
});
