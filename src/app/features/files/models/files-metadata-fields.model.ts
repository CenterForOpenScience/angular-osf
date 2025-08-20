import { OsfFileCustomMetadata } from './file-custom-metadata.model';

export interface MetadataField {
  key: keyof OsfFileCustomMetadata;
  label: string;
}
