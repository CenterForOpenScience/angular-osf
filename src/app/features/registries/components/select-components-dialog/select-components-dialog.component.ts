import { TranslatePipe } from '@ngx-translate/core';

import { TreeNode } from 'primeng/api';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Tree } from 'primeng/tree';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ProjectShortInfoModel } from '../../models';

@Component({
  selector: 'osf-select-components-dialog',
  imports: [TranslatePipe, Tree, Button],
  templateUrl: './select-components-dialog.component.html',
  styleUrl: './select-components-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponentsDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  selectedComponents: TreeNode[] = [];
  parent: ProjectShortInfoModel = this.config.data.parent;
  components: TreeNode[] = [];

  constructor() {
    this.components = [
      {
        label: this.parent.title,
        selectable: false,
        expanded: true,
        key: this.parent.id,
        data: this.parent.id,
        children: this.config.data.components.map(this.mapProjectToTreeNode),
      },
    ];
    this.selectedComponents.push({ key: this.parent.id });
  }

  private mapProjectToTreeNode = (project: ProjectShortInfoModel): TreeNode => {
    this.selectedComponents.push({
      key: project.id,
    });
    return {
      label: project.title,
      data: project.id,
      key: project.id,
      expanded: true,
      children: project.children?.map(this.mapProjectToTreeNode) ?? [],
    };
  };

  continue() {
    const selectedComponentsSet = new Set<string>([...this.selectedComponents.map((c) => c.key!), this.parent.id]);
    this.dialogRef.close([...selectedComponentsSet]);
  }
}
