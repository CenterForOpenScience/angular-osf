import { StepOption } from '@osf/shared/models';

export const DEFAULT_STEPS: StepOption[] = [
  {
    index: 0,
    label: 'navigation.metadata',
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
