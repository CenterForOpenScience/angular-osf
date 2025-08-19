import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider, MockProviders } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';

import { CreateNewVersionComponent } from './create-new-version.component';

describe.skip('CreateNewVersionComponent', () => {
  let component: CreateNewVersionComponent;
  let fixture: ComponentFixture<CreateNewVersionComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintStepperSelectors.getPreprint:
          return () => ({});
        case PreprintStepperSelectors.isPreprintSubmitting:
          return () => false;
        default:
          return () => null;
      }
    });

    await TestBed.configureTestingModule({
      imports: [CreateNewVersionComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProviders(Router, ActivatedRoute, ToastService),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
