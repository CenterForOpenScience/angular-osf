import { MockComponent, MockProviders } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { AddContributorType } from '@osf/shared/enums/contributors/add-contributor-type.enum';
import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';
import { ContributorAddModel } from '@shared/models/contributors/contributor-add.model';

import { TextInputComponent } from '../../text-input/text-input.component';

import { AddUnregisteredContributorDialogComponent } from './add-unregistered-contributor-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('AddUnregisteredContributorDialogComponent', () => {
  let component: AddUnregisteredContributorDialogComponent;
  let fixture: ComponentFixture<AddUnregisteredContributorDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let closeSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUnregisteredContributorDialogComponent, OSFTestingModule, MockComponent(TextInputComponent)],
      providers: [MockProviders(DynamicDialogRef)],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUnregisteredContributorDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    closeSpy = jest.spyOn(dialogRef, 'close');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component['contributorForm']).toBeDefined();
    expect(component['contributorForm'].controls['fullName']).toBeDefined();
    expect(component['contributorForm'].controls['email']).toBeDefined();
  });

  it('should have inputLimits defined', () => {
    expect(component['inputLimits']).toBeDefined();
    expect(component['inputLimits']).toEqual(InputLimits);
  });

  it('should have dialogRef injected', () => {
    expect(component['dialogRef']).toBeDefined();
  });

  it('should have required validators on fullName', () => {
    const fullNameControl = component['contributorForm'].controls['fullName'];

    fullNameControl.setValue('');
    expect(fullNameControl.invalid).toBe(true);

    fullNameControl.setValue('   ');
    expect(fullNameControl.invalid).toBe(true);

    fullNameControl.setValue('John Doe');
    expect(fullNameControl.valid).toBe(true);
  });

  it('should have maxLength validator on fullName', () => {
    const fullNameControl = component['contributorForm'].controls['fullName'];
    const longName = 'a'.repeat(InputLimits.fullName.maxLength + 1);

    fullNameControl.setValue(longName);
    expect(fullNameControl.invalid).toBe(true);
  });

  it('should have required validators on email', () => {
    const emailControl = component['contributorForm'].controls['email'];

    emailControl.setValue('');
    expect(emailControl.invalid).toBe(true);

    emailControl.setValue('   ');
    expect(emailControl.invalid).toBe(true);
  });

  it('should have email validator on email', () => {
    const emailControl = component['contributorForm'].controls['email'];

    emailControl.setValue('invalid-email');
    expect(emailControl.invalid).toBe(true);

    emailControl.setValue('valid@email.com');
    expect(emailControl.valid).toBe(true);
  });

  it('should have maxLength validator on email', () => {
    const emailControl = component['contributorForm'].controls['email'];
    const longEmail = 'a'.repeat(InputLimits.email.maxLength + 1) + '@example.com';

    emailControl.setValue(longEmail);
    expect(emailControl.invalid).toBe(true);
  });

  it('should add registered contributor', () => {
    component['addRegistered']();

    expect(closeSpy).toHaveBeenCalledWith({
      data: [],
      type: AddContributorType.Registered,
    });
  });

  it('should submit form with valid data', () => {
    const formData = {
      fullName: 'John Doe',
      email: 'john@example.com',
    };

    component['contributorForm'].patchValue(formData);

    component['submit']();

    const expectedContributor: ContributorAddModel = {
      fullName: 'John Doe',
      email: 'john@example.com',
      isBibliographic: true,
      permission: ContributorPermission.Write,
    };

    expect(closeSpy).toHaveBeenCalledWith({
      data: [expectedContributor],
      type: AddContributorType.Unregistered,
    });
  });

  it('should not submit form with invalid data', () => {
    component['contributorForm'].patchValue({
      fullName: '',
      email: 'invalid-email',
    });

    component['submit']();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should not submit form with empty data', () => {
    component['contributorForm'].patchValue({
      fullName: '',
      email: '',
    });

    component['submit']();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should handle form with valid data', () => {
    const validData = {
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
    };

    component['contributorForm'].patchValue(validData);
    fixture.detectChanges();

    expect(component['contributorForm'].valid).toBe(true);
    expect(component['contributorForm'].value.fullName).toBe('Jane Smith');
    expect(component['contributorForm'].value.email).toBe('jane.smith@example.com');
  });

  it('should handle form with spaces in data', () => {
    const dataWithSpaces = {
      fullName: '   John Doe   ',
      email: '   john@example.com   ',
    };

    component['contributorForm'].patchValue(dataWithSpaces);
    fixture.detectChanges();

    expect(component['contributorForm'].invalid).toBe(true);
  });

  it('should handle form reset', () => {
    component['contributorForm'].patchValue({
      fullName: 'Test User',
      email: 'test@example.com',
    });

    component['contributorForm'].reset();

    expect(component['contributorForm'].value.fullName).toBe('');
    expect(component['contributorForm'].value.email).toBe('');
    expect(component['contributorForm'].invalid).toBe(true);
  });
});
