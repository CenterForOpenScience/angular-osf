import { ToastService } from '@osf/shared/services';

export const ToastServiceMock = {
  provide: ToastService,
  useValue: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
};
