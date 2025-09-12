import { ResourceType } from '../enums';

export const CardLabelTranslationKeys: Partial<Record<ResourceType, string>> = {
  [ResourceType.Project]: 'resourceCard.type.project',
  [ResourceType.ProjectComponent]: 'resourceCard.type.projectComponent',
  [ResourceType.Registration]: 'resourceCard.type.registration',
  [ResourceType.RegistrationComponent]: 'resourceCard.type.registrationComponent',
  [ResourceType.Preprint]: 'resourceCard.type.preprint',
  [ResourceType.File]: 'resourceCard.type.file',
  [ResourceType.Agent]: 'resourceCard.type.user',
  [ResourceType.Null]: 'resourceCard.type.null',
};
