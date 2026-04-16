import { Mock } from 'vitest';

import { SafeHtml } from '@angular/platform-browser';

import { ActivityLog } from '@osf/shared/models/activity-logs/activity-logs.model';
import { ActivityLogDisplayService } from '@osf/shared/services/activity-logs/activity-log-display.service';

type GetActivityDisplayFn = (log: ActivityLog) => SafeHtml;

export type ActivityLogDisplayServiceMockType = Partial<ActivityLogDisplayService> & {
  getActivityDisplay: Mock<GetActivityDisplayFn>;
};

export class ActivityLogDisplayServiceMockBuilder {
  private getActivityDisplayMock: Mock<GetActivityDisplayFn> = vi
    .fn<GetActivityDisplayFn>()
    .mockReturnValue('<span>formatted</span>' as SafeHtml);

  static create(): ActivityLogDisplayServiceMockBuilder {
    return new ActivityLogDisplayServiceMockBuilder();
  }

  withGetActivityDisplay(mockImpl: Mock<GetActivityDisplayFn>): ActivityLogDisplayServiceMockBuilder {
    this.getActivityDisplayMock = mockImpl;
    return this;
  }

  withGetActivityDisplayReturnValue(returnValue: SafeHtml): ActivityLogDisplayServiceMockBuilder {
    this.getActivityDisplayMock = vi.fn<GetActivityDisplayFn>().mockReturnValue(returnValue);
    return this;
  }

  build(): ActivityLogDisplayServiceMockType {
    return {
      getActivityDisplay: this.getActivityDisplayMock,
    } as ActivityLogDisplayServiceMockType;
  }
}

export const ActivityLogDisplayServiceMock = {
  create() {
    return ActivityLogDisplayServiceMockBuilder.create();
  },
  simple(returnValue: SafeHtml = '<span>formatted</span>' as SafeHtml) {
    return ActivityLogDisplayServiceMockBuilder.create().withGetActivityDisplayReturnValue(returnValue).build();
  },
};
