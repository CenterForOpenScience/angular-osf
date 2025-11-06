import { MockComponent } from 'ng-mocks';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectModel } from '@osf/shared/models/subject/subject.model';
import { SubjectsSelectors } from '@osf/shared/stores/subjects';

import { SearchInputComponent } from '../search-input/search-input.component';

import { SubjectsComponent } from './subjects.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('SubjectsComponent', () => {
  let component: SubjectsComponent;
  let fixture: ComponentFixture<SubjectsComponent>;

  const mockParentSubject: SubjectModel = {
    id: 'parent-1',
    name: 'Parent Subject',
    children: [],
    parent: null,
  };

  const mockChildSubject: SubjectModel = {
    id: 'child-1',
    name: 'Child Subject',
    children: [],
    parent: mockParentSubject,
  };

  const mockSubjectWithChildren: SubjectModel = {
    id: 'parent-2',
    name: 'Parent with Children',
    children: [mockChildSubject],
    parent: null,
  };

  const mockSubjects: SubjectModel[] = [mockParentSubject, mockSubjectWithChildren];
  const mockSearchedSubjects: SubjectModel[] = [mockChildSubject];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsComponent, OSFTestingStoreModule, MockComponent(SearchInputComponent)],
      providers: [
        provideMockStore({
          signals: [
            { selector: SubjectsSelectors.getSubjects, value: signal(mockSubjects) },
            { selector: SubjectsSelectors.getSubjectsLoading, value: signal(false) },
            { selector: SubjectsSelectors.getSearchedSubjects, value: signal(mockSearchedSubjects) },
            { selector: SubjectsSelectors.getSearchedSubjectsLoading, value: signal(false) },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize FormControl with empty string', () => {
    expect(component.searchControl.value).toBe('');
  });

  it('should have default areSubjectsUpdating input value as false', () => {
    expect(component.areSubjectsUpdating()).toBe(false);
  });

  it('should have default selected input value as empty array', () => {
    expect(component.selected()).toEqual([]);
  });

  it('should have default readonly input value as false', () => {
    expect(component.readonly()).toBe(false);
  });

  it('should set areSubjectsUpdating input correctly', () => {
    fixture.componentRef.setInput('areSubjectsUpdating', true);
    expect(component.areSubjectsUpdating()).toBe(true);
  });

  it('should set selected input correctly', () => {
    const selectedSubjects = [mockParentSubject];
    fixture.componentRef.setInput('selected', selectedSubjects);
    expect(component.selected()).toEqual(selectedSubjects);
  });

  it('should set readonly input correctly', () => {
    fixture.componentRef.setInput('readonly', true);
    expect(component.readonly()).toBe(true);
  });

  it('should compute subjectsTree correctly', () => {
    fixture.detectChanges();
    const tree = component.subjectsTree();
    expect(tree.length).toBe(2);
    expect(tree[0].label).toBe('Parent Subject');
    expect(tree[0].data).toBe(mockParentSubject);
    expect(tree[0].key).toBe('parent-1');
    expect(tree[1].children?.length).toBe(1);
  });

  it('should compute selectedTree correctly', () => {
    fixture.componentRef.setInput('selected', [mockParentSubject]);
    fixture.detectChanges();
    const tree = component.selectedTree();
    expect(tree.length).toBe(1);
    expect(tree[0].label).toBe('Parent Subject');
    expect(tree[0].data).toBe(mockParentSubject);
  });

  it('should compute searchedList correctly with parents', () => {
    fixture.detectChanges();
    const list = component.searchedList();
    expect(list.length).toBe(1);
    expect(list[0].length).toBeGreaterThan(0);
    expect(list[0][list[0].length - 1]).toBe(mockChildSubject);
  });

  it('should compute childrenIdsMap correctly', () => {
    fixture.detectChanges();
    const map = component.childrenIdsMap();
    expect(map).toBeDefined();
    expect(typeof map).toBe('object');
  });

  it('should update expanded state and emit loadChildren when loadNode is called with empty children', () => {
    const emitSpy = jest.spyOn(component.loadChildren, 'emit');
    const mockTreeNode = {
      data: { id: 'parent-1', children: [] },
    } as any;

    component.loadNode(mockTreeNode);

    expect(component.expanded['parent-1']).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith('parent-1');
  });

  it('should not emit loadChildren when loadNode is called with non-empty children', () => {
    const emitSpy = jest.spyOn(component.loadChildren, 'emit');
    const mockTreeNode = {
      data: { id: 'parent-2', children: [mockChildSubject] },
    } as any;

    component.loadNode(mockTreeNode);

    expect(component.expanded['parent-2']).toBe(true);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should update expanded state when collapseNode is called', () => {
    component.expanded['parent-1'] = true;
    const mockTreeNode = {
      data: { id: 'parent-1' },
    } as any;

    component.collapseNode(mockTreeNode);

    expect(component.expanded['parent-1']).toBe(false);
  });

  it('should emit updateSelection when selectSubject is called and readonly is false', () => {
    const emitSpy = jest.spyOn(component.updateSelection, 'emit');
    fixture.componentRef.setInput('readonly', false);
    fixture.detectChanges();

    component.selectSubject(mockParentSubject);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit updateSelection when selectSubject is called and readonly is true', () => {
    const emitSpy = jest.spyOn(component.updateSelection, 'emit');
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    component.selectSubject(mockParentSubject);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit updateSelection when removeSubject is called and readonly is false', () => {
    const emitSpy = jest.spyOn(component.updateSelection, 'emit');
    fixture.componentRef.setInput('selected', [mockParentSubject]);
    fixture.componentRef.setInput('readonly', false);
    fixture.detectChanges();

    component.removeSubject(mockParentSubject);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit updateSelection when removeSubject is called and readonly is true', () => {
    const emitSpy = jest.spyOn(component.updateSelection, 'emit');
    fixture.componentRef.setInput('selected', [mockParentSubject]);
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    component.removeSubject(mockParentSubject);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit updateSelection when selectSearched is called with checked true', () => {
    const emitSpy = jest.spyOn(component.updateSelection, 'emit');
    fixture.componentRef.setInput('readonly', false);
    fixture.detectChanges();

    const mockEvent = {
      checked: true,
    } as any;

    component.selectSearched(mockEvent, [mockParentSubject]);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit updateSelection when selectSearched is called with checked false', () => {
    const emitSpy = jest.spyOn(component.updateSelection, 'emit');
    fixture.componentRef.setInput('selected', [mockParentSubject]);
    fixture.componentRef.setInput('readonly', false);
    fixture.detectChanges();

    const mockEvent = {
      checked: false,
    } as any;

    component.selectSearched(mockEvent, [mockParentSubject]);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit updateSelection when selectSearched is called and readonly is true', () => {
    const emitSpy = jest.spyOn(component.updateSelection, 'emit');
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    const mockEvent = {
      checked: true,
    } as any;

    component.selectSearched(mockEvent, [mockParentSubject]);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should return true for isChecked when all subjects are selected', () => {
    fixture.componentRef.setInput('selected', [mockParentSubject, mockChildSubject]);
    fixture.detectChanges();

    const result = component.isChecked([mockParentSubject, mockChildSubject]);

    expect(result).toBe(true);
  });

  it('should return false for isChecked when not all subjects are selected', () => {
    fixture.componentRef.setInput('selected', [mockParentSubject]);
    fixture.detectChanges();

    const result = component.isChecked([mockParentSubject, mockChildSubject]);

    expect(result).toBe(false);
  });

  it('should return false for isChecked when subjects array is empty', () => {
    fixture.detectChanges();

    const result = component.isChecked([]);

    expect(result).toBe(false);
  });

  it('should emit searchChanged with debounce when searchControl value changes', () => {
    jest.useFakeTimers();
    const emitSpy = jest.spyOn(component.searchChanged, 'emit');

    component.searchControl.setValue('test search');
    jest.advanceTimersByTime(300);

    expect(emitSpy).toHaveBeenCalledWith('test search');
    jest.useRealTimers();
  });
});
