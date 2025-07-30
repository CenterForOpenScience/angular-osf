import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataDoiComponent } from './project-metadata-doi.component';

describe('ProjectMetadataDoiComponent', () => {
  let component: ProjectMetadataDoiComponent;
  let fixture: ComponentFixture<ProjectMetadataDoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataDoiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataDoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
