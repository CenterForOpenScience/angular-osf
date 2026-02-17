import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaActionTrigger } from '@osf/features/registries/enums';
import { HandleSchemaResponse } from '@osf/features/registries/store';

import { ConfirmContinueEditingDialogComponent } from './confirm-continue-editing-dialog.component';

import { provideDynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ConfirmContinueEditingDialogComponent', () => {
  let component: ConfirmContinueEditingDialogComponent;
  let fixture: ComponentFixture<ConfirmContinueEditingDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;

  const MOCK_REVISION_ID = 'test-revision-id';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmContinueEditingDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        // MockProvider(DynamicDialogRef),
        MockProvider(DynamicDialogConfig, { data: { revisionId: MOCK_REVISION_ID } }),
        provideMockStore(),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(ConfirmContinueEditingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isSubmitting as false', () => {
    expect(component.isSubmitting).toBe(false);
  });

  it('should dispatch handleSchemaResponse with comment on submit', () => {
    component.form.patchValue({ comment: 'Test comment' });

    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(
      new HandleSchemaResponse(MOCK_REVISION_ID, SchemaActionTrigger.AdminReject, 'Test comment')
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should dispatch handleSchemaResponse with empty comment on submit', () => {
    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(
      new HandleSchemaResponse(MOCK_REVISION_ID, SchemaActionTrigger.AdminReject, '')
    );
  });

  it('should update comment value', () => {
    component.form.patchValue({ comment: 'New comment' });
    expect(component.form.get('comment')?.value).toBe('New comment');
  });
});
