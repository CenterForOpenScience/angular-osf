import { TreeNode } from 'primeng/api';

import { SubjectModel } from '../models';

export const convertSubjectsToTreeNode = (subjects: SubjectModel[], selectedIds: string[]): TreeNode[] => {
  const convertSubject = (subject: SubjectModel): TreeNode => {
    const node: TreeNode = {
      key: subject.id,
      label: subject.text,
      data: subject.text,
      leaf: subject.childrenCount === 0,
      expanded: subject.children && subject.children?.length > 0,
      children: [],
    };

    if (subject.children && subject.children.length > 0) {
      node.children = subject.children.map(convertSubject);
    }

    // if (node.key && selectedIds.includes(node.key)) {
    //   this.selectedTreeSubjects.push(node);
    // }

    return node;
  };

  return subjects.map(convertSubject);
};
