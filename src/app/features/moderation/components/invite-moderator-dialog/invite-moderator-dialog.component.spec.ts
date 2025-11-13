import { MockComponents } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSelectComponent } from '@osf/shared/components/form-select/form-select.component';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { ModeratorPermission } from '../../enums';

import { InviteModeratorDialogComponent } from './invite-moderator-dialog.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('InviteModeratorDialogComponent', () => {
  let component: InviteModeratorDialogComponent;
  let fixture: ComponentFixture<InviteModeratorDialogComponent>;
  let mockDialogRef: jest.Mocked<DynamicDialogRef>;

  beforeEach(async () => {
    mockDialogRef = DynamicDialogRefMock.useValue as unknown as jest.Mocked<DynamicDialogRef>;

    await TestBed.configureTestingModule({
      imports: [
        InviteModeratorDialogComponent,
        OSFTestingModule,
        ...MockComponents(TextInputComponent, FormSelectComponent),
      ],
      providers: [DynamicDialogRefMock],
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

  it('should search moderator and close dialog', () => {
    component.searchModerator();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      data: [],
      type: 1,
    });
  });

  it('should submit form with valid data and close dialog', () => {
    component.moderatorForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      permission: ModeratorPermission.Admin,
    });

    component.submit();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      data: [
        {
          fullName: 'John Doe',
          email: 'john@example.com',
          permission: ModeratorPermission.Admin,
        },
      ],
      type: 2,
    });
  });

  it('should not submit form with invalid data', () => {
    component.moderatorForm.patchValue({
      fullName: '',
      email: 'invalid-email',
      permission: ModeratorPermission.Moderator,
    });

    component.submit();

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should use default permission when not provided', () => {
    component.moderatorForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      permission: undefined,
    });

    component.submit();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      data: [
        {
          fullName: 'John Doe',
          email: 'john@example.com',
          permission: ModeratorPermission.Moderator,
        },
      ],
      type: 2,
    });
  });
});
