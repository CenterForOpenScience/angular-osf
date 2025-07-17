import { PreprintSteps } from '@osf/features/preprints/enums';
import { StepOption } from '@shared/models';

export const createNewVersionStepsConst: StepOption[] = [
  {
    index: 0,
    label: 'preprints.preprintStepper.steps.file',
    value: PreprintSteps.File,
  },
  {
    index: 1,
    label: 'preprints.preprintStepper.steps.review',
    value: PreprintSteps.Review,
  },
];
