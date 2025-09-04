import { ToastService } from '@osf/shared/services';

export const ToastServiceMock = {
  provide: ToastService,
  useValue: {
    showSuccess: jest.fn(),
    showError: jest.fn(),
    showWarn: jest.fn(),
  },
};
