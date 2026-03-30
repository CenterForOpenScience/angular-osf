import { Store } from '@ngxs/store';

import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { SubjectsComponent } from '@osf/shared/components/subjects/subjects.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import {
  FetchChildrenSubjects,
  FetchSelectedSubjects,
  FetchSubjects,
  SubjectsSelectors,
  UpdateResourceSubjects,
} from '@osf/shared/stores/subjects';
import { SubjectModel } from '@shared/models/subject/subject.model';

import { RegistriesSubjectsComponent } from './registries-subjects.component';

import { MOCK_DRAFT_REGISTRATION } from '@testing/mocks/draft-registration.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesSubjectsComponent', () => {
  let component: RegistriesSubjectsComponent;
  let fixture: ComponentFixture<RegistriesSubjectsComponent>;
  let store: Store;

  const mockSubjects: SubjectModel[] = [
    { id: 'sub-1', name: 'Subject 1' },
    { id: 'sub-2', name: 'Subject 2' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegistriesSubjectsComponent, MockComponent(SubjectsComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [
            { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
            { selector: SubjectsSelectors.areSelectedSubjectsLoading, value: false },
            { selector: RegistriesSelectors.getDraftRegistration, value: MOCK_DRAFT_REGISTRATION },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(RegistriesSubjectsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', new FormControl(null, Validators.required));
    fixture.componentRef.setInput('draftId', 'draft-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch fetchSubjects and fetchSelectedSubjects on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      new FetchSubjects(ResourceType.Registration, MOCK_DRAFT_REGISTRATION.providerId)
    );
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSelectedSubjects('draft-1', ResourceType.DraftRegistration));
  });

  it('should dispatch fetchChildrenSubjects on getSubjectChildren', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.getSubjectChildren('parent-1');
    expect(store.dispatch).toHaveBeenCalledWith(new FetchChildrenSubjects('parent-1'));
  });

  it('should dispatch fetchSubjects with search term on searchSubjects', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.searchSubjects('biology');
    expect(store.dispatch).toHaveBeenCalledWith(
      new FetchSubjects(ResourceType.Registration, MOCK_DRAFT_REGISTRATION.providerId, 'biology')
    );
  });

  it('should dispatch updateResourceSubjects and update control on updateSelectedSubjects', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.updateSelectedSubjects(mockSubjects);
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateResourceSubjects('draft-1', ResourceType.DraftRegistration, mockSubjects)
    );
    expect(component.control().value).toEqual(mockSubjects);
    expect(component.control().touched).toBe(true);
    expect(component.control().dirty).toBe(true);
  });

  it('should mark control as touched and dirty on focusout', () => {
    component.onFocusOut();
    expect(component.control().touched).toBe(true);
    expect(component.control().dirty).toBe(true);
  });

  it('should have invalid control when value is null', () => {
    component.control().markAsTouched();
    component.control().updateValueAndValidity();
    expect(component.control().valid).toBe(false);
    expect(component.control().errors?.['required']).toBeTruthy();
  });

  it('should have valid control when subjects are set', () => {
    component.updateControlState(mockSubjects);
    expect(component.control().valid).toBe(true);
    expect(component.control().errors).toBeNull();
  });
});
