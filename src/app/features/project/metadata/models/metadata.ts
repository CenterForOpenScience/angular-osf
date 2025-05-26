export interface MetadataTemplate {
  title: string;
  description: string;
}

export const metadataTemplates: MetadataTemplate[] = [
  {
    title: 'OSF Enhanced Metadata',
    description: 'Additional metadata for OSF records, derived from the DataCite 4.4 Schema',
  },
  {
    title: 'Human Cognitive Neuroscience Data',
    description: 'This is a template to describe human cognitive neuroscience data.',
  },
  {
    title: 'Psych-DS Official Template',
    description: 'A community standard providing a systematic way of formatting and documenting datasets',
  },
  {
    title: 'mateBUS',
    description: 'A metadata template for applied psychology and organizational research',
  },
  {
    title: 'LDbase Project Metadata Form ver. 2',
    description: 'The LDbase template is for projects in the fields of education, learning, and human development.',
  },
];
