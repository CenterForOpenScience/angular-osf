import { ResourceTab } from '@osf/features/search/models/resource-tab.enum';

export function getResourceTypes(resourceTab: ResourceTab): string {
  switch (resourceTab) {
    case ResourceTab.Projects:
      return 'Project,ProjectComponent';
    case ResourceTab.Registrations:
      return 'Registration,RegistrationComponent';
    case ResourceTab.Preprints:
      return 'Preprint';
    case ResourceTab.Files:
      return 'File';
    case ResourceTab.Users:
      return 'Agent';
    default:
      return 'Registration,RegistrationComponent,Project,ProjectComponent,Preprint,Agent,File';
  }
}
