export type StringOrNull = string | null;
export type StringOrNullOrUndefined = string | null | undefined;

export type BooleanOrNull = boolean | null;
export type BooleanOrNullOrUndefined = boolean | null | undefined;

export type NumberOrNull = number | null;
export type NumberOrNullOrUndefined = number | null | undefined;

export type DateOrNull = Date | null;
export type DateOrNullOrUndefined = Date | null | undefined;

export type ArrayOrNull<T> = T[] | null;
export type ArrayOrNullOrUndefined<T> = T[] | null | undefined;

export type ObjectOrNull<T> = T | null;
export type ObjectOrNullOrUndefined<T> = T | null | undefined;

export type Primitive = string | number | boolean | null | undefined;
export type NonNullablePrimitive = string | number | boolean;
