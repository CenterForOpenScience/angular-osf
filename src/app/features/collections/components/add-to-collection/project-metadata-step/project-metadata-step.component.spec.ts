import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataStepComponent } from './project-metadata-step.component';

describe('ProjectMetadataStepComponent', () => {
  let component: ProjectMetadataStepComponent;
  let fixture: ComponentFixture<ProjectMetadataStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
