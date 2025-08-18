import { Primitive } from '@osf/shared/helpers/types.helper';

export interface SelectOption {
  label: string;
  value: Primitive;
}

export interface CustomOption<T> {
  label: string;
  value: T;
}
