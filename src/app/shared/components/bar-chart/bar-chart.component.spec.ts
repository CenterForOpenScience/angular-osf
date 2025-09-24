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

  it('should have access to PIE_CHART_PALETTE', () => {
    expect(component.PIE_CHART_PALETTE).toBeDefined();
    expect(Array.isArray(component.PIE_CHART_PALETTE)).toBe(true);
  });

  it('should return different colors from PIE_CHART_PALETTE for different indices', () => {
    const color1 = component.PIE_CHART_PALETTE[0];
    const color2 = component.PIE_CHART_PALETTE[1];

    expect(color1).toBeDefined();
    expect(color2).toBeDefined();
    expect(color1).not.toBe(color2);
  });

  it('should initialize chart data and options on ngOnInit', () => {
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

    component.ngOnInit();

    expect(mockGetComputedStyle).toHaveBeenCalledWith(document.documentElement);
    expect(component.data()).toBeDefined();
    expect(component.options()).toBeDefined();

    mockGetComputedStyle.mockRestore();
  });
});
