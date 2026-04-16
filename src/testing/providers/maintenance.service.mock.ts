import { of } from 'rxjs';

import { Mock } from 'vitest';

import { MaintenanceService } from '@core/components/osf-banners/services/maintenance.service';

export type MaintenanceServiceMockType = Partial<MaintenanceService> & {
  apiUrl: string;
  fetchMaintenanceStatus: Mock;
};

export const MaintenanceServiceMock = {
  simple(): MaintenanceServiceMockType {
    return {
      apiUrl: 'https://api.test/v2',
      fetchMaintenanceStatus: vi.fn().mockReturnValue(of(null)),
    };
  },
};
