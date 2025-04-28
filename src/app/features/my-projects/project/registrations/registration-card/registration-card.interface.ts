export interface Contributor {
  name: string;
  link?: string;
}

export type RegistrationStatus = 'draft' | 'withdrawn' | 'in_progress';

export interface RegistrationCard {
  title: string;
  template: string;
  registry: string;
  registeredDate: string;
  lastUpdated: string;
  contributors: Contributor[];
  description: string;
  status: RegistrationStatus;
}
