import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider, MockProviders } from 'ng-mocks';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';

import { SupplementsStepComponent } from './supplements-step.component';

describe('SupplementsStepComponent', () => {
  let component: SupplementsStepComponent;
  let fixture: ComponentFixture<SupplementsStepComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintStepperSelectors.getPreprint:
          return () => ({});
        case PreprintStepperSelectors.isPreprintSubmitting:
          return () => false;
        case PreprintStepperSelectors.getAvailableProjects:
          return () => [];
        case PreprintStepperSelectors.areAvailableProjectsLoading:
          return () => false;
        case PreprintStepperSelectors.getPreprintProject:
          return () => null;
        case PreprintStepperSelectors.isPreprintProjectLoading:
          return () => false;
        default:
          return () => null;
      }
    });

    await TestBed.configureTestingModule({
      imports: [SupplementsStepComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(Store, MOCK_STORE),
        TranslateServiceMock,
        MockProviders(ConfirmationService, MessageService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplementsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
