import type gapi from 'gapi-script'; // or just `import gapi from 'gapi-script';`

/**
 * Extends the global `Window` interface to include additional properties used by the application,
 * such as Google APIs (`gapi`, `google.picker`) and the `dataLayer` for analytics or GTM integration.
 */
declare global {
  interface Window {
    /**
     * Represents the Google API client library (`gapi`) attached to the global window.
     * Used for OAuth, Picker API, Drive API, etc.
     *
     * @see https://developers.google.com/api-client-library/javascript/
     */
    gapi: typeof gapi;

    /**
     * Contains Google-specific UI services attached to the global window,
     * such as the `google.picker` API.
     *
     * @see https://developers.google.com/picker/docs/
     */
    google: {
      /**
       * Reference to the Google Picker API used for file selection and Drive integration.
       */
      picker: typeof google.picker;
    };

    /**
     * Global analytics `dataLayer` object used by Google Tag Manager (GTM).
     * Can store custom application metadata for tracking and event push.
     *
     * @property resourceType - The type of resource currently being viewed (e.g., 'project', 'file', etc.)
     * @property loggedIn - Indicates whether the user is currently authenticated.
     */
    dataLayer: {
      /**
       * The type of content or context being viewed (e.g., "project", "node", etc.).
       * Optional — may be undefined depending on when or where GTM initializes.
       */
      resourceType: string | undefined;

      /**
       * Indicates if the current user is authenticated.
       * Used for segmenting analytics based on login state.
       */
      loggedIn: boolean;
    };

    /**
     * Flag used by prerender services to determine when a page is fully loaded.
     * Set to false initially, then set to true once all AJAX requests and content are loaded.
     */
    prerenderReady?: boolean;
  }
}
