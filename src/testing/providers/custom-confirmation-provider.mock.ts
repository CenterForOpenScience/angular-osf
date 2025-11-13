import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import {
  AcceptConfirmationOptions,
  ContinueConfirmationOptions,
  DeleteConfirmationOptions,
} from '@shared/models/confirmation-options.model';

export type CustomConfirmationServiceMockType = Partial<CustomConfirmationService> & {
  confirmDelete: jest.Mock<void, [DeleteConfirmationOptions]>;
  confirmAccept: jest.Mock<void, [AcceptConfirmationOptions]>;
  confirmContinue: jest.Mock<void, [ContinueConfirmationOptions]>;
};

export class CustomConfirmationServiceMockBuilder {
  private confirmDeleteMock: jest.Mock<void, [DeleteConfirmationOptions]> = jest.fn();
  private confirmAcceptMock: jest.Mock<void, [AcceptConfirmationOptions]> = jest.fn();
  private confirmContinueMock: jest.Mock<void, [ContinueConfirmationOptions]> = jest.fn();

  static create(): CustomConfirmationServiceMockBuilder {
    return new CustomConfirmationServiceMockBuilder();
  }

  withConfirmDelete(mockImpl: jest.Mock<void, [DeleteConfirmationOptions]>): CustomConfirmationServiceMockBuilder {
    this.confirmDeleteMock = mockImpl;
    return this;
  }

  withConfirmAccept(mockImpl: jest.Mock<void, [AcceptConfirmationOptions]>): CustomConfirmationServiceMockBuilder {
    this.confirmAcceptMock = mockImpl;
    return this;
  }

  withConfirmContinue(mockImpl: jest.Mock<void, [ContinueConfirmationOptions]>): CustomConfirmationServiceMockBuilder {
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
      confirmDelete: jest.fn(),
      confirmAccept: jest.fn(),
      confirmContinue: jest.fn(),
    } as CustomConfirmationServiceMockType;
  },
};
