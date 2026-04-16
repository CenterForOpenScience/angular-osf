import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsComponent } from '@osf/shared/components/subjects/subjects.component';
import { SubjectModel } from '@osf/shared/models/subject/subject.model';

import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { MetadataSubjectsComponent } from './metadata-subjects.component';

describe('MetadataSubjectsComponent', () => {
  let component: MetadataSubjectsComponent;
  let fixture: ComponentFixture<MetadataSubjectsComponent>;

  const mockSubjects: SubjectModel[] = SUBJECTS_MOCK;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataSubjectsComponent, MockComponent(SubjectsComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(MetadataSubjectsComponent);
    fixture.componentRef.setInput('selectedSubjects', mockSubjects);
    fixture.componentRef.setInput('isSubjectsUpdating', false);
    fixture.componentRef.setInput('readonly', false);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedSubjects input', () => {
    fixture.componentRef.setInput('selectedSubjects', mockSubjects);
    fixture.detectChanges();

    expect(component.selectedSubjects()).toEqual(mockSubjects);
  });

  it('should set isSubjectsUpdating input', () => {
    fixture.componentRef.setInput('isSubjectsUpdating', true);
    fixture.detectChanges();

    expect(component.isSubjectsUpdating()).toBe(true);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });

  it('should emit getSubjectChildren event', () => {
    const emitSpy = vi.spyOn(component.getSubjectChildren, 'emit');
    const parentId = 'subject-1';

    component.getSubjectChildren.emit(parentId);

    expect(emitSpy).toHaveBeenCalledWith(parentId);
  });

  it('should emit searchSubjects event', () => {
    const emitSpy = vi.spyOn(component.searchSubjects, 'emit');
    const searchTerm = 'computer science';

    component.searchSubjects.emit(searchTerm);

    expect(emitSpy).toHaveBeenCalledWith(searchTerm);
  });

  it('should emit updateSelectedSubjects event', () => {
    const emitSpy = vi.spyOn(component.updateSelectedSubjects, 'emit');
    const updatedSubjects: SubjectModel[] = [
      {
        id: 'subject-7',
        name: 'New Subject',
        children: [],
        parent: null,
      },
    ];

    component.updateSelectedSubjects.emit(updatedSubjects);

    expect(emitSpy).toHaveBeenCalledWith(updatedSubjects);
  });
});
