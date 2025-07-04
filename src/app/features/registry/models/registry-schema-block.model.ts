// export interface RegistrySchemaBlock {
//   value: string;
//   values: string[];
//   files?: { id: string; name: string }[];
//   required: boolean;
//   html?: string;
//   type: string;
// }
export interface RegistrySchemaBlock {
  blockType: string;
  displayText: string;
  required: boolean;
  schemaBlockGroupKey: string;
  registrationResponseKey: string | null;
}
