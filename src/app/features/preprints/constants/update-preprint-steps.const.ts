import { PreprintSteps } from '@osf/features/preprints/enums';
import { StepOption } from '@shared/models';

export const updatePreprintSteps: StepOption[] = [
  {
    index: 0,
    label: 'preprints.preprintStepper.steps.titleAndAbstract',
    value: PreprintSteps.TitleAndAbstract,
  },
  {
    index: 1,
    label: 'preprints.preprintStepper.steps.metadata',
    value: PreprintSteps.Metadata,
  },
  {
    index: 2,
    label: 'preprints.preprintStepper.steps.authorAssertions',
    value: PreprintSteps.AuthorAssertions,
  },
  {
    index: 3,
    label: 'preprints.preprintStepper.steps.supplements',
    value: PreprintSteps.Supplements,
  },
  {
    index: 4,
    label: 'preprints.preprintStepper.steps.review',
    value: PreprintSteps.Review,
  },
];
