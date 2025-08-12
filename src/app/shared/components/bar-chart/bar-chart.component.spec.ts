import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@shared/mocks';

import { BarChartComponent } from './bar-chart.component';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.title()).toBe('');
    expect(component.labels()).toEqual([]);
    expect(component.datasets()).toEqual([]);
    expect(component.showLegend()).toBe(false);
    expect(component.showGrid()).toBe(false);
    expect(component.showTicks()).toBe(true);
    expect(component.orientation()).toBe('horizontal');
    expect(component.showExpandedSection()).toBe(false);
  });

  it('should return color from getColor method', () => {
    const color1 = component.getColor(0);
    const color2 = component.getColor(1);
    const color3 = component.getColor(10);

    expect(color1).toBeDefined();
    expect(color2).toBeDefined();
    expect(color3).toBeDefined();
    expect(typeof color1).toBe('string');
  });

  it('should return different colors for different indices', () => {
    const color1 = component.getColor(0);
    const color2 = component.getColor(1);

    expect(color1).not.toBe(color2);
  });

  it('should initialize chart successfully', () => {
    const mockGetPropertyValue = jest.fn((prop: string) => {
      const colors: Record<string, string> = {
        '--dark-blue-1': '#1a365d',
        '--grey-2': '#e2e8f0',
        '--pr-blue-1': '#3182ce',
      };
      return colors[prop] || '#000000';
    });

    const mockGetComputedStyle = jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: mockGetPropertyValue,
    } as any);

    (component as any).initChart();

    expect(mockGetComputedStyle).toHaveBeenCalledWith(document.documentElement);

    mockGetComputedStyle.mockRestore();
  });
});
