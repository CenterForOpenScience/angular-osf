import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsSelectors } from '@osf/shared/stores/institutions';
import { Institution } from '@shared/models/institutions/institutions.models';

import { SettingsProjectAffiliationComponent } from './settings-project-affiliation.component';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('SettingsProjectAffiliationComponent', () => {
  let component: SettingsProjectAffiliationComponent;
  let fixture: ComponentFixture<SettingsProjectAffiliationComponent>;

  const mockInstitutions: Institution[] = [MOCK_INSTITUTION];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsProjectAffiliationComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [{ selector: InstitutionsSelectors.getUserInstitutions, value: [] }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsProjectAffiliationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('affiliations', []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with empty affiliations array', () => {
    fixture.componentRef.setInput('affiliations', []);
    fixture.detectChanges();

    expect(component.affiliations()).toEqual([]);
  });

  it('should display affiliations when provided', () => {
    fixture.componentRef.setInput('affiliations', mockInstitutions);
    fixture.detectChanges();

    expect(component.affiliations()).toEqual(mockInstitutions);
  });

  it('should emit removed event when removeAffiliation is called', () => {
    jest.spyOn(component.removed, 'emit');
    fixture.componentRef.setInput('affiliations', mockInstitutions);
    fixture.detectChanges();

    component.removeAffiliation(MOCK_INSTITUTION);

    expect(component.removed.emit).toHaveBeenCalledWith(MOCK_INSTITUTION);
  });

  describe('canRemoveAffiliation', () => {
    const affiliatedInstitution = { ...MOCK_INSTITUTION, id: 'affiliated-id' };
    const nonAffiliatedInstitution = { ...MOCK_INSTITUTION, id: 'non-affiliated-id' };
    const userInstitutions = [{ ...MOCK_INSTITUTION, id: 'affiliated-id' }];

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [SettingsProjectAffiliationComponent, OSFTestingModule],
        providers: [
          provideMockStore({
            signals: [{ selector: InstitutionsSelectors.getUserInstitutions, value: userInstitutions }],
          }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SettingsProjectAffiliationComponent);
      component = fixture.componentInstance;
    });

    it('should return true when canRemove is true', () => {
      fixture.componentRef.setInput('canRemove', true);
      fixture.componentRef.setInput('canEdit', false);
      fixture.detectChanges();

      expect(component.canRemoveAffiliation(affiliatedInstitution)).toBe(true);
      expect(component.canRemoveAffiliation(nonAffiliatedInstitution)).toBe(true);
    });

    it('should return true when canEdit is true and user is affiliated with institution', () => {
      fixture.componentRef.setInput('canRemove', false);
      fixture.componentRef.setInput('canEdit', true);
      fixture.detectChanges();

      expect(component.canRemoveAffiliation(affiliatedInstitution)).toBe(true);
    });

    it('should return false when canEdit is true but user is not affiliated with institution', () => {
      fixture.componentRef.setInput('canRemove', false);
      fixture.componentRef.setInput('canEdit', true);
      fixture.detectChanges();

      expect(component.canRemoveAffiliation(nonAffiliatedInstitution)).toBe(false);
    });

    it('should return false when both canRemove and canEdit are false', () => {
      fixture.componentRef.setInput('canRemove', false);
      fixture.componentRef.setInput('canEdit', false);
      fixture.detectChanges();

      expect(component.canRemoveAffiliation(affiliatedInstitution)).toBe(false);
      expect(component.canRemoveAffiliation(nonAffiliatedInstitution)).toBe(false);
    });
  });

  describe('userInstitutionIds', () => {
    it('should create a Set of user institution IDs', () => {
      const userInstitutions = [
        { ...MOCK_INSTITUTION, id: 'id1' },
        { ...MOCK_INSTITUTION, id: 'id2' },
      ];

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [SettingsProjectAffiliationComponent, OSFTestingModule],
        providers: [
          provideMockStore({
            signals: [{ selector: InstitutionsSelectors.getUserInstitutions, value: userInstitutions }],
          }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SettingsProjectAffiliationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const result = component.userInstitutionIds();
      expect(result).toBeInstanceOf(Set);
      expect(result.has('id1')).toBe(true);
      expect(result.has('id2')).toBe(true);
      expect(result.has('id3')).toBe(false);
    });

    it('should return empty Set when no user institutions', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [SettingsProjectAffiliationComponent, OSFTestingModule],
        providers: [
          provideMockStore({
            signals: [{ selector: InstitutionsSelectors.getUserInstitutions, value: [] }],
          }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SettingsProjectAffiliationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const result = component.userInstitutionIds();
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
    });
  });
});
