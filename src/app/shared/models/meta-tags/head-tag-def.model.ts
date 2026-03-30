import { MetaDefinition } from '@angular/platform-browser';

export type HeadTagAttrs = Record<string, string | number | boolean>;

export type HeadTagDef =
  | {
      type: 'meta';
      attrs: MetaDefinition;
    }
  | {
      type: 'link';
      attrs: HeadTagAttrs;
    }
  | {
      type: 'script';
      attrs: HeadTagAttrs;
      content?: string;
    };
