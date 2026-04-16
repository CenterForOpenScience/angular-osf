import { Mock } from 'vitest';

import { MyProjectsTableParamsService } from '@osf/features/my-projects/services/my-projects-table-params.service';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { TableParameters } from '@shared/models/table-parameters.model';

export type MyProjectsTableParamsServiceMockType = Partial<MyProjectsTableParamsService> & {
  buildTableParams: Mock<(baseRows: number, totalRecords: number, isBookmarks: boolean) => TableParameters>;
};

export class MyProjectsTableParamsServiceMockBuilder {
  private buildTableParamsMock: Mock<
    (baseRows: number, totalRecords: number, isBookmarks: boolean) => TableParameters
  > = vi.fn((baseRows: number, totalRecords: number, isBookmarks: boolean) => ({
    ...DEFAULT_TABLE_PARAMS,
    rows: isBookmarks ? totalRecords : baseRows,
    totalRecords,
    paginator: !isBookmarks,
    rowsPerPageOptions: isBookmarks ? [] : DEFAULT_TABLE_PARAMS.rowsPerPageOptions,
    firstRowIndex: 0,
  }));

  static create(): MyProjectsTableParamsServiceMockBuilder {
    return new MyProjectsTableParamsServiceMockBuilder();
  }

  withBuildTableParams(
    mockImpl: Mock<(baseRows: number, totalRecords: number, isBookmarks: boolean) => TableParameters>
  ): MyProjectsTableParamsServiceMockBuilder {
    this.buildTableParamsMock = mockImpl;
    return this;
  }

  build(): MyProjectsTableParamsServiceMockType {
    return {
      buildTableParams: this.buildTableParamsMock,
    };
  }
}

export const MyProjectsTableParamsServiceMock = {
  create() {
    return MyProjectsTableParamsServiceMockBuilder.create();
  },
  simple() {
    return MyProjectsTableParamsServiceMockBuilder.create().build();
  },
};
