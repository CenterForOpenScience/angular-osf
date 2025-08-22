// src/types/structured-clone.d.ts
declare module 'structured-clone' {
  function structuredClone<T>(value: T): T;
  export = structuredClone;
}
