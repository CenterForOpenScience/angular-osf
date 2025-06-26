import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubHeaderComponent } from '@osf/shared/components';

import { ProjectFilesContainerComponent } from './project-files-container.component';

describe('ProjectFilesContainerComponent', () => {
  let component: ProjectFilesContainerComponent;
  let fixture: ComponentFixture<ProjectFilesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFilesContainerComponent, MockComponent(SubHeaderComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFilesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
