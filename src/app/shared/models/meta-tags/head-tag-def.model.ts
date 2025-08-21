import { MetaDefinition } from '@angular/platform-browser';

export interface HeadTagDef {
  type: 'meta' | 'link' | 'script';
  attrs: MetaDefinition;
  content?: string;
}
