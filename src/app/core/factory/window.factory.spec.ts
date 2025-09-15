// src/app/window.spec.ts
import { isPlatformBrowser } from '@angular/common';

import { windowFactory } from './window.factory';

jest.mock('@angular/common', () => ({
  isPlatformBrowser: jest.fn(),
}));

describe('windowFactory', () => {
  const mockWindow = globalThis.window;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return window object if platform is browser', () => {
    (isPlatformBrowser as jest.Mock).mockReturnValue(true);

    const result = windowFactory('browser');
    expect(isPlatformBrowser).toHaveBeenCalledWith('browser');
    expect(result).toBe(mockWindow);
  });

  it('should return empty object if platform is not browser', () => {
    (isPlatformBrowser as jest.Mock).mockReturnValue(false);

    const result = windowFactory('server');
    expect(isPlatformBrowser).toHaveBeenCalledWith('server');
    expect(result).toEqual({});
  });
});
