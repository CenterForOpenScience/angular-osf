import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { MetadataTagsComponent } from './metadata-tags.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

describe('MetadataTagsComponent', () => {
  let component: MetadataTagsComponent;
  let fixture: ComponentFixture<MetadataTagsComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  const mockTags = ['tag1', 'tag2', 'tag3'];

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [MetadataTagsComponent, OSFTestingModule],
      providers: [MockProvider(Router, routerMock)],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataTagsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.tags()).toEqual([]);
    expect(component.readonly()).toBe(false);
  });

  it('should set tags input', () => {
    fixture.componentRef.setInput('tags', mockTags);
    fixture.detectChanges();

    expect(component.tags()).toEqual(mockTags);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });

  it('should emit tagsChanged event', () => {
    const emitSpy = jest.spyOn(component.tagsChanged, 'emit');
    const newTags = ['new-tag1', 'new-tag2'];

    component.tagsChanged.emit(newTags);

    expect(emitSpy).toHaveBeenCalledWith(newTags);
  });

  it('should navigate to search when tag is clicked', () => {
    const testTag = 'test-tag';

    component.tagClicked(testTag);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { search: testTag } });
  });

  it('should render tags-input component when not readonly', () => {
    fixture.componentRef.setInput('readonly', false);
    fixture.componentRef.setInput('tags', mockTags);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const tagsInputComponent = compiled.querySelector('osf-tags-input');
    expect(tagsInputComponent).toBeTruthy();
  });

  it('should render p-tag elements when readonly', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.componentRef.setInput('tags', mockTags);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const tagElements = compiled.querySelectorAll('p-tag');
    expect(tagElements.length).toBe(mockTags.length);
  });

  it('should display translated label', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const heading = compiled.querySelector('h2');
    expect(heading).toBeTruthy();
  });

  it('should handle empty tags array', () => {
    fixture.componentRef.setInput('tags', []);
    fixture.detectChanges();

    expect(component.tags()).toEqual([]);
  });

  it('should handle tag click with empty string', () => {
    component.tagClicked('');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { search: '' } });
  });
});
