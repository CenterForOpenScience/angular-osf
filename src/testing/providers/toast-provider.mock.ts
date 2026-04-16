import { Mock } from 'vitest';

import { ToastService } from '@osf/shared/services/toast.service';

type ToastFn = (...args: any[]) => void;

export type ToastServiceMockType = Partial<ToastService> & {
  showSuccess: Mock<ToastFn>;
  showWarn: Mock<ToastFn>;
  showError: Mock<ToastFn>;
};

export class ToastServiceMockBuilder {
  private showSuccessMock: Mock<ToastFn> = vi.fn();
  private showWarnMock: Mock<ToastFn> = vi.fn();
  private showErrorMock: Mock<ToastFn> = vi.fn();

  static create(): ToastServiceMockBuilder {
    return new ToastServiceMockBuilder();
  }

  withShowSuccess(mockImpl: Mock<ToastFn>): ToastServiceMockBuilder {
    this.showSuccessMock = mockImpl;
    return this;
  }

  withShowWarn(mockImpl: Mock<ToastFn>): ToastServiceMockBuilder {
    this.showWarnMock = mockImpl;
    return this;
  }

  withShowError(mockImpl: Mock<ToastFn>): ToastServiceMockBuilder {
    this.showErrorMock = mockImpl;
    return this;
  }

  build(): ToastServiceMockType {
    return {
      showSuccess: this.showSuccessMock,
      showWarn: this.showWarnMock,
      showError: this.showErrorMock,
    } as ToastServiceMockType;
  }
}

export const ToastServiceMock = {
  create() {
    return ToastServiceMockBuilder.create();
  },
  simple() {
    return {
      showSuccess: vi.fn(),
      showWarn: vi.fn(),
      showError: vi.fn(),
    } as ToastServiceMockType;
  },
};
