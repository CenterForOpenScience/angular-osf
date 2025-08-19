import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept control input', () => {
    const fc = new FormControl<string>('hello');
    fixture.componentRef.setInput('control', fc);
    expect(component.control()).toBe(fc);
    expect(component.control().value).toBe('hello');
  });

  it('should accept placeholder input', () => {
    fixture.componentRef.setInput('placeholder', 'Search...');
    expect(component.placeholder()).toBe('Search...');
  });

  it('should accept showHelpIcon input', () => {
    fixture.componentRef.setInput('showHelpIcon', true);
    expect(component.showHelpIcon()).toBe(true);
  });

  it('should expose triggerSearch and helpClicked outputs', () => {
    expect(component.triggerSearch).toBeDefined();
    expect(component.helpClicked).toBeDefined();
  });

  it('should emit triggerSearch when control has non-empty trimmed value', () => {
    const spy = jest.fn();
    component.triggerSearch.subscribe(spy);

    component.control().setValue('  query  ');
    component.enterClicked();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('  query  ');
  });

  it('should not emit triggerSearch when control value is empty string', () => {
    const spy = jest.fn();
    component.triggerSearch.subscribe(spy);

    component.control().setValue('');
    component.enterClicked();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit triggerSearch when control value is whitespace only', () => {
    const spy = jest.fn();
    component.triggerSearch.subscribe(spy);

    component.control().setValue('   ');
    component.enterClicked();

    expect(spy).not.toHaveBeenCalled();
  });
});
