import { SubmitSteps } from '@osf/features/preprints/enums';
import { StepOption } from '@shared/models';

export const submitPreprintSteps: StepOption[] = [
  {
    index: 0,
    label: 'preprints.preprintStepper.steps.titleAndAbstract',
    value: SubmitSteps.TitleAndAbstract,
  },
  {
    index: 1,
    label: 'preprints.preprintStepper.steps.file',
    value: SubmitSteps.File,
  },
  {
    index: 2,
    label: 'preprints.preprintStepper.steps.metadata',
    value: SubmitSteps.Metadata,
  },
  {
    index: 3,
    label: 'preprints.preprintStepper.steps.authorAssertions',
    value: SubmitSteps.AuthorAssertions,
  },
  {
    index: 4,
    label: 'preprints.preprintStepper.steps.supplements',
    value: SubmitSteps.Supplements,
  },
  {
    index: 5,
    label: 'preprints.preprintStepper.steps.review',
    value: SubmitSteps.Review,
  },
];
