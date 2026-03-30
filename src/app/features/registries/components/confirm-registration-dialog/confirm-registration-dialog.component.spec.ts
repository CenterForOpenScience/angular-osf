import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { throwError } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitType } from '@osf/features/registries/enums';
import { RegisterDraft, RegistriesSelectors } from '@osf/features/registries/store';

import { ConfirmRegistrationDialogComponent } from './confirm-registration-dialog.component';

import { provideDynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ConfirmRegistrationDialogComponent', () => {
  let component: ConfirmRegistrationDialogComponent;
  let fixture: ComponentFixture<ConfirmRegistrationDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;

  const MOCK_CONFIG_DATA = {
    draftId: 'draft-1',
    providerId: 'provider-1',
    projectId: 'project-1',
    components: [] as string[],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmRegistrationDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data: { ...MOCK_CONFIG_DATA } }),
        provideMockStore({
          signals: [{ selector: RegistriesSelectors.isRegistrationSubmitting, value: false }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
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

  it('should dispatch registerDraft with immediate option and close dialog', () => {
    component.form.get('submitOption')?.setValue(SubmitType.Public);

    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(
      new RegisterDraft(
        MOCK_CONFIG_DATA.draftId,
        '',
        MOCK_CONFIG_DATA.providerId,
        MOCK_CONFIG_DATA.projectId,
        MOCK_CONFIG_DATA.components
      )
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should dispatch registerDraft with embargo and include ISO embargoDate', () => {
    const date = new Date('2025-01-01T00:00:00Z');
    component.form.get('submitOption')?.setValue(SubmitType.Embargo);
    component.form.get('embargoDate')?.setValue(date);

    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(
      new RegisterDraft(
        MOCK_CONFIG_DATA.draftId,
        date.toISOString(),
        MOCK_CONFIG_DATA.providerId,
        MOCK_CONFIG_DATA.projectId,
        MOCK_CONFIG_DATA.components
      )
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should return a date 3 days in the future for minEmbargoDate', () => {
    const expected = new Date();
    expected.setDate(expected.getDate() + 3);

    const result = component.minEmbargoDate();

    expect(result.getFullYear()).toBe(expected.getFullYear());
    expect(result.getMonth()).toBe(expected.getMonth());
    expect(result.getDate()).toBe(expected.getDate());
  });

  it('should re-enable form on submit error', () => {
    (store.dispatch as jest.Mock).mockReturnValueOnce(throwError(() => new Error('fail')));

    component.form.get('submitOption')?.setValue(SubmitType.Public);
    component.submit();

    expect(component.form.enabled).toBe(true);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
