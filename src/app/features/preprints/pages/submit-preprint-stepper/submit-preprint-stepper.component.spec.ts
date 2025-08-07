import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';

import { SubmitPreprintStepperComponent } from './submit-preprint-stepper.component';

describe.skip('SubmitPreprintStepperComponent', () => {
  let component: SubmitPreprintStepperComponent;
  let fixture: ComponentFixture<SubmitPreprintStepperComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintStepperSelectors.getSelectedProviderId:
          return () => 'id1';
        case PreprintStepperSelectors.isPreprintSubmitting:
          return () => false;
        default:
          return () => null;
      }
    });
    await TestBed.configureTestingModule({
      imports: [SubmitPreprintStepperComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(Store, MOCK_STORE), TranslateServiceMock, MockProvider(Router)],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitPreprintStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
