import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { LoaderService } from '@osf/shared/services/loader.service';

import { RegistrationLinksCardComponent } from '../../components';
import { RegistryLinksSelectors } from '../../store/registry-links';

import { RegistryLinksComponent } from './registry-links.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryLinksComponent', () => {
  let component: RegistryLinksComponent;
  let fixture: ComponentFixture<RegistryLinksComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockLoaderService: jest.Mocked<LoaderService>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().build();
    mockRouter = RouterMockBuilder.create().withUrl('/test-url').build();
    mockLoaderService = {
      show: jest.fn(),
      hide: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        RegistryLinksComponent,
        OSFTestingModule,
        ...MockComponents(SubHeaderComponent, LoadingSpinnerComponent, RegistrationLinksCardComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(LoaderService, mockLoaderService),
        provideMockStore({
          signals: [
            { selector: RegistryLinksSelectors.getLinkedNodes, value: [] },
            { selector: RegistryLinksSelectors.getLinkedNodesLoading, value: false },
            { selector: RegistryLinksSelectors.getLinkedRegistrations, value: [] },
            { selector: RegistryLinksSelectors.getLinkedRegistrationsLoading, value: false },
            { selector: RegistriesSelectors.getSchemaResponse, value: null },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryLinksComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize actions', () => {
    expect(component.actions).toBeDefined();
  });

  it('should navigate to registrations', () => {
    const registrationId = 'test-registration-id';
    component.navigateToRegistrations(registrationId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([registrationId, 'overview']);
  });

  it('should navigate to nodes', () => {
    const nodeId = 'test-node-id';
    component.navigateToNodes(nodeId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([nodeId, 'overview']);
  });

  it('should update registration with loader', () => {
    const registrationId = 'test-registration-id';

    expect(() => component.updateRegistration(registrationId)).not.toThrow();

    expect(mockLoaderService.show).toHaveBeenCalled();
  });
});
