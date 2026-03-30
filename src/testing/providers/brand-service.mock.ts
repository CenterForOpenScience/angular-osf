import { BrandService } from '@osf/shared/services/brand.service';

export type BrandServiceMockType = Partial<BrandService> & {
  applyBranding: jest.Mock;
  resetBranding: jest.Mock;
};

export const BrandServiceMock = {
  simple(): BrandServiceMockType {
    return {
      applyBranding: jest.fn(),
      resetBranding: jest.fn(),
    };
  },
};
