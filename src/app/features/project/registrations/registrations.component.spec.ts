import { MockComponents, MockProvider } from 'ng-mocks';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { RegistrationCardComponent } from '@osf/shared/components/registration-card/registration-card.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CurrentResourceSelectors } from '@shared/stores/current-resource';

import { RegistrationsComponent } from './registrations.component';
import { GetRegistrations, RegistrationsSelectors } from './store';

import { MOCK_REGISTRATION } from '@testing/mocks/registration.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistrationsComponent', () => {
  let component: RegistrationsComponent;
  let fixture: ComponentFixture<RegistrationsComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let storeDispatchSpy: jest.SpyInstance;

  const mockProjectId = 'project-123';
  const mockRegistrations = [MOCK_REGISTRATION];
  const mockEnvironment = {
    defaultProvider: 'test-provider',
  };

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create().withParams({ id: mockProjectId }).build();

    const mockStore = provideMockStore({
      signals: [
        { selector: CurrentResourceSelectors.hasAdminAccess, value: signal(true) },
        { selector: RegistrationsSelectors.getRegistrations, value: signal(mockRegistrations) },
        { selector: RegistrationsSelectors.getRegistrationsTotalCount, value: signal(10) },
        { selector: RegistrationsSelectors.isRegistrationsLoading, value: signal(false) },
      ],
    });

    storeDispatchSpy = jest.spyOn(mockStore.useValue, 'dispatch');

    await TestBed.configureTestingModule({
      imports: [
        RegistrationsComponent,
        OSFTestingModule,
        ...MockComponents(
          RegistrationCardComponent,
          SubHeaderComponent,
          LoadingSpinnerComponent,
          CustomPaginatorComponent
        ),
      ],
      providers: [
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(ENVIRONMENT, mockEnvironment),
        mockStore,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationsComponent);
    component = fixture.componentInstance;
  });

  it('should have default values', () => {
    expect(component.itemsPerPage).toBe(10);
    expect(component.first).toBe(0);
  });

  it('should initialize projectId from route params', () => {
    expect(component.projectId()).toBe(mockProjectId);
  });

  it('should dispatch getRegistrations action on ngOnInit', () => {
    component.ngOnInit();

    expect(storeDispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: mockProjectId,
        page: 1,
        pageSize: 10,
      })
    );
    expect(storeDispatchSpy).toHaveBeenCalledWith(expect.any(GetRegistrations));
  });

  it('should navigate to registries route when addRegistration is called', () => {
    const navigateSpy = jest.spyOn(routerMock, 'navigate');

    component.addRegistration();

    expect(navigateSpy).toHaveBeenCalledWith([`registries/${mockEnvironment.defaultProvider}/new`], {
      queryParams: { projectId: mockProjectId },
    });
  });

  it('should dispatch getRegistrations and update first on page change', () => {
    const mockPaginatorState = {
      page: 2,
      first: 20,
      rows: 10,
      pageCount: 5,
    } as any;

    component.onPageChange(mockPaginatorState);

    expect(storeDispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: mockProjectId,
        page: 3,
        pageSize: 10,
      })
    );
    expect(component.first).toBe(20);
  });

  it('should handle page change with page 0', () => {
    const mockPaginatorState = {
      page: 0,
      first: 0,
      rows: 10,
      pageCount: 5,
    } as any;

    component.onPageChange(mockPaginatorState);

    expect(storeDispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: mockProjectId,
        page: 1,
        pageSize: 10,
      })
    );
    expect(component.first).toBe(0);
  });
});
