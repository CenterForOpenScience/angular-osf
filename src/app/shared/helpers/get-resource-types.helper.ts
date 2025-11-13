import { ResourceType } from '@osf/shared/enums/resource-type.enum';

export function getResourceTypeStringFromEnum(resourceTab: ResourceType): string {
  switch (resourceTab) {
    case ResourceType.Project:
      return 'Project,ProjectComponent';
    case ResourceType.Registration:
      return 'Registration,RegistrationComponent';
    case ResourceType.Preprint:
      return 'Preprint';
    case ResourceType.File:
      return 'File';
    case ResourceType.Agent:
      return 'Agent';
    default:
      return 'Registration,RegistrationComponent,Project,ProjectComponent,Preprint,Agent,File';
  }
}
