import { ToastService } from '@osf/shared/services';

export type ToastServiceMockType = Partial<ToastService> & {
  showSuccess: jest.Mock;
  showWarn: jest.Mock;
  showError: jest.Mock;
};

export class ToastServiceMockBuilder {
  private showSuccessMock: jest.Mock = jest.fn();
  private showWarnMock: jest.Mock = jest.fn();
  private showErrorMock: jest.Mock = jest.fn();

  static create(): ToastServiceMockBuilder {
    return new ToastServiceMockBuilder();
  }

  withShowSuccess(mockImpl: jest.Mock): ToastServiceMockBuilder {
    this.showSuccessMock = mockImpl;
    return this;
  }

  withShowWarn(mockImpl: jest.Mock): ToastServiceMockBuilder {
    this.showWarnMock = mockImpl;
    return this;
  }

  withShowError(mockImpl: jest.Mock): ToastServiceMockBuilder {
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
      showSuccess: jest.fn(),
      showWarn: jest.fn(),
      showError: jest.fn(),
    } as ToastServiceMockType;
  },
};
