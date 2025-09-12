import { DynamicDialogRef } from 'primeng/dynamicdialog';

export const DynamicDialogRefMock = {
  provide: DynamicDialogRef,
  useValue: {
    close: jest.fn(),
  },
};
