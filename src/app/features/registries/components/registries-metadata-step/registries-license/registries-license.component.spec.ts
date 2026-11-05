import { Store } from '@ngxs/store';

import { MockComponent } from 'ng-mocks';

import { Mock } from 'vitest';

import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { FetchLicenses, RegistriesSelectors, SaveLicense } from '@osf/features/registries/store';
import { LicenseComponent } from '@osf/shared/components/license/license.component';
import { DraftRegistrationModel } from '@osf/shared/models/registration/draft-registration.model';
import { LicenseDetails, LicenseModel } from '@shared/models/license/license.model';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { RegistriesLicenseComponent } from './registries-license.component';

const DEFAULT_LICENSES_URL = 'https://api.osf.io/v2/providers/registrations/osf/licenses/';

interface SetupOverrides {
  draft?: Partial<DraftRegistrationModel> | null;
  licensesUrl?: string | null;
}

describe('RegistriesLicenseComponent', () => {
  let component: RegistriesLicenseComponent;
  let fixture: ComponentFixture<RegistriesLicenseComponent>;
  let store: Store;
  let licensesSignal: WritableSignal<LicenseModel[]>;
  let selectedLicenseSignal: WritableSignal<DraftRegistrationModel['license'] | null>;
  let draftRegistrationSignal: WritableSignal<Partial<DraftRegistrationModel> | null>;

  const mockLicense: LicenseModel = { id: 'lic-1', name: 'MIT', requiredFields: [], url: '', text: '' };
  const mockDefaultLicense: LicenseModel = { id: 'default-1', name: 'Default', requiredFields: [], url: '', text: '' };

  function setup(overrides: SetupOverrides = {}) {
    const draft = 'draft' in overrides ? overrides.draft! : {};
    const licensesUrl = 'licensesUrl' in overrides ? overrides.licensesUrl : DEFAULT_LICENSES_URL;

    licensesSignal = signal<LicenseModel[]>([]);
    selectedLicenseSignal = signal<DraftRegistrationModel['license'] | null>(null);
    draftRegistrationSignal = signal(draft);

    TestBed.configureTestingModule({
      imports: [RegistriesLicenseComponent, MockComponent(LicenseComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getLicenses, value: licensesSignal },
            { selector: RegistriesSelectors.getSelectedLicense, value: selectedLicenseSignal },
            { selector: RegistriesSelectors.getDraftRegistration, value: draftRegistrationSignal },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(RegistriesLicenseComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', new FormGroup({ id: new FormControl('') }));
    fixture.componentRef.setInput('draftId', 'draft-1');
    if (licensesUrl != null) {
      fixture.componentRef.setInput('licensesUrl', licensesUrl);
    }
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should dispatch fetchLicenses on init when licensesUrl present', () => {
    setup();
    expect(store.dispatch).toHaveBeenCalledWith(new FetchLicenses(DEFAULT_LICENSES_URL));
  });

  it('should not fetch licenses when licensesUrl is missing', () => {
    setup({ licensesUrl: null });
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchLicenses));
  });

  it('should not re-fetch when draft registration changes', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    draftRegistrationSignal.set({ defaultLicenseId: 'default-1' });
    fixture.detectChanges();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchLicenses));
  });

  it('should sync selected license to control when license exists in list', () => {
    setup();
    licensesSignal.set([mockLicense]);
    selectedLicenseSignal.set({ id: 'lic-1', options: null });
    fixture.detectChanges();
    expect(component.control().get('id')?.value).toBe('lic-1');
  });

  it('should apply default license when selected license is not in the list', () => {
    setup({ draft: { defaultLicenseId: 'default-1' } });
    (store.dispatch as Mock).mockClear();
    selectedLicenseSignal.set({ id: 'missing-lic', options: null });
    licensesSignal.set([mockDefaultLicense]);
    fixture.detectChanges();
    expect(component.control().get('id')?.value).toBe('default-1');
    expect(store.dispatch).toHaveBeenCalledWith(new SaveLicense('draft-1', 'default-1'));
  });

  it('should apply default license and save when no selected license', () => {
    setup({ draft: { defaultLicenseId: 'default-1' } });
    (store.dispatch as Mock).mockClear();
    licensesSignal.set([mockDefaultLicense]);
    fixture.detectChanges();
    expect(component.control().get('id')?.value).toBe('default-1');
    expect(store.dispatch).toHaveBeenCalledWith(new SaveLicense('draft-1', 'default-1'));
  });

  it('should apply default license but not save when it has required fields', () => {
    setup({ draft: { defaultLicenseId: 'default-2' } });
    (store.dispatch as Mock).mockClear();
    const licenseWithFields: LicenseModel = {
      id: 'default-2',
      name: 'CC-BY',
      requiredFields: ['year'],
      url: '',
      text: '',
    };
    licensesSignal.set([licenseWithFields]);
    fixture.detectChanges();
    expect(component.control().get('id')?.value).toBe('default-2');
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SaveLicense));
  });

  it('should prefer selected license over default license', () => {
    setup({ draft: { defaultLicenseId: 'default-1' } });
    licensesSignal.set([mockDefaultLicense, mockLicense]);
    selectedLicenseSignal.set({ id: 'lic-1', options: { year: '2024', copyrightHolders: 'Me' } });
    fixture.detectChanges();
    expect(component.control().get('id')?.value).toBe('lic-1');
  });

  it('should set control id and save license when selecting simple license', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    component.selectLicense(mockLicense);
    expect(component.control().get('id')?.value).toBe('lic-1');
    expect(store.dispatch).toHaveBeenCalledWith(new SaveLicense('draft-1', 'lic-1'));
  });

  it('should not save when license has required fields', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    component.selectLicense({ id: 'lic-2', name: 'CC-BY', requiredFields: ['year'], url: '', text: '' });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch saveLicense with options on createLicense', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    const licenseDetails: LicenseDetails = {
      id: 'lic-3',
      licenseOptions: { year: '2024', copyrightHolders: 'Me' },
    };
    component.createLicense(licenseDetails);
    expect(store.dispatch).toHaveBeenCalledWith(
      new SaveLicense('draft-1', 'lic-3', { year: '2024', copyrightHolders: 'Me' })
    );
  });

  it('should not apply default license when defaultLicenseId is not in the list', () => {
    setup({ draft: { defaultLicenseId: 'non-existent' } });
    (store.dispatch as Mock).mockClear();
    licensesSignal.set([mockLicense]);
    fixture.detectChanges();
    expect(component.control().get('id')?.value).toBe('');
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SaveLicense));
  });

  it('should mark control on focus out', () => {
    setup();
    component.onFocusOut();
    expect(component.control().touched).toBe(true);
    expect(component.control().dirty).toBe(true);
  });
});
