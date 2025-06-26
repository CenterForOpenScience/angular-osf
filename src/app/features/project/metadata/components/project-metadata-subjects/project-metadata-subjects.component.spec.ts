import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataSubjectsComponent } from './project-metadata-subjects.component';

describe('ProjectMetadataSubjectsComponent', () => {
  let component: ProjectMetadataSubjectsComponent;
  let fixture: ComponentFixture<ProjectMetadataSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataSubjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
