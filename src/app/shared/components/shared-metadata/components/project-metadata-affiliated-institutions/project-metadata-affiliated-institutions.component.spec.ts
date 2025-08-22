import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAffiliatedInstitutions } from '@osf/features/project/overview/models';
import { MOCK_PROJECT_AFFILIATED_INSTITUTIONS, TranslateServiceMock } from '@shared/mocks';

import { ProjectMetadataAffiliatedInstitutionsComponent } from './project-metadata-affiliated-institutions.component';

describe('ProjectMetadataAffiliatedInstitutionsComponent', () => {
  let component: ProjectMetadataAffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<ProjectMetadataAffiliatedInstitutionsComponent>;

  const mockAffiliatedInstitutions: ProjectAffiliatedInstitutions[] = MOCK_PROJECT_AFFILIATED_INSTITUTIONS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataAffiliatedInstitutionsComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataAffiliatedInstitutionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set affiliatedInstitutions input', () => {
    fixture.componentRef.setInput('affiliatedInstitutions', mockAffiliatedInstitutions);
    fixture.detectChanges();

    expect(component.affiliatedInstitutions()).toEqual(mockAffiliatedInstitutions);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });

  it('should emit openEditAffiliatedInstitutionsDialog event', () => {
    const emitSpy = jest.spyOn(component.openEditAffiliatedInstitutionsDialog, 'emit');

    component.openEditAffiliatedInstitutionsDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should display affiliated institutions when they exist', () => {
    fixture.componentRef.setInput('affiliatedInstitutions', mockAffiliatedInstitutions);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;

    expect(compiled.textContent).toContain('University of Example');
    expect(compiled.textContent).toContain('Research Institute');
    expect(compiled.textContent).toContain('Medical Center');

    expect(compiled.textContent).toContain('A leading research university');
    expect(compiled.textContent).toContain('Focused on scientific research');
    expect(compiled.textContent).toContain('Healthcare and medical research');
  });
});
