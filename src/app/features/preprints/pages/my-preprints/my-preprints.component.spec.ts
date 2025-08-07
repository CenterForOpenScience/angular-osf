import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';

import { MyPreprintsComponent } from './my-preprints.component';

describe('MyPreprintsComponent', () => {
  let component: MyPreprintsComponent;
  let fixture: ComponentFixture<MyPreprintsComponent>;
  let queryParamsSubject: BehaviorSubject<Record<string, string>>;
  const mockRouter: Partial<Router> = {
    navigateByUrl: jest.fn(),
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<Record<string, string>>({});

    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === PreprintSelectors.getMyPreprints) return () => [];
      if (selector === PreprintSelectors.getMyPreprintsTotalCount) return () => 0;
      if (selector === PreprintSelectors.areMyPreprintsLoading) return () => false;
      return () => null;
    });

    const mockActivatedRoute = {
      queryParams: queryParamsSubject.asObservable(),
      snapshot: {
        queryParams: {},
      },
    } as Partial<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [MyPreprintsComponent, MockPipe(TranslatePipe)],
      providers: [
        provideRouter([]),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(Store, MOCK_STORE),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPreprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
