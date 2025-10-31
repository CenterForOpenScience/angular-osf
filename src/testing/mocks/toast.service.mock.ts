import { ToastService } from '@osf/shared/services/toast.service';

/**
 * A mock implementation of a toast (notification) service for testing purposes.
 *
 * @remarks
 * This mock allows tests to verify that toast messages would have been triggered without
 * actually displaying them. The methods are replaced with Jest spies so you can assert
 * calls like `expect(toastService.showSuccess).toHaveBeenCalledWith(...)`.
 *
 * @example
 * ```ts
 * TestBed.configureTestingModule({
 *   providers: [{ provide: ToastService, useValue: toastServiceMock }]
 * });
 *
 * it('should show success toast', () => {
 *   someComponent.doSomething();
 *   expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('Operation successful');
 * });
 * ```
 *
 * @property showSuccess - Mocked method for displaying a success message.
 * @property showError - Mocked method for displaying an error message.
 * @property showWarng - Mocked method for displaying a warning message.
 */
export const ToastServiceMock = {
  provide: ToastService,
  useValue: {
    showSuccess: jest.fn(),
    showError: jest.fn(),
    showWarn: jest.fn(),
  },
};
