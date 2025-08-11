import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { MOCK_STORE } from '@shared/mocks';
import { IS_LARGE, IS_MEDIUM } from '@shared/utils';

import { PreprintFileSectionComponent } from './preprint-file-section.component';

describe.skip('PreprintFileSectionComponent', () => {
  let component: PreprintFileSectionComponent;
  let fixture: ComponentFixture<PreprintFileSectionComponent>;

  const mockStore = MOCK_STORE;
  let isMediumSubject: BehaviorSubject<boolean>;
  let isLargeSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (
        selector === PreprintSelectors.isPreprintFileLoading ||
        selector === PreprintSelectors.getPreprintFileVersions ||
        selector === PreprintSelectors.arePreprintFileVersionsLoading
      ) {
        return () => [];
      }
      return () => null;
    });

    isMediumSubject = new BehaviorSubject<boolean>(false);
    isLargeSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [PreprintFileSectionComponent],
      providers: [
        MockProvider(Store, mockStore),
        MockProvider(IS_MEDIUM, isMediumSubject),
        MockProvider(IS_LARGE, isLargeSubject),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintFileSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
