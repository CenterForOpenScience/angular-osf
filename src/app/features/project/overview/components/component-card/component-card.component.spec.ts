import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { NodeMenuAction } from '@osf/shared/enums/node-menu-action.enum';

import { MOCK_NODE_WITH_ADMIN, MOCK_NODE_WITHOUT_ADMIN } from '@testing/mocks/node.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { ComponentCardComponent } from './component-card.component';

describe('ComponentCardComponent', () => {
  let component: ComponentCardComponent;
  let fixture: ComponentFixture<ComponentCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ComponentCardComponent,
        ...MockComponents(IconComponent, ContributorsListComponent, TruncatedTextComponent),
      ],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(ComponentCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('component', MOCK_NODE_WITH_ADMIN);
    fixture.componentRef.setInput('anonymous', false);
    fixture.detectChanges();
  });

  it('should emit navigate when the title is clicked', () => {
    const emitSpy = vi.spyOn(component.navigate, 'emit');

    fixture.nativeElement.querySelector('.node-title').click();

    expect(emitSpy).toHaveBeenCalledWith(MOCK_NODE_WITH_ADMIN.id);
  });

  it('should emit menuAction when a menu action is selected', () => {
    const emitSpy = vi.spyOn(component.menuAction, 'emit');

    component.handleMenuAction(NodeMenuAction.Settings);

    expect(emitSpy).toHaveBeenCalledWith(NodeMenuAction.Settings);
  });

  it('should hide the menu when the user is not a contributor', () => {
    fixture.componentRef.setInput('component', { ...MOCK_NODE_WITH_ADMIN, currentUserIsContributor: false });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p-button')).toBeNull();
  });

  it('should show contributors and settings actions without delete when the user is not an admin', () => {
    fixture.componentRef.setInput('component', MOCK_NODE_WITHOUT_ADMIN);
    fixture.detectChanges();

    expect(component.componentActionItems().map((item) => item.action)).toEqual([
      NodeMenuAction.ManageContributors,
      NodeMenuAction.Settings,
    ]);
  });

  it('should include delete when the user is an admin', () => {
    expect(component.componentActionItems().map((item) => item.action)).toEqual([
      NodeMenuAction.ManageContributors,
      NodeMenuAction.Settings,
      NodeMenuAction.Delete,
    ]);
  });

  it('should hide delete when hideDeleteAction is true', () => {
    fixture.componentRef.setInput('hideDeleteAction', true);
    fixture.detectChanges();

    expect(component.componentActionItems().map((item) => item.action)).toEqual([
      NodeMenuAction.ManageContributors,
      NodeMenuAction.Settings,
    ]);
  });
});
