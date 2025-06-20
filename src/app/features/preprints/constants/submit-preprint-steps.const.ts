import { StepperStep } from '@shared/models';

export const submitPreprintSteps: StepperStep[] = [
  {
    label: 'Title and Abstract',
    value: 0,
  },
  {
    label: 'File',
    value: 1,
  },
  {
    label: 'Metadata',
    value: 2,
  },
  {
    label: 'Author Assertions',
    value: 3,
  },
  {
    label: 'Supplements',
    value: 4,
  },
  {
    label: 'Review',
    value: 5,
  },
];
