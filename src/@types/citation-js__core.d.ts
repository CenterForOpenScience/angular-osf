declare module '@citation-js/core' {
  export class Cite {
    constructor(data: unknown);
    format(
      format: string,
      options: {
        format: string;
        template: string;
        lang: string;
      }
    ): string;
  }
}

declare module '@citation-js/plugin-csl';
