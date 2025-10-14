import { CustomConfirmationService } from '@osf/shared/services';

export const CustomConfirmationServiceMock = {
  confirmDelete: jest.fn(),
  confirmAccept: jest.fn(),
  confirmContinue: jest.fn(),
};

export const MockCustomConfirmationServiceProvider = {
  provide: CustomConfirmationService,
  useValue: CustomConfirmationServiceMock,
};
