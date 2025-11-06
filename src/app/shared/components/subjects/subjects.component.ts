import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { TreeNode } from 'primeng/api';
import { Card } from 'primeng/card';
import { Checkbox, CheckboxChangeEvent } from 'primeng/checkbox';
import { Chip } from 'primeng/chip';
import { Skeleton } from 'primeng/skeleton';
import { Tree, TreeModule } from 'primeng/tree';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

import { SubjectModel } from '@osf/shared/models/subject/subject.model';
import { SubjectsSelectors } from '@osf/shared/stores/subjects';

import { SearchInputComponent } from '../search-input/search-input.component';

@Component({
  selector: 'osf-subjects',
  imports: [Card, TranslatePipe, Chip, SearchInputComponent, Tree, TreeModule, Checkbox, Skeleton, FormsModule],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsComponent {
  subjects = select(SubjectsSelectors.getSubjects);
  subjectsLoading = select(SubjectsSelectors.getSubjectsLoading);
  searchedSubjects = select(SubjectsSelectors.getSearchedSubjects);
  areSubjectsUpdating = input<boolean>(false);
  isSearching = select(SubjectsSelectors.getSearchedSubjectsLoading);
  selected = input<SubjectModel[]>([]);
  readonly = input<boolean>(false);
  searchChanged = output<string>();
  loadChildren = output<string>();
  updateSelection = output<SubjectModel[]>();

  subjectsTree = computed(() => this.subjects().map((subject: SubjectModel) => this.mapSubjectToTreeNode(subject)));
  selectedTree = computed(() => this.selected().map((subject: SubjectModel) => this.mapSubjectToTreeNode(subject)));
  searchedList = computed(() =>
    this.searchedSubjects().map((subject: SubjectModel) => this.mapParentsSubject(subject))
  );

  childrenIdsMap = computed(() => this.buildChildrenIdsMap(this.searchedSubjects()));

  expanded: Record<string, boolean> = {};

  searchControl = new FormControl<string>('');

  constructor() {
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchChanged.emit(value ?? '');
    });
  }

  loadNode(event: TreeNode) {
    this.expanded[event.data.id] = true;
    if (event.data.children?.length === 0) {
      this.loadChildren.emit(event.data.id);
    }
  }

  collapseNode(event: TreeNode) {
    this.expanded[event.data.id] = false;
  }

  selectSubject(subject: SubjectModel) {
    if (this.readonly()) return;

    const childrenIds = this.getChildrenIds([subject]);
    const updatedSelection = [...this.selected().filter((s) => !childrenIds.includes(s.id)), subject];
    const parentSubjects = this.mapParentsSubject(subject.parent).filter(
      (p) => !updatedSelection.some((s) => s.id === p.id)
    );
    if (parentSubjects.length) {
      updatedSelection.push(...parentSubjects);
    }
    this.updateSelection.emit(updatedSelection);
  }

  removeSubject(subject: SubjectModel) {
    if (this.readonly()) return;

    const updatedSelection = this.selected().filter(
      (s) => s.id !== subject.id && !this.getChildrenIds([subject]).includes(s.id)
    );
    this.updateSelection.emit(updatedSelection);
  }

  selectSearched(event: CheckboxChangeEvent, subjects: SubjectModel[]) {
    if (this.readonly()) return;

    if (event.checked) {
      const map = new Map<string, SubjectModel>();
      [...this.selected(), ...subjects].forEach((subject) => map.set(subject.id, subject));
      this.updateSelection.emit([...map.values()]);
    } else {
      const currentSubject = subjects[subjects.length - 1];
      const childrenIds = this.childrenIdsMap()[currentSubject.id] ?? [];
      const updatedSelection = this.selected().filter((s) => s.id !== currentSubject.id && !childrenIds.includes(s.id));
      this.updateSelection.emit(updatedSelection);
    }
  }

  isChecked(subjects: SubjectModel[]): boolean {
    if (!subjects?.length) return false;

    const selectedIds = new Set(this.selected().map((s) => s.id));
    return subjects.every((s) => selectedIds.has(s.id));
  }

  private getChildrenIds(subjects: SubjectModel[]): string[] {
    return subjects.reduce((acc: string[], subject: SubjectModel) => {
      acc.push(subject.id);
      if (subject.children) {
        acc.push(...this.getChildrenIds(subject.children));
      }
      return acc;
    }, []);
  }

  private mapSubjectToTreeNode(subject: SubjectModel): TreeNode {
    return {
      label: subject.name,
      data: subject,
      key: subject.id,
      children: subject.children?.map((child: SubjectModel) => this.mapSubjectToTreeNode(child)),
      leaf: !subject.children,
      expanded: this.expanded[subject.id] ?? false,
    };
  }

  private mapParentsSubject(subject: SubjectModel | null | undefined, acc: SubjectModel[] = []): SubjectModel[] {
    if (!subject) {
      return acc.reverse();
    }

    acc.push(subject);
    return this.mapParentsSubject(subject.parent, acc);
  }

  private buildChildrenIdsMap(subjects: SubjectModel[]): Record<string, string[]> {
    const groupedByParent = new Map<string, SubjectModel[]>();
    subjects.forEach((s) => {
      if (s.parent?.id) {
        const arr = groupedByParent.get(s.parent.id) ?? [];
        arr.push(s);
        groupedByParent.set(s.parent.id, arr);
      }
    });

    const collectChildrenIds = (id: string): string[] => {
      const children = groupedByParent.get(id) ?? [];
      const ids = children.map((c) => c.id);
      for (const child of children) {
        ids.push(...collectChildrenIds(child.id));
      }
      return ids;
    };

    const result: Record<string, string[]> = {};
    subjects.forEach((s) => {
      result[s.id] = collectChildrenIds(s.id);
    });

    return result;
  }
}
