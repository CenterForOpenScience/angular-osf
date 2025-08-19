import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@shared/mocks';

import { TagsInputComponent } from './tags-input.component';

describe('TagsInputComponent', () => {
  let component: TagsInputComponent;
  let fixture: ComponentFixture<TagsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsInputComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(TagsInputComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tags input correctly', () => {
    const mockTags = ['tag1', 'tag2', 'tag3'];
    fixture.componentRef.setInput('tags', mockTags);
    expect(component.tags()).toEqual(mockTags);
  });

  it('should set required input to true', () => {
    fixture.componentRef.setInput('required', true);
    expect(component.required()).toBe(true);
  });

  it('should set readonly input to true', () => {
    fixture.componentRef.setInput('readonly', true);
    expect(component.readonly()).toBe(true);
  });

  it('should emit tagsChanged event', () => {
    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');
    const mockTags = ['tag1', 'tag2'];

    component.tagsChanged.emit(mockTags);

    expect(emitSpy).toHaveBeenCalledWith(mockTags);
  });

  it('should have inputValue signal accessible', () => {
    expect(component.inputValue).toBeDefined();
    expect(typeof component.inputValue).toBe('function');
  });

  it('should set inputValue signal correctly', () => {
    component.inputValue.set('test input');
    expect(component.inputValue()).toBe('test input');
  });

  it('should have localTags signal accessible', () => {
    expect(component.localTags).toBeDefined();
    expect(typeof component.localTags).toBe('function');
  });

  it('should initialize localTags with empty array', () => {
    expect(component.localTags()).toEqual([]);
  });

  it('should set localTags signal correctly', () => {
    const mockTags = ['local1', 'local2'];
    component.localTags.set(mockTags);
    expect(component.localTags()).toEqual(mockTags);
  });

  it('should have inputElement viewChild accessible', () => {
    expect(component.inputElement).toBeDefined();
    expect(typeof component.inputElement).toBe('function');
  });

  it('should handle removeTag method', () => {
    component.localTags.set(['tag1', 'tag2', 'tag3']);
    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');

    component.removeTag(1);

    expect(component.localTags()).toEqual(['tag1', 'tag3']);
    expect(emitSpy).toHaveBeenCalledWith(['tag1', 'tag3']);
  });

  it('should handle removeTag method in readonly mode', () => {
    fixture.componentRef.setInput('readonly', true);
    component.localTags.set(['tag1', 'tag2', 'tag3']);
    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');

    component.removeTag(1);

    expect(component.localTags()).toEqual(['tag1', 'tag2', 'tag3']);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should handle rapid tag removals', () => {
    component.localTags.set(['tag1', 'tag2', 'tag3', 'tag4']);
    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');

    component.removeTag(0);
    component.removeTag(1);

    expect(component.localTags()).toEqual(['tag2', 'tag4']);
    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenNthCalledWith(1, ['tag2', 'tag3', 'tag4']);
    expect(emitSpy).toHaveBeenNthCalledWith(2, ['tag2', 'tag4']);
  });
});
