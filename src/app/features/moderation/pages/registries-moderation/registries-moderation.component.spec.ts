import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { RegistryModerationTab } from '../../enums';

import { RegistriesModerationComponent } from './registries-moderation.component';

describe('RegistriesModerationComponent', () => {
  let component: RegistriesModerationComponent;
  let fixture: ComponentFixture<RegistriesModerationComponent>;
  let mockRouter: RouterMockType;

  interface SetupOptions {
    providerId?: string;
    tab?: RegistryModerationTab;
  }

  function setup(options: SetupOptions = {}) {
    const { providerId = 'provider-1', tab = RegistryModerationTab.Pending } = options;
    const routeBuilder = ActivatedRouteMockBuilder.create().withFirstChild((child) => child.withData({ tab }));
    if (providerId) {
      routeBuilder.withParams({ providerId });
    }
    const route = routeBuilder.build() as Partial<ActivatedRoute>;

    mockRouter = RouterMockBuilder.create().withUrl('/registries/moderation/pending').build();
    TestBed.configureTestingModule({
      imports: [RegistriesModerationComponent, ...MockComponents(SubHeaderComponent, SelectComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore(),
        MockProvider(ActivatedRoute, route),
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, of(true)),
      ],
    });

    fixture = TestBed.createComponent(RegistriesModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should initialize selectedTab from first child route data', () => {
    setup({ tab: RegistryModerationTab.Submitted });

    expect(component.selectedTab).toBe(RegistryModerationTab.Submitted);
  });

  it('should navigate to not-found when providerId is missing', () => {
    setup({ providerId: '' });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/not-found']);
  });

  it('should call getProvider action when providerId exists', () => {
    setup({ providerId: 'provider-1' });
    const getProviderSpy = vi.fn();
    component.actions = { ...component.actions, getProvider: getProviderSpy };

    component.ngOnInit();

    expect(getProviderSpy).toHaveBeenCalledWith('provider-1');
  });

  it('should call clearCurrentProvider on destroy', () => {
    setup();
    const clearCurrentProviderSpy = vi.fn();
    component.actions = { ...component.actions, clearCurrentProvider: clearCurrentProviderSpy };

    component.ngOnDestroy();

    expect(clearCurrentProviderSpy).toHaveBeenCalled();
  });

  it('should handle tab change and navigate relative to current route', () => {
    setup();

    component.onTabChange(RegistryModerationTab.Moderators);

    expect(component.selectedTab).toBe(RegistryModerationTab.Moderators);
    expect(mockRouter.navigate).toHaveBeenCalledWith([RegistryModerationTab.Moderators], {
      relativeTo: component.route,
    });
  });

  it('should expose static defaults', () => {
    setup();

    expect(component.resourceType).toBe(ResourceType.Registration);
    expect(component.tabOptions.length).toBeGreaterThan(0);
  });
});
