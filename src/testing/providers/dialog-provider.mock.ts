import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

export class DialogServiceMockBuilder {
  private openSpy = jest.fn();
  private getInstanceSpy = jest.fn();

  static create(): DialogServiceMockBuilder {
    return new DialogServiceMockBuilder();
  }

  withOpenMock(mockFn?: jest.Mock): DialogServiceMockBuilder {
    this.openSpy = mockFn || jest.fn().mockReturnValue({} as DynamicDialogRef<any>);
    return this;
  }

  withGetInstanceMock(mockFn?: jest.Mock): DialogServiceMockBuilder {
    this.getInstanceSpy = mockFn || jest.fn();
    return this;
  }

  withOpenReturning(ref: DynamicDialogRef<any>): DialogServiceMockBuilder {
    this.openSpy = jest.fn().mockReturnValue(ref);
    return this;
  }

  withOpenThrowing(error: Error): DialogServiceMockBuilder {
    this.openSpy = jest.fn().mockImplementation(() => {
      throw error;
    });
    return this;
  }

  build(): Partial<DialogService> {
    return {
      open: this.openSpy,
      getInstance: this.getInstanceSpy,
      dialogComponentRefMap: new Map(),
    };
  }
}

export const DialogServiceMock = {
  create() {
    return DialogServiceMockBuilder.create();
  },

  withOpenMock(mockFn?: jest.Mock) {
    return DialogServiceMockBuilder.create().withOpenMock(mockFn);
  },

  withGetInstanceMock(mockFn?: jest.Mock) {
    return DialogServiceMockBuilder.create().withGetInstanceMock(mockFn);
  },

  withOpenReturning(ref: DynamicDialogRef<any>) {
    return DialogServiceMockBuilder.create().withOpenReturning(ref);
  },

  withOpenThrowing(error: Error) {
    return DialogServiceMockBuilder.create().withOpenThrowing(error);
  },
};
