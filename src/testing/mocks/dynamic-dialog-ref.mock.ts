import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Subject } from 'rxjs';

export const DynamicDialogRefMock = {
  provide: DynamicDialogRef,
  useValue: {
    close: jest.fn(),
  },
};

export function provideDynamicDialogRefMock() {
  return {
    provide: DynamicDialogRef,
    useFactory: () => ({
      close: jest.fn(),
      destroy: jest.fn(),
      onClose: new Subject<any>(),
    }),
  };
}
