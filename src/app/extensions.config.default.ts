/**
 * Extension Configuration
 *
 * See docs/file-extensions.md for details.
 */
export interface ExtensionConfig {
  load: () => Promise<unknown>;
  factory: string;
  enabled: boolean;
  config?: unknown;
}

export const extensionConfig: ExtensionConfig[] = [
  // Copy Link - adds "Copy Link" to Share submenu
  {
    load: () => import('./extensions/copy-links'),
    factory: 'copyLinksExtensionFactory',
    enabled: true,
  },
];
