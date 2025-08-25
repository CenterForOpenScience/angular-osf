import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOverview } from '@osf/features/project/overview/models';
import { MOCK_PROJECT_OVERVIEW, TranslateServiceMock } from '@shared/mocks';

import { ProjectMetadataDoiComponent } from './project-metadata-doi.component';

describe('ProjectMetadataDoiComponent', () => {
  let component: ProjectMetadataDoiComponent;
  let fixture: ComponentFixture<ProjectMetadataDoiComponent>;

  const mockProjectWithDoi: ProjectOverview = MOCK_PROJECT_OVERVIEW;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataDoiComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataDoiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentProject input', () => {
    fixture.componentRef.setInput('currentProject', mockProjectWithDoi);
    fixture.detectChanges();

    expect(component.currentProject()).toEqual(mockProjectWithDoi);
  });

  it('should emit editDoi event when onCreateDoi is called', () => {
    const emitSpy = jest.spyOn(component.editDoi, 'emit');

    component.onCreateDoi();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit editDoi event when onEditDoi is called', () => {
    const emitSpy = jest.spyOn(component.editDoi, 'emit');

    component.onEditDoi();

    expect(emitSpy).toHaveBeenCalled();
  });
});
