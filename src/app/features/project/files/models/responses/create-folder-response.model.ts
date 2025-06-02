import { ApiData } from '@osf/core/models';
import { FileLinks, FileRelationshipsResponse, FileResponse } from '@osf/features/project/files/models';
import { FileTargetResponse } from '@osf/features/project/files/models/responses/get-file-target-response.model';

export type CreateFolderResponse = ApiData<FileResponse, FileTargetResponse, FileRelationshipsResponse, FileLinks>;
