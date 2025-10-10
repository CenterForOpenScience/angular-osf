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

    static plugins: {
      config: {
        get(plugin: string): {
          templates: {
            add(id: string, template: string): void;
            has(id: string): boolean;
          };
        };
      };
    };
  }
}

declare module '@citation-js/plugin-csl';
