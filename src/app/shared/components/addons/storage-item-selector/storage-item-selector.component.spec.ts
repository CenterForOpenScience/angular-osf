import { provideStore } from '@ngxs/store';

import { DialogService } from 'primeng/dynamicdialog';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationNames } from '@osf/features/project/project-addons/enums';
import { StorageItemSelectorComponent } from '@shared/components/addons';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { StorageItemModel } from '@shared/models';

describe('StorageItemSelectorComponent', () => {
  let component: StorageItemSelectorComponent;
  let fixture: ComponentFixture<StorageItemSelectorComponent>;

  beforeEach(async () => {
    MOCK_STORE.selectSignal.mockImplementation((selector) => {
      if (selector === 'getSelectedFolder') return () => signal(null);
      if (selector === 'getOperationInvocationSubmitting') return () => signal(false);
      if (selector === 'getCreatedOrUpdatedConfiguredAddonSubmitting') return () => signal(false);
      return () => signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [StorageItemSelectorComponent],
      providers: [
        TranslateServiceMock,
        provideStore([]),
        { provide: 'Store', useValue: MOCK_STORE },
        {
          provide: DialogService,
          useValue: {
            open: jest.fn(),
          },
        },
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

  it('should set selectedStorageItemId', () => {
    const mockFolder: StorageItemModel = {
      itemId: 'test-folder-id',
      itemName: 'Test Folder',
      itemType: 'folder',
    } as StorageItemModel;

    (component as any).selectedStorageItem.set(mockFolder);
    (component as any).handleSave();

    expect(component.selectedStorageItemId()).toBe('test-folder-id');
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
