import { Store } from '@ngxs/store';

import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { SubjectsComponent } from '@osf/shared/components/subjects/subjects.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import {
  FetchChildrenSubjects,
  FetchSelectedSubjects,
  FetchSubjects,
  SubjectsSelectors,
  UpdateResourceSubjects,
} from '@osf/shared/stores/subjects';

import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { PreprintsSubjectsComponent } from './preprints-subjects.component';

describe('PreprintsSubjectsComponent', () => {
  let component: PreprintsSubjectsComponent;
  let fixture: ComponentFixture<PreprintsSubjectsComponent>;
  let store: Store;

  const mockSubjects = SUBJECTS_MOCK;

  beforeEach(() => {
    const control = new FormControl([]);

    TestBed.configureTestingModule({
      imports: [PreprintsSubjectsComponent, MockComponent(SubjectsComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [
            { selector: SubjectsSelectors.getSelectedSubjects, value: mockSubjects },
            { selector: SubjectsSelectors.areSelectedSubjectsLoading, value: false },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PreprintsSubjectsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('providerId', 'test-provider-id');
    fixture.componentRef.setInput('preprintId', 'test-preprint-id');
    fixture.detectChanges();
  });

  it('should fetch provider subjects and selected subjects on init when ids exist', () => {
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSubjects(ResourceType.Preprint, 'test-provider-id'));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSelectedSubjects('test-preprint-id', ResourceType.Preprint));
    expect(component.control().value).toEqual(mockSubjects);
  });

  it('should dispatch child subjects fetch', () => {
    component.getSubjectChildren('parent-123');

    expect(store.dispatch).toHaveBeenCalledWith(new FetchChildrenSubjects('parent-123'));
  });

  it('should search subjects', () => {
    component.searchSubjects('math');
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSubjects(ResourceType.Preprint, 'test-provider-id', 'math'));
  });

  it('should update control state and resource subjects when preprint id exists', () => {
    const control = component.control();

    component.updateSelectedSubjects(mockSubjects);

    expect(control.value).toEqual(mockSubjects);
    expect(control.touched).toBe(true);
    expect(control.dirty).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateResourceSubjects('test-preprint-id', ResourceType.Preprint, mockSubjects)
    );
  });
});
