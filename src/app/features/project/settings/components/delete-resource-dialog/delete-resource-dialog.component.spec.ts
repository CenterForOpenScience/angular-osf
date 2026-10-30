import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { NodeShortInfoModel } from '@osf/shared/models/nodes/node-with-children.model';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { DeleteResourceDialogData } from '../../models/delete-resource-options.model';

import { DeleteResourceDialogComponent } from './delete-resource-dialog.component';

interface SetupOverrides extends BaseSetupOverrides {
  dialogData?: DeleteResourceDialogData;
}

describe('DeleteResourceDialogComponent', () => {
  let component: DeleteResourceDialogComponent;
  let fixture: ComponentFixture<DeleteResourceDialogComponent>;
  let dialogRef: DynamicDialogRef;

  const resources: NodeShortInfoModel[] = [
    {
      id: 'c1',
      title: 'Component 1',
      isPublic: true,
      permissions: [UserPermissions.Admin],
    },
    {
      id: 'c2',
      title: 'Component 2',
      isPublic: true,
      permissions: [UserPermissions.Admin, UserPermissions.Write],
    },
  ];

  const dialogData: DeleteResourceDialogData = {
    listMessageKey: 'list',
    warningMessageKey: 'warning',
    confirmationKey: 'confirmation',
    noPermissionsMessageKey: 'no-permissions',
    singleMessageKey: 'single',
  };

  const defaultSignals: SignalOverride[] = [
    { selector: CurrentResourceSelectors.getResourceWithChildren, value: resources },
    { selector: CurrentResourceSelectors.allResourceChildrenHaveAdminAccess, value: true },
  ];

  function setup(overrides: SetupOverrides = {}) {
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [DeleteResourceDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data: overrides.dialogData ?? dialogData }),
        provideMockStore({ signals }),
      ],
    });

    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(DeleteResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should return false for hasAdminAccessForAllComponents when access is denied', () => {
    setup({
      selectorOverrides: [{ selector: CurrentResourceSelectors.allResourceChildrenHaveAdminAccess, value: false }],
    });

    expect(component.hasAdminAccessForAllComponents()).toBe(false);
  });

  it('should show the list when there are multiple resources', () => {
    setup();

    expect(component.showList()).toBe(true);
  });

  it('should show the single message when one resource has a single message key', () => {
    setup({
      selectorOverrides: [{ selector: CurrentResourceSelectors.getResourceWithChildren, value: [resources[0]] }],
    });

    expect(component.showList()).toBe(false);
  });

  it('should show the list for one resource when no single message key is set', () => {
    setup({
      dialogData: {
        listMessageKey: 'list',
        warningMessageKey: 'warning',
        confirmationKey: 'confirmation',
        noPermissionsMessageKey: 'no-permissions',
      },
      selectorOverrides: [{ selector: CurrentResourceSelectors.getResourceWithChildren, value: [resources[0]] }],
    });

    expect(component.showList()).toBe(true);
  });

  it('should return true for isInputValid when confirmation matches selected scientist', () => {
    setup();

    component.userInput.set(component.selectedScientist);

    expect(component.isInputValid()).toBe(true);
  });

  it('should close dialog with true on delete', () => {
    setup();

    component.handleDelete();

    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
