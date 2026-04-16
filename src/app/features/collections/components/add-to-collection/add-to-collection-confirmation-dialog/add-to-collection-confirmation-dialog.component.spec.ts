import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of, throwError } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollectionSubmission } from '@osf/features/collections/store/add-to-collection/add-to-collection.actions';
import { UpdateProjectPublicStatus } from '@osf/features/project/overview/store';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { AddToCollectionConfirmationDialogComponent } from './add-to-collection-confirmation-dialog.component';

describe('AddToCollectionConfirmationDialogComponent', () => {
  let component: AddToCollectionConfirmationDialogComponent;
  let fixture: ComponentFixture<AddToCollectionConfirmationDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;
  let toastService: ToastServiceMockType;
  let dialogConfig: { data: { payload?: unknown; project?: { id: string; isPublic: boolean } } };

  beforeEach(() => {
    toastService = ToastServiceMock.simple();
    dialogConfig = {
      data: {
        payload: { title: 'Submission' },
        project: { id: 'project-1', isPublic: false },
      },
    };

    TestBed.configureTestingModule({
      imports: [AddToCollectionConfirmationDialogComponent],
      providers: [
        provideOSFCore(),
        provideMockStore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, dialogConfig),
        MockProvider(ToastService, toastService),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(AddToCollectionConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return early when payload or project is missing', () => {
    vi.spyOn(store, 'dispatch');
    dialogConfig.data.payload = undefined;

    component.handleAddToCollectionConfirm();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should update project public status and create submission when project is private', () => {
    vi.spyOn(store, 'dispatch').mockReturnValue(of(void 0));

    component.handleAddToCollectionConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateProjectPublicStatus([{ id: 'project-1', public: true }]));
    expect(store.dispatch).toHaveBeenCalledWith(new CreateCollectionSubmission({ title: 'Submission' } as any));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
    expect(toastService.showSuccess).toHaveBeenCalledWith('collections.addToCollection.confirmationDialogToastMessage');
    expect(component.isSubmitting()).toBe(false);
  });

  it('should skip public status update when project is already public', () => {
    dialogConfig.data.project = { id: 'project-1', isPublic: true };
    vi.spyOn(store, 'dispatch').mockReturnValue(of(void 0));

    component.handleAddToCollectionConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new CreateCollectionSubmission({ title: 'Submission' } as any));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateProjectPublicStatus));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should reset submitting state on error', () => {
    vi.spyOn(store, 'dispatch').mockImplementation((action) => {
      if (action instanceof CreateCollectionSubmission) {
        return throwError(() => new Error('fail'));
      }
      return of(void 0);
    });

    component.handleAddToCollectionConfirm();

    expect(component.isSubmitting()).toBe(false);
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });
});
