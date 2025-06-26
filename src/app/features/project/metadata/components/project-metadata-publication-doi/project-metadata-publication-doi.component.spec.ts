import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataPublicationDoiComponent } from './project-metadata-publication-doi.component';

describe('ProjectMetadataPublicationDoiComponent', () => {
  let component: ProjectMetadataPublicationDoiComponent;
  let fixture: ComponentFixture<ProjectMetadataPublicationDoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataPublicationDoiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataPublicationDoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
