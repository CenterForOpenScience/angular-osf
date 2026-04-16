import { Mock } from 'vitest';

import { BrandService } from '@osf/shared/services/brand.service';

export type BrandServiceMockType = Partial<BrandService> & {
  applyBranding: Mock;
  resetBranding: Mock;
};

export const BrandServiceMock = {
  simple(): BrandServiceMockType {
    return {
      applyBranding: vi.fn(),
      resetBranding: vi.fn(),
    };
  },
};
