import { Mock } from 'vitest';

import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

export type ViewOnlyLinkHelperMockType = Partial<ViewOnlyLinkHelperService> & {
  hasViewOnlyParam: Mock;
  getViewOnlyParam: Mock;
  getViewOnlyParamFromUrl: Mock;
};

export const ViewOnlyLinkHelperMock = {
  simple(hasViewOnly = false): ViewOnlyLinkHelperMockType {
    return {
      hasViewOnlyParam: vi.fn().mockReturnValue(hasViewOnly),
      getViewOnlyParam: vi.fn().mockReturnValue(null),
      getViewOnlyParamFromUrl: vi.fn().mockReturnValue(null),
    };
  },
};
