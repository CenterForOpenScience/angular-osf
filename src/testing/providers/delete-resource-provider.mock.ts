import { Mock } from 'vitest';

import { DeleteResourceBaseOptions } from '@osf/features/project/settings/models/delete-resource-options.model';
import { DeleteResourceService } from '@osf/features/project/settings/services/delete-resource.service';

type DeleteResourceFn = (options: DeleteResourceBaseOptions) => void;

export type DeleteResourceServiceMockType = Partial<DeleteResourceService> & {
  deleteComponent: Mock<DeleteResourceFn>;
  deleteProject: Mock<DeleteResourceFn>;
};

export const DeleteResourceServiceMock = {
  simple(): DeleteResourceServiceMockType {
    return {
      deleteComponent: vi.fn(),
      deleteProject: vi.fn(),
    };
  },
};
