import { Mock } from 'vitest';

import { ConfirmForkOptions } from '@osf/shared/models/confirm-fork-options.model';
import { ForkDialogService } from '@osf/shared/services/fork-dialog.service';

export type ForkDialogServiceMockType = Partial<ForkDialogService> & {
  confirmFork: Mock<(options: ConfirmForkOptions) => void>;
};

export const ForkDialogServiceMock = {
  simple(): ForkDialogServiceMockType {
    return { confirmFork: vi.fn() };
  },
};
