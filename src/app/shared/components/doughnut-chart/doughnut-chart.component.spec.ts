import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutChartComponent } from './doughnut-chart.component';

describe('PieChartComponent', () => {
  let component: DoughnutChartComponent;
  let fixture: ComponentFixture<DoughnutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoughnutChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoughnutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
