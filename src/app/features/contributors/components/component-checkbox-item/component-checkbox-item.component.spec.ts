import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MOCK_VIEW_ONLY_LINK_COMPONENT_ITEM } from '@shared/mocks';

import { ViewOnlyLinkComponentItem } from '../../models/view-only-components.models';

import { ComponentCheckboxItemComponent } from './component-checkbox-item.component';

describe('ComponentCheckboxItemComponent', () => {
  let component: ComponentCheckboxItemComponent;
  let fixture: ComponentFixture<ComponentCheckboxItemComponent>;

  const mockItem: ViewOnlyLinkComponentItem = MOCK_VIEW_ONLY_LINK_COMPONENT_ITEM;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCheckboxItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentCheckboxItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit checkboxChange when checkbox is clicked', () => {
    jest.spyOn(component.checkboxChange, 'emit');

    const checkboxElement = fixture.debugElement.query(By.css('p-checkbox'));
    checkboxElement.triggerEventHandler('onChange', {});

    expect(component.checkboxChange.emit).toHaveBeenCalled();
  });

  it('should handle item with parentId', () => {
    const itemWithParent = { ...mockItem, parentId: 'parent-123' };
    fixture.componentRef.setInput('item', itemWithParent);
    fixture.detectChanges();

    expect(component.item().parentId).toBe('parent-123');
  });

  it('should handle item without parentId', () => {
    expect(component.item().parentId).toBeNull();
  });

  it('should handle different item IDs', () => {
    const differentItem = { ...mockItem, id: 'different-id' };
    fixture.componentRef.setInput('item', differentItem);
    fixture.detectChanges();

    expect(component.item().id).toBe('different-id');
  });
});
