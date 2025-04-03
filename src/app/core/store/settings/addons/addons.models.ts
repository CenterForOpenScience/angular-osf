import { Addon } from '@shared/entities/addons.entities';

export interface AddonsStateModel {
  storageAddons: Addon[];
  citationAddons: Addon[];
}
