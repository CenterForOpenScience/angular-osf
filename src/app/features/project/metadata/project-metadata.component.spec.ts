import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataComponent } from './project-metadata.component';

describe('ProjectMetadataComponent', () => {
  let component: ProjectMetadataComponent;
  let fixture: ComponentFixture<ProjectMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
