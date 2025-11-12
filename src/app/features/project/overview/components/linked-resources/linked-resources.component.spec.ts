import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { NodeLinksSelectors } from '@osf/shared/stores/node-links';

import { DeleteNodeLinkDialogComponent } from '../delete-node-link-dialog/delete-node-link-dialog.component';
import { LinkResourceDialogComponent } from '../link-resource-dialog/link-resource-dialog.component';

import { LinkedResourcesComponent } from './linked-resources.component';

import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('LinkedProjectsComponent', () => {
  let component: LinkedResourcesComponent;
  let fixture: ComponentFixture<LinkedResourcesComponent>;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;

  const mockLinkedResources = [
    { ...MOCK_NODE_WITH_ADMIN, id: 'resource-1', title: 'Linked Resource 1' },
    { ...MOCK_NODE_WITH_ADMIN, id: 'resource-2', title: 'Linked Resource 2' },
    { ...MOCK_NODE_WITH_ADMIN, id: 'resource-3', title: 'Linked Resource 3' },
  ];

  beforeEach(async () => {
    customDialogServiceMock = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();

    await TestBed.configureTestingModule({
      imports: [
        LinkedResourcesComponent,
        OSFTestingModule,
        ...MockComponents(IconComponent, ContributorsListComponent),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: NodeLinksSelectors.getLinkedResources, value: mockLinkedResources },
            { selector: NodeLinksSelectors.getLinkedResourcesLoading, value: false },
          ],
        }),
        MockProvider(CustomDialogService, customDialogServiceMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedResourcesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();
  });

  it('should open LinkResourceDialogComponent with correct config', () => {
    component.openLinkProjectModal();

    expect(customDialogServiceMock.open).toHaveBeenCalledWith(LinkResourceDialogComponent, {
      header: 'project.overview.dialog.linkProject.header',
      width: '850px',
    });
  });

  it('should find resource by id and open DeleteNodeLinkDialogComponent with correct config when resource exists', () => {
    component.openDeleteResourceModal('resource-2');

    expect(customDialogServiceMock.open).toHaveBeenCalledWith(DeleteNodeLinkDialogComponent, {
      header: 'project.overview.dialog.deleteNodeLink.header',
      width: '650px',
      data: { currentLink: mockLinkedResources[1] },
    });
  });

  it('should return early and not open dialog when resource is not found', () => {
    customDialogServiceMock.open.mockClear();

    component.openDeleteResourceModal('non-existent-id');

    expect(customDialogServiceMock.open).not.toHaveBeenCalled();
  });
});
