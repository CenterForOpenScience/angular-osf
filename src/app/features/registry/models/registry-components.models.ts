import { NodeBibliographicContributor } from './bibliographic-contributors.models';

export interface RegistryComponentModel {
  id: string;
  title: string;
  description: string;
  category: string;
  dateCreated: string;
  dateModified: string;
  dateRegistered: string;
  registrationSupplement: string;
  tags: string[];
  isPublic: boolean;
  contributorsCount?: number;
  contributors?: NodeBibliographicContributor[];
  registry?: string;
}
