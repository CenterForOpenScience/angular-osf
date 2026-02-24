import { BrowserTabService } from '@osf/shared/services/browser-tab.service';

export type BrowserTabServiceMockType = Partial<BrowserTabService> & {
  updateTabStyles: jest.Mock;
  resetToDefaults: jest.Mock;
};

export const BrowserTabServiceMock = {
  simple(): BrowserTabServiceMockType {
    return {
      updateTabStyles: jest.fn(),
      resetToDefaults: jest.fn(),
    };
  },
};
