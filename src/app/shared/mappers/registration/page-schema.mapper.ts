import { BlockType } from '@osf/shared/enums/block-type.enum';
import { FieldType } from '@osf/shared/enums/field-type.enum';
import { PageSchema, Question, SchemaBlocksResponseJsonApi, Section } from '@osf/shared/models';

export class PageSchemaMapper {
  static fromSchemaBlocksResponse(response: SchemaBlocksResponseJsonApi): PageSchema[] {
    const pages: PageSchema[] = [];
    let currentPage!: PageSchema;
    let currentQuestion: Question | null = null;
    let currentSection: Section | null = null;
    response.data.map((item) => {
      switch (item.attributes.block_type) {
        case BlockType.PageHeading:
          currentPage = {
            id: item.id,
            title: item.attributes.display_text,
            questions: [],
          };
          currentQuestion = null;
          currentSection = null;
          pages.push(currentPage);
          break;
        case BlockType.SectionHeading:
          if (currentPage) {
            currentSection = {
              id: item.id,
              title: item.attributes.display_text,
              questions: [],
            };
            currentPage.sections = currentPage.sections || [];
            currentPage.sections.push(currentSection);
            currentQuestion = null;
          }
          break;

        case BlockType.Paragraph:
          if (currentQuestion) {
            currentQuestion.paragraphText = item.attributes.display_text;
            currentQuestion.fieldType = FieldType.Paragraph;
          } else if (currentSection) {
            currentSection.description = item.attributes.display_text;
          } else {
            currentPage.description = item.attributes.display_text;
          }
          break;

        case BlockType.SubsectionHeading:
          currentQuestion = {
            id: item.id,
            displayText: item.attributes.display_text,
            helpText: item.attributes.help_text,
            exampleText: item.attributes.example_text,
            required: item.attributes.required,
            groupKey: item.attributes.schema_block_group_key,
            responseKey: item.attributes.registration_response_key || undefined,
          };
          if (currentSection) {
            currentSection.questions = currentSection.questions || [];
            currentSection.questions.push(currentQuestion);
          } else if (currentPage) {
            currentPage.questions = currentPage.questions || [];
            currentPage.questions.push(currentQuestion);
          }
          break;

        case BlockType.QuestionLabel:
          currentQuestion = {
            id: item.id,
            displayText: item.attributes.display_text,
            helpText: item.attributes.help_text,
            exampleText: item.attributes.example_text,
            required: item.attributes.required,
            groupKey: item.attributes.schema_block_group_key,
            responseKey: item.attributes.registration_response_key || undefined,
          };
          if (currentSection) {
            currentSection.questions = currentSection.questions || [];
            currentSection.questions.push(currentQuestion);
          } else if (currentPage) {
            currentPage.questions = currentPage.questions || [];
            currentPage.questions.push(currentQuestion);
          }
          break;

        case BlockType.SingleSelectInput:
          if (currentQuestion) {
            currentQuestion.fieldType = FieldType.Radio;
            currentQuestion.required = item.attributes.required;
            currentQuestion.responseKey = item.attributes.registration_response_key || undefined;
          }
          break;

        case BlockType.MultiSelectInput:
          if (currentQuestion) {
            currentQuestion.fieldType = FieldType.Checkbox;
            currentQuestion.required = item.attributes.required;
            currentQuestion.responseKey = item.attributes.registration_response_key || undefined;
          }
          break;

        case BlockType.SelectInputOption:
          if (currentQuestion) {
            currentQuestion.options = currentQuestion?.options || [];
            currentQuestion?.options.push({
              label: item.attributes.display_text,
              value: item.attributes.display_text,
              helpText: item.attributes.help_text,
            });
          }
          break;

        case BlockType.LongTextInput:
          if (currentQuestion) {
            currentQuestion.fieldType = FieldType.TextArea;
            currentQuestion.required = item.attributes.required;
            currentQuestion.responseKey = item.attributes.registration_response_key || undefined;
          }
          break;
        case BlockType.ShortTextInput:
          if (currentQuestion) {
            currentQuestion.fieldType = FieldType.Text;
            currentQuestion.required = item.attributes.required;
            currentQuestion.responseKey = item.attributes.registration_response_key || undefined;
          }
          break;

        case BlockType.FileInput:
          if (currentQuestion) {
            currentQuestion.fieldType = FieldType.File;
            currentQuestion.required = item.attributes.required;
            currentQuestion.responseKey = item.attributes.registration_response_key || undefined;
          }
          break;
        default:
          console.warn(`Unexpected block type: ${item.attributes.block_type}`);
          return;
      }
    });

    return pages;
  }
}
