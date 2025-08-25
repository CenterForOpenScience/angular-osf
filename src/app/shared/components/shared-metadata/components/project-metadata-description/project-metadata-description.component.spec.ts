import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@shared/mocks';

import { ProjectMetadataDescriptionComponent } from './project-metadata-description.component';

describe('ProjectMetadataDescriptionComponent', () => {
  let component: ProjectMetadataDescriptionComponent;
  let fixture: ComponentFixture<ProjectMetadataDescriptionComponent>;

  const mockDescription = 'This is a test project description.';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataDescriptionComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataDescriptionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set description input', () => {
    fixture.componentRef.setInput('description', mockDescription);
    fixture.detectChanges();

    expect(component.description()).toEqual(mockDescription);
  });

  it('should emit openEditDescriptionDialog event', () => {
    const emitSpy = jest.spyOn(component.openEditDescriptionDialog, 'emit');

    component.openEditDescriptionDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
