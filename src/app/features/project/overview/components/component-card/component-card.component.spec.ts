import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';

import { ComponentCardComponent } from './component-card.component';

import { MOCK_NODE_WITH_ADMIN, MOCK_NODE_WITHOUT_ADMIN } from '@testing/mocks/node.mock';

describe('ComponentCardComponent', () => {
  let component: ComponentCardComponent;
  let fixture: ComponentFixture<ComponentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCardComponent, ...MockComponents(IconComponent, ContributorsListComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('component', MOCK_NODE_WITH_ADMIN);
    fixture.componentRef.setInput('anonymous', false);
    fixture.detectChanges();
  });

  it('should emit navigate when handleNavigate is called', () => {
    const emitSpy = jest.spyOn(component.navigate, 'emit');
    component.handleNavigate('test-id');
    expect(emitSpy).toHaveBeenCalledWith('test-id');
  });

  it('should emit menuAction when handleMenuAction is called', () => {
    const emitSpy = jest.spyOn(component.menuAction, 'emit');
    component.handleMenuAction('settings');
    expect(emitSpy).toHaveBeenCalledWith('settings');
  });

  describe('componentActionItems', () => {
    it('should return base items for any component', () => {
      fixture.componentRef.setInput('component', MOCK_NODE_WITHOUT_ADMIN);
      fixture.detectChanges();
      const items = component.componentActionItems();
      expect(items).toHaveLength(2);
      expect(items[0].action).toBe('manageContributors');
      expect(items[1].action).toBe('settings');
    });

    it('should include delete action when component has Admin permission', () => {
      fixture.componentRef.setInput('component', MOCK_NODE_WITH_ADMIN);
      fixture.detectChanges();
      const items = component.componentActionItems();
      expect(items).toHaveLength(3);
      expect(items[0].action).toBe('manageContributors');
      expect(items[1].action).toBe('settings');
      expect(items[2].action).toBe('delete');
    });

    it('should exclude delete action when component does not have Admin permission', () => {
      fixture.componentRef.setInput('component', MOCK_NODE_WITHOUT_ADMIN);
      fixture.detectChanges();
      const items = component.componentActionItems();
      expect(items).toHaveLength(2);
      expect(items.every((item) => item.action !== 'delete')).toBe(true);
    });

    it('should exclude delete action when hideDeleteAction is true', () => {
      fixture.componentRef.setInput('component', MOCK_NODE_WITH_ADMIN);
      fixture.componentRef.setInput('hideDeleteAction', true);
      fixture.detectChanges();
      const items = component.componentActionItems();
      expect(items).toHaveLength(2);
      expect(items.every((item) => item.action !== 'delete')).toBe(true);
    });
  });
});
