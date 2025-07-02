export interface ViewSchemaBlock {
  value: string;
  values: string[];
  files?: { id: string; name: string }[];
  required: boolean;
  html?: string;
  type: string;
}
