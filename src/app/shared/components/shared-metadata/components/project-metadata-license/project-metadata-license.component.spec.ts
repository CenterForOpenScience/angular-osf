import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataLicenseComponent } from './project-metadata-license.component';

describe('ProjectMetadataLicenseComponent', () => {
  let component: ProjectMetadataLicenseComponent;
  let fixture: ComponentFixture<ProjectMetadataLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataLicenseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
