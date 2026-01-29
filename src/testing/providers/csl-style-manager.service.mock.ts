import { of } from 'rxjs';

import { StorageItem } from '@osf/shared/models/addons/storage-item.model';
import { CslStyleManagerService } from '@osf/shared/services/csl-style-manager.service';

export function CslStyleManagerServiceMockFactory() {
  return {
    formatCitation: jest.fn().mockImplementation((item: StorageItem) => item.itemName || ''),
    ensureStyleLoaded: jest.fn().mockReturnValue(of(undefined)),
    clearCache: jest.fn(),
  } as unknown as jest.Mocked<CslStyleManagerService>;
}
