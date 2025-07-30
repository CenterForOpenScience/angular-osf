import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataAffiliatedInstitutionsComponent } from './project-metadata-affiliated-institutions.component';

describe('ProjectMetadataAffiliatedInstitutionsComponent', () => {
  let component: ProjectMetadataAffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<ProjectMetadataAffiliatedInstitutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataAffiliatedInstitutionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataAffiliatedInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
