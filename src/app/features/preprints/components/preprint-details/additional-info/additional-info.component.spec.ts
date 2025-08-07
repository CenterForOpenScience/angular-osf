import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { SubjectsSelectors } from '@shared/stores';

import { AdditionalInfoComponent } from './additional-info.component';

describe('AdditionalInfoComponent', () => {
  let component: AdditionalInfoComponent;
  let fixture: ComponentFixture<AdditionalInfoComponent>;

  const mockStore = MOCK_STORE;

  beforeEach(async () => {
    (mockStore.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === PreprintSelectors.getPreprint) return () => null;
      if (selector === PreprintSelectors.isPreprintLoading) return () => false;
      if (selector === SubjectsSelectors.getSelectedSubjects) return () => [];
      if (selector === SubjectsSelectors.areSelectedSubjectsLoading) return () => false;
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [AdditionalInfoComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(Store, mockStore), TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
