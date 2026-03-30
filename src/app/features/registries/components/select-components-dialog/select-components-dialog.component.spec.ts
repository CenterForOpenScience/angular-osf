import { MockProvider } from 'ng-mocks';

import { TreeNode } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectShortInfoModel } from '../../models/project-short-info.model';

import { SelectComponentsDialogComponent } from './select-components-dialog.component';

import { provideDynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

describe('SelectComponentsDialogComponent', () => {
  let component: SelectComponentsDialogComponent;
  let fixture: ComponentFixture<SelectComponentsDialogComponent>;
  let dialogRef: DynamicDialogRef;

  const parent: ProjectShortInfoModel = { id: 'p1', title: 'Parent Project' };
  const components: ProjectShortInfoModel[] = [
    { id: 'c1', title: 'Child 1', children: [{ id: 'c1a', title: 'Child 1A' }] },
    { id: 'c2', title: 'Child 2' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectComponentsDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data: { parent, components } }),
      ],
    });

    dialogRef = TestBed.inject(DynamicDialogRef);
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
    const selectedKeys = new Set(component.selectedComponents.map((n: TreeNode) => n.key));
    expect(selectedKeys).toEqual(new Set(['p1', 'c1', 'c1a', 'c2']));
  });

  it('should close with unique selected component ids including parent on continue', () => {
    component.continue();
    expect(dialogRef.close).toHaveBeenCalledWith(expect.arrayContaining(['p1', 'c1', 'c1a', 'c2']));
    const passed = (dialogRef.close as jest.Mock).mock.calls[0][0] as string[];
    expect(new Set(passed).size).toBe(passed.length);
  });
});
