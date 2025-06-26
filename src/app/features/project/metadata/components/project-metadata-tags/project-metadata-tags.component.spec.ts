import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataTagsComponent } from './project-metadata-tags.component';

describe('ProjectMetadataTagsComponent', () => {
  let component: ProjectMetadataTagsComponent;
  let fixture: ComponentFixture<ProjectMetadataTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataTagsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
