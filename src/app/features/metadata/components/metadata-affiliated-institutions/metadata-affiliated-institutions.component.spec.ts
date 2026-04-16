import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';

import { MOCK_PROJECT_AFFILIATED_INSTITUTIONS } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { MetadataAffiliatedInstitutionsComponent } from './metadata-affiliated-institutions.component';

describe('MetadataAffiliatedInstitutionsComponent', () => {
  let component: MetadataAffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<MetadataAffiliatedInstitutionsComponent>;

  const mockAffiliatedInstitutions = MOCK_PROJECT_AFFILIATED_INSTITUTIONS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataAffiliatedInstitutionsComponent, MockComponent(AffiliatedInstitutionsViewComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(MetadataAffiliatedInstitutionsComponent);
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
