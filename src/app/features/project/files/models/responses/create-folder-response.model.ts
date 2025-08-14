import { ApiData, FileLinks, FileRelationshipsResponse, FileResponse } from '@osf/shared/models';

import { FileTargetResponse } from './get-file-target-response.model';

export type CreateFolderResponse = ApiData<FileResponse, FileTargetResponse, FileRelationshipsResponse, FileLinks>;
