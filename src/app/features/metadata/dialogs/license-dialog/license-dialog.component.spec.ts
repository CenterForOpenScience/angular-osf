import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseComponent } from '@osf/shared/components/license/license.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { LicenseModel, LicenseOptions } from '@osf/shared/models/license/license.model';
import { FetchLicenses, LicensesSelectors } from '@osf/shared/stores/licenses';

import { MOCK_LICENSE } from '@testing/mocks/license.mock';
import { MOCK_PROJECT_METADATA } from '@testing/mocks/project-metadata.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { LicenseDialogComponent } from './license-dialog.component';

describe('LicenseDialogComponent', () => {
  let component: LicenseDialogComponent;
  let fixture: ComponentFixture<LicenseDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;
  let licensesLoadingSignal: WritableSignal<boolean>;

  const licenseWithoutFields: LicenseModel = {
    ...MOCK_LICENSE,
    id: 'license-simple',
    name: 'MIT',
    requiredFields: [],
  };

  const mockLicenseOptions: LicenseOptions = {
    copyrightHolders: 'John Doe',
    year: '2023',
  };

  interface SetupOverrides {
    dialogData?: {
      resourceType?: ResourceType;
      providerId?: string;
      metadata?: typeof MOCK_PROJECT_METADATA | null;
    };
    licenses?: LicenseModel[];
    licensesLoading?: boolean;
  }

  function setup(overrides: SetupOverrides = {}) {
    licensesLoadingSignal = signal(overrides.licensesLoading ?? false);

    TestBed.configureTestingModule({
      imports: [LicenseDialogComponent, ...MockComponents(LoadingSpinnerComponent, LicenseComponent)],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data: overrides.dialogData ?? {} }),
        provideMockStore({
          signals: [
            {
              selector: LicensesSelectors.getLicenses,
              value: overrides.licenses ?? [MOCK_LICENSE, licenseWithoutFields],
            },
            { selector: LicensesSelectors.getLoading, value: licensesLoadingSignal },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(LicenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should dispatch FetchLicenses on init with defaults', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchLicenses(ResourceType.Project, undefined));
  });

  it('should dispatch FetchLicenses with dialog resource type and provider', () => {
    setup({
      dialogData: {
        resourceType: ResourceType.Registration,
        providerId: 'provider-1',
      },
    });

    expect(store.dispatch).toHaveBeenCalledWith(new FetchLicenses(ResourceType.Registration, 'provider-1'));
  });

  it('should initialize selected license and options from metadata', () => {
    setup({
      dialogData: {
        metadata: {
          ...MOCK_PROJECT_METADATA,
          license: MOCK_LICENSE,
        },
      },
    });

    expect(component.selectedLicenseId()).toBe(MOCK_LICENSE.id);
    expect(component.initialLicenseOptions).toEqual({
      copyrightHolders: 'Test Author, Test University',
      year: '2024',
    });
  });

  it('should close dialog with license options when saving a valid required-fields license', () => {
    setup();
    const closeSpy = vi.spyOn(dialogRef, 'close');
    component.selectedLicenseId.set(MOCK_LICENSE.id);
    component.licenseState.set({
      licenseOptions: mockLicenseOptions,
      formInvalid: false,
    });

    expect(component.isSaveDisabled()).toBe(false);
    component.save();

    expect(closeSpy).toHaveBeenCalledWith({
      licenseId: MOCK_LICENSE.id,
      licenseOptions: mockLicenseOptions,
    });
  });

  it('should not save when required fields form is invalid', () => {
    setup();
    const closeSpy = vi.spyOn(dialogRef, 'close');
    component.selectedLicenseId.set(MOCK_LICENSE.id);
    component.licenseState.set({
      licenseOptions: { copyrightHolders: '', year: '' },
      formInvalid: true,
    });

    expect(component.isSaveDisabled()).toBe(true);
    component.save();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should close dialog when saving license without required fields', () => {
    setup();
    const closeSpy = vi.spyOn(dialogRef, 'close');
    component.selectedLicenseId.set(licenseWithoutFields.id);

    expect(component.isSaveDisabled()).toBe(false);
    component.save();

    expect(closeSpy).toHaveBeenCalledWith({
      licenseId: licenseWithoutFields.id,
      licenseOptions: undefined,
    });
  });

  it('should not save when no license is selected', () => {
    setup();
    const closeSpy = vi.spyOn(dialogRef, 'close');
    component.selectedLicenseId.set(null);

    expect(component.isSaveDisabled()).toBe(true);
    component.save();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should not save when selected license is not found', () => {
    setup();
    const closeSpy = vi.spyOn(dialogRef, 'close');
    component.selectedLicenseId.set('non-existent-license');

    expect(component.isSaveDisabled()).toBe(true);
    component.save();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should close dialog on cancel', () => {
    setup();
    const closeSpy = vi.spyOn(dialogRef, 'close');

    component.cancel();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should disable save while licenses are loading', () => {
    setup({ licensesLoading: true });

    expect(component.isSaveDisabled()).toBe(true);
  });

  it('should disable save when license and options are unchanged', () => {
    setup({
      dialogData: {
        metadata: {
          ...MOCK_PROJECT_METADATA,
          license: MOCK_LICENSE,
        },
      },
    });
    component.licenseState.set({
      licenseOptions: {
        copyrightHolders: 'Test Author, Test University',
        year: '2024',
      },
      formInvalid: false,
    });

    expect(component.isSaveDisabled()).toBe(true);
  });
});
