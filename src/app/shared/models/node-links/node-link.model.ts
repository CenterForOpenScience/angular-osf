import { IdTypeModel } from '../common/id-type.model';

export interface NodeLink {
  type: string;
  id: string;
  targetNode: IdTypeModel;
}
