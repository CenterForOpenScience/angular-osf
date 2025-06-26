import { OsfFileCustomMetadata } from './osf-models/file-custom-metadata.model';

export interface MetadataField {
  key: keyof OsfFileCustomMetadata;
  label: string;
}
