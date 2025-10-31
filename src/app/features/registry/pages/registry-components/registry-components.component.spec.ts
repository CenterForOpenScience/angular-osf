import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';

import { RegistrationLinksCardComponent } from '../../components/registration-links-card/registration-links-card.component';
import { RegistryComponentsSelectors } from '../../store/registry-components';

import { RegistryComponentsComponent } from './registry-components.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryComponentsComponent', () => {
  let component: RegistryComponentsComponent;
  let fixture: ComponentFixture<RegistryComponentsComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().build();

    mockRouter = RouterMockBuilder.create().withUrl('/test-url').build();

    await TestBed.configureTestingModule({
      imports: [
        RegistryComponentsComponent,
        OSFTestingModule,
        ...MockComponents(
          SubHeaderComponent,
          LoadingSpinnerComponent,
          RegistrationLinksCardComponent,
          ViewOnlyLinkMessageComponent
        ),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: [
            { selector: RegistryComponentsSelectors.getRegistryComponents, value: [] },
            { selector: RegistryComponentsSelectors.getRegistryComponentsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryComponentsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize actions', () => {
    expect(component.actions).toBeDefined();
  });

  it('should navigate to component details', () => {
    const componentId = 'test-component-id';
    component.reviewComponentDetails(componentId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([componentId, 'overview']);
  });

  it('should compute hasViewOnly correctly', () => {
    expect(component.hasViewOnly()).toBe(false);
  });
});
