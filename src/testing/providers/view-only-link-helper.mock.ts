import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

export type ViewOnlyLinkHelperMockType = Partial<ViewOnlyLinkHelperService> & {
  hasViewOnlyParam: jest.Mock;
  getViewOnlyParam: jest.Mock;
  getViewOnlyParamFromUrl: jest.Mock;
};

export const ViewOnlyLinkHelperMock = {
  simple(hasViewOnly = false): ViewOnlyLinkHelperMockType {
    return {
      hasViewOnlyParam: jest.fn().mockReturnValue(hasViewOnly),
      getViewOnlyParam: jest.fn().mockReturnValue(null),
      getViewOnlyParamFromUrl: jest.fn().mockReturnValue(null),
    };
  },
};
