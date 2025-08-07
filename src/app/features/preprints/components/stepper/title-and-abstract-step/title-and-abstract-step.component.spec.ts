import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider, MockProviders } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TitleAndAbstractStepComponent } from '@osf/features/preprints/components';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';

describe('TitleAndAbstractStepComponent', () => {
  let component: TitleAndAbstractStepComponent;
  let fixture: ComponentFixture<TitleAndAbstractStepComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintStepperSelectors.getPreprint:
          return () => null;
        case PreprintStepperSelectors.getSelectedProviderId:
          return () => '1';
        case PreprintStepperSelectors.isPreprintSubmitting:
          return () => false;
        default:
          return () => null;
      }
    });

    await TestBed.configureTestingModule({
      imports: [TitleAndAbstractStepComponent, MockPipe(TranslatePipe)],
      providers: [MockProviders(ActivatedRoute, ToastService), MockProvider(Store, MOCK_STORE), TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleAndAbstractStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
