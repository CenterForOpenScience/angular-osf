import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceType } from '@shared/enums';
import { SubjectModel } from '@shared/models';

import { BrowseBySubjectsComponent } from './browse-by-subjects.component';

import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('BrowseBySubjectsComponent', () => {
  let component: BrowseBySubjectsComponent;
  let fixture: ComponentFixture<BrowseBySubjectsComponent>;

  const mockSubjects: SubjectModel[] = SUBJECTS_MOCK;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseBySubjectsComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BrowseBySubjectsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('subjects', []);
    fixture.componentRef.setInput('areSubjectsLoading', false);
    fixture.componentRef.setInput('isProviderLoading', false);

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    fixture.componentRef.setInput('subjects', []);
    fixture.componentRef.setInput('areSubjectsLoading', false);
    fixture.componentRef.setInput('isProviderLoading', false);
    fixture.detectChanges();

    expect(component.subjects()).toEqual([]);
    expect(component.areSubjectsLoading()).toBe(false);
    expect(component.isProviderLoading()).toBe(false);
    expect(component.isLandingPage()).toBe(false);
  });

  it('should display title', () => {
    fixture.componentRef.setInput('subjects', []);
    fixture.componentRef.setInput('areSubjectsLoading', false);
    fixture.componentRef.setInput('isProviderLoading', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h2');

    expect(title).toBeTruthy();
    expect(title.textContent).toBe('preprints.browseBySubjects.title');
  });

  it('should display correct subject names in buttons', () => {
    fixture.componentRef.setInput('subjects', mockSubjects);
    fixture.componentRef.setInput('areSubjectsLoading', false);
    fixture.componentRef.setInput('isProviderLoading', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('p-button');

    expect(buttons[0].getAttribute('ng-reflect-label')).toBe('Mathematics');
    expect(buttons[1].getAttribute('ng-reflect-label')).toBe('Physics');
  });

  it('should compute linksToSearchPageForSubject correctly', () => {
    fixture.componentRef.setInput('subjects', mockSubjects);
    fixture.componentRef.setInput('areSubjectsLoading', false);
    fixture.componentRef.setInput('isProviderLoading', false);
    fixture.detectChanges();

    const links = component.linksToSearchPageForSubject();

    expect(links).toHaveLength(2);
    expect(links[0]).toEqual({
      tab: ResourceType.Preprint,
      filter_subject: '{"label":"Mathematics","value":"https://example.com/subjects/mathematics"}',
    });
    expect(links[1]).toEqual({
      tab: ResourceType.Preprint,
      filter_subject: '{"label":"Physics","value":"https://example.com/subjects/physics"}',
    });
  });

  it('should set correct routerLink for non-landing page', () => {
    fixture.componentRef.setInput('subjects', mockSubjects);
    fixture.componentRef.setInput('areSubjectsLoading', false);
    fixture.componentRef.setInput('isProviderLoading', false);
    fixture.componentRef.setInput('isLandingPage', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('p-button');

    expect(buttons[0].getAttribute('ng-reflect-router-link')).toBe('discover');
  });

  it('should set correct routerLink for landing page', () => {
    fixture.componentRef.setInput('subjects', mockSubjects);
    fixture.componentRef.setInput('areSubjectsLoading', false);
    fixture.componentRef.setInput('isProviderLoading', false);
    fixture.componentRef.setInput('isLandingPage', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('p-button');

    expect(buttons[0].getAttribute('ng-reflect-router-link')).toBe('/search');
  });

  it('should handle subjects without iri', () => {
    const subjectsWithoutIri: SubjectModel[] = [
      {
        id: 'subject-1',
        name: 'Physics',
        iri: undefined,
        children: [],
        parent: null,
        expanded: false,
      },
    ];

    fixture.componentRef.setInput('subjects', subjectsWithoutIri);
    fixture.componentRef.setInput('areSubjectsLoading', false);
    fixture.componentRef.setInput('isProviderLoading', false);
    fixture.detectChanges();

    const links = component.linksToSearchPageForSubject();

    expect(links).toHaveLength(1);
    expect(links[0]).toEqual({
      tab: ResourceType.Preprint,
      filter_subject: '{"label":"Physics"}',
    });
  });
});
