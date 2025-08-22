import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOverviewContributor } from '@osf/features/project/overview/models';
import { MOCK_OVERVIEW_CONTRIBUTORS, TranslateServiceMock } from '@shared/mocks';

import { ProjectMetadataContributorsComponent } from './project-metadata-contributors.component';

describe('ProjectMetadataContributorsComponent', () => {
  let component: ProjectMetadataContributorsComponent;
  let fixture: ComponentFixture<ProjectMetadataContributorsComponent>;

  const mockContributors: ProjectOverviewContributor[] = MOCK_OVERVIEW_CONTRIBUTORS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataContributorsComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataContributorsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.contributors()).toEqual([]);
    expect(component.readonly()).toBe(false);
  });

  it('should set contributors input', () => {
    fixture.componentRef.setInput('contributors', mockContributors);
    fixture.detectChanges();

    expect(component.contributors()).toEqual(mockContributors);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });

  it('should emit openEditContributorDialog event', () => {
    const emitSpy = jest.spyOn(component.openEditContributorDialog, 'emit');

    component.openEditContributorDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
