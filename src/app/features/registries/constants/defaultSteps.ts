import { StepOption } from '@osf/shared/models';

export const defaultSteps: StepOption[] = [
  {
    index: 0,
    label: 'navigation.project.metadata',
    value: '',
    routeLink: 'metadata',
  },
  {
    label: 'registries.review.step',
    value: '',
    routeLink: 'review',
    index: 1,
  },
];
