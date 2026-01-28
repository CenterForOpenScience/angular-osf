import { Injectable, signal } from '@angular/core';

import { FileActionExtension } from '@osf/shared/tokens/file-action-extensions.token';

/**
 * Central registry for all plugin extensions.
 * Extensions are registered at app initialization time via APP_INITIALIZER.
 */
@Injectable({ providedIn: 'root' })
export class ExtensionRegistry {
  private readonly _extensions = signal<FileActionExtension[]>([]);

  /** Read-only signal of all extensions */
  readonly extensions = this._extensions.asReadonly();

  register(extensions: FileActionExtension[]): void {
    this._extensions.update((current) => [...current, ...extensions]);
  }
}
