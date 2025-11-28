import { APP_INITIALIZER, Provider } from '@angular/core';

import { ExtensionRegistry } from '@core/services/extension-registry.service';
import { FileActionExtension } from '@osf/shared/tokens/file-action-extensions.token';

import { ExtensionConfig, extensionConfig } from '../../extensions.config';

type FactoryFunction = (config?: unknown) => FileActionExtension[];

async function loadExtensions(registry: ExtensionRegistry): Promise<void> {
  for (const ext of extensionConfig) {
    if (!ext.enabled) continue;
    await loadExtension(ext, registry);
  }
}

async function loadExtension(extConfig: ExtensionConfig, registry: ExtensionRegistry): Promise<void> {
  const module = await extConfig.load();
  const factory = (module as Record<string, FactoryFunction>)[extConfig.factory];

  if (typeof factory !== 'function') {
    throw new Error(`Extension factory "${extConfig.factory}" not found in module`);
  }

  const extensions = factory(extConfig.config);
  registry.register(extensions);
}

export const EXTENSION_INITIALIZATION_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: (registry: ExtensionRegistry) => {
    return () => loadExtensions(registry);
  },
  deps: [ExtensionRegistry],
  multi: true,
};
