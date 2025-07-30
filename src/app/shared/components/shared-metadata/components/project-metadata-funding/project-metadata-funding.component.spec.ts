import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataFundingComponent } from './project-metadata-funding.component';

describe('ProjectMetadataFundingComponent', () => {
  let component: ProjectMetadataFundingComponent;
  let fixture: ComponentFixture<ProjectMetadataFundingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataFundingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataFundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
