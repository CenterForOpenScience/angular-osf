import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { MOCK_STORE, TranslateServiceMock } from '@osf/shared/mocks';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';

import { PreprintsMetadataStepComponent } from './preprints-metadata-step.component';

describe('PreprintsMetadataStepComponent', () => {
  let component: PreprintsMetadataStepComponent;
  let fixture: ComponentFixture<PreprintsMetadataStepComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintStepperSelectors.getLicenses:
          return () => [];
        case PreprintStepperSelectors.getPreprint:
          return () => null;
        case PreprintStepperSelectors.isPreprintSubmitting:
          return () => false;
        default:
          return () => [];
      }
    });

    await TestBed.configureTestingModule({
      imports: [PreprintsMetadataStepComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProvider(ToastService),
        MockProvider(CustomConfirmationService),
        TranslateServiceMock,
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsMetadataStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
