import { Mock } from 'vitest';

import { Signal, signal } from '@angular/core';

import { MaintenanceModeService } from '@core/services/maintenance-mode.service';

export type MaintenanceModeServiceMockType = Partial<MaintenanceModeService> & {
  activate: Mock<() => void>;
  deactivate: Mock<() => void>;
  isActive: Signal<boolean>;
};

export const MaintenanceModeServiceMock = {
  simple() {
    return {
      activate: vi.fn(),
      deactivate: vi.fn(),
      isActive: signal(false).asReadonly(),
    } as MaintenanceModeServiceMockType;
  },
};
