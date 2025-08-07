import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipes, MockProvider, MockProviders } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { DecodeHtmlPipe } from '@shared/pipes';

import { SelectPreprintServiceComponent } from './select-preprint-service.component';

describe('SelectPreprintServiceComponent', () => {
  let component: SelectPreprintServiceComponent;
  let fixture: ComponentFixture<SelectPreprintServiceComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintProvidersSelectors.getPreprintProvidersAllowingSubmissions:
          return () => [];
        case PreprintProvidersSelectors.arePreprintProvidersAllowingSubmissionsLoading:
          return () => false;
        case PreprintStepperSelectors.getSelectedProviderId:
          return () => null;
        default:
          return () => [];
      }
    });

    await TestBed.configureTestingModule({
      imports: [SelectPreprintServiceComponent, MockPipes(TranslatePipe, DecodeHtmlPipe)],
      providers: [MockProvider(Store, MOCK_STORE), TranslateServiceMock, MockProviders(Router, ActivatedRoute)],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPreprintServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
