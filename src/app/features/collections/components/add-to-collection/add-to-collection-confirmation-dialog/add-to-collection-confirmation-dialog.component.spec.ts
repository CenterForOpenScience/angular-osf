import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@osf/shared/services/toast.service';

import { AddToCollectionConfirmationDialogComponent } from './add-to-collection-confirmation-dialog.component';

import { MOCK_PROJECT } from '@testing/mocks/project.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('AddToCollectionConfirmationDialogComponent', () => {
  let component: AddToCollectionConfirmationDialogComponent;
  let fixture: ComponentFixture<AddToCollectionConfirmationDialogComponent>;
  let mockDialogRef: DynamicDialogRef;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;

  const mockPayload = {
    collectionId: 'collection-1',
    projectId: 'project-1',
    collectionMetadata: { title: 'Test Collection' },
    userId: 'user-1',
  };

  const mockProject = MOCK_PROJECT;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as any;

    toastServiceMock = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [AddToCollectionConfirmationDialogComponent, OSFTestingModule],
      providers: [
        MockProvider(DynamicDialogRef, mockDialogRef),
        MockProvider(ToastService, toastServiceMock),
        MockProvider(DynamicDialogConfig, {
          data: {
            payload: mockPayload,
            project: mockProject,
          },
        }),
        provideMockStore({
          signals: [],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToCollectionConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with dialog data', () => {
    expect(component.config.data.payload).toEqual(mockPayload);
    expect(component.config.data.project).toEqual(mockProject);
  });

  it('should handle add to collection confirmation', () => {
    component.handleAddToCollectionConfirm();

    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should have config data', () => {
    expect(component.config.data.payload).toBeDefined();
    expect(component.config.data.payload.collectionId).toBe('collection-1');
    expect(component.config.data.payload.projectId).toBe('project-1');
    expect(component.config.data.payload.userId).toBe('user-1');
  });

  it('should have project data in config', () => {
    expect(component.config.data.project).toBeDefined();
    expect(component.config.data.project.id).toBe('project-1');
    expect(component.config.data.project.title).toBe('Test Project');
    expect(component.config.data.project.isPublic).toBe(true);
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.createCollectionSubmission).toBeDefined();
    expect(component.actions.updateProjectPublicStatus).toBeDefined();
  });

  it('should have isSubmitting signal', () => {
    expect(component.isSubmitting()).toBe(false);
  });
});
