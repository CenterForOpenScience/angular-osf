import { Mock } from 'vitest';

import { HttpErrorResponse } from '@angular/common/http';
import { Signal, signal } from '@angular/core';

import { MaintenanceModeService } from '@core/services/maintenance-mode.service';

export type MaintenanceModeServiceMockType = Partial<MaintenanceModeService> & {
  activate: Mock<() => void>;
  deactivate: Mock<() => void>;
  checkOnce: Mock<() => void>;
  isMaintenanceError: Mock<(error: HttpErrorResponse) => boolean>;
  isActive: Signal<boolean>;
};

export const MaintenanceModeServiceMock = {
  simple(isActive = false) {
    return {
      activate: vi.fn(),
      deactivate: vi.fn(),
      checkOnce: vi.fn(),
      isMaintenanceError: vi.fn(
        (error: HttpErrorResponse) => error.status === 503 && error.error?.meta?.maintenance_mode === true
      ),
      isActive: signal(isActive).asReadonly(),
    } as MaintenanceModeServiceMockType;
  },
};
