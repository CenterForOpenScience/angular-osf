import { of } from 'rxjs';

import { DataciteService } from '@osf/shared/services/datacite/datacite.service';

export type DataciteServiceMockType = Partial<DataciteService> & {
  logIdentifiableView: jest.Mock;
  logIdentifiableDownload: jest.Mock;
  logFileDownload: jest.Mock;
  logFileView: jest.Mock;
};

export class DataciteServiceMockBuilder {
  private logIdentifiableViewMock: jest.Mock = jest.fn().mockReturnValue(of(void 0));
  private logIdentifiableDownloadMock: jest.Mock = jest.fn().mockReturnValue(of(void 0));
  private logFileDownloadMock: jest.Mock = jest.fn().mockReturnValue(of(void 0));
  private logFileViewMock: jest.Mock = jest.fn().mockReturnValue(of(void 0));

  static create(): DataciteServiceMockBuilder {
    return new DataciteServiceMockBuilder();
  }

  withLogIdentifiableView(mockImpl: jest.Mock): DataciteServiceMockBuilder {
    this.logIdentifiableViewMock = mockImpl;
    return this;
  }

  withLogIdentifiableDownload(mockImpl: jest.Mock): DataciteServiceMockBuilder {
    this.logIdentifiableDownloadMock = mockImpl;
    return this;
  }

  withLogFileDownload(mockImpl: jest.Mock): DataciteServiceMockBuilder {
    this.logFileDownloadMock = mockImpl;
    return this;
  }

  withLogFileView(mockImpl: jest.Mock): DataciteServiceMockBuilder {
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
