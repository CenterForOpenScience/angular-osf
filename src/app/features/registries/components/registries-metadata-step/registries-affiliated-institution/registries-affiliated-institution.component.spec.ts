import { Store } from '@ngxs/store';

import { MockComponent } from 'ng-mocks';

import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components/affiliated-institution-select/affiliated-institution-select.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
import {
  FetchResourceInstitutions,
  FetchUserInstitutions,
  InstitutionsSelectors,
  UpdateResourceInstitutions,
} from '@osf/shared/stores/institutions';

import { RegistriesAffiliatedInstitutionComponent } from './registries-affiliated-institution.component';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesAffiliatedInstitutionComponent', () => {
  let component: RegistriesAffiliatedInstitutionComponent;
  let fixture: ComponentFixture<RegistriesAffiliatedInstitutionComponent>;
  let store: Store;
  let resourceInstitutionsSignal: WritableSignal<Institution[]>;

  beforeEach(() => {
    resourceInstitutionsSignal = signal<Institution[]>([]);

    TestBed.configureTestingModule({
      imports: [RegistriesAffiliatedInstitutionComponent, MockComponent(AffiliatedInstitutionSelectComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [
            { selector: InstitutionsSelectors.getUserInstitutions, value: [] },
            { selector: InstitutionsSelectors.areUserInstitutionsLoading, value: false },
            { selector: InstitutionsSelectors.getResourceInstitutions, value: resourceInstitutionsSignal },
            { selector: InstitutionsSelectors.areResourceInstitutionsLoading, value: false },
            { selector: InstitutionsSelectors.areResourceInstitutionsSubmitting, value: false },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(RegistriesAffiliatedInstitutionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('draftId', 'draft-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch fetchUserInstitutions and fetchResourceInstitutions on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(new FetchUserInstitutions());
    expect(store.dispatch).toHaveBeenCalledWith(
      new FetchResourceInstitutions('draft-1', ResourceType.DraftRegistration)
    );
  });

  it('should sync selectedInstitutions when resourceInstitutions emits', () => {
    const institutions: Institution[] = [MOCK_INSTITUTION as Institution];
    resourceInstitutionsSignal.set(institutions);
    fixture.detectChanges();
    expect(component.selectedInstitutions()).toEqual(institutions);
  });

  it('should dispatch updateResourceInstitutions on selection', () => {
    (store.dispatch as jest.Mock).mockClear();
    const selected: Institution[] = [MOCK_INSTITUTION as Institution];
    component.institutionsSelected(selected);
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateResourceInstitutions('draft-1', ResourceType.DraftRegistration, selected)
    );
  });
});
