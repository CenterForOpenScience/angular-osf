export interface StepOption {
  index: number;
  label: string;
  value: number | string;
  invalid?: boolean;
  touched?: boolean;
  routeLink?: string;
  disabled?: boolean;
}
