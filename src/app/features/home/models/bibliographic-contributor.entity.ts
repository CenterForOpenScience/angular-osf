import {User} from '@core/services/user/user.entity';

export interface BibliographicContributor {
  id: string;
  bibliographic: boolean;
  index: number;
  permission: string;
  unregisteredContributor: boolean;
  users: User;
}
