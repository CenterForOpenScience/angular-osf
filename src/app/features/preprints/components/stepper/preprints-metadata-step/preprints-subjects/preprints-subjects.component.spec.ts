import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { SubjectsComponent } from '@osf/shared/components';
import { SubjectModel } from '@osf/shared/models';
import { SubjectsSelectors } from '@osf/shared/stores';

import { PreprintsSubjectsComponent } from './preprints-subjects.component';

import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintsSubjectsComponent', () => {
  let component: PreprintsSubjectsComponent;
  let fixture: ComponentFixture<PreprintsSubjectsComponent>;

  const mockSubjects: SubjectModel[] = SUBJECTS_MOCK;

  const mockFormControl = new FormControl([]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsSubjectsComponent, OSFTestingModule, MockComponent(SubjectsComponent)],
      providers: [
        provideMockStore({
          signals: [
            { selector: PreprintStepperSelectors.getSelectedProviderId, value: 'test-provider-id' },
            { selector: SubjectsSelectors.getSelectedSubjects, value: mockSubjects },
            { selector: SubjectsSelectors.areSelectedSubjectsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsSubjectsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preprintId', 'test-preprint-id');
    fixture.componentRef.setInput('control', mockFormControl);

    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be an instance of PreprintsSubjectsComponent', () => {
      expect(component).toBeInstanceOf(PreprintsSubjectsComponent);
    });
  });

  it('should have required inputs', () => {
    expect(component.preprintId()).toBe('test-preprint-id');
    expect(component.control()).toBe(mockFormControl);
  });

  it('should have NGXS selectors defined', () => {
    expect(component.selectedSubjects).toBeDefined();
    expect(component.isSubjectsUpdating).toBeDefined();
    expect(component['selectedProviderId']).toBeDefined();
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.fetchSubjects).toBeDefined();
    expect(component.actions.fetchSelectedSubjects).toBeDefined();
    expect(component.actions.fetchChildrenSubjects).toBeDefined();
    expect(component.actions.updateResourceSubjects).toBeDefined();
  });

  it('should have INPUT_VALIDATION_MESSAGES constant', () => {
    expect(component.INPUT_VALIDATION_MESSAGES).toBeDefined();
  });

  it('should get selected subjects from store', () => {
    expect(component.selectedSubjects()).toEqual(mockSubjects);
  });

  it('should get subjects loading state from store', () => {
    expect(component.isSubjectsUpdating()).toBe(false);
  });

  it('should get selected provider ID from store', () => {
    expect(component['selectedProviderId']()).toBe('test-provider-id');
  });

  it('should call getSubjectChildren with parent ID', () => {
    const parentId = 'parent-123';

    expect(() => component.getSubjectChildren(parentId)).not.toThrow();
  });

  it('should call searchSubjects with search term', () => {
    const searchTerm = 'mathematics';

    expect(() => component.searchSubjects(searchTerm)).not.toThrow();
  });

  it('should handle null control gracefully', () => {
    const nullControl = new FormControl(null);
    fixture.componentRef.setInput('control', nullControl);

    expect(() => component.updateControlState(mockSubjects)).not.toThrow();
  });

  it('should mark control as touched and dirty', () => {
    const freshControl = new FormControl([]);
    fixture.componentRef.setInput('control', freshControl);

    component.updateControlState(mockSubjects);

    expect(freshControl.touched).toBe(true);
    expect(freshControl.dirty).toBe(true);
  });

  it('should render subjects component', () => {
    const subjectsComponent = fixture.nativeElement.querySelector('osf-subjects');
    expect(subjectsComponent).toBeTruthy();
  });

  it('should handle control with required error', () => {
    mockFormControl.setErrors({ required: true });
    mockFormControl.markAsTouched();
    mockFormControl.markAsDirty();
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(mockFormControl.errors).toEqual({ required: true });
  });

  it('should not show error message when control is valid', () => {
    mockFormControl.setErrors(null);
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('p-message');
    expect(errorMessage).toBeFalsy();
  });

  it('should handle empty preprintId', () => {
    fixture.componentRef.setInput('preprintId', '');

    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should handle undefined preprintId', () => {
    fixture.componentRef.setInput('preprintId', undefined);

    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should handle empty subjects array', () => {
    const emptySubjects: SubjectModel[] = [];

    expect(() => component.updateSelectedSubjects(emptySubjects)).not.toThrow();
    expect(mockFormControl.value).toEqual(emptySubjects);
  });

  it('should handle null subjects', () => {
    expect(() => component.updateControlState(null as any)).not.toThrow();
  });
});
