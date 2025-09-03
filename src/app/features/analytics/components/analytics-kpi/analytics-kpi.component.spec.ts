import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsKpiComponent } from './analytics-kpi.component';

describe.skip('AnalyticsKpiComponent', () => {
  let component: AnalyticsKpiComponent;
  let fixture: ComponentFixture<AnalyticsKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsKpiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
