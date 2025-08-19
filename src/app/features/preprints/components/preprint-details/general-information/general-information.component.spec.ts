import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { ContributorsSelectors } from '@shared/stores';

import { GeneralInformationComponent } from './general-information.component';

describe('GeneralInformationComponent', () => {
  let component: GeneralInformationComponent;
  let fixture: ComponentFixture<GeneralInformationComponent>;

  const mockStore = MOCK_STORE;

  beforeEach(async () => {
    (mockStore.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (
        selector === PreprintSelectors.getPreprint ||
        selector === PreprintSelectors.isPreprintLoading ||
        selector === PreprintSelectors.getPreprintVersionIds ||
        selector === PreprintSelectors.arePreprintVersionIdsLoading
      ) {
        return signal(null);
      }
      if (
        selector === ContributorsSelectors.getContributors ||
        selector === ContributorsSelectors.isContributorsLoading
      ) {
        return signal([]);
      }
      return signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [GeneralInformationComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(Store, mockStore), MockProvider(Router), MockProvider(Location), TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
