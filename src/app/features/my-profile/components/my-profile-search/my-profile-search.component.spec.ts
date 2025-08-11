import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IS_XSMALL } from '@osf/shared/utils';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';

import { MyProfileSearchComponent } from './my-profile-search.component';

describe.skip('MyProfileSearchComponent', () => {
  let component: MyProfileSearchComponent;
  let fixture: ComponentFixture<MyProfileSearchComponent>;
  let isMobileSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isMobileSubject = new BehaviorSubject<boolean>(false);

    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation(() => {
      return () => ({
        datesCreated: [],
        funders: [],
        subjects: [],
        licenses: [],
        resourceTypes: [],
        institutions: [],
        providers: [],
        partOfCollection: [],
      });
    });

    await TestBed.configureTestingModule({
      imports: [MyProfileSearchComponent],
      providers: [
        MockProvider(IS_XSMALL, isMobileSubject),
        TranslateServiceMock,
        MockProvider(Store, MOCK_STORE),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
