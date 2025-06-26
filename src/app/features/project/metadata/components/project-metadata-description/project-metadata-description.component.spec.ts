import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataDescriptionComponent } from './project-metadata-description.component';

describe('ProjectMetadataDescriptionComponent', () => {
  let component: ProjectMetadataDescriptionComponent;
  let fixture: ComponentFixture<ProjectMetadataDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataDescriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
