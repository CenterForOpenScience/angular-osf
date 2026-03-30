import { FileModel } from '@osf/shared/models/files/file.model';

export type AttachedFile = Partial<FileModel & { file_id: string }>;
