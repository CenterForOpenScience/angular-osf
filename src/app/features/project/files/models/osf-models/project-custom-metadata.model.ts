export interface OsfProjectMetadata {
  title: string;
  description: string;
  dateCreated: Date;
  dateModified: Date;
  language: string;
  resourceTypeGeneral: string;
  funders: {
    funderName: string;
    funderIdentifier: string;
    funderIdentifierType: string;
    awardNumber: string;
    awardUri: string;
    awardTitle: string;
  }[];
}
