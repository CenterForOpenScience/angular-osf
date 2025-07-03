import { Institution, InstitutionLinks } from '@shared/models';

export interface InstitutionJsonApiModel {
  data: {
    attributes: Institution;
    id: string;
    links: InstitutionLinks;
  };
  meta: { version: string };
}
