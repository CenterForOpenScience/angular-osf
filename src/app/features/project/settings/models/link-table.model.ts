import {
  ViewOnlyLinkCreatorModel,
  ViewOnlyLinkNodeModel,
} from '@osf/features/project/settings/models/view-only-link.model';

export interface LinkTableModel {
  id: string;
  sharedComponents: string;
  createdDate: string | Date;
  createdBy: ViewOnlyLinkCreatorModel;
  nodes: ViewOnlyLinkNodeModel[];
  anonymous: boolean;
  link: string;
}
