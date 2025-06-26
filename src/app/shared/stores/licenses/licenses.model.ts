import { AsyncStateModel, License } from '@shared/models';

export interface LicensesStateModel {
  licenses: AsyncStateModel<License[]>;
}
