import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TagsListComponent } from './tags-list.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('TagsListComponent', () => {
  let component: TagsListComponent;
  let fixture: ComponentFixture<TagsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsListComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TagsListComponent);
    component = fixture.componentInstance;
  });

  it('should have default input values', () => {
    expect(component.tags()).toEqual([]);
    expect(component.isLoading()).toBe(false);
  });

  it('should set tags input correctly', () => {
    const mockTags = ['tag1', 'tag2', 'tag3'];
    fixture.componentRef.setInput('tags', mockTags);
    expect(component.tags()).toEqual(mockTags);
  });

  it('should set isLoading input correctly', () => {
    fixture.componentRef.setInput('isLoading', true);
    expect(component.isLoading()).toBe(true);
  });

  it('should render tags when tags array has items and isLoading is false', () => {
    const mockTags = ['tag1', 'tag2', 'tag3'];
    fixture.componentRef.setInput('tags', mockTags);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const tagElements = fixture.debugElement.queryAll(By.css('p-tag'));
    expect(tagElements.length).toBe(3);
  });

  it('should have tagClick output defined', () => {
    expect(component.tagClick).toBeDefined();
  });

  it('should emit tagClick with correct tag value when tag is clicked', () => {
    const mockTags = ['tag1', 'tag2', 'tag3'];
    fixture.componentRef.setInput('tags', mockTags);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.tagClick, 'emit');
    const tagElements = fixture.debugElement.queryAll(By.css('p-tag'));

    tagElements[0].triggerEventHandler('click', null);

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('tag1');
  });
});
