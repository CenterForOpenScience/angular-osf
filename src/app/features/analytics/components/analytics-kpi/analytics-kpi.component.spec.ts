import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AnalyticsKpiComponent } from './analytics-kpi.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('AnalyticsKpiComponent', () => {
  let component: AnalyticsKpiComponent;
  let fixture: ComponentFixture<AnalyticsKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsKpiComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsKpiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.showButton()).toBe(false);
    expect(component.buttonLabel()).toBe('');
    expect(component.title()).toBe('');
    expect(component.value()).toBe(0);
  });

  it('should update inputs via setInput', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('showButton', true);
    fixture.componentRef.setInput('buttonLabel', 'CLICK_ME');
    fixture.componentRef.setInput('title', 'T');
    fixture.componentRef.setInput('value', 7);

    expect(component.isLoading()).toBe(true);
    expect(component.showButton()).toBe(true);
    expect(component.buttonLabel()).toBe('CLICK_ME');
    expect(component.title()).toBe('T');
    expect(component.value()).toBe(7);
  });

  it('should render title set via setInput', () => {
    fixture.componentRef.setInput('title', 'SOME_TITLE');
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(By.css('p.title'));
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.textContent.trim()).toBe('SOME_TITLE');
  });

  it('should show button with label and emit on click', () => {
    const clickSpy = jest.fn();
    component.buttonClick.subscribe(() => clickSpy());

    fixture.componentRef.setInput('showButton', true);
    fixture.componentRef.setInput('buttonLabel', 'CLICK_ME');
    fixture.detectChanges();

    const nativeButton = fixture.debugElement.query(By.css('button.p-button'));
    expect(nativeButton).toBeTruthy();
    expect(nativeButton.nativeElement.textContent.trim()).toBe('CLICK_ME');

    nativeButton.nativeElement.click();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should toggle button visibility via setInput', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button.p-button'))).toBeNull();

    fixture.componentRef.setInput('showButton', true);
    fixture.componentRef.setInput('buttonLabel', 'LBL');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button.p-button'))).toBeTruthy();

    fixture.componentRef.setInput('showButton', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button.p-button'))).toBeNull();
  });
});
