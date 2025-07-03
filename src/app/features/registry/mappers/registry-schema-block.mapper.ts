import { RegistrationQuestions, RegistrySchemaBlock, SchemaBlockAttributes } from '@osf/features/registry/models';

export function MapRegistrySchemaBlock(
  block: SchemaBlockAttributes,
  questions: RegistrationQuestions
): RegistrySchemaBlock {
  const schemaBlock = {
    required: block.required,
    type: block.block_type,
    value: '',
    values: [],
    files: [],
  } as RegistrySchemaBlock;

  if (block.display_text) {
    schemaBlock.value = block.display_text;
  } else if (block.registration_response_key) {
    const questionValue = questions[block.registration_response_key];

    if (questionValue && Array.isArray(questionValue)) {
      if (schemaBlock.type === 'multi-select-input') {
        schemaBlock.values = questionValue as string[];
      } else if (schemaBlock.type === 'file-input') {
        schemaBlock.files = (questionValue as { file_id: string; file_name: string }[]).map((file) => ({
          id: file.file_id,
          name: file.file_name,
        }));
      }
    } else if (questionValue) {
      schemaBlock.value = questionValue as string;
    }
  }

  return schemaBlock;
}
