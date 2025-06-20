declare module 'markdown-it-video' {
  import { PluginSimple } from 'markdown-it';

  const videoPlugin: PluginSimple;
  export default videoPlugin;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const ace: any;
