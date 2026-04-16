import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { ToastService } from '@osf/shared/services/toast.service';
import { DeleteNodeLink, NodeLinksSelectors } from '@osf/shared/stores/node-links';

import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ProjectOverviewModel } from '../../models';
import { ProjectOverviewSelectors } from '../../store';

import { DeleteNodeLinkDialogComponent } from './delete-node-link-dialog.component';

interface SetupOverrides extends BaseSetupOverrides {
  currentLink?: NodeModel | null;
}

describe('DeleteNodeLinkDialogComponent', () => {
  let component: DeleteNodeLinkDialogComponent;
  let fixture: ComponentFixture<DeleteNodeLinkDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;
  let toastService: ToastServiceMockType;

  const mockProject: ProjectOverviewModel = {
    ...MOCK_PROJECT_OVERVIEW,
    id: 'project-1',
  };

  const mockLink: NodeModel = {
    ...MOCK_NODE_WITH_ADMIN,
    id: 'linked-1',
    title: 'Linked Resource',
  };

  const defaultSignals: SignalOverride[] = [
    { selector: ProjectOverviewSelectors.getProject, value: mockProject },
    { selector: NodeLinksSelectors.getNodeLinksSubmitting, value: false },
  ];

  function setup(overrides: SetupOverrides = {}) {
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [DeleteNodeLinkDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, {
          data: { currentLink: overrides.currentLink === undefined ? mockLink : overrides.currentLink },
        }),
        MockProvider(ToastService, toastService),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(DeleteNodeLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should not dispatch delete action when current link is missing', () => {
    setup({ currentLink: null });
    (store.dispatch as Mock).mockClear();

    component.handleDeleteNodeLink();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(DeleteNodeLink));
    expect(toastService.showSuccess).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should not dispatch delete action when current project is missing', () => {
    setup({
      selectorOverrides: [{ selector: ProjectOverviewSelectors.getProject, value: null }],
    });
    (store.dispatch as Mock).mockClear();

    component.handleDeleteNodeLink();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(DeleteNodeLink));
    expect(toastService.showSuccess).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should dispatch delete action, show success toast and close dialog with hasChanges', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.handleDeleteNodeLink();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteNodeLink('project-1', mockLink));
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.deleteNodeLink.success');
    expect(dialogRef.close).toHaveBeenCalledWith({ hasChanges: true });
  });
});
