import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseComponent, LoadingSpinnerComponent } from '@shared/components';
import { LicensesSelectors } from '@shared/stores/licenses';

import { LicenseDialogComponent } from './license-dialog.component';

import { MOCK_LICENSE } from '@testing/mocks';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('LicenseDialogComponent', () => {
  let component: LicenseDialogComponent;
  let fixture: ComponentFixture<LicenseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseDialogComponent, OSFTestingModule, ...MockComponents(LoadingSpinnerComponent, LicenseComponent)],
      providers: [
        MockProvider(DynamicDialogRef),
        MockProvider(DynamicDialogConfig),
        provideMockStore({
          signals: [
            { selector: LicensesSelectors.getLicenses, value: [MOCK_LICENSE] },
            { selector: LicensesSelectors.getLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LicenseDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle license selection', () => {
    component.onSelectLicense(MOCK_LICENSE);

    expect(component.selectedLicenseId()).toBe(MOCK_LICENSE.id);
  });

  it('should handle license creation with non-existent license', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    const createEvent = {
      id: 'non-existent-license',
      licenseOptions: { copyrightHolders: 'John Doe', year: '2023' },
    };

    component.onCreateLicense(createEvent);

    expect(closeSpy).not.toHaveBeenCalled();
    expect(component.isSubmitting()).toBe(false);
  });

  it('should handle save with license that has required fields', () => {
    component.selectedLicenseId.set(MOCK_LICENSE.id);

    const mockLicenseComponent = {
      selectedLicense: () => MOCK_LICENSE,
      licenseForm: { invalid: false },
      saveLicense: jest.fn(),
    };

    Object.defineProperty(component, 'licenseComponent', {
      get: () => () => mockLicenseComponent,
    });

    component.save();

    expect(mockLicenseComponent.saveLicense).toHaveBeenCalled();
    expect(component.isSubmitting()).toBe(true);
  });

  it('should not save when no license is selected', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.selectedLicenseId.set(null);

    component.save();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should not save when selected license is not found', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.selectedLicenseId.set('non-existent-license');

    component.save();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should handle cancel', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    const mockLicenseComponent = {
      cancel: jest.fn(),
    };

    Object.defineProperty(component, 'licenseComponent', {
      get: () => () => mockLicenseComponent,
    });

    component.cancel();

    expect(mockLicenseComponent.cancel).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should handle cancel when license component is not available', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    Object.defineProperty(component, 'licenseComponent', {
      get: () => () => null,
    });

    component.cancel();

    expect(closeSpy).toHaveBeenCalled();
  });
});
