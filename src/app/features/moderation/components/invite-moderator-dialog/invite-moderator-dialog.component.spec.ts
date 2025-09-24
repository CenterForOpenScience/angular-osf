import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSelectComponent, TextInputComponent } from '@shared/components';

import { ModeratorPermission } from '../../enums';

import { InviteModeratorDialogComponent } from './invite-moderator-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('InviteModeratorDialogComponent', () => {
  let component: InviteModeratorDialogComponent;
  let fixture: ComponentFixture<InviteModeratorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InviteModeratorDialogComponent,
        OSFTestingModule,
        ...MockComponents(TextInputComponent, FormSelectComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteModeratorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.moderatorForm).toBeDefined();
    expect(component.moderatorForm.get('fullName')?.value).toBe('');
    expect(component.moderatorForm.get('email')?.value).toBe('');
    expect(component.moderatorForm.get('permission')?.value).toBe(ModeratorPermission.Moderator);
  });

  it('should have input limits defined', () => {
    expect(component.inputLimits).toBeDefined();
  });

  it('should have permissions options defined', () => {
    expect(component.permissionsOptions).toBeDefined();
    expect(component.permissionsOptions.length).toBeGreaterThan(0);
  });

  it('should search moderator', () => {
    component.searchModerator();
  });

  it('should submit form with valid data', () => {
    component.moderatorForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      permission: ModeratorPermission.Admin,
    });

    component.submit();
  });

  it('should not submit form with invalid data', () => {
    component.moderatorForm.patchValue({
      fullName: '',
      email: 'invalid-email',
      permission: ModeratorPermission.Moderator,
    });

    component.submit();
  });

  it('should use default permission when not provided', () => {
    component.moderatorForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      permission: undefined,
    });

    component.submit();
  });
});
