import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { MOCK_STORE, TranslateServiceMock } from '@osf/shared/mocks';
import { SubjectsSelectors } from '@osf/shared/stores';

import { PreprintsSubjectsComponent } from './preprints-subjects.component';

describe('PreprintsSubjectsComponent', () => {
  let component: PreprintsSubjectsComponent;
  let fixture: ComponentFixture<PreprintsSubjectsComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintStepperSelectors.getSelectedProviderId:
          return () => 'Test';
        case SubjectsSelectors.getSelectedSubjects:
          return () => [];
        case SubjectsSelectors.areSelectedSubjectsLoading:
          return () => false;
        default:
          return () => [];
      }
    });

    await TestBed.configureTestingModule({
      imports: [PreprintsSubjectsComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(Store, MOCK_STORE), TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsSubjectsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preprintId', '');
    fixture.componentRef.setInput('control', new FormControl([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
