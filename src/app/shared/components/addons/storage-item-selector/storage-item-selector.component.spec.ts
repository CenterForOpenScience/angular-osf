import { MockComponents, MockProvider } from 'ng-mocks';

import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { OperationNames } from '@shared/enums/operation-names.enum';
import { OperationInvocation } from '@shared/models/addons/operation-invocation.model';
import { AddonsSelectors } from '@shared/stores/addons';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomDialogServiceMockBuilder,
  CustomDialogServiceMockType,
} from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { GoogleFilePickerComponent } from '../../google-file-picker/google-file-picker.component';
import { SelectComponent } from '../../select/select.component';

import { StorageItemSelectorComponent } from './storage-item-selector.component';

describe('StorageItemSelectorComponent', () => {
  let component: StorageItemSelectorComponent;
  let fixture: ComponentFixture<StorageItemSelectorComponent>;
  let mockCustomDialogService: CustomDialogServiceMockType;
  let mockOperationInvocation: WritableSignal<OperationInvocation | null>;

  beforeEach(() => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();
    mockOperationInvocation = signal<OperationInvocation | null>(null);

    TestBed.configureTestingModule({
      imports: [StorageItemSelectorComponent, ...MockComponents(GoogleFilePickerComponent, SelectComponent)],
      providers: [
        provideOSFCore(),
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
            {
              selector: AddonsSelectors.getOperationInvocation,
              value: mockOperationInvocation,
            },
          ],
        }),
        MockProvider(CustomDialogService, mockCustomDialogService),
      ],
    });

    fixture = TestBed.createComponent(StorageItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isGoogleFilePicker', false);
    fixture.componentRef.setInput('accountName', 'test-account');
    fixture.componentRef.setInput('accountId', 'test-id');
    fixture.componentRef.setInput('operationInvocationResult', []);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit operationInvoke with correct data', () => {
    const operationName = OperationNames.LIST_ROOT_ITEMS;
    const itemId = 'test-id';
    const operationInvokeSpy = vi.spyOn(component.operationInvoke, 'emit');

    component.handleCreateOperationInvocation(operationName, itemId);

    expect(operationInvokeSpy).toHaveBeenCalledWith({
      operationName,
      itemId,
    });
  });

  it('should update breadcrumbs and trim them', () => {
    const operationName = OperationNames.LIST_CHILD_ITEMS;
    const itemId = 'test-id';
    const itemName = 'Test Folder';

    component.handleCreateOperationInvocation(operationName, itemId, itemName, true);

    expect(component.breadcrumbItems().length).toBeGreaterThan(0);
  });

  it('should emit save event', () => {
    const saveSpy = vi.spyOn(component.save, 'emit');

    component.handleSave();

    expect(saveSpy).toHaveBeenCalled();
  });

  it('should emit cancelSelection event', () => {
    const cancelSpy = vi.spyOn(component.cancelSelection, 'emit');

    component.handleCancel();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should clear breadcrumbs for LIST_ROOT_ITEMS operation', () => {
    (component as any).updateBreadcrumbs(OperationNames.LIST_ROOT_ITEMS, 'test-id');

    expect(component.breadcrumbItems()).toEqual([]);
  });

  it('should add breadcrumb item for valid operation', () => {
    const itemId = 'test-id';
    const itemName = 'Test Folder';

    (component as any).updateBreadcrumbs(OperationNames.LIST_CHILD_ITEMS, itemId, itemName, true);

    const breadcrumbs = component.breadcrumbItems();
    expect(breadcrumbs.length).toBe(1);
    expect(breadcrumbs[0].id).toBe(itemId);
    expect(breadcrumbs[0].label).toBe(itemName);
  });

  describe('showLoadMoreButton', () => {
    it('should return false when operationInvocation is null', () => {
      mockOperationInvocation.set(null);
      fixture.detectChanges();

      expect(component.showLoadMoreButton()).toBe(false);
    });

    it('should return false when nextSampleCursor is not present', () => {
      mockOperationInvocation.set({
        id: 'test-id',
        type: 'operation-invocation',
        invocationStatus: 'success',
        operationName: 'list_root_items',
        operationKwargs: {},
        operationResult: [],
        itemCount: 10,
        thisSampleCursor: 'cursor-1',
      });
      fixture.detectChanges();

      expect(component.showLoadMoreButton()).toBe(false);
    });

    it('should return true when nextSampleCursor differs from thisSampleCursor', () => {
      mockOperationInvocation.set({
        id: 'test-id',
        type: 'operation-invocation',
        invocationStatus: 'success',
        operationName: 'list_root_items',
        operationKwargs: {},
        operationResult: [],
        itemCount: 20,
        thisSampleCursor: 'cursor-1',
        nextSampleCursor: 'cursor-2',
      });
      fixture.detectChanges();

      expect(component.showLoadMoreButton()).toBe(true);
    });

    it('should return true for opaque/base64 cursors like GitLab uses', () => {
      mockOperationInvocation.set({
        id: 'test-id',
        type: 'operation-invocation',
        invocationStatus: 'success',
        operationName: 'list_root_items',
        operationKwargs: {},
        operationResult: [],
        itemCount: 20,
        thisSampleCursor: 'eyJpZCI6MTIzfQ==',
        nextSampleCursor: 'eyJpZCI6MTQ1fQ==',
      });
      fixture.detectChanges();

      expect(component.showLoadMoreButton()).toBe(true);
    });

    it('should return false when nextSampleCursor equals thisSampleCursor', () => {
      mockOperationInvocation.set({
        id: 'test-id',
        type: 'operation-invocation',
        invocationStatus: 'success',
        operationName: 'list_root_items',
        operationKwargs: {},
        operationResult: [],
        itemCount: 10,
        thisSampleCursor: 'cursor-1',
        nextSampleCursor: 'cursor-1',
      });
      fixture.detectChanges();

      expect(component.showLoadMoreButton()).toBe(false);
    });

    it('should return true when nextSampleCursor exists but thisSampleCursor is undefined', () => {
      mockOperationInvocation.set({
        id: 'test-id',
        type: 'operation-invocation',
        invocationStatus: 'success',
        operationName: 'list_root_items',
        operationKwargs: {},
        operationResult: [],
        itemCount: 20,
        nextSampleCursor: 'cursor-2',
      });
      fixture.detectChanges();

      expect(component.showLoadMoreButton()).toBe(true);
    });
  });
});
