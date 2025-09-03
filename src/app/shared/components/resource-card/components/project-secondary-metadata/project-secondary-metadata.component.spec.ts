import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSecondaryMetadataComponent } from './project-secondary-metadata.component';

describe.skip('ProjectSecondaryMetadataComponent', () => {
  let component: ProjectSecondaryMetadataComponent;
  let fixture: ComponentFixture<ProjectSecondaryMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSecondaryMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSecondaryMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
