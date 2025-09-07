import { PaginationLinksModel } from '@osf/shared/models/pagination-links.model';

import { InstitutionPreprint } from './institution-preprint.model';
import { InstitutionRegistration } from './institution-registration.model';

export interface AdminInstitutionSearchResult {
  items: InstitutionRegistration[] | InstitutionPreprint[];
  totalCount: number;
  links?: PaginationLinksModel;
  downloadLink: string | null;
}
