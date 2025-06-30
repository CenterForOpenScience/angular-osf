import { createDispatchMap, select } from '@ngxs/store';

import { TreeNode } from 'primeng/api';
import { Tree, TreeNodeExpandEvent } from 'primeng/tree';

import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { SubjectModel } from '@osf/shared/models';
import { GetChildrenSubjects, SubjectsSelectors } from '@osf/shared/stores';

interface SubjectData {
  selectedIds: string[];
  subjects: SubjectModel[];
}

@Component({
  selector: 'osf-subject-tree',
  imports: [Tree],
  templateUrl: './subject-tree.component.html',
  styleUrl: './subject-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectTreeComponent {
  subjectData = input<SubjectData>({ selectedIds: [], subjects: [] });
  subjectTreeData = computed(() => this.convertSubjects(this.subjectData()));

  selectedSubjects = input<string[]>([]);
  treeData = input<TreeNode[]>([]);

  loadChildren = output<TreeNode>();
  itemsSelected = output<string[]>();

  selectedTreeSubjects: TreeNode[] = [];
  loading = select(SubjectsSelectors.areParentSubjectsLoading);

  selectedFiles = signal([] as TreeNode[]);

  protected actions = createDispatchMap({ getChildrenSubjects: GetChildrenSubjects });

  selectionChanged(event: TreeNode | TreeNode[] | null) {
    if (Array.isArray(event)) {
      const selectedIds = event.map((node) => node.key ?? '').filter((id) => id.length) || [];
      this.itemsSelected.emit(selectedIds);
    }
  }

  onNodeExpand(event: TreeNodeExpandEvent) {
    if (!event.node.children?.length) {
      this.loadChildren.emit(event.node);
    }
  }

  private convertSubjects(subjects: SubjectData): TreeNode[] {
    const convertSubject = (subject: SubjectModel): TreeNode => {
      const node: TreeNode = {
        key: subject.id,
        label: subject.text,
        data: subject.text,
        leaf: subject.childrenCount === 0,
        children: [],
      };

      if (subject.children && subject.children.length > 0) {
        node.children = subject.children.map(convertSubject);
      }

      if (node.key && this.subjectData().selectedIds.includes(node.key)) {
        this.selectedTreeSubjects.push(node);
      }

      return node;
    };

    return subjects.subjects.map(convertSubject);
  }
}
