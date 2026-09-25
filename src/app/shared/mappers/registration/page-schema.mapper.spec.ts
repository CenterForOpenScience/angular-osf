import { BlockType } from '@osf/shared/enums/block-type.enum';
import { FieldType } from '@osf/shared/enums/field-type.enum';
import { SchemaBlocksResponseJsonApi } from '@osf/shared/models/registration/schema-blocks-json-api.model';

import { PageSchemaMapper } from './page-schema.mapper';

type SchemaBlock = SchemaBlocksResponseJsonApi['data'][number];

function block(id: string, blockType: BlockType, overrides: Partial<SchemaBlock['attributes']> = {}): SchemaBlock {
  return {
    id,
    type: 'schema-blocks',
    attributes: {
      block_type: blockType,
      display_text: '',
      example_text: '',
      help_text: '',
      index: 0,
      registration_response_key: null,
      required: false,
      schema_block_group_key: id,
      ...overrides,
    },
  };
}

function response(blocks: SchemaBlock[]): SchemaBlocksResponseJsonApi {
  return { data: blocks, meta: { total: blocks.length } };
}

describe('PageSchemaMapper', () => {
  it('should return no pages when the response has no blocks', () => {
    expect(PageSchemaMapper.fromSchemaBlocksResponse(response([]))).toEqual([]);
  });

  it('should map a page heading and attach its question', () => {
    const pages = PageSchemaMapper.fromSchemaBlocksResponse(
      response([
        block('page-1', BlockType.PageHeading, { display_text: 'Study &amp; design', help_text: 'Help' }),
        block('q-1', BlockType.QuestionLabel, {
          display_text: 'Research questions',
          schema_block_group_key: 'g1',
        }),
        block('input-1', BlockType.LongTextInput, {
          registration_response_key: 'q1',
          required: true,
          schema_block_group_key: 'g1',
        }),
      ])
    );

    expect(pages).toEqual([
      {
        id: 'page-1',
        title: 'Study & design',
        helpText: 'Help',
        questions: [
          {
            id: 'q-1',
            displayText: 'Research questions',
            helpText: '',
            exampleText: '',
            required: true,
            groupKey: 'g1',
            responseKey: 'q1',
            fieldType: FieldType.TextArea,
          },
        ],
      },
    ]);
  });

  it('should attach section questions to the section', () => {
    const pages = PageSchemaMapper.fromSchemaBlocksResponse(
      response([
        block('page-1', BlockType.PageHeading, { display_text: 'Methods' }),
        block('section-1', BlockType.SectionHeading, { display_text: 'Analysis' }),
        block('q-1', BlockType.QuestionLabel, { display_text: 'Data processing', schema_block_group_key: 'g1' }),
        block('input-1', BlockType.ShortTextInput, {
          registration_response_key: 'q2',
          required: true,
          schema_block_group_key: 'g1',
        }),
      ])
    );

    expect(pages[0].questions).toEqual([]);
    expect(pages[0].sections).toEqual([
      {
        id: 'section-1',
        title: 'Analysis',
        helpText: '',
        questions: [
          {
            id: 'q-1',
            displayText: 'Data processing',
            helpText: '',
            exampleText: '',
            required: true,
            groupKey: 'g1',
            responseKey: 'q2',
            fieldType: FieldType.Text,
          },
        ],
      },
    ]);
  });

  it('should wrap questions without a page heading into one page', () => {
    const pages = PageSchemaMapper.fromSchemaBlocksResponse(
      response([
        block('q-1', BlockType.QuestionLabel, { display_text: 'Research questions', schema_block_group_key: 'g1' }),
        block('input-1', BlockType.LongTextInput, {
          registration_response_key: 'q1',
          required: true,
          schema_block_group_key: 'g1',
        }),
        block('q-2', BlockType.QuestionLabel, { display_text: 'Upload files', schema_block_group_key: 'g2' }),
        block('input-2', BlockType.FileInput, {
          registration_response_key: '53-7',
          required: false,
          schema_block_group_key: 'g2',
        }),
      ])
    );

    expect(pages).toEqual([
      {
        id: 'q-1',
        title: '',
        questions: [
          {
            id: 'q-1',
            displayText: 'Research questions',
            helpText: '',
            exampleText: '',
            required: true,
            groupKey: 'g1',
            responseKey: 'q1',
            fieldType: FieldType.TextArea,
          },
          {
            id: 'q-2',
            displayText: 'Upload files',
            helpText: '',
            exampleText: '',
            required: false,
            groupKey: 'g2',
            responseKey: '53-7',
            fieldType: FieldType.File,
          },
        ],
      },
    ]);
  });
});
