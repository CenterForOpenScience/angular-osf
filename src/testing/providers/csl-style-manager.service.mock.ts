import { of } from 'rxjs';

import { Mocked } from 'vitest';

import { StorageItem } from '@osf/shared/models/addons/storage-item.model';
import { CslStyleManagerService } from '@osf/shared/services/csl-style-manager.service';

export function CslStyleManagerServiceMockFactory() {
  return {
    formatCitation: vi.fn().mockImplementation((item: StorageItem) => item.itemName || ''),
    ensureStyleLoaded: vi.fn().mockReturnValue(of(undefined)),
    clearCache: vi.fn(),
  } as unknown as Mocked<CslStyleManagerService>;
}
