import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataResourceInformationComponent } from './project-metadata-resource-information.component';

describe('ProjectMetadataResourceInformationComponent', () => {
  let component: ProjectMetadataResourceInformationComponent;
  let fixture: ComponentFixture<ProjectMetadataResourceInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataResourceInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataResourceInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
