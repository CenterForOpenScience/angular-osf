import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ResourceType } from '@shared/enums/resource-type.enum';
import { SubjectModel } from '@shared/models/subject/subject.model';

import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { BrowseBySubjectsComponent } from './browse-by-subjects.component';

describe('BrowseBySubjectsComponent', () => {
  let component: BrowseBySubjectsComponent;
  let fixture: ComponentFixture<BrowseBySubjectsComponent>;

  const mockSubjects: SubjectModel[] = SUBJECTS_MOCK;

  function setup(overrides?: {
    subjects?: SubjectModel[];
    areSubjectsLoading?: boolean;
    isProviderLoading?: boolean;
    isLandingPage?: boolean;
  }) {
    TestBed.configureTestingModule({
      imports: [BrowseBySubjectsComponent],
      providers: [provideOSFCore(), provideRouter([])],
    });

    fixture = TestBed.createComponent(BrowseBySubjectsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('subjects', overrides?.subjects ?? []);
    fixture.componentRef.setInput('areSubjectsLoading', overrides?.areSubjectsLoading ?? false);
    fixture.componentRef.setInput('isProviderLoading', overrides?.isProviderLoading ?? false);
    fixture.componentRef.setInput('isLandingPage', overrides?.isLandingPage ?? false);
    fixture.detectChanges();
  }

  it('should keep default isLandingPage input as false', () => {
    setup();

    expect(component.isLandingPage()).toBe(false);
  });

  it('should render skeleton rows while loading', () => {
    setup({ areSubjectsLoading: true, subjects: mockSubjects });

    expect(fixture.nativeElement.querySelectorAll('p-skeleton').length).toBe(6);
    expect(fixture.nativeElement.querySelectorAll('p-button').length).toBe(0);
  });

  it('should render one button per subject when not loading', () => {
    setup({ subjects: mockSubjects });

    expect(fixture.nativeElement.querySelectorAll('p-button').length).toBe(mockSubjects.length);
  });

  it('should build query params for subject with iri', () => {
    setup({ subjects: mockSubjects });

    expect(component.getQueryParamsForSubject(mockSubjects[0])).toEqual({
      tab: ResourceType.Preprint,
      filter_subject: '[{"label":"Mathematics","value":"https://example.com/subjects/mathematics"}]',
    });
  });

  it('should build query params for subject without iri', () => {
    setup();
    const subjectWithoutIri = {
      id: 'subject-1',
      name: 'Physics',
      iri: undefined,
      children: [],
      parent: null,
      expanded: false,
    } as SubjectModel;

    expect(component.getQueryParamsForSubject(subjectWithoutIri)).toEqual({
      tab: ResourceType.Preprint,
      filter_subject: '[{"label":"Physics"}]',
    });
  });

  it.each([
    { isLandingPage: false, expected: 'discover' },
    { isLandingPage: true, expected: '/search' },
  ])('should resolve route for isLandingPage=$isLandingPage', ({ isLandingPage, expected }) => {
    setup({ isLandingPage });

    expect(component.subjectRoute()).toBe(expected);
  });
});
