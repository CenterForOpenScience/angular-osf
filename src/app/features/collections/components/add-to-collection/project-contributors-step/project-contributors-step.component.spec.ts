import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContributorsStepComponent } from './project-contributors-step.component';

describe('ProjectContributorsStepComponent', () => {
  let component: ProjectContributorsStepComponent;
  let fixture: ComponentFixture<ProjectContributorsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectContributorsStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectContributorsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
