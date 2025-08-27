import type gapi from 'gapi-script'; // or just `import gapi from 'gapi-script';`

declare global {
  interface Window {
    gapi: typeof gapi;
    google: {
      picker: typeof google.picker;
    };
  }
}
