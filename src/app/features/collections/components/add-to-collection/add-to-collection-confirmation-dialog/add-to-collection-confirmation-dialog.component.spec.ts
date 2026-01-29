import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of, throwError } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@osf/shared/services/toast.service';

import { AddToCollectionConfirmationDialogComponent } from './add-to-collection-confirmation-dialog.component';

import { MOCK_PROJECT } from '@testing/mocks/project.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AddToCollectionConfirmationDialogComponent', () => {
  let component: AddToCollectionConfirmationDialogComponent;
  let fixture: ComponentFixture<AddToCollectionConfirmationDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let toastService: jest.Mocked<ToastService>;
  let configData: { payload?: any; project?: any };
  let updateProjectPublicStatus: jest.Mock;
  let createCollectionSubmission: jest.Mock;

  beforeEach(async () => {
    dialogRef = { close: jest.fn() } as any;
    toastService = { showSuccess: jest.fn() } as any;
    configData = {
      payload: {
        collectionId: 'collection-1',
        projectId: 'project-1',
        collectionMetadata: { title: 'Test Collection' },
        userId: 'user-1',
      },
      project: { ...MOCK_PROJECT, isPublic: false, id: 'project-1' },
    };
    updateProjectPublicStatus = jest.fn().mockReturnValue(of(null));
    createCollectionSubmission = jest.fn().mockReturnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [AddToCollectionConfirmationDialogComponent, OSFTestingModule],
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRef },
        { provide: ToastService, useValue: toastService },
        { provide: DynamicDialogConfig, useValue: { data: configData } },
        provideMockStore({ signals: [] }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToCollectionConfirmationDialogComponent);
    component = fixture.componentInstance;
    component.actions = {
      updateProjectPublicStatus,
      createCollectionSubmission,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch updates and close on confirm when project is private', () => {
    component.handleAddToCollectionConfirm();

    expect(updateProjectPublicStatus).toHaveBeenCalledWith([{ id: 'project-1', public: true }]);
    expect(createCollectionSubmission).toHaveBeenCalledWith(configData.payload);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
    expect(toastService.showSuccess).toHaveBeenCalledWith('collections.addToCollection.confirmationDialogToastMessage');
    expect(component.isSubmitting()).toBe(false);
  });

  it('should skip public status update when project already public', () => {
    configData.project.isPublic = true;
    updateProjectPublicStatus.mockClear();

    component.handleAddToCollectionConfirm();

    expect(updateProjectPublicStatus).not.toHaveBeenCalled();
    expect(createCollectionSubmission).toHaveBeenCalledWith(configData.payload);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should do nothing when payload or project is missing', () => {
    configData.payload = undefined;
    component.handleAddToCollectionConfirm();

    expect(updateProjectPublicStatus).not.toHaveBeenCalled();
    expect(createCollectionSubmission).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should reset submitting state and not close on error', () => {
    createCollectionSubmission.mockReturnValue(throwError(() => new Error('fail')));

    component.handleAddToCollectionConfirm();

    expect(component.isSubmitting()).toBe(false);
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });
});
