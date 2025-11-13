import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

export type CustomDialogServiceMockType = Partial<CustomDialogService> & {
  open: jest.Mock<DynamicDialogRef, [any, Partial<DynamicDialogConfig>?]>;
};

export class CustomDialogServiceMockBuilder {
  private openMock: jest.Mock<DynamicDialogRef, [any, Partial<DynamicDialogConfig>?]> = jest.fn();

  static create(): CustomDialogServiceMockBuilder {
    return new CustomDialogServiceMockBuilder();
  }

  withOpen(
    mockImpl: jest.Mock<DynamicDialogRef, [any, Partial<DynamicDialogConfig>?]>
  ): CustomDialogServiceMockBuilder {
    this.openMock = mockImpl;
    return this;
  }

  withDefaultOpen(): CustomDialogServiceMockBuilder {
    this.openMock = jest.fn().mockReturnValue({
      onClose: {
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn(),
        }),
      },
      close: jest.fn(),
    } as unknown as DynamicDialogRef);
    return this;
  }

  build(): CustomDialogServiceMockType {
    return {
      open: this.openMock,
    } as CustomDialogServiceMockType;
  }
}

export const CustomDialogServiceMock = {
  create() {
    return CustomDialogServiceMockBuilder.create();
  },
  simple() {
    return {
      open: jest.fn().mockReturnValue({
        onClose: {
          pipe: jest.fn().mockReturnValue({
            subscribe: jest.fn(),
          }),
        },
        close: jest.fn(),
      } as unknown as DynamicDialogRef),
    } as CustomDialogServiceMockType;
  },
};
