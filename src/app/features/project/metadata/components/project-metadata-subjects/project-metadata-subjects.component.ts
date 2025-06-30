import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Chip } from 'primeng/chip';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

import { ProjectOverview, ProjectOverviewSubject } from '@osf/features/project/overview/models';
import { SearchInputComponent } from '@shared/components';
import { NodeSubjectModel } from '@shared/models';

interface SubjectOption {
  id: string;
  label: string;
  children?: SubjectOption[];
  expanded?: boolean;
  selected?: boolean;
  indeterminate?: boolean;
  level?: number;
}

@Component({
  selector: 'osf-project-metadata-subjects',
  imports: [Card, Chip, TranslatePipe, FormsModule, Checkbox, NgClass, SearchInputComponent],
  templateUrl: './project-metadata-subjects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataSubjectsComponent {
  subjectsChanged = output<ProjectOverviewSubject[]>();

  currentProject = input.required<ProjectOverview | null>();
  subjectsList = input<NodeSubjectModel[]>([]);

  searchControl = new FormControl('');

  selectedSubjects = signal<ProjectOverviewSubject[]>([]);
  searchValue = signal<string>('');
  filteredOptions = signal<SubjectOption[]>([]);

  subjectOptions = computed<SubjectOption[]>(() => {
    const subjects = this.subjectsList();
    return this.convertMetadataSubjectsToOptions(subjects);
  });

  constructor() {
    effect(() => {
      const project = this.currentProject();
      if (project?.subjects) {
        this.selectedSubjects.set([...project.subjects]);
        this.updateSelectionState();
      }
    });

    effect(() => {
      const options = this.subjectOptions();
      if (options.length > 0) {
        this.filterOptions();
      }
    });

    this.searchControl.valueChanges.subscribe((value) => {
      this.searchValue.set(value || '');
      this.filterOptions();
    });
  }

  onInputFocus() {
    this.filterOptions();
  }

  filterOptions() {
    const search = this.searchValue().toLowerCase();
    const filtered = this.filterOptionsRecursive(this.subjectOptions(), search);
    this.filteredOptions.set(filtered);
  }

  private filterOptionsRecursive(options: SubjectOption[], search: string): SubjectOption[] {
    const filtered: SubjectOption[] = [];

    for (const option of options) {
      const matchesSearch = !search || option.label.toLowerCase().includes(search);
      const filteredChildren = option.children ? this.filterOptionsRecursive(option.children, search) : [];

      if (matchesSearch || filteredChildren.length > 0) {
        const originalOption = this.findOptionById(this.subjectOptions(), option.id);

        filtered.push({
          ...option,
          selected: originalOption ? originalOption.selected || false : false,
          indeterminate: originalOption ? originalOption.indeterminate || false : false,
          expanded: search ? true : originalOption ? originalOption.expanded || false : false,
          children: filteredChildren.length > 0 ? filteredChildren : option.children,
        });
      }
    }

    return filtered;
  }

  toggleExpand(option: SubjectOption, event: Event) {
    event.stopPropagation();
    const originalOption = this.findOptionById(this.subjectOptions(), option.id);
    if (originalOption) {
      originalOption.expanded = !originalOption.expanded;
    }
    this.filterOptions();
  }

  private findOptionById(options: SubjectOption[], id: string): SubjectOption | null {
    for (const option of options) {
      if (option.id === id) {
        return option;
      }
      if (option.children) {
        const found = this.findOptionById(option.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  private findAllChildrenIds(option: SubjectOption): string[] {
    let ids: string[] = [];
    if (option.children) {
      option.children.forEach((child) => {
        ids.push(child.id);
        ids = ids.concat(this.findAllChildrenIds(child));
      });
    }
    return ids;
  }

  toggleSelection(option: SubjectOption) {
    const originalOption = this.findOptionById(this.subjectOptions(), option.id);
    if (!originalOption) return;

    const newSelectedState = !originalOption.selected;

    const expandedStates = this.getExpandedStates();

    originalOption.selected = newSelectedState;
    originalOption.indeterminate = false;

    let updatedSubjects = [...this.selectedSubjects()];

    if (newSelectedState) {
      updatedSubjects.push({ id: originalOption.id, text: originalOption.label });
      if (originalOption.children) {
        this.addChildrenToSelection(originalOption.children, updatedSubjects);
        this.updateChildrenSelection(originalOption.children, true);
      }
    } else {
      const idsToRemove = [originalOption.id, ...this.findAllChildrenIds(originalOption)];
      updatedSubjects = updatedSubjects.filter((s) => !idsToRemove.includes(s.id));
      if (originalOption.children) {
        this.updateChildrenSelection(originalOption.children, false);
      }
    }

    this.selectedSubjects.set(this.getUniqueSubjects(updatedSubjects));

    this.updateParentSelectionState();

    this.restoreExpandedStates(expandedStates);

    if (originalOption.children && originalOption.children.length > 0) {
      originalOption.expanded = true;
    }

    this.filterOptions();

    this.subjectsChanged.emit(this.selectedSubjects());
  }

  private updateChildrenSelection(children: SubjectOption[], selected: boolean) {
    children.forEach((child) => {
      child.selected = selected;
      child.indeterminate = false;
      if (child.children) {
        this.updateChildrenSelection(child.children, selected);
      }
    });
  }

  private convertMetadataSubjectsToOptions(subjects: NodeSubjectModel[]): SubjectOption[] {
    const selectedIds = this.selectedSubjects().map((s) => s.id);

    const convertSubject = (subject: NodeSubjectModel): SubjectOption => {
      const isSelected = selectedIds.includes(subject.id);
      const option: SubjectOption = {
        id: subject.id,
        label: subject.text,
        expanded: false,
        selected: isSelected,
        level: subject.level,
      };

      if (subject.children && subject.children.length > 0) {
        option.children = subject.children.map(convertSubject);
        const allChildrenSelected = option.children.every((child) => child.selected);
        const someChildrenSelected = option.children.some((child) => child.selected || child.indeterminate);

        if (someChildrenSelected) {
          option.expanded = true;
        }

        option.selected = allChildrenSelected;
        option.indeterminate = !allChildrenSelected && someChildrenSelected;
      }

      return option;
    };

    return subjects.map(convertSubject);
  }

  private addChildrenToSelection(children: SubjectOption[], selectedSubjects: ProjectOverviewSubject[]) {
    children.forEach((child) => {
      selectedSubjects.push({ id: child.id, text: child.label });
      if (child.children) {
        this.addChildrenToSelection(child.children, selectedSubjects);
      }
    });
  }

  removeSubject(subject: ProjectOverviewSubject) {
    const updatedSubjects = this.selectedSubjects().filter((s) => s.id !== subject.id);
    this.selectedSubjects.set(updatedSubjects);
    this.updateSelectionState();
    this.subjectsChanged.emit(updatedSubjects);
  }

  private updateSelectionState() {
    const selectedIds = this.selectedSubjects().map((s) => s.id);
    this.updateOptionsSelection(this.subjectOptions(), selectedIds);
    this.updateParentSelectionState();
    this.filterOptions();
  }

  private updateOptionsSelection(options: SubjectOption[], selectedIds: string[]) {
    options.forEach((option) => {
      option.selected = selectedIds.includes(option.id);
      option.indeterminate = false;
      if (option.children) {
        this.updateOptionsSelection(option.children, selectedIds);
      }
    });
  }

  private updateParentSelectionState() {
    const updateParent = (options: SubjectOption[]) => {
      options.forEach((parent) => {
        if (parent.children) {
          const selectedChildren = parent.children.filter((child) => child.selected).length;
          const indeterminateChildren = parent.children.filter((child) => child.indeterminate).length;
          const totalChildren = parent.children.length;

          if (selectedChildren === 0 && indeterminateChildren === 0) {
            parent.selected = false;
            parent.indeterminate = false;
          } else if (selectedChildren === totalChildren) {
            parent.selected = true;
            parent.indeterminate = false;
          } else {
            parent.selected = false;
            parent.indeterminate = true;
          }

          updateParent(parent.children);
        }
      });
    };

    updateParent(this.subjectOptions());
  }

  getUniqueSubjects(subjects?: ProjectOverviewSubject[]): ProjectOverviewSubject[] {
    const seen = new Set<string>();
    const subjectList = subjects ? subjects : this.selectedSubjects();
    return subjectList.filter((subject) => {
      if (seen.has(subject.id)) {
        return false;
      }
      seen.add(subject.id);
      return true;
    });
  }

  private getExpandedStates(): Map<string, boolean> {
    const expandedStates = new Map<string, boolean>();
    this.collectExpandedStates(this.subjectOptions(), expandedStates);
    return expandedStates;
  }

  private collectExpandedStates(options: SubjectOption[], expandedStates: Map<string, boolean>) {
    options.forEach((option) => {
      expandedStates.set(option.id, option.expanded || false);
      if (option.children) {
        this.collectExpandedStates(option.children, expandedStates);
      }
    });
  }

  private restoreExpandedStates(expandedStates: Map<string, boolean>) {
    this.applyExpandedStates(this.subjectOptions(), expandedStates);
  }

  private applyExpandedStates(options: SubjectOption[], expandedStates: Map<string, boolean>) {
    options.forEach((option) => {
      option.expanded = expandedStates.get(option.id) || false;
      if (option.children) {
        this.applyExpandedStates(option.children, expandedStates);
      }
    });
  }
}
