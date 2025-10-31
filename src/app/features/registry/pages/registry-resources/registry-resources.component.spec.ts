import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MetadataSelectors } from '@osf/features/metadata/store';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { RegistryResourcesSelectors } from '../../store/registry-resources';

import { RegistryResourcesComponent } from './registry-resources.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('RegistryResourcesComponent', () => {
  let component: RegistryResourcesComponent;
  let fixture: ComponentFixture<RegistryResourcesComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let mockCustomConfirmationService: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let mockToastService: ReturnType<ToastServiceMockBuilder['build']>;

  const mockRegistryId = 'test-registry-id';
  const mockRegistry = {
    currentUserPermissions: [UserPermissions.Write],
    identifiers: [{ id: 'test-id' }],
  };

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: mockRegistryId }).build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    mockCustomConfirmationService = CustomConfirmationServiceMockBuilder.create().build();
    mockToastService = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        RegistryResourcesComponent,
        OSFTestingModule,
        ...MockComponents(SubHeaderComponent, LoadingSpinnerComponent, IconComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(CustomConfirmationService, mockCustomConfirmationService),
        MockProvider(ToastService, mockToastService),
        provideMockStore({
          signals: [
            { selector: RegistryResourcesSelectors.getResources, value: [] },
            { selector: RegistryResourcesSelectors.isResourcesLoading, value: false },
            { selector: RegistryResourcesSelectors.getCurrentResource, value: null },
            { selector: MetadataSelectors.getResourceMetadata, value: mockRegistry },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isAddingResource()).toBe(false);
    expect(component.doiDomain).toBe('https://doi.org/');
  });

  it('should compute canEdit correctly', () => {
    expect(component.canEdit()).toBe(true);
  });

  it('should compute addButtonVisible correctly', () => {
    expect(component.addButtonVisible()).toBe(true);
  });

  it('should add resource successfully', () => {
    component.registryId = mockRegistryId;

    const mockActions = {
      addResource: jest.fn().mockReturnValue(of({})),
    };

    Object.defineProperty(component, 'actions', {
      value: mockActions,
      writable: true,
    });

    component.addResource();

    expect(mockActions.addResource).toHaveBeenCalledWith(mockRegistryId);

    expect(component).toBeTruthy();
  });

  it('should not add resource if no registry ID', () => {
    component.registryId = undefined;
    const initialAddingState = component.isAddingResource();

    component.addResource();

    expect(component.isAddingResource()).toBe(initialAddingState);
  });

  it('should open add resource dialog', () => {
    component.registryId = mockRegistryId;
    const dialogRef = { onClose: { pipe: jest.fn() } };

    const actualService = component['customDialogService'];
    actualService.open = jest.fn().mockReturnValue(dialogRef);

    const result = component.openAddResourceDialog();

    expect(actualService.open).toHaveBeenCalledWith(expect.any(Function), {
      header: 'resources.add',
      width: '500px',
      data: { id: mockRegistryId },
    });
    expect(result).toBe(dialogRef.onClose);
  });

  it('should delete resource with confirmation', () => {
    component.registryId = mockRegistryId;
    const resourceId = 'resource-id';

    component.deleteResource(resourceId);

    expect(mockCustomConfirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'resources.delete',
      messageKey: 'resources.deleteText',
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: expect.any(Function),
    });
  });

  it('should not delete resource if no registry ID', () => {
    component.registryId = undefined;
    const resourceId = 'resource-id';

    component.deleteResource(resourceId);

    expect(mockCustomConfirmationService.confirmDelete).not.toHaveBeenCalled();
  });
});
