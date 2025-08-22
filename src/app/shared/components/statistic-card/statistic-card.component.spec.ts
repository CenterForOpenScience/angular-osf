import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticCardComponent } from './statistic-card.component';

describe('StatisticCardComponent', () => {
  let component: StatisticCardComponent;
  let fixture: ComponentFixture<StatisticCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value input correctly for string', () => {
    fixture.componentRef.setInput('value', 'test-value');
    expect(component.value()).toBe('test-value');
  });

  it('should set value input correctly for number', () => {
    fixture.componentRef.setInput('value', 42);
    expect(component.value()).toBe(42);
  });

  it('should set value input correctly for boolean', () => {
    fixture.componentRef.setInput('value', true);
    expect(component.value()).toBe(true);
  });

  it('should set value input correctly for null', () => {
    fixture.componentRef.setInput('value', null);
    expect(component.value()).toBe(null);
  });

  it('should have label input with default empty string', () => {
    expect(component.label()).toBe('');
  });

  it('should set label input correctly', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    expect(component.label()).toBe('Test Label');
  });
});
