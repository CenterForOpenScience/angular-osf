import { of } from 'rxjs';

import { DataciteService } from '@shared/services/datacite/datacite.service';

export function DataciteMockFactory() {
  return {
    logFileDownload: jest.fn().mockReturnValue(of(void 0)),
    logFileView: jest.fn().mockReturnValue(of(void 0)),
    logIdentifiableView: jest.fn().mockReturnValue(of(void 0)),
    logIdentifiableDownload: jest.fn().mockReturnValue(of(void 0)),
  } as unknown as jest.Mocked<DataciteService>;
}
