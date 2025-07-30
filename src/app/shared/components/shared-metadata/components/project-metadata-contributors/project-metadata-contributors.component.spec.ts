import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataContributorsComponent } from './project-metadata-contributors.component';

describe('ProjectMetadataContributorsComponent', () => {
  let component: ProjectMetadataContributorsComponent;
  let fixture: ComponentFixture<ProjectMetadataContributorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataContributorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
