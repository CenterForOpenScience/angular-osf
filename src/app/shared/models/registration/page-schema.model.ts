import { FieldType } from '@osf/shared/enums/field-type.enum';

export interface PageSchema {
  id: string;
  title: string;
  helpText?: string;
  description?: string;
  questions?: Question[];
  sections?: Section[];
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  helpText?: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  displayText: string;
  exampleText?: string;
  helpText?: string;
  paragraphText?: string;
  fieldType?: FieldType;
  options?: QuestionOption[];
  required: boolean;
  groupKey?: string;
  responseKey?: string;
}

export interface QuestionOption {
  label: string;
  value: string;
  helpText?: string;
}
