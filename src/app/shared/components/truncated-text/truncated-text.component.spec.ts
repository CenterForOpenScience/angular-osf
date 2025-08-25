import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruncatedTextComponent } from '@shared/components';
import { TranslateServiceMock } from '@shared/mocks';

describe('TruncatedTextComponent', () => {
  let component: TruncatedTextComponent;
  let fixture: ComponentFixture<TruncatedTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruncatedTextComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(TruncatedTextComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set text input correctly', () => {
    fixture.componentRef.setInput('text', 'Test text content');
    expect(component.text()).toBe('Test text content');
  });

  it('should set hasContent input correctly', () => {
    fixture.componentRef.setInput('hasContent', true);
    expect(component.hasContent()).toBe(true);
  });

  it('should set maxVisibleLines input correctly', () => {
    fixture.componentRef.setInput('maxVisibleLines', 5);
    expect(component.maxVisibleLines()).toBe(5);
  });

  it('should toggle isTextExpanded from false to true', () => {
    expect(component['isTextExpanded']()).toBe(false);
    component['toggleTextExpansion']();
    expect(component['isTextExpanded']()).toBe(true);
  });

  it('should toggle isTextExpanded from true to false', () => {
    component['isTextExpanded'].set(true);
    expect(component['isTextExpanded']()).toBe(true);
    component['toggleTextExpansion']();
    expect(component['isTextExpanded']()).toBe(false);
  });

  it('should call checkTextOverflow in ngAfterViewInit', () => {
    const checkTextOverflowSpy = jest.spyOn(component as any, 'checkTextOverflow');

    component.ngAfterViewInit();

    expect(checkTextOverflowSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle empty text input', () => {
    fixture.componentRef.setInput('text', '');
    expect(component.text()).toBe('');
  });

  it('should handle different hasContent values', () => {
    fixture.componentRef.setInput('hasContent', true);
    expect(component.hasContent()).toBe(true);

    fixture.componentRef.setInput('hasContent', false);
    expect(component.hasContent()).toBe(false);
  });

  it('should handle different maxVisibleLines values', () => {
    const values = [1, 2, 3, 5, 10, 100];

    values.forEach((value) => {
      fixture.componentRef.setInput('maxVisibleLines', value);
      expect(component.maxVisibleLines()).toBe(value);
    });
  });

  it('should handle negative maxVisibleLines', () => {
    fixture.componentRef.setInput('maxVisibleLines', -1);
    expect(component.maxVisibleLines()).toBe(-1);
  });

  it('should properly update isTextExpanded signal', () => {
    expect(component['isTextExpanded']()).toBe(false);

    component['isTextExpanded'].set(true);
    expect(component['isTextExpanded']()).toBe(true);

    component['isTextExpanded'].set(false);
    expect(component['isTextExpanded']()).toBe(false);
  });

  it('should properly update hasOverflowingText signal', () => {
    expect(component['hasOverflowingText']()).toBe(false);

    component['hasOverflowingText'].set(true);
    expect(component['hasOverflowingText']()).toBe(true);

    component['hasOverflowingText'].set(false);
    expect(component['hasOverflowingText']()).toBe(false);
  });
});
