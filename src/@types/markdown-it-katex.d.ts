declare module 'markdown-it-katex' {
  import { PluginSimple } from 'markdown-it';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface KatexOptions {
    throwOnError?: boolean;
    errorColor?: string;
    macros?: Record<string, string>;
    fleqn?: boolean;
    leqno?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    strict?: boolean | string | Function;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    trust?: boolean | Function;
    output?: string;
    displayMode?: boolean;
  }

  const markdownItKatex: PluginSimple;
  export = markdownItKatex;
}
