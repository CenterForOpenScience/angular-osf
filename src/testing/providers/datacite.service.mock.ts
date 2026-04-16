import { of } from 'rxjs';

import { Mock } from 'vitest';

import { DataciteService } from '@osf/shared/services/datacite/datacite.service';

export type DataciteServiceMockType = Partial<DataciteService> & {
  logIdentifiableView: Mock;
  logIdentifiableDownload: Mock;
  logFileDownload: Mock;
  logFileView: Mock;
};

export class DataciteServiceMockBuilder {
  private logIdentifiableViewMock: Mock = vi.fn().mockReturnValue(of(void 0));
  private logIdentifiableDownloadMock: Mock = vi.fn().mockReturnValue(of(void 0));
  private logFileDownloadMock: Mock = vi.fn().mockReturnValue(of(void 0));
  private logFileViewMock: Mock = vi.fn().mockReturnValue(of(void 0));

  static create(): DataciteServiceMockBuilder {
    return new DataciteServiceMockBuilder();
  }

  withLogIdentifiableView(mockImpl: Mock): DataciteServiceMockBuilder {
    this.logIdentifiableViewMock = mockImpl;
    return this;
  }

  withLogIdentifiableDownload(mockImpl: Mock): DataciteServiceMockBuilder {
    this.logIdentifiableDownloadMock = mockImpl;
    return this;
  }

  withLogFileDownload(mockImpl: Mock): DataciteServiceMockBuilder {
    this.logFileDownloadMock = mockImpl;
    return this;
  }

  withLogFileView(mockImpl: Mock): DataciteServiceMockBuilder {
    this.logFileViewMock = mockImpl;
    return this;
  }

  build(): DataciteServiceMockType {
    return {
      logIdentifiableView: this.logIdentifiableViewMock,
      logIdentifiableDownload: this.logIdentifiableDownloadMock,
      logFileDownload: this.logFileDownloadMock,
      logFileView: this.logFileViewMock,
    } as DataciteServiceMockType;
  }
}

export const DataciteServiceMock = {
  create() {
    return DataciteServiceMockBuilder.create();
  },
  simple() {
    return DataciteServiceMockBuilder.create().build();
  },
};
