import { MockComponents, MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleFilePickerComponent, SelectComponent } from '@shared/components';
import { StorageItemSelectorComponent } from '@shared/components/addons';
import { OperationNames } from '@shared/enums';
import { AddonsSelectors } from '@shared/stores';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { DialogServiceMockBuilder } from '@testing/providers/dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('StorageItemSelectorComponent', () => {
  let component: StorageItemSelectorComponent;
  let fixture: ComponentFixture<StorageItemSelectorComponent>;
  let mockDialogService: ReturnType<DialogServiceMockBuilder['build']>;

  beforeEach(async () => {
    mockDialogService = DialogServiceMockBuilder.create().withOpenMock().build();

    await TestBed.configureTestingModule({
      imports: [
        StorageItemSelectorComponent,
        OSFTestingModule,
        ...MockComponents(GoogleFilePickerComponent, SelectComponent),
      ],
      providers: [
        provideMockStore({
          signals: [
            {
              selector: AddonsSelectors.getSelectedStorageItem,
              value: null,
            },
            {
              selector: AddonsSelectors.getOperationInvocationSubmitting,
              value: false,
            },
            {
              selector: AddonsSelectors.getCreatedOrUpdatedConfiguredAddonSubmitting,
              value: false,
            },
          ],
        }),
        MockProvider(DialogService, mockDialogService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StorageItemSelectorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit operationInvoke with correct data', () => {
    const operationName = OperationNames.LIST_ROOT_ITEMS;
    const itemId = 'test-id';
    const operationInvokeSpy = jest.spyOn(component.operationInvoke, 'emit');

    (component as any).handleCreateOperationInvocation(operationName, itemId);

    expect(operationInvokeSpy).toHaveBeenCalledWith({
      operationName,
      itemId,
    });
  });

  it('should update breadcrumbs and trim them', () => {
    const operationName = OperationNames.LIST_CHILD_ITEMS;
    const itemId = 'test-id';
    const itemName = 'Test Folder';

    (component as any).handleCreateOperationInvocation(operationName, itemId, itemName, true);

    expect((component as any).breadcrumbItems().length).toBeGreaterThan(0);
  });

  it('should emit save event', () => {
    const saveSpy = jest.spyOn(component.save, 'emit');

    (component as any).handleSave();

    expect(saveSpy).toHaveBeenCalled();
  });

  it('should emit cancelSelection event', () => {
    const cancelSpy = jest.spyOn(component.cancelSelection, 'emit');

    (component as any).handleCancel();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should clear breadcrumbs for LIST_ROOT_ITEMS operation', () => {
    (component as any).updateBreadcrumbs(OperationNames.LIST_ROOT_ITEMS, 'test-id');

    expect((component as any).breadcrumbItems()).toEqual([]);
  });

  it('should add breadcrumb item for valid operation', () => {
    const itemId = 'test-id';
    const itemName = 'Test Folder';

    (component as any).updateBreadcrumbs(OperationNames.LIST_CHILD_ITEMS, itemId, itemName, true);

    const breadcrumbs = (component as any).breadcrumbItems();
    expect(breadcrumbs.length).toBe(1);
    expect(breadcrumbs[0].id).toBe(itemId);
    expect(breadcrumbs[0].label).toBe(itemName);
  });
});
