import { Identifier } from './identifiers';

export interface ResourceMetadata {
  title: string;
  description: string;
  dateCreated: Date;
  dateModified: Date;
  language: string;
  resourceTypeGeneral: string;
  identifiers: Identifier[];
  funders: {
    funderName: string;
    funderIdentifier: string;
    funderIdentifierType: string;
    awardNumber: string;
    awardUri: string;
    awardTitle: string;
  }[];
}
