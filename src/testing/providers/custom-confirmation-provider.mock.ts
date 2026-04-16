import { Mock } from 'vitest';

import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import {
  AcceptConfirmationOptions,
  ContinueConfirmationOptions,
  DeleteConfirmationOptions,
} from '@shared/models/confirmation-options.model';

type ConfirmDeleteFn = (options: DeleteConfirmationOptions) => void;
type ConfirmAcceptFn = (options: AcceptConfirmationOptions) => void;
type ConfirmContinueFn = (options: ContinueConfirmationOptions) => void;

export type CustomConfirmationServiceMockType = Partial<CustomConfirmationService> & {
  confirmDelete: Mock<ConfirmDeleteFn>;
  confirmAccept: Mock<ConfirmAcceptFn>;
  confirmContinue: Mock<ConfirmContinueFn>;
};

export class CustomConfirmationServiceMockBuilder {
  private confirmDeleteMock: Mock<ConfirmDeleteFn> = vi.fn();
  private confirmAcceptMock: Mock<ConfirmAcceptFn> = vi.fn();
  private confirmContinueMock: Mock<ConfirmContinueFn> = vi.fn();

  static create(): CustomConfirmationServiceMockBuilder {
    return new CustomConfirmationServiceMockBuilder();
  }

  withConfirmDelete(mockImpl: Mock<ConfirmDeleteFn>): CustomConfirmationServiceMockBuilder {
    this.confirmDeleteMock = mockImpl;
    return this;
  }

  withConfirmAccept(mockImpl: Mock<ConfirmAcceptFn>): CustomConfirmationServiceMockBuilder {
    this.confirmAcceptMock = mockImpl;
    return this;
  }

  withConfirmContinue(mockImpl: Mock<ConfirmContinueFn>): CustomConfirmationServiceMockBuilder {
    this.confirmContinueMock = mockImpl;
    return this;
  }

  build(): CustomConfirmationServiceMockType {
    return {
      confirmDelete: this.confirmDeleteMock,
      confirmAccept: this.confirmAcceptMock,
      confirmContinue: this.confirmContinueMock,
    } as CustomConfirmationServiceMockType;
  }
}

export const CustomConfirmationServiceMock = {
  create() {
    return CustomConfirmationServiceMockBuilder.create();
  },
  simple() {
    return {
      confirmDelete: vi.fn(),
      confirmAccept: vi.fn(),
      confirmContinue: vi.fn(),
    } as CustomConfirmationServiceMockType;
  },
};
