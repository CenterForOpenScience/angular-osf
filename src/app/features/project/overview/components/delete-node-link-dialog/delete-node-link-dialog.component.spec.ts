import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ToastService } from '@osf/shared/services/toast.service';
import { DeleteNodeLink, NodeLinksSelectors } from '@osf/shared/stores/node-links';

import { ProjectOverviewSelectors } from '../../store';

import { DeleteNodeLinkDialogComponent } from './delete-node-link-dialog.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { ToastServiceMock } from '@testing/mocks/toast.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('DeleteNodeLinkDialogComponent', () => {
  let component: DeleteNodeLinkDialogComponent;
  let fixture: ComponentFixture<DeleteNodeLinkDialogComponent>;
  let store: jest.Mocked<Store>;
  let dialogRef: jest.Mocked<DynamicDialogRef>;
  let dialogConfig: jest.Mocked<DynamicDialogConfig>;
  let toastService: jest.Mocked<ToastService>;

  const mockProject = { ...MOCK_NODE_WITH_ADMIN, id: 'test-project-id' };
  const mockCurrentLink = { ...MOCK_NODE_WITH_ADMIN, id: 'linked-resource-id', title: 'Linked Resource' };

  beforeEach(async () => {
    dialogConfig = {
      data: { currentLink: mockCurrentLink },
    } as jest.Mocked<DynamicDialogConfig>;

    await TestBed.configureTestingModule({
      imports: [DeleteNodeLinkDialogComponent, OSFTestingModule],
      providers: [
        DynamicDialogRefMock,
        ToastServiceMock,
        MockProvider(DynamicDialogConfig, dialogConfig),
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: mockProject },
            { selector: NodeLinksSelectors.getNodeLinksSubmitting, value: false },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    store.dispatch = jest.fn().mockReturnValue(of(true));
    fixture = TestBed.createComponent(DeleteNodeLinkDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef) as jest.Mocked<DynamicDialogRef>;
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize currentProject selector', () => {
    expect(component.currentProject()).toEqual(mockProject);
  });

  it('should initialize isSubmitting selector', () => {
    expect(component.isSubmitting()).toBe(false);
  });

  it('should initialize actions with deleteNodeLink mapping', () => {
    expect(component.actions.deleteNodeLink).toBeDefined();
  });

  it('should dispatch DeleteNodeLink action with correct parameters on successful deletion', () => {
    component.handleDeleteNodeLink();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(DeleteNodeLink));
    const call = (store.dispatch as jest.Mock).mock.calls.find((call) => call[0] instanceof DeleteNodeLink);
    expect(call).toBeDefined();
    const action = call[0] as DeleteNodeLink;
    expect(action.projectId).toBe('test-project-id');
    expect(action.linkedResource).toEqual(mockCurrentLink);
  });

  it('should show success toast on successful deletion', fakeAsync(() => {
    component.handleDeleteNodeLink();
    tick();

    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.deleteNodeLink.success');
  }));

  it('should close dialog with hasChanges true on successful deletion', fakeAsync(() => {
    component.handleDeleteNodeLink();
    tick();

    expect(dialogRef.close).toHaveBeenCalledWith({ hasChanges: true });
  }));
});
