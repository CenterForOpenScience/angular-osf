import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitType } from '@osf/features/registries/enums';
import { RegistriesSelectors } from '@osf/features/registries/store';

import { ConfirmRegistrationDialogComponent } from './confirm-registration-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ConfirmRegistrationDialogComponent', () => {
  let component: ConfirmRegistrationDialogComponent;
  let fixture: ComponentFixture<ConfirmRegistrationDialogComponent>;
  let mockDialogRef: DynamicDialogRef;
  let mockDialogConfig: jest.Mocked<DynamicDialogConfig>;

  const MOCK_CONFIG_DATA = {
    draftId: 'draft-1',
    providerId: 'provider-1',
    projectId: 'project-1',
    components: [],
  };

  beforeEach(async () => {
    mockDialogRef = { close: jest.fn() } as any;
    mockDialogConfig = { data: { ...MOCK_CONFIG_DATA } } as any;

    await TestBed.configureTestingModule({
      imports: [ConfirmRegistrationDialogComponent, OSFTestingModule],
      providers: [
        MockProvider(DynamicDialogRef, mockDialogRef),
        MockProvider(DynamicDialogConfig, mockDialogConfig),
        provideMockStore({
          signals: [{ selector: RegistriesSelectors.isRegistrationSubmitting, value: false }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmRegistrationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have required controls and default state', () => {
    expect(component.form.get('submitOption')).toBeDefined();
    expect(component.form.get('embargoDate')).toBeDefined();
    expect(component.showDateControl).toBe(false);
    expect(component.SubmitType).toBe(SubmitType);
  });

  it('should enable embargoDate when SubmitType.Embargo selected', () => {
    const embargoControl = component.form.get('embargoDate');
    expect(embargoControl?.disabled).toBe(true);

    component.form.get('submitOption')?.setValue(SubmitType.Embargo);

    expect(component.showDateControl).toBe(true);
    expect(embargoControl?.enabled).toBe(true);
  });

  it('should disable embargoDate when non-Embargo selected', () => {
    component.form.get('submitOption')?.setValue(SubmitType.Embargo);
    component.form.get('submitOption')?.setValue(SubmitType.Public);

    const embargoControl = component.form.get('embargoDate');
    expect(component.showDateControl).toBe(false);
    expect(embargoControl?.disabled).toBe(true);
    expect(embargoControl?.value).toBeNull();
  });

  it('should submit with immediate option and close dialog', () => {
    const mockActions = {
      registerDraft: jest.fn().mockReturnValue(of({})),
    };
    Object.defineProperty(component, 'actions', { value: mockActions, writable: true });

    component.form.get('submitOption')?.setValue(SubmitType.Public);
    component.submit();

    expect(mockActions.registerDraft).toHaveBeenCalledWith(
      MOCK_CONFIG_DATA.draftId,
      '',
      MOCK_CONFIG_DATA.providerId,
      MOCK_CONFIG_DATA.projectId,
      MOCK_CONFIG_DATA.components
    );
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should submit with embargo and include ISO embargoDate', () => {
    const mockActions = {
      registerDraft: jest.fn().mockReturnValue(of({})),
    };
    Object.defineProperty(component, 'actions', { value: mockActions, writable: true });

    const date = new Date('2025-01-01T00:00:00Z');
    component.form.get('submitOption')?.setValue(SubmitType.Embargo);
    component.form.get('embargoDate')?.setValue(date);

    component.submit();

    expect(mockActions.registerDraft).toHaveBeenCalledWith(
      MOCK_CONFIG_DATA.draftId,
      date.toISOString(),
      MOCK_CONFIG_DATA.providerId,
      MOCK_CONFIG_DATA.projectId,
      MOCK_CONFIG_DATA.components
    );
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });
});
