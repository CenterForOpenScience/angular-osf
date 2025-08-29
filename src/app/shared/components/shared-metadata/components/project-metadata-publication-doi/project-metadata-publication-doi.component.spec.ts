import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_PROJECT_IDENTIFIERS, TranslateServiceMock } from '@shared/mocks';
import { Identifier } from '@shared/models';

import { ProjectMetadataPublicationDoiComponent } from './project-metadata-publication-doi.component';

describe('ProjectMetadataPublicationDoiComponent', () => {
  let component: ProjectMetadataPublicationDoiComponent;
  let fixture: ComponentFixture<ProjectMetadataPublicationDoiComponent>;

  const mockIdentifiers: Identifier = MOCK_PROJECT_IDENTIFIERS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataPublicationDoiComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataPublicationDoiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.identifiers()).toEqual([]);
    expect(component.hideEditDoi()).toBe(false);
  });

  it('should set identifiers input', () => {
    fixture.componentRef.setInput('identifiers', mockIdentifiers);
    fixture.detectChanges();

    expect(component.identifiers()).toEqual(mockIdentifiers);
  });

  it('should set hideEditDoi input', () => {
    fixture.componentRef.setInput('hideEditDoi', true);
    fixture.detectChanges();

    expect(component.hideEditDoi()).toBe(true);
  });

  it('should emit openEditPublicationDoiDialog event', () => {
    const emitSpy = jest.spyOn(component.openEditPublicationDoiDialog, 'emit');

    component.openEditPublicationDoiDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
