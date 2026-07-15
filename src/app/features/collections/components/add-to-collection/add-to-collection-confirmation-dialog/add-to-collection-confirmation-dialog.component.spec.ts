import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of, throwError } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollectionSubmission } from '@osf/features/collections/store/add-to-collection/add-to-collection.actions';
import {
  CedarMetadataAttributes,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
} from '@osf/features/metadata/models';
import { CreateCedarMetadataRecord, UpdateCedarMetadataRecord } from '@osf/features/metadata/store';
import { UpdateProjectPublicStatus } from '@osf/features/project/overview/store';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CollectionSubmissionPayload } from '@osf/shared/models/collections/collection-submission-payload.model';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { AddToCollectionConfirmationDialogComponent } from './add-to-collection-confirmation-dialog.component';

const MOCK_CEDAR_DATA: CedarRecordDataBinding = {
  data: { '@context': {} } as CedarMetadataAttributes,
  id: 'template-1',
  isPublished: true,
};

const MOCK_EXISTING_CEDAR_RECORD: CedarMetadataRecordData = {
  id: 'cedar-record-1',
  attributes: { metadata: {} as CedarMetadataAttributes, is_published: true },
  relationships: {
    template: { data: { type: 'cedar-metadata-templates', id: 'template-1' } },
    target: { data: { type: 'nodes', id: 'project-1' } },
  },
};

describe('AddToCollectionConfirmationDialogComponent', () => {
  let component: AddToCollectionConfirmationDialogComponent;
  let fixture: ComponentFixture<AddToCollectionConfirmationDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;
  let toastService: ToastServiceMockType;
  let dialogConfig: {
    data: {
      payload?: CollectionSubmissionPayload;
      project?: { id: string; isPublic: boolean };
      cedarData?: CedarRecordDataBinding | null;
      existingCedarRecord?: CedarMetadataRecordData | null;
    };
  };

  const MOCK_PAYLOAD: CollectionSubmissionPayload = {
    collectionId: 'collection-1',
    projectId: 'project-1',
    userId: 'user-1',
  };

  beforeEach(() => {
    toastService = ToastServiceMock.simple();
    dialogConfig = {
      data: {
        payload: MOCK_PAYLOAD,
        project: { id: 'project-1', isPublic: false },
        cedarData: null,
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

  it('should update project public status then create submission when project is private and no Cedar data', () => {
    vi.spyOn(store, 'dispatch').mockReturnValue(of(void 0));

    component.handleAddToCollectionConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateProjectPublicStatus([{ id: 'project-1', public: true }]));
    expect(store.dispatch).toHaveBeenCalledWith(new CreateCollectionSubmission(MOCK_PAYLOAD));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CreateCedarMetadataRecord));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
    expect(toastService.showSuccess).toHaveBeenCalledWith('collections.addToCollection.confirmationDialogToastMessage');
    expect(component.isSubmitting()).toBe(false);
  });

  it('should skip public status update when project is already public', () => {
    dialogConfig.data.project = { id: 'project-1', isPublic: true };
    vi.spyOn(store, 'dispatch').mockReturnValue(of(void 0));

    component.handleAddToCollectionConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new CreateCollectionSubmission(MOCK_PAYLOAD));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateProjectPublicStatus));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should create Cedar record before submission when cedarData is present and no existing record', () => {
    dialogConfig.data.cedarData = MOCK_CEDAR_DATA;
    vi.spyOn(store, 'dispatch').mockReturnValue(of(void 0));

    component.handleAddToCollectionConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(
      new CreateCedarMetadataRecord(MOCK_CEDAR_DATA, 'project-1', ResourceType.Project)
    );
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateCedarMetadataRecord));
    expect(store.dispatch).toHaveBeenCalledWith(new CreateCollectionSubmission(MOCK_PAYLOAD));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should update existing Cedar record instead of creating when existingCedarRecord is provided', () => {
    dialogConfig.data.cedarData = MOCK_CEDAR_DATA;
    dialogConfig.data.existingCedarRecord = MOCK_EXISTING_CEDAR_RECORD;
    vi.spyOn(store, 'dispatch').mockReturnValue(of(void 0));

    component.handleAddToCollectionConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateCedarMetadataRecord(MOCK_CEDAR_DATA, 'cedar-record-1', 'project-1', ResourceType.Project)
    );
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CreateCedarMetadataRecord));
    expect(store.dispatch).toHaveBeenCalledWith(new CreateCollectionSubmission(MOCK_PAYLOAD));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should not create Cedar record when cedarData is null', () => {
    dialogConfig.data.cedarData = null;
    vi.spyOn(store, 'dispatch').mockReturnValue(of(void 0));

    component.handleAddToCollectionConfirm();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CreateCedarMetadataRecord));
    expect(store.dispatch).toHaveBeenCalledWith(new CreateCollectionSubmission(MOCK_PAYLOAD));
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

  it('should reset submitting state on Cedar record creation error', () => {
    dialogConfig.data.cedarData = MOCK_CEDAR_DATA;
    vi.spyOn(store, 'dispatch').mockImplementation((action) => {
      if (action instanceof CreateCedarMetadataRecord) {
        return throwError(() => new Error('cedar fail'));
      }
      return of(void 0);
    });

    component.handleAddToCollectionConfirm();

    expect(component.isSubmitting()).toBe(false);
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });
});
