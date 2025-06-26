import { ApiData } from '@osf/core/models';
import { FileTargetResponse } from '@osf/features/project/files/models/responses/get-file-target-response.model';
import { FileLinks, FileRelationshipsResponse, FileResponse } from '@shared/models';

export type CreateFolderResponse = ApiData<FileResponse, FileTargetResponse, FileRelationshipsResponse, FileLinks>;
