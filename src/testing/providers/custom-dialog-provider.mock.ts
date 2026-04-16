import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mock } from 'vitest';

import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

type OpenFn = (component: any, config?: Partial<DynamicDialogConfig>) => DynamicDialogRef;

export type CustomDialogServiceMockType = Partial<CustomDialogService> & {
  open: Mock<OpenFn>;
};

export class CustomDialogServiceMockBuilder {
  private openMock: Mock<OpenFn> = vi.fn();

  static create(): CustomDialogServiceMockBuilder {
    return new CustomDialogServiceMockBuilder();
  }

  withOpen(mockImpl: Mock<OpenFn>): CustomDialogServiceMockBuilder {
    this.openMock = mockImpl;
    return this;
  }

  withDefaultOpen(): CustomDialogServiceMockBuilder {
    this.openMock = vi.fn().mockReturnValue({
      onClose: {
        pipe: vi.fn().mockReturnValue({
          subscribe: vi.fn(),
        }),
      },
      close: vi.fn(),
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
      open: vi.fn().mockReturnValue({
        onClose: {
          pipe: vi.fn().mockReturnValue({
            subscribe: vi.fn(),
          }),
        },
        close: vi.fn(),
      } as unknown as DynamicDialogRef),
    } as CustomDialogServiceMockType;
  },
};
