import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionsViewComponent } from '@shared/components';
import { MOCK_PROJECT_AFFILIATED_INSTITUTIONS, TranslateServiceMock } from '@shared/mocks';

import { ProjectMetadataAffiliatedInstitutionsComponent } from './project-metadata-affiliated-institutions.component';

describe('ProjectMetadataAffiliatedInstitutionsComponent', () => {
  let component: ProjectMetadataAffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<ProjectMetadataAffiliatedInstitutionsComponent>;

  const mockAffiliatedInstitutions = MOCK_PROJECT_AFFILIATED_INSTITUTIONS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataAffiliatedInstitutionsComponent, MockComponent(AffiliatedInstitutionsViewComponent)],
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
});
