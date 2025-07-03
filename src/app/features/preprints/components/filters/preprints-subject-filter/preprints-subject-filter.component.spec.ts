import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsResourcesFiltersSelectors } from '@osf/features/preprints/store/preprints-resources-filters';
import { PreprintsResourcesFiltersOptionsSelectors } from '@osf/features/preprints/store/preprints-resources-filters-options';

import { PreprintsSubjectFilterComponent } from './preprints-subject-filter.component';

describe('SubjectFilterComponent', () => {
  let component: PreprintsSubjectFilterComponent;
  let fixture: ComponentFixture<PreprintsSubjectFilterComponent>;

  const mockSubjects = [
    { id: '1', label: 'Physics', count: 10 },
    { id: '2', label: 'Chemistry', count: 15 },
    { id: '3', label: 'Biology', count: 20 },
  ];

  const mockStore = {
    selectSignal: jest.fn().mockImplementation((selector) => {
      if (selector === PreprintsResourcesFiltersOptionsSelectors.getSubjects) {
        return () => mockSubjects;
      }
      if (selector === PreprintsResourcesFiltersSelectors.getSubject) {
        return () => ({ label: '', id: '' });
      }
      return () => null;
    }),
    dispatch: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsSubjectFilterComponent],
      providers: [MockProvider(Store, mockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsSubjectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize with subjects', () => {
    expect(component).toBeTruthy();
    expect(component['availableSubjects']()).toEqual(mockSubjects);
    expect(component['subjectsOptions']().length).toBe(3);
    expect(component['subjectsOptions']()[0].labelCount).toBe('Physics (10)');
  });
});
