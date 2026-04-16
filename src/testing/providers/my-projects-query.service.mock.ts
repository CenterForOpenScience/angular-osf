import { Mock } from 'vitest';

import { MyProjectsTab } from '@osf/features/my-projects/enums';
import { MyProjectsQueryService } from '@osf/features/my-projects/services/my-projects-query.service';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { QueryParams } from '@shared/models/query-params.model';

export type MyProjectsQueryServiceMockType = Partial<MyProjectsQueryService> & {
  getRawParams: Mock<() => Record<string, string>>;
  handlePageChange: Mock;
  handleSort: Mock;
  handleTabSwitch: Mock;
  handleSearch: Mock;
  toQueryModel: Mock<(raw: Record<string, string>) => QueryParams>;
  hasTabInUrl: Mock<(raw: Record<string, string>) => boolean>;
  getTabFromUrl: Mock<(raw: Record<string, string>) => number | null>;
  updateParams: Mock;
};

export class MyProjectsQueryServiceMockBuilder {
  private rawParams: Record<string, string> = { tab: '1', page: '1', size: '10' };
  private queryModel: QueryParams = {
    page: 1,
    size: 10,
    search: '',
    sortColumn: '',
    sortOrder: SortOrder.Asc,
  };
  private selectedTab = MyProjectsTab.Projects;

  static create(): MyProjectsQueryServiceMockBuilder {
    return new MyProjectsQueryServiceMockBuilder();
  }

  withRawParams(rawParams: Record<string, string>): MyProjectsQueryServiceMockBuilder {
    this.rawParams = rawParams;
    return this;
  }

  withQueryModel(queryModel: QueryParams): MyProjectsQueryServiceMockBuilder {
    this.queryModel = queryModel;
    return this;
  }

  withSelectedTab(selectedTab: MyProjectsTab): MyProjectsQueryServiceMockBuilder {
    this.selectedTab = selectedTab;
    return this;
  }

  build(): MyProjectsQueryServiceMockType {
    return {
      getRawParams: vi.fn(() => this.rawParams),
      handlePageChange: vi.fn(),
      handleSort: vi.fn(),
      handleTabSwitch: vi.fn(),
      handleSearch: vi.fn(),
      toQueryModel: vi.fn(() => this.queryModel),
      hasTabInUrl: vi.fn(() => true),
      getTabFromUrl: vi.fn(() => this.selectedTab),
      updateParams: vi.fn(),
    };
  }
}

export const MyProjectsQueryServiceMock = {
  create() {
    return MyProjectsQueryServiceMockBuilder.create();
  },
  simple() {
    return MyProjectsQueryServiceMockBuilder.create().build();
  },
};
