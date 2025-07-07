import {
  RegistrationQuestions,
  RegistrySchemaBlock,
  SchemaBlockAttributes,
  ViewSchemaBlock,
} from '@osf/features/registry/models';

export function MapViewSchemaBlock(block: RegistrySchemaBlock, questions: RegistrationQuestions): ViewSchemaBlock {
  const schemaBlock = {
    required: block.required,
    type: block.blockType,
    value: '',
    values: [],
    files: [],
  } as ViewSchemaBlock;

  if (block.displayText) {
    schemaBlock.value = block.displayText;
  } else if (block.registrationResponseKey) {
    const questionValue = questions[block.registrationResponseKey];

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

export function MapRegistrySchemaBlock(block: SchemaBlockAttributes): RegistrySchemaBlock {
  return {
    blockType: block.block_type,
    displayText: block.display_text,
    registrationResponseKey: block?.registration_response_key,
    required: block.required,
    schemaBlockGroupKey: block.schema_block_group_key,
  };
}
