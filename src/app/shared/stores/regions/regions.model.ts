import { AsyncStateModel, IdName } from '@shared/models';

export interface RegionsStateModel {
  regions: AsyncStateModel<IdName[]>;
}
