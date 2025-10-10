import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsInputComponent } from './tags-input.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('TagsInputComponent', () => {
  let component: TagsInputComponent;
  let fixture: ComponentFixture<TagsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsInputComponent, OSFTestingModule],
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

  it('should focus input element when called', () => {
    const mockInputElement = {
      nativeElement: {
        focus: jest.fn(),
      },
    };

    Object.defineProperty(component, 'inputElement', {
      get: () => () => mockInputElement,
    });

    component.onContainerClick();

    expect(mockInputElement.nativeElement.focus).toHaveBeenCalled();
  });

  it('should handle when input element is null', () => {
    Object.defineProperty(component, 'inputElement', {
      get: () => () => null,
    });

    expect(() => component.onContainerClick()).not.toThrow();
  });

  it('should add tag on Enter key with value', () => {
    const mockEvent = {
      key: 'Enter',
      preventDefault: jest.fn(),
      target: {
        value: 'new tag',
      },
    } as unknown as KeyboardEvent;

    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');
    component.localTags.set(['existing tag']);

    component.onInputKeydown(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(component.localTags()).toEqual(['existing tag', 'new tag']);
    expect(emitSpy).toHaveBeenCalledWith(['existing tag', 'new tag']);
    expect((mockEvent.target as HTMLInputElement).value).toBe('');
    expect(component.inputValue()).toBe('');
  });

  it('should add tag on Comma key with value', () => {
    const mockEvent = {
      key: ',',
      preventDefault: jest.fn(),
      target: {
        value: 'new tag',
      },
    } as unknown as KeyboardEvent;

    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');
    component.localTags.set(['existing tag']);

    component.onInputKeydown(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(component.localTags()).toEqual(['existing tag', 'new tag']);
    expect(emitSpy).toHaveBeenCalledWith(['existing tag', 'new tag']);
  });

  it('should remove last tag on Backspace with empty value and existing tags', () => {
    const mockEvent = {
      key: 'Backspace',
      preventDefault: jest.fn(),
      target: {
        value: '',
      },
    } as unknown as KeyboardEvent;

    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');
    component.localTags.set(['tag1', 'tag2', 'tag3']);

    component.onInputKeydown(mockEvent);

    expect(component.localTags()).toEqual(['tag1', 'tag2']);
    expect(emitSpy).toHaveBeenCalledWith(['tag1', 'tag2']);
  });

  it('should not remove tag on Backspace when value is not empty', () => {
    const mockEvent = {
      key: 'Backspace',
      preventDefault: jest.fn(),
      target: {
        value: 'some value',
      },
    } as unknown as KeyboardEvent;

    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');
    component.localTags.set(['tag1', 'tag2']);

    component.onInputKeydown(mockEvent);

    expect(component.localTags()).toEqual(['tag1', 'tag2']);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not remove tag on Backspace when no tags exist', () => {
    const mockEvent = {
      key: 'Backspace',
      preventDefault: jest.fn(),
      target: {
        value: '',
      },
    } as unknown as KeyboardEvent;

    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');
    component.localTags.set([]);

    component.onInputKeydown(mockEvent);

    expect(component.localTags()).toEqual([]);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should add tag when value exists', () => {
    const mockEvent = {
      target: {
        value: 'new tag',
      },
    } as unknown as FocusEvent;

    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');
    component.localTags.set(['existing tag']);

    component.onInputBlur(mockEvent);

    expect(component.localTags()).toEqual(['existing tag', 'new tag']);
    expect(emitSpy).toHaveBeenCalledWith(['existing tag', 'new tag']);
    expect((mockEvent.target as HTMLInputElement).value).toBe('');
    expect(component.inputValue()).toBe('');
  });

  it('should not add tag when value is empty', () => {
    const mockEvent = {
      target: {
        value: '   ',
      },
    } as unknown as FocusEvent;

    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');
    component.localTags.set(['existing tag']);

    component.onInputBlur(mockEvent);

    expect(component.localTags()).toEqual(['existing tag']);
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
