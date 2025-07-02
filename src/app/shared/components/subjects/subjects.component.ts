import { TranslatePipe } from '@ngx-translate/core';

import { TreeNode } from 'primeng/api';
import { Card } from 'primeng/card';
import { Checkbox, CheckboxChangeEvent } from 'primeng/checkbox';
import { Chip } from 'primeng/chip';
import { Skeleton } from 'primeng/skeleton';
import { Tree, TreeModule } from 'primeng/tree';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subject } from '@osf/shared/models';

import { SearchInputComponent } from '../search-input/search-input.component';

@Component({
  selector: 'osf-subjects',
  imports: [Card, TranslatePipe, Chip, SearchInputComponent, Tree, TreeModule, Checkbox, Skeleton],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsComponent {
  list = input<Subject[]>([]);
  searchedSubjects = input<Subject[]>([]);
  loading = input<boolean>(false);
  isSearching = input<boolean>(false);
  selected = input<Subject[]>([]);
  searchChanged = output<string>();
  loadChildren = output<string>();
  updateSelection = output<Subject[]>();

  subjectsTree = computed(() => this.list().map((subject: Subject) => this.mapSubjectToTreeNode(subject)));
  selectedTree = computed(() => this.selected().map((subject: Subject) => this.mapSubjectToTreeNode(subject)));
  searchedList = computed(() => this.searchedSubjects().map((subject: Subject) => this.mapParentsSubject(subject)));
  expanded: Record<string, boolean> = {};

  protected searchControl = new FormControl<string>('');

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

  selectSubject(subject: Subject) {
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

  removeSubject(subject: Subject) {
    const updatedSelection = this.selected().filter(
      (s) => s.id !== subject.id && !this.getChildrenIds([subject]).includes(s.id)
    );
    this.updateSelection.emit(updatedSelection);
  }

  selectSearched(event: CheckboxChangeEvent, subjects: Subject[]) {
    if (event.checked) {
      this.updateSelection.emit([...this.selected(), ...subjects]);
    } else {
      const updatedSelection = this.selected().filter((s) => !subjects.some((sub) => sub.id === s.id));
      this.updateSelection.emit(updatedSelection);
    }
  }

  private getChildrenIds(subjects: Subject[]): string[] {
    return subjects.reduce((acc: string[], subject: Subject) => {
      acc.push(subject.id);
      if (subject.children) {
        acc.push(...this.getChildrenIds(subject.children));
      }
      return acc;
    }, []);
  }

  private mapSubjectToTreeNode(subject: Subject): TreeNode {
    return {
      label: subject.name,
      data: subject,
      key: subject.id,
      children: subject.children?.map((child: Subject) => this.mapSubjectToTreeNode(child)),
      leaf: !subject.children,
      expanded: this.expanded[subject.id] ?? false,
    };
  }

  private mapParentsSubject(subject: Subject | null | undefined, acc: Subject[] = []): Subject[] {
    if (!subject) {
      return acc.reverse();
    }

    acc.push(subject);
    return this.mapParentsSubject(subject.parent, acc);
  }
}
