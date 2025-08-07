import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsDateCreatedFilterComponent } from '@osf/features/preprints/components';
import { PreprintsResourcesFiltersSelectors } from '@osf/features/preprints/store/preprints-resources-filters';
import { PreprintsResourcesFiltersOptionsSelectors } from '@osf/features/preprints/store/preprints-resources-filters-options';
import { MOCK_STORE } from '@osf/shared/mocks';
import { DateCreated } from '@osf/shared/models';

describe('PreprintsDateCreatedFilterComponent', () => {
  let component: PreprintsDateCreatedFilterComponent;
  let fixture: ComponentFixture<PreprintsDateCreatedFilterComponent>;

  const mockStore = MOCK_STORE;

  const mockDates: DateCreated[] = [
    { value: '2024', count: 10 },
    { value: '2023', count: 5 },
  ];

  beforeEach(async () => {
    (mockStore.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === PreprintsResourcesFiltersOptionsSelectors.getDatesCreated) {
        return signal(mockDates);
      }
      if (selector === PreprintsResourcesFiltersSelectors.getDateCreated) {
        return signal({ label: '', value: '' });
      }
      return signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [PreprintsDateCreatedFilterComponent],
      providers: [MockProvider(Store, mockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsDateCreatedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
