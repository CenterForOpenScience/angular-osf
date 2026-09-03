import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { UserSelectors } from '@core/store/user';
import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { InstitutionsSelectors } from '@shared/stores/institutions';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { MetaTagsServiceMockFactory } from '@testing/providers/meta-tags.service.mock';
import { PrerenderReadyServiceMockFactory } from '@testing/providers/prerender-ready.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { ProfileInformationComponent } from './components';
import { ProfileComponent } from './profile.component';
import { ProfileSelectors } from './store';

function setup(overrides: BaseSetupOverrides = {}) {
  const routerMock = RouterMockBuilder.create().build();
  const activatedRouteMock = ActivatedRouteMockBuilder.create()
    .withParams(overrides.routeParams ?? {})
    .build();
  const metaTagsService = MetaTagsServiceMockFactory();
  const prerenderReadyService = PrerenderReadyServiceMockFactory();

  const defaultSignals: SignalOverride[] = [
    { selector: UserSelectors.getCurrentUser, value: null },
    { selector: ProfileSelectors.getUserProfile, value: null },
    { selector: ProfileSelectors.isUserProfileLoading, value: false },
    { selector: InstitutionsSelectors.getUserInstitutions, value: [] },
  ];

  TestBed.configureTestingModule({
    imports: [
      ProfileComponent,
      ...MockComponents(ProfileInformationComponent, GlobalSearchComponent, LoadingSpinnerComponent),
    ],
    providers: [
      provideOSFCore(),
      MockProvider(Router, routerMock),
      MockProvider(ActivatedRoute, activatedRouteMock),
      MockProvider(MetaTagsService, metaTagsService),
      MockProvider(PrerenderReadyService, prerenderReadyService),
      provideMockStore({
        signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
      }),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(ProfileComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    component,
    fixture,
    store,
    routerMock,
    activatedRouteMock,
    metaTagsService,
    prerenderReadyService,
  };
}

describe('ProfileComponent', () => {
  it('should create', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
  });

  it('should navigate to settings/profile when called', () => {
    const { component, routerMock } = setup();

    component.toProfileSettings();

    expect(routerMock.navigate).toHaveBeenCalledWith(['settings/profile']);
  });

  it('should return true when route has no id param', () => {
    const { component } = setup();

    expect(component.isMyProfile()).toBe(true);
  });

  it('should return false when route has id param', () => {
    const { component } = setup({ routeParams: { id: 'user456' } });

    expect(component.isMyProfile()).toBe(false);
  });

  it('should filter out Agent resource type from search tab options', () => {
    const { component } = setup();

    expect(component.resourceTabOptions.every((option) => option.value !== ResourceType.Agent)).toBe(true);
  });

  it('should set prerender not ready on init', () => {
    const { prerenderReadyService } = setup();

    expect(prerenderReadyService.setNotReady).toHaveBeenCalled();
  });

  it('should update user osf type meta tag for my profile', () => {
    const { metaTagsService } = setup({
      selectorOverrides: [{ selector: UserSelectors.getCurrentUser, value: MOCK_USER }],
    });

    expect(metaTagsService.updateMetaTags).toHaveBeenCalledWith(
      { osfType: CurrentResourceType.Users },
      expect.anything(),
      { mergeDefaults: false }
    );
    expect(metaTagsService.updateMetaTags).toHaveBeenCalledTimes(1);
  });

  it('should update user osf type meta tag after fetching a public profile', () => {
    const { metaTagsService } = setup({
      routeParams: { id: MOCK_USER.id },
      selectorOverrides: [{ selector: ProfileSelectors.getUserProfile, value: MOCK_USER }],
    });

    expect(metaTagsService.updateMetaTags).toHaveBeenCalledWith(
      { osfType: CurrentResourceType.Users },
      expect.anything(),
      { mergeDefaults: false }
    );
    expect(metaTagsService.updateMetaTags).toHaveBeenCalledTimes(1);
  });

  it('should not update meta tags when my profile has no current user', () => {
    const { metaTagsService } = setup();

    expect(metaTagsService.updateMetaTags).not.toHaveBeenCalled();
  });
});
