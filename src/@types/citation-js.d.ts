declare module '@citation-js/core' {
  export class Cite {
    constructor(data?: unknown);

    format(
      type: string,
      options?: {
        format?: string;
        template?: string;
        lang?: string;
      }
    ): string;

    static plugins: {
      config: {
        get(name: string): {
          templates: {
            add(id: string, template: string): void;
            has(id: string): boolean;
          };
        };
      };
    };
  }

  export = Cite;
}

declare module '@citation-js/plugin-csl';
