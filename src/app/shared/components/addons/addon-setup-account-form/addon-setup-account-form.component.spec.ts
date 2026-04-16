import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { provideRouter } from '@angular/router';

import { AddonFormControls } from '@osf/shared/enums/addon-form-controls.enum';
import { AddonFormService } from '@shared/services/addons/addon-form.service';

import { MOCK_ADDON } from '@testing/mocks/addon.mock';
import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { AddonSetupAccountFormComponent } from './addon-setup-account-form.component';

describe('AddonSetupAccountFormComponent', () => {
  let component: AddonSetupAccountFormComponent;
  let fixture: ComponentFixture<AddonSetupAccountFormComponent>;
  let addonFormService: AddonFormService;

  const mockAddonFormService = {
    initializeForm: vi.fn(),
    generateAuthorizedAddonPayload: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddonSetupAccountFormComponent],
      providers: [provideOSFCore(), provideRouter([]), MockProvider(AddonFormService, mockAddonFormService)],
    });

    fixture = TestBed.createComponent(AddonSetupAccountFormComponent);
    component = fixture.componentInstance;
    addonFormService = TestBed.inject(AddonFormService);

    fixture.componentRef.setInput('addon', MOCK_ADDON);
    fixture.componentRef.setInput('userReferenceId', MOCK_USER.id);
    fixture.componentRef.setInput('addonTypeString', 'storage');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit formSubmit event when handleSubmit is called with valid form (if true)', () => {
    const mockPayload = { data: { id: 'test' } };
    const mockForm = new FormGroup({
      [AddonFormControls.AccountName]: new FormControl('Test Account'),
      [AddonFormControls.AccessKey]: new FormControl('test-key'),
      [AddonFormControls.SecretKey]: new FormControl('test-secret'),
    });

    vi.spyOn(addonFormService, 'initializeForm').mockReturnValue(mockForm as any);
    vi.spyOn(addonFormService, 'generateAuthorizedAddonPayload').mockReturnValue(mockPayload as any);

    const formSubmitSpy = vi.spyOn(component.formSubmit, 'emit');

    (component as any).handleSubmit();

    expect(addonFormService.generateAuthorizedAddonPayload).toHaveBeenCalledWith(
      mockForm.value,
      MOCK_ADDON,
      MOCK_USER.id,
      'storage'
    );
    expect(formSubmitSpy).toHaveBeenCalledWith(mockPayload);
  });

  it('should not emit formSubmit event when handleSubmit is called with invalid form (if false)', () => {
    const mockForm = new FormGroup({
      [AddonFormControls.AccountName]: new FormControl('Test Account'),
      [AddonFormControls.AccessKey]: new FormControl('test-key'),
      [AddonFormControls.SecretKey]: new FormControl('test-secret'),
    });
    mockForm.setErrors({ invalid: true });

    vi.spyOn(addonFormService, 'initializeForm').mockReturnValue(mockForm as any);
    const formSubmitSpy = vi.spyOn(component.formSubmit, 'emit');

    (component as any).handleSubmit();

    expect(formSubmitSpy).not.toHaveBeenCalled();
  });

  it('should emit backClick event when handleBack is called', () => {
    const backClickSpy = vi.spyOn(component.backClick, 'emit');

    (component as any).handleBack();

    expect(backClickSpy).toHaveBeenCalled();
  });
});
