import { Mock } from 'vitest';

import { PreprintDraftDeletionService } from '@osf/features/preprints/services/preprint-draft-deletion.service';

export type PreprintDraftDeletionServiceMockType = Partial<PreprintDraftDeletionService> & {
  deleted: boolean;
  confirmDeleteDraft: Mock;
  canDeactivate: Mock;
};

export const PreprintDraftDeletionServiceMock = {
  simple(): PreprintDraftDeletionServiceMockType {
    const service: PreprintDraftDeletionServiceMockType = {
      deleted: false,
      confirmDeleteDraft: vi.fn(),
      canDeactivate: vi.fn((submitted: boolean) => submitted || service.deleted),
    };
    return service;
  },
};
