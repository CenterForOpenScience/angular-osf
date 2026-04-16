import { Mock } from 'vitest';

import { ProjectRedirectDialogService } from '@osf/shared/services/project-redirect-dialog.service';

export type ProjectRedirectDialogServiceMockType = Partial<ProjectRedirectDialogService> & {
  showProjectRedirectDialog: Mock<(projectId: string) => void>;
};

export class ProjectRedirectDialogServiceMockBuilder {
  private showProjectRedirectDialogMock: Mock<(projectId: string) => void> = vi.fn();

  static create(): ProjectRedirectDialogServiceMockBuilder {
    return new ProjectRedirectDialogServiceMockBuilder();
  }

  withShowProjectRedirectDialog(mockImpl: Mock<(projectId: string) => void>): ProjectRedirectDialogServiceMockBuilder {
    this.showProjectRedirectDialogMock = mockImpl;
    return this;
  }

  build(): ProjectRedirectDialogServiceMockType {
    return {
      showProjectRedirectDialog: this.showProjectRedirectDialogMock,
    };
  }
}

export const ProjectRedirectDialogServiceMock = {
  create() {
    return ProjectRedirectDialogServiceMockBuilder.create();
  },
  simple() {
    return ProjectRedirectDialogServiceMockBuilder.create().build();
  },
};
