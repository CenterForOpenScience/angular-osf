import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider, MockProviders } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicabilityStatus } from '@osf/features/preprints/enums';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { MOCK_STORE } from '@shared/mocks';
import { CustomConfirmationService, ToastService } from '@shared/services';

import { AuthorAssertionsStepComponent } from './author-assertions-step.component';

const mockPreprint = {
  id: '1',
  hasCoi: false,
  coiStatement: null,
  hasDataLinks: ApplicabilityStatus.NotApplicable,
  dataLinks: [],
  whyNoData: null,
  hasPreregLinks: ApplicabilityStatus.NotApplicable,
  preregLinks: [],
  whyNoPrereg: null,
  preregLinkInfo: null,
};

describe('AuthorAssertionsStepComponent', () => {
  let component: AuthorAssertionsStepComponent;
  let fixture: ComponentFixture<AuthorAssertionsStepComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === PreprintStepperSelectors.getPreprint) return () => mockPreprint;
      if (selector === PreprintStepperSelectors.isPreprintSubmitting) return () => false;
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [AuthorAssertionsStepComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProviders(ToastService, CustomConfirmationService, TranslateService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorAssertionsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
