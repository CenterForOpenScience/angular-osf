import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Subject } from 'rxjs';

export const DynamicDialogRefMock = {
  provide: DynamicDialogRef,
  useValue: {
    close: vi.fn(),
  },
};

export function provideDynamicDialogRefMock() {
  return {
    provide: DynamicDialogRef,
    useFactory: () => ({
      close: vi.fn(),
      destroy: vi.fn(),
      onClose: new Subject<any>(),
    }),
  };
}
