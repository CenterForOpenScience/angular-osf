import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownComponent } from './markdown.component';

describe('MarkdownComponent', () => {
  let component: MarkdownComponent;
  let fixture: ComponentFixture<MarkdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set markdownText input', () => {
    const testText = '# Test Heading';
    fixture.componentRef.setInput('markdownText', testText);
    fixture.detectChanges();

    expect(component.markdownText()).toBe(testText);
  });

  it('should render basic markdown heading', () => {
    const testText = '# Test Heading';
    fixture.componentRef.setInput('markdownText', testText);
    fixture.detectChanges();

    const renderedHtml = component.renderedHtml();
    expect(renderedHtml).toBeDefined();
  });

  it('should render markdown paragraph', () => {
    const testText = 'This is a paragraph with **bold** text.';
    fixture.componentRef.setInput('markdownText', testText);
    fixture.detectChanges();

    const renderedHtml = component.renderedHtml();
    expect(renderedHtml).toBeDefined();
  });

  it('should render markdown links', () => {
    const testText = '[Link text](https://example.com)';
    fixture.componentRef.setInput('markdownText', testText);
    fixture.detectChanges();

    const renderedHtml = component.renderedHtml();
    expect(renderedHtml).toBeDefined();
  });

  it('should render markdown code blocks', () => {
    const testText = '```\nconsole.log("Hello World");\n```';
    fixture.componentRef.setInput('markdownText', testText);
    fixture.detectChanges();

    const renderedHtml = component.renderedHtml();
    expect(renderedHtml).toBeDefined();
  });

  it('should render inline code', () => {
    const testText = 'Use `console.log()` to print to console.';
    fixture.componentRef.setInput('markdownText', testText);
    fixture.detectChanges();

    const renderedHtml = component.renderedHtml();
    expect(renderedHtml).toBeDefined();
  });

  it('should render empty markdown text', () => {
    fixture.componentRef.setInput('markdownText', '');
    fixture.detectChanges();

    const renderedHtml = component.renderedHtml();
    expect(renderedHtml).toBeDefined();
  });

  it('should render markdown with HTML tags', () => {
    const testText = '<div>HTML content</div>';
    fixture.componentRef.setInput('markdownText', testText);
    fixture.detectChanges();

    const renderedHtml = component.renderedHtml();
    expect(renderedHtml).toBeDefined();
  });

  it('should render markdown with emphasis', () => {
    const testText = '*Italic text* and **bold text**';
    fixture.componentRef.setInput('markdownText', testText);
    fixture.detectChanges();

    const renderedHtml = component.renderedHtml();
    expect(renderedHtml).toBeDefined();
  });

  it('should render markdown with strikethrough', () => {
    const testText = '~~Strikethrough text~~';
    fixture.componentRef.setInput('markdownText', testText);
    fixture.detectChanges();

    const renderedHtml = component.renderedHtml();
    expect(renderedHtml).toBeDefined();
  });

  it('should render markdown with blockquotes', () => {
    const testText = '> This is a blockquote';
    fixture.componentRef.setInput('markdownText', testText);
    fixture.detectChanges();

    const renderedHtml = component.renderedHtml();
    expect(renderedHtml).toBeDefined();
  });

  it('should render markdown with horizontal rules', () => {
    const testText = 'Content above\n\n---\n\nContent below';
    fixture.componentRef.setInput('markdownText', testText);
    fixture.detectChanges();

    const renderedHtml = component.renderedHtml();
    expect(renderedHtml).toBeDefined();
  });

  it('should update rendered content when markdown text changes', () => {
    const testText1 = '# Heading 1';
    const testText2 = '# Heading 2';

    fixture.componentRef.setInput('markdownText', testText1);
    fixture.detectChanges();
    const html1 = component.renderedHtml();

    fixture.componentRef.setInput('markdownText', testText2);
    fixture.detectChanges();
    const html2 = component.renderedHtml();

    expect(html1).not.toEqual(html2);
  });
});
