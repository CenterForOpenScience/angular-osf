import { Store } from '@ngxs/store';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Institution } from '@osf/shared/models/institutions/institutions.model';
import { FetchUserInstitutions, InstitutionsSelectors } from '@shared/stores/institutions';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { SettingsProjectAffiliationComponent } from './settings-project-affiliation.component';

describe('SettingsProjectAffiliationComponent', () => {
  let component: SettingsProjectAffiliationComponent;
  let fixture: ComponentFixture<SettingsProjectAffiliationComponent>;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SettingsProjectAffiliationComponent],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [{ selector: InstitutionsSelectors.getUserInstitutions, value: [MOCK_INSTITUTION] }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SettingsProjectAffiliationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should dispatch FetchUserInstitutions on init when canEdit is true', () => {
    (store.dispatch as Mock).mockClear();
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchUserInstitutions());
  });

  it('should not dispatch FetchUserInstitutions on init when canEdit is false', () => {
    (store.dispatch as Mock).mockClear();
    fixture.componentRef.setInput('canEdit', false);
    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchUserInstitutions));
  });

  it('should return true for canRemoveAffiliation when canRemove is true', () => {
    fixture.componentRef.setInput('canRemove', true);
    fixture.detectChanges();

    expect(component.canRemoveAffiliation(MOCK_INSTITUTION as Institution)).toBe(true);
  });

  it('should return true for canRemoveAffiliation when user can edit and affiliation is user institution', () => {
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();

    expect(component.canRemoveAffiliation(MOCK_INSTITUTION as Institution)).toBe(true);
  });

  it('should return false for canRemoveAffiliation when cannot remove and institution is not in user institutions', () => {
    const anotherInstitution: Institution = {
      ...(MOCK_INSTITUTION as Institution),
      id: 'id2',
      name: 'Another Institution',
    };
    fixture.componentRef.setInput('canEdit', true);
    fixture.componentRef.setInput('canRemove', false);
    fixture.detectChanges();

    expect(component.canRemoveAffiliation(anotherInstitution)).toBe(false);
  });

  it('should emit removed event when removeAffiliation is called', () => {
    fixture.detectChanges();
    const removedSpy = vi.spyOn(component.removed, 'emit');

    component.removeAffiliation(MOCK_INSTITUTION as Institution);

    expect(removedSpy).toHaveBeenCalledWith(MOCK_INSTITUTION as Institution);
  });
});
