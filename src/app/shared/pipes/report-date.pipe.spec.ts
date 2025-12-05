import { ReportDatePipe } from './report-date.pipe';

describe('ReportDatePipe', () => {
  let pipe: ReportDatePipe;

  beforeEach(() => {
    pipe = new ReportDatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "2024-08" to "August 1, 2024"', () => {
    expect(pipe.transform('2024-08')).toBe('August 1, 2024');
  });

  it('should transform "2024-12" to "December 1, 2024"', () => {
    expect(pipe.transform('2024-12')).toBe('December 1, 2024');
  });

  it('should transform "2025-01" to "January 1, 2025"', () => {
    expect(pipe.transform('2025-01')).toBe('January 1, 2025');
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should return empty string for invalid format', () => {
    expect(pipe.transform('invalid')).toBe('');
    expect(pipe.transform('2024')).toBe('');
    expect(pipe.transform('2024-')).toBe('');
  });

  it('should return empty string for invalid month', () => {
    expect(pipe.transform('2024-13')).toBe('');
    expect(pipe.transform('2024-00')).toBe('');
  });
});
