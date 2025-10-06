import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponentsDialogComponent } from './select-components-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('SelectComponentsDialogComponent', () => {
  let component: SelectComponentsDialogComponent;
  let fixture: ComponentFixture<SelectComponentsDialogComponent>;
  let dialogRefMock: { close: jest.Mock };
  let dialogConfigMock: DynamicDialogConfig;

  const parent = { id: 'p1', title: 'Parent Project' } as any;
  const components = [
    { id: 'c1', title: 'Child 1', children: [{ id: 'c1a', title: 'Child 1A' }] },
    { id: 'c2', title: 'Child 2' },
  ] as any;

  beforeEach(async () => {
    dialogRefMock = { close: jest.fn() } as any;
    dialogConfigMock = { data: { parent, components } } as any;

    await TestBed.configureTestingModule({
      imports: [SelectComponentsDialogComponent, OSFTestingModule],
      providers: [
        MockProvider(DynamicDialogRef, dialogRefMock as any),
        MockProvider(DynamicDialogConfig, dialogConfigMock as any),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize tree with parent and children', () => {
    expect(component).toBeTruthy();
    expect(component.components.length).toBe(1);
    const root = component.components[0];
    expect(root.label).toBe('Parent Project');
    expect(root.children?.length).toBe(2);
    const selectedKeys = new Set(component.selectedComponents.map((n) => n.key));
    expect(selectedKeys.has('p1')).toBe(true);
    expect(selectedKeys.has('c1')).toBe(true);
    expect(selectedKeys.has('c1a')).toBe(true);
    expect(selectedKeys.has('c2')).toBe(true);
  });

  it('should close with unique selected component ids including parent on continue', () => {
    component.continue();
    expect(dialogRefMock.close).toHaveBeenCalledWith(expect.arrayContaining(['p1', 'c1', 'c1a', 'c2']));
    const passed = (dialogRefMock.close as jest.Mock).mock.calls[0][0] as string[];
    expect(new Set(passed).size).toBe(passed.length);
  });
});
