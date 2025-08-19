import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { MOCK_PROVIDER, MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';

import { UpdatePreprintStepperComponent } from './update-preprint-stepper.component';

describe('UpdatePreprintStepperComponent', () => {
  let component: UpdatePreprintStepperComponent;
  let fixture: ComponentFixture<UpdatePreprintStepperComponent>;
  const mockActivatedRoute = {
    params: of({ providerId: 'osf', preprintId: 'id1' }),
    snapshot: { params: { providerId: 'osf', preprintId: 'id1' } },
  };

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintStepperSelectors.getPreprint:
          return () => ({ id: 'id1', title: 'Test', description: '' });
        case PreprintStepperSelectors.isPreprintSubmitting:
          return () => false;
        case PreprintProvidersSelectors.getPreprintProviderDetails('osf'):
          return () => MOCK_PROVIDER;
        case PreprintProvidersSelectors.isPreprintProviderDetailsLoading:
          return () => false;
        default:
          return () => null;
      }
    });

    await TestBed.configureTestingModule({
      imports: [UpdatePreprintStepperComponent, MockPipe(TranslatePipe)],
      teardown: { destroyAfterEach: false },
      providers: [
        MockProvider(Store, MOCK_STORE),
        TranslateServiceMock,
        MockProvider(ToastService),
        MockProvider(Router),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePreprintStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
