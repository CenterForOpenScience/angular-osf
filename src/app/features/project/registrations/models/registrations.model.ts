export interface RegistrationsGetResponse {
  id: string;
  type: string;
  attributes: RegistrationsAttributes;
}

interface RegistrationsAttributes {
  title: string;
  date_registered: string;
  date_modified: string;
  registration_supplement: string;
  description: string;
  withdrawn: boolean;
}

export interface RegistrationModel {
  id: string;
  type: string;
  lastFetched?: number;
  title: string;
  dateRegistered: string;
  dateModified: string;
  registrationSupplement: string;
  description: string;
  withdrawn: boolean;
  registry: string;
  status: RegistrationStatus;
  contributors?: Contributor[];
}

export interface Contributor {
  name: string;
  link?: string;
}
export enum RegistrationStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  WITHDRAWN = 'withdrawn',
  SUBMITTED = 'submitted',
}
