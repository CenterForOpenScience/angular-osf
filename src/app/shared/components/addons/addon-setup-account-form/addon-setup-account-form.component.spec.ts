import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { AddonFormControls } from '@osf/shared/enums/addon-form-controls.enum';
import { AddonFormService } from '@shared/services/addons/addon-form.service';

import { AddonSetupAccountFormComponent } from './addon-setup-account-form.component';

import { MOCK_ADDON } from '@testing/mocks/addon.mock';
import { MOCK_USER } from '@testing/mocks/data.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('AddonSetupAccountFormComponent', () => {
  let component: AddonSetupAccountFormComponent;
  let fixture: ComponentFixture<AddonSetupAccountFormComponent>;
  let addonFormService: AddonFormService;

  const mockAddonFormService = {
    initializeForm: jest.fn(),
    generateAuthorizedAddonPayload: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonSetupAccountFormComponent, OSFTestingModule],
      providers: [MockProvider(AddonFormService, mockAddonFormService)],
    }).compileComponents();

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

    jest.spyOn(addonFormService, 'initializeForm').mockReturnValue(mockForm as any);
    jest.spyOn(addonFormService, 'generateAuthorizedAddonPayload').mockReturnValue(mockPayload as any);

    const formSubmitSpy = jest.spyOn(component.formSubmit, 'emit');

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

    jest.spyOn(addonFormService, 'initializeForm').mockReturnValue(mockForm as any);
    const formSubmitSpy = jest.spyOn(component.formSubmit, 'emit');

    (component as any).handleSubmit();

    expect(formSubmitSpy).not.toHaveBeenCalled();
  });

  it('should emit backClick event when handleBack is called', () => {
    const backClickSpy = jest.spyOn(component.backClick, 'emit');

    (component as any).handleBack();

    expect(backClickSpy).toHaveBeenCalled();
  });
});
