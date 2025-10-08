import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ResourceType } from '@osf/shared/enums';

import { ProfileComponent } from './profile.component';
import { ProfileSelectors } from './store';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, OSFTestingModule],
      providers: [
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        provideMockStore({
          signals: [
            { selector: UserSelectors.getCurrentUser, value: null },
            { selector: ProfileSelectors.getUserProfile, value: null },
            { selector: ProfileSelectors.isUserProfileLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

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
