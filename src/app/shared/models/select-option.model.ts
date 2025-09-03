import { Primitive } from '../helpers';

export interface SelectOption {
  label: string;
  value: Primitive;
}

export interface CustomOption<T> {
  label: string;
  value: T;
}
