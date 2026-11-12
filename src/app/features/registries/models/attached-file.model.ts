import { FilePayloadJsonApi } from '@osf/shared/models/files/file-payload-json-api.model';

export type AttachedFile = FilePayloadJsonApi & { name: string };
