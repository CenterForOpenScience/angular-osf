import { Store } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';

import { Button } from 'primeng/button';

import { BehaviorSubject, of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { IS_XSMALL } from '@osf/shared/utils';

import { ResetFiltersState } from '../search/components/resource-filters/store';
import { SearchComponent } from '../search/search.component';
import { ResetSearchState } from '../search/store';

import { MyProfileComponent } from './my-profile.component';
import { SetIsMyProfile } from './store';

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;
  let store: Partial<Store>;
  let router: Partial<Router>;
  let isXSmallSubject: BehaviorSubject<boolean>;

  const mockUser = {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    givenName: 'John',
    familyName: 'Doe',
    middleNames: '',
    suffix: '',
    dateRegistered: '2024-01-01',
    employment: [
      {
        title: 'Software Engineer',
        institution: 'Tech Corp',
        startDate: '2020-01-01',
        endDate: null,
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        institution: 'University of Technology',
        startDate: '2016-01-01',
        endDate: '2020-01-01',
        ongoing: false,
      },
    ],
    socials: {
      orcid: '0000-0000-0000-0000',
    },
    link: 'https://example.com/profile',
  };

  beforeEach(async () => {
    store = {
      dispatch: jest.fn().mockReturnValue(of(undefined)),
      selectSignal: jest.fn().mockReturnValue(signal(() => mockUser)),
    };

    router = {
      navigate: jest.fn(),
    };

    isXSmallSubject = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [MyProfileComponent, MockModule(TranslateModule), MockComponent(Button), MockComponent(SearchComponent)],
      providers: [
        MockProvider(Store, store),
        MockProvider(Router, router),
        { provide: IS_XSMALL, useValue: isXSmallSubject },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to profile settings when toProfileSettings is called', () => {
    component.toProfileSettings();
    expect(router.navigate).toHaveBeenCalledWith(['settings/profile-settings']);
  });

  it('should handle mobile view correctly', () => {
    isXSmallSubject.next(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const editButton = compiled.querySelector('.btn-full-width');
    expect(editButton).toBeTruthy();
  });

  it('should clean up store state on destroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(ResetFiltersState);
    expect(store.dispatch).toHaveBeenCalledWith(ResetSearchState);
    expect(store.dispatch).toHaveBeenCalledWith(new SetIsMyProfile(false));
  });

  it('should render search component', () => {
    const searchComponent = fixture.debugElement.query(By.directive(SearchComponent));
    expect(searchComponent).toBeTruthy();
  });
});
