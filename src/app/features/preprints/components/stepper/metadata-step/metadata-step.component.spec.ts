import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { CustomConfirmationService, ToastService } from '@shared/services';

import { MetadataStepComponent } from './metadata-step.component';

describe('MetadataStepComponent', () => {
  let component: MetadataStepComponent;
  let fixture: ComponentFixture<MetadataStepComponent>;

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
      imports: [MetadataStepComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProvider(ToastService),
        MockProvider(CustomConfirmationService),
        TranslateServiceMock,
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
