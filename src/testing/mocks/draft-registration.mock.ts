import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { DraftRegistrationModel } from '@shared/models/registration/draft-registration.model';

export const MOCK_DRAFT_REGISTRATION: DraftRegistrationModel = {
  branchedFrom: {
    filesLink: 'someFilesLink',
    id: 'projectId',
    title: 'Project Title',
    type: 'nodes',
  },
  components: [],
  description: 'This is a description',
  hasProject: true,
  id: 'thisissupposedtobeauniqueid',
  license: {
    id: 'someLicenseId',
    options: null,
  },
  providerId: 'osf',
  registrationSchemaId: '6797c0dedee44d144a2943fc',
  stepsData: {
    summary: '',
    uploader: [],
  },
  tags: [],
  title: 'This is a title',
  currentUserPermissions: [UserPermissions.Admin, UserPermissions.Write, UserPermissions.Read],
};
