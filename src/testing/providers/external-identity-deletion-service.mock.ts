import { Mock, vi } from 'vitest';

import { ExternalIdentityDeletionService } from '@osf/features/settings/account-settings/services/external-identity-deletion.service';

type ConfirmAndDeleteFn = (identityId: string) => void;

export type ExternalIdentityDeletionServiceMockType = Pick<ExternalIdentityDeletionService, 'confirmAndDelete'> & {
  confirmAndDelete: Mock<ConfirmAndDeleteFn>;
};

export class ExternalIdentityDeletionServiceMockBuilder {
  private confirmAndDeleteMock: Mock<ConfirmAndDeleteFn> = vi.fn();

  static create(): ExternalIdentityDeletionServiceMockBuilder {
    return new ExternalIdentityDeletionServiceMockBuilder();
  }

  withConfirmAndDelete(mockImpl: Mock<ConfirmAndDeleteFn>): ExternalIdentityDeletionServiceMockBuilder {
    this.confirmAndDeleteMock = mockImpl;
    return this;
  }

  build(): ExternalIdentityDeletionServiceMockType {
    return {
      confirmAndDelete: this.confirmAndDeleteMock,
    } as ExternalIdentityDeletionServiceMockType;
  }
}

export const ExternalIdentityDeletionServiceMock = {
  create() {
    return ExternalIdentityDeletionServiceMockBuilder.create();
  },
  simple() {
    return ExternalIdentityDeletionServiceMockBuilder.create().build();
  },
};
