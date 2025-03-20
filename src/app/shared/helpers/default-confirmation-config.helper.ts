import { Confirmation } from 'primeng/api';

export const defaultConfirmationConfig: Confirmation = {
  message: 'Are you sure you want to proceed?',
  header: 'Confirmation',
  closable: true,
  closeOnEscape: false,
  rejectButtonProps: {
    label: 'Cancel',
    severity: 'info',
    outlined: true,
  },
  acceptButtonProps: {
    label: 'Confirm',
  },
};
