import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { NodeMenuAction } from '@osf/shared/enums/node-menu-action.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';

import { MOCK_NODE_WITH_ADMIN, MOCK_NODE_WITHOUT_ADMIN } from '@testing/mocks/node.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { DuplicateCardComponent } from './duplicate-card.component';

describe('DuplicateCardComponent', () => {
  let component: DuplicateCardComponent;
  let fixture: ComponentFixture<DuplicateCardComponent>;

  function setup(duplicate: NodeModel = MOCK_NODE_WITH_ADMIN) {
    TestBed.configureTestingModule({
      imports: [
        DuplicateCardComponent,
        ...MockComponents(IconComponent, TruncatedTextComponent, ContributorsListComponent),
      ],
      providers: [provideOSFCore(), provideRouter([])],
    });

    fixture = TestBed.createComponent(DuplicateCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('duplicate', duplicate);
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should expose dateFormat', () => {
    setup();
    expect(component.dateFormat).toBe('MMM d, y, h:mm a');
  });

  it('should expose menu items', () => {
    setup();
    expect(component.menuItems).toEqual([
      {
        label: 'project.overview.actions.manageContributors',
        action: NodeMenuAction.ManageContributors,
      },
      {
        label: 'project.overview.actions.settings',
        action: NodeMenuAction.Settings,
      },
      {
        label: 'common.labels.delete',
        action: NodeMenuAction.Delete,
      },
    ]);
  });

  it('should allow manage when user has admin permission', () => {
    setup(MOCK_NODE_WITH_ADMIN);
    expect(component.canManageDuplicate()).toBe(true);
  });

  it('should allow manage when user has write permission', () => {
    setup(MOCK_NODE_WITHOUT_ADMIN);
    expect(component.canManageDuplicate()).toBe(true);
  });

  it('should not allow manage when user has only read permission', () => {
    const readOnly: NodeModel = {
      ...MOCK_NODE_WITHOUT_ADMIN,
      currentUserPermissions: [UserPermissions.Read],
    };
    setup(readOnly);
    expect(component.canManageDuplicate()).toBe(false);
  });

  it('should emit menuAction when handleMenuAction is called', () => {
    setup();
    const emitted: NodeMenuAction[] = [];
    component.menuAction.subscribe((action) => emitted.push(action));

    component.handleMenuAction(NodeMenuAction.Settings);
    component.handleMenuAction(NodeMenuAction.Delete);

    expect(emitted).toEqual([NodeMenuAction.Settings, NodeMenuAction.Delete]);
  });
});
