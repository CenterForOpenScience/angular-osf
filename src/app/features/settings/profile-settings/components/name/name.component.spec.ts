import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileSettingsUser, UserSelectors } from '@core/store/user';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { CitationPreviewComponent } from '../citation-preview/citation-preview.component';
import { NameFormComponent } from '../name-form/name-form.component';

import { NameComponent } from './name.component';

import { MockCustomConfirmationServiceProvider } from '@testing/mocks/custom-confirmation.service.mock';
import { MOCK_USER } from '@testing/mocks/data.mock';

describe('NameComponent', () => {
  let component: NameComponent;
  let fixture: ComponentFixture<NameComponent>;
  let customConfirmationService: CustomConfirmationService;

  const mockStore = {
    selectSignal: jest.fn().mockImplementation((selector) => {
      if (selector === UserSelectors.getUserNames) {
        return () => MOCK_USER;
      }
      return () => null;
    }),
    dispatch: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [NameComponent, MockPipe(TranslatePipe), ...MockComponents(CitationPreviewComponent, NameFormComponent)],
      providers: [
        MockCustomConfirmationServiceProvider,
        MockProvider(ToastService),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(TranslatePipe),
        MockProvider(Store, mockStore),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NameComponent);
    component = fixture.componentInstance;
    customConfirmationService = TestBed.inject(CustomConfirmationService);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not proceed when form is invalid', () => {
    component.form.get('fullName')?.setValue('');
    component.form.get('fullName')?.setErrors({ required: true });

    component.saveChanges();

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch updateProfileSettingsUser action with correct data', () => {
    const formData = {
      fullName: 'John Doe',
      givenName: 'John',
      middleNames: 'Alexander',
      familyName: 'Doe',
      suffix: 'Jr.',
    };

    component.form.patchValue(formData);

    component.saveChanges();

    expect(mockStore.dispatch).toHaveBeenCalledWith(new UpdateProfileSettingsUser(formData));
  });

  it('should reset form to current user data', () => {
    component.form.patchValue({
      fullName: 'Changed Name',
      givenName: 'Changed',
      middleNames: 'Changed',
      familyName: 'Changed',
      suffix: 'Changed',
    });

    jest.spyOn(customConfirmationService, 'confirmDelete').mockImplementation(({ onConfirm }) => {
      onConfirm();
    });

    component.discardChanges();

    expect(component.form.get('fullName')?.value).toBe(MOCK_USER.fullName);
    expect(component.form.get('givenName')?.value).toBe(MOCK_USER.givenName);
    expect(component.form.get('middleNames')?.value).toBe(MOCK_USER.middleNames);
    expect(component.form.get('familyName')?.value).toBe(MOCK_USER.familyName);
    expect(component.form.get('suffix')?.value).toBe(MOCK_USER.suffix);
  });
});
