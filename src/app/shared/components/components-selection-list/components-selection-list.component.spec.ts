import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentCheckboxItemModel } from '@shared/models';

import { ComponentsSelectionListComponent } from './components-selection-list.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ComponentsSelectionListComponent', () => {
  let component: ComponentsSelectionListComponent;
  let fixture: ComponentFixture<ComponentsSelectionListComponent>;

  const mockComponents: ComponentCheckboxItemModel[] = [
    { id: 'comp-1', title: 'Component 1', disabled: false, checked: false },
    { id: 'comp-2', title: 'Component 2', disabled: false, checked: true },
    { id: 'comp-3', title: 'Component 3', disabled: true, checked: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsSelectionListComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentsSelectionListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('components', mockComponents);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should return true when all non-disabled items are checked', () => {
    const allChecked: ComponentCheckboxItemModel[] = [
      { id: 'comp-1', title: 'Component 1', disabled: false, checked: true },
      { id: 'comp-2', title: 'Component 2', disabled: false, checked: true },
      { id: 'comp-3', title: 'Component 3', disabled: true, checked: false },
    ];

    fixture.componentRef.setInput('components', allChecked);
    fixture.detectChanges();

    expect(component.isSelectAllDisabled()).toBe(true);
  });

  it('should return false when some non-disabled items are not checked', () => {
    fixture.componentRef.setInput('components', mockComponents);
    fixture.detectChanges();

    expect(component.isSelectAllDisabled()).toBe(false);
  });

  it('should return false when no non-disabled items are checked', () => {
    const noneChecked: ComponentCheckboxItemModel[] = [
      { id: 'comp-1', title: 'Component 1', disabled: false, checked: false },
      { id: 'comp-2', title: 'Component 2', disabled: false, checked: false },
      { id: 'comp-3', title: 'Component 3', disabled: true, checked: true },
    ];

    fixture.componentRef.setInput('components', noneChecked);
    fixture.detectChanges();

    expect(component.isSelectAllDisabled()).toBe(false);
  });

  it('should return true when all items are disabled', () => {
    const allDisabled: ComponentCheckboxItemModel[] = [
      { id: 'comp-1', title: 'Component 1', disabled: true, checked: true },
      { id: 'comp-2', title: 'Component 2', disabled: true, checked: false },
    ];

    fixture.componentRef.setInput('components', allDisabled);
    fixture.detectChanges();

    expect(component.isSelectAllDisabled()).toBe(true);
  });

  it('should return true when components array is empty', () => {
    fixture.componentRef.setInput('components', []);
    fixture.detectChanges();

    expect(component.isSelectAllDisabled()).toBe(true);
  });

  it('should return true when all non-disabled items are unchecked', () => {
    const allUnchecked: ComponentCheckboxItemModel[] = [
      { id: 'comp-1', title: 'Component 1', disabled: false, checked: false },
      { id: 'comp-2', title: 'Component 2', disabled: false, checked: false },
      { id: 'comp-3', title: 'Component 3', disabled: true, checked: true },
    ];

    fixture.componentRef.setInput('components', allUnchecked);
    fixture.detectChanges();

    expect(component.isRemoveAllDisabled()).toBe(true);
  });

  it('should return false when some non-disabled items are checked', () => {
    fixture.componentRef.setInput('components', mockComponents);
    fixture.detectChanges();

    expect(component.isRemoveAllDisabled()).toBe(false);
  });

  it('should return false when all non-disabled items are checked', () => {
    const allChecked: ComponentCheckboxItemModel[] = [
      { id: 'comp-1', title: 'Component 1', disabled: false, checked: true },
      { id: 'comp-2', title: 'Component 2', disabled: false, checked: true },
      { id: 'comp-3', title: 'Component 3', disabled: true, checked: false },
    ];

    fixture.componentRef.setInput('components', allChecked);
    fixture.detectChanges();

    expect(component.isRemoveAllDisabled()).toBe(false);
  });

  it('should return true when all items are disabled', () => {
    const allDisabled: ComponentCheckboxItemModel[] = [
      { id: 'comp-1', title: 'Component 1', disabled: true, checked: true },
      { id: 'comp-2', title: 'Component 2', disabled: true, checked: false },
    ];

    fixture.componentRef.setInput('components', allDisabled);
    fixture.detectChanges();

    expect(component.isRemoveAllDisabled()).toBe(true);
  });

  it('should return true when components array is empty', () => {
    fixture.componentRef.setInput('components', []);
    fixture.detectChanges();

    expect(component.isRemoveAllDisabled()).toBe(true);
  });

  it('should check all non-disabled items', () => {
    fixture.componentRef.setInput('components', mockComponents);
    fixture.detectChanges();

    component.selectAll();

    const result = component.components();
    expect(result[0].checked).toBe(true); // was unchecked, now checked
    expect(result[1].checked).toBe(true); // was checked, remains checked
    expect(result[2].checked).toBe(true); // disabled, remains checked
  });

  it('should not change disabled items state', () => {
    const mixedComponents: ComponentCheckboxItemModel[] = [
      { id: 'comp-1', title: 'Component 1', disabled: false, checked: false },
      { id: 'comp-2', title: 'Component 2', disabled: true, checked: false },
    ];

    fixture.componentRef.setInput('components', mixedComponents);
    fixture.detectChanges();

    component.selectAll();

    const result = component.components();
    expect(result[0].checked).toBe(true);
    expect(result[1].checked).toBe(false);
  });

  it('should work with empty array', () => {
    fixture.componentRef.setInput('components', []);
    fixture.detectChanges();

    component.selectAll();

    expect(component.components()).toEqual([]);
  });

  it('should work with all disabled items', () => {
    const allDisabled: ComponentCheckboxItemModel[] = [
      { id: 'comp-1', title: 'Component 1', disabled: true, checked: false },
      { id: 'comp-2', title: 'Component 2', disabled: true, checked: true },
    ];

    fixture.componentRef.setInput('components', allDisabled);
    fixture.detectChanges();

    component.selectAll();

    const result = component.components();
    expect(result[0].checked).toBe(false);
    expect(result[1].checked).toBe(true);
  });

  it('should uncheck all non-disabled items', () => {
    fixture.componentRef.setInput('components', mockComponents);
    fixture.detectChanges();

    component.removeAll();

    const result = component.components();
    expect(result[0].checked).toBe(false);
    expect(result[1].checked).toBe(false);
    expect(result[2].checked).toBe(true);
  });

  it('should not change disabled items state', () => {
    const mixedComponents: ComponentCheckboxItemModel[] = [
      { id: 'comp-1', title: 'Component 1', disabled: false, checked: true },
      { id: 'comp-2', title: 'Component 2', disabled: true, checked: true },
    ];

    fixture.componentRef.setInput('components', mixedComponents);
    fixture.detectChanges();

    component.removeAll();

    const result = component.components();
    expect(result[0].checked).toBe(false);
    expect(result[1].checked).toBe(true);
  });

  it('should work with empty array', () => {
    fixture.componentRef.setInput('components', []);
    fixture.detectChanges();

    component.removeAll();

    expect(component.components()).toEqual([]);
  });

  it('should work with all disabled items', () => {
    const allDisabled: ComponentCheckboxItemModel[] = [
      { id: 'comp-1', title: 'Component 1', disabled: true, checked: false },
      { id: 'comp-2', title: 'Component 2', disabled: true, checked: true },
    ];

    fixture.componentRef.setInput('components', allDisabled);
    fixture.detectChanges();

    component.removeAll();

    const result = component.components();
    expect(result[0].checked).toBe(false);
    expect(result[1].checked).toBe(true);
  });

  it('should toggle between selectAll and removeAll correctly', () => {
    fixture.componentRef.setInput('components', mockComponents);
    fixture.detectChanges();

    component.selectAll();
    let result = component.components();
    expect(result[0].checked).toBe(true);
    expect(result[1].checked).toBe(true);

    component.removeAll();
    result = component.components();
    expect(result[0].checked).toBe(false);
    expect(result[1].checked).toBe(false);
    expect(result[2].checked).toBe(true);
  });

  it('should update computed properties after selectAll', () => {
    fixture.componentRef.setInput('components', mockComponents);
    fixture.detectChanges();

    expect(component.isSelectAllDisabled()).toBe(false);
    expect(component.isRemoveAllDisabled()).toBe(false);

    component.selectAll();

    expect(component.isSelectAllDisabled()).toBe(true);
    expect(component.isRemoveAllDisabled()).toBe(false);
  });

  it('should update computed properties after removeAll', () => {
    const allChecked: ComponentCheckboxItemModel[] = [
      { id: 'comp-1', title: 'Component 1', disabled: false, checked: true },
      { id: 'comp-2', title: 'Component 2', disabled: false, checked: true },
    ];

    fixture.componentRef.setInput('components', allChecked);
    fixture.detectChanges();

    expect(component.isSelectAllDisabled()).toBe(true);
    expect(component.isRemoveAllDisabled()).toBe(false);

    component.removeAll();

    expect(component.isSelectAllDisabled()).toBe(false);
    expect(component.isRemoveAllDisabled()).toBe(true);
  });

  it('should preserve component properties other than checked', () => {
    const componentsWithExtra: ComponentCheckboxItemModel[] = [
      {
        id: 'comp-1',
        title: 'Component 1',
        disabled: false,
        checked: false,
        isCurrent: true,
        parentId: 'parent-1',
      },
    ];

    fixture.componentRef.setInput('components', componentsWithExtra);
    fixture.detectChanges();

    component.selectAll();

    const result = component.components()[0];
    expect(result.id).toBe('comp-1');
    expect(result.title).toBe('Component 1');
    expect(result.disabled).toBe(false);
    expect(result.checked).toBe(true);
    expect(result.isCurrent).toBe(true);
    expect(result.parentId).toBe('parent-1');
  });
});
