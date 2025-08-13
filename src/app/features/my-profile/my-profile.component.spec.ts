import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { BehaviorSubject, of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { EducationHistoryComponent, EmploymentHistoryComponent } from '@osf/shared/components';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { MOCK_USER } from '@osf/shared/mocks';

import { MyProfileSearchComponent } from './components';
import { MyProfileComponent } from './my-profile.component';

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;
  let store: Partial<Store>;
  let router: Partial<Router>;
  let isMediumSubject: BehaviorSubject<boolean>;

  const mockUser = MOCK_USER;

  beforeEach(async () => {
    store = {
      dispatch: jest.fn().mockReturnValue(of(undefined)),
      selectSignal: jest.fn().mockReturnValue(signal(() => mockUser)),
    };

    router = {
      navigate: jest.fn(),
    };

    isMediumSubject = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [
        MyProfileComponent,
        MockPipe(TranslatePipe),
        ...MockComponents(MyProfileSearchComponent, EducationHistoryComponent, EmploymentHistoryComponent),
      ],
      providers: [
        MockProvider(Store, store),
        MockProvider(Router, router),
        MockProvider(TranslateService),
        MockProvider(IS_MEDIUM, isMediumSubject),
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

  it('should render search component', () => {
    const searchComponent = fixture.debugElement.query(By.directive(MyProfileSearchComponent));
    expect(searchComponent).toBeTruthy();
  });
});
