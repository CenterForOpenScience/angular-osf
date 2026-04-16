import { CookieService } from 'ngx-cookie-service';

import { Mock } from 'vitest';

export type CookieServiceMockType = Partial<CookieService> & {
  check: Mock;
  get: Mock;
  getAll: Mock;
  set: Mock;
  delete: Mock;
  deleteAll: Mock;
};

export const CookieServiceMock = {
  simple(): CookieServiceMockType {
    return {
      check: vi.fn().mockReturnValue(false),
      get: vi.fn().mockReturnValue(''),
      getAll: vi.fn().mockReturnValue({}),
      set: vi.fn(),
      delete: vi.fn(),
      deleteAll: vi.fn(),
    };
  },
};
