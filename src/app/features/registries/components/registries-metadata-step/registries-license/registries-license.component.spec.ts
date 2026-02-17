import { Store } from '@ngxs/store';

import { MockComponent } from 'ng-mocks';

import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { FetchLicenses, RegistriesSelectors, SaveLicense } from '@osf/features/registries/store';
import { LicenseComponent } from '@osf/shared/components/license/license.component';
import { LicenseModel } from '@shared/models/license/license.model';

import { RegistriesLicenseComponent } from './registries-license.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesLicenseComponent', () => {
  let component: RegistriesLicenseComponent;
  let fixture: ComponentFixture<RegistriesLicenseComponent>;
  let store: Store;
  let licensesSignal: WritableSignal<LicenseModel[]>;
  let selectedLicenseSignal: WritableSignal<{ id: string; options?: Record<string, string> } | null>;
  let draftRegistrationSignal: WritableSignal<Partial<{ providerId: string; defaultLicenseId: string }> | null>;

  const mockLicense: LicenseModel = { id: 'lic-1', name: 'MIT', requiredFields: [], url: '', text: '' };
  const mockDefaultLicense: LicenseModel = { id: 'default-1', name: 'Default', requiredFields: [], url: '', text: '' };

  beforeEach(() => {
    licensesSignal = signal<LicenseModel[]>([]);
    selectedLicenseSignal = signal<{ id: string; options?: Record<string, string> } | null>(null);
    draftRegistrationSignal = signal<Partial<{ providerId: string; defaultLicenseId: string }> | null>({
      providerId: 'osf',
    });

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch fetchLicenses on init when draft present', () => {
    expect(store.dispatch).toHaveBeenCalledWith(new FetchLicenses('osf'));
  });

  it('should fetch licenses only once even if draft re-emits', () => {
    (store.dispatch as jest.Mock).mockClear();
    draftRegistrationSignal.set({ providerId: 'other' });
    fixture.detectChanges();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchLicenses));
  });

  it('should sync selected license to control when license exists in list', () => {
    licensesSignal.set([mockLicense]);
    selectedLicenseSignal.set({ id: 'lic-1' });
    fixture.detectChanges();
    expect(component.control().get('id')?.value).toBe('lic-1');
  });

  it('should apply default license and save when no selected license', () => {
    (store.dispatch as jest.Mock).mockClear();
    draftRegistrationSignal.set({ providerId: 'osf', defaultLicenseId: 'default-1' });
    licensesSignal.set([mockDefaultLicense]);
    fixture.detectChanges();
    expect(component.control().get('id')?.value).toBe('default-1');
    expect(store.dispatch).toHaveBeenCalledWith(new SaveLicense('draft-1', 'default-1'));
  });

  it('should apply default license but not save when it has required fields', () => {
    (store.dispatch as jest.Mock).mockClear();
    const licenseWithFields: LicenseModel = {
      id: 'default-2',
      name: 'CC-BY',
      requiredFields: ['year'],
      url: '',
      text: '',
    };
    draftRegistrationSignal.set({ providerId: 'osf', defaultLicenseId: 'default-2' });
    licensesSignal.set([licenseWithFields]);
    fixture.detectChanges();
    expect(component.control().get('id')?.value).toBe('default-2');
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SaveLicense));
  });

  it('should prefer selected license over default license', () => {
    licensesSignal.set([mockDefaultLicense, mockLicense]);
    draftRegistrationSignal.set({ providerId: 'osf', defaultLicenseId: 'default-1' });
    selectedLicenseSignal.set({ id: 'lic-1' });
    fixture.detectChanges();
    expect(component.control().get('id')?.value).toBe('lic-1');
  });

  it('should set control id and save license when selecting simple license', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.selectLicense(mockLicense);
    expect(component.control().get('id')?.value).toBe('lic-1');
    expect(store.dispatch).toHaveBeenCalledWith(new SaveLicense('draft-1', 'lic-1'));
  });

  it('should not save when license has required fields', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.selectLicense({ id: 'lic-2', name: 'CC-BY', requiredFields: ['year'], url: '', text: '' });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch saveLicense with options on createLicense', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.createLicense({ id: 'lic-3', licenseOptions: { year: '2024', copyrightHolders: 'Me' } });
    expect(store.dispatch).toHaveBeenCalledWith(
      new SaveLicense('draft-1', 'lic-3', { year: '2024', copyrightHolders: 'Me' })
    );
  });

  it('should not apply default license when defaultLicenseId is not in the list', () => {
    (store.dispatch as jest.Mock).mockClear();
    draftRegistrationSignal.set({ providerId: 'osf', defaultLicenseId: 'non-existent' });
    licensesSignal.set([mockLicense]);
    fixture.detectChanges();
    expect(component.control().get('id')?.value).toBe('');
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SaveLicense));
  });

  it('should mark control on focus out', () => {
    component.onFocusOut();
    expect(component.control().touched).toBe(true);
    expect(component.control().dirty).toBe(true);
  });
});
