import { Contributor } from '@osf/features/home/models/contributor.entity';

export interface Project {
  id: string;
  title: string;
  dateModified: Date;
  bibliographicContributors: Contributor[];
  links: null; // needs to be researched, there is a big hierarchy
}
