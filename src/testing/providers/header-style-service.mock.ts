import { Mock } from 'vitest';

import { HeaderStyleService } from '@osf/shared/services/header-style.service';

export type HeaderStyleServiceMockType = Partial<HeaderStyleService> & {
  applyHeaderStyles: Mock;
  resetToDefaults: Mock;
};

export const HeaderStyleServiceMock = {
  simple(): HeaderStyleServiceMockType {
    return {
      applyHeaderStyles: vi.fn(),
      resetToDefaults: vi.fn(),
    };
  },
};
