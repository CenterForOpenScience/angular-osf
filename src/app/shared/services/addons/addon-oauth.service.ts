import { createDispatchMap, select } from '@ngxs/store';

import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthorizedAccountModel, OAuthCallbacks } from '@shared/models';
import { AddonsSelectors, DeleteAuthorizedAddon, GetAuthorizedStorageOauthToken } from '@shared/stores/addons';

@Injectable({
  providedIn: 'root',
})
export class AddonOAuthService {
  private destroyRef = inject(DestroyRef);

  private pendingOauth = signal<boolean>(false);
  private createdAddon = signal<AuthorizedAccountModel | null>(null);
  private addonTypeString = signal<string>('');
  private callbacks = signal<OAuthCallbacks | null>(null);

  private authorizedStorageAddons = select(AddonsSelectors.getAuthorizedStorageAddons);

  private actions = createDispatchMap({
    getAuthorizedStorageOauthToken: GetAuthorizedStorageOauthToken,
    deleteAuthorizedAddon: DeleteAuthorizedAddon,
  });

  private boundOnVisibilityChange = this.onVisibilityChange.bind(this);

  startOAuthTracking(createdAddon: AuthorizedAccountModel, addonTypeString: string, callbacks: OAuthCallbacks): void {
    this.pendingOauth.set(true);
    this.createdAddon.set(createdAddon);
    this.addonTypeString.set(addonTypeString);
    this.callbacks.set(callbacks);

    document.addEventListener('visibilitychange', this.boundOnVisibilityChange);
  }

  stopOAuthTracking(): void {
    this.cleanupService();
  }

  private onVisibilityChange(): void {
    if (document.visibilityState === 'visible' && this.pendingOauth()) {
      this.checkOauthSuccess();
    }
  }

  private checkOauthSuccess(): void {
    const addon = this.createdAddon();
    if (!addon?.id) return;

    this.actions
      .getAuthorizedStorageOauthToken(addon.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          const updatedAddon = this.authorizedStorageAddons().find(
            (storageAddon: AuthorizedAccountModel) => storageAddon.id === addon.id
          );

          if (updatedAddon?.credentialsAvailable && updatedAddon?.authUrl === null) {
            this.completeOauthFlow(updatedAddon);
          }
        },
        error: () => {
          this.completeOauthFlow();
        },
      });
  }

  private completeOauthFlow(updatedAddon?: AuthorizedAccountModel): void {
    this.pendingOauth.set(false);
    document.removeEventListener('visibilitychange', this.boundOnVisibilityChange);

    if (updatedAddon && this.callbacks()?.onSuccess) {
      const originalAddon = this.createdAddon();
      const addonForCallback = {
        ...updatedAddon,
        externalServiceName: originalAddon?.externalServiceName || updatedAddon.externalServiceName,
      };
      this.callbacks()?.onSuccess(addonForCallback);
    }

    this.resetServiceData();
  }

  private cleanupService(): void {
    this.cleanupIncompleteOAuthAddon();
    document.removeEventListener('visibilitychange', this.boundOnVisibilityChange);
    this.resetServiceData();
  }

  private cleanupIncompleteOAuthAddon(): void {
    const addon = this.createdAddon();
    if (addon?.id && this.pendingOauth() && !addon.credentialsAvailable) {
      this.actions.deleteAuthorizedAddon(addon.id, this.addonTypeString()).subscribe();
    }
  }

  private resetServiceData(): void {
    this.createdAddon.set(null);
    this.addonTypeString.set('');
    this.callbacks.set(null);
  }
}
