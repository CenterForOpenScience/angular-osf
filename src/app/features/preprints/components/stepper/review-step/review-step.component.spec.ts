import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipes, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { InterpolatePipe } from '@shared/pipes';
import { ToastService } from '@shared/services';

import { ReviewStepComponent } from './review-step.component';

import { MOCK_PROVIDER, MOCK_STORE, TranslateServiceMock } from '@testing/mocks';

describe('ReviewStepComponent', () => {
  let component: ReviewStepComponent;
  let fixture: ComponentFixture<ReviewStepComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintStepperSelectors.getPreprint:
          return () => ({ id: '1', licenseOptions: {} });
        case PreprintStepperSelectors.isPreprintSubmitting:
          return () => false;
        case PreprintStepperSelectors.getPreprintLicense:
          return () => ({});
        case PreprintStepperSelectors.getPreprintProject:
          return () => null;
        default:
          return () => [];
      }
    });

    await TestBed.configureTestingModule({
      imports: [ReviewStepComponent, MockPipes(TranslatePipe, InterpolatePipe)],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProvider(ToastService),
        MockProvider(Router),
        TranslateServiceMock,
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('provider', MOCK_PROVIDER);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
