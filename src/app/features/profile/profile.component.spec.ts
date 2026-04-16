import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { UserSelectors } from '@core/store/user';
import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { ProfileInformationComponent } from './components';
import { ProfileComponent } from './profile.component';
import { ProfileSelectors } from './store';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(() => {
    routerMock = RouterMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        ...MockComponents(ProfileInformationComponent, GlobalSearchComponent, LoadingSpinnerComponent),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(PrerenderReadyService),
        provideMockStore({
          signals: [
            { selector: UserSelectors.getCurrentUser, value: null },
            { selector: ProfileSelectors.getUserProfile, value: null },
            { selector: ProfileSelectors.isUserProfileLoading, value: false },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to settings/profile when called', () => {
    component.toProfileSettings();

    expect(routerMock.navigate).toHaveBeenCalledWith(['settings/profile']);
  });

  it('should return true when route has no id param', () => {
    activatedRouteMock.snapshot!.params = {};

    expect(component.isMyProfile()).toBe(true);
  });

  it('should return false when route has id param', () => {
    activatedRouteMock.snapshot!.params = { id: 'user456' };

    expect(component.isMyProfile()).toBe(false);
  });

  it('should filter out Agent resource type from search tab options', () => {
    expect(component.resourceTabOptions).toBeDefined();
    expect(component.resourceTabOptions.every((option) => option.value !== ResourceType.Agent)).toBe(true);
  });
});
