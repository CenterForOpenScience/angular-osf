import { HeaderStyleService } from '@osf/shared/services/header-style.service';

export type HeaderStyleServiceMockType = Partial<HeaderStyleService> & {
  applyHeaderStyles: jest.Mock;
  resetToDefaults: jest.Mock;
};

export const HeaderStyleServiceMock = {
  simple(): HeaderStyleServiceMockType {
    return {
      applyHeaderStyles: jest.fn(),
      resetToDefaults: jest.fn(),
    };
  },
};
