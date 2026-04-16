import { Mock } from 'vitest';

type CaptureExceptionFn = (error: unknown, hint?: unknown) => string;
type InitFn = (options?: unknown) => unknown;

export interface SentryMockType {
  captureException: Mock<CaptureExceptionFn>;
  init: Mock<InitFn>;
}

export const SentryMock = {
  simple(): SentryMockType {
    return {
      captureException: vi.fn(() => 'event-id'),
      init: vi.fn(),
    };
  },
};
