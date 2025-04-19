import { ApplicationRef, inject, Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { interval, BehaviorSubject, first, concat } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class NewVersionCheckerService {
  isNewVersionAvailable = new BehaviorSubject<boolean>(false);
  swUpdate = inject(SwUpdate);
  appRef = inject(ApplicationRef);

  updateInterval = 15 * 60 * 1000;

  constructor() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.promptOnUpdateAvailable();
    this.checkForUpdateAfterInterval(this.updateInterval);
  }

  applyUpdate(): void {
    this.swUpdate
      .activateUpdate()
      .then(() => globalThis.location.reload())
      .catch(() => console.error('Update failed'));
  }

  private promptOnUpdateAvailable(): void {
    this.swUpdate.versionUpdates
      .pipe(takeUntilDestroyed())
      .subscribe((event: VersionEvent) => {
        console.info('Current version is', event);

        if (event.type !== 'NO_NEW_VERSION_DETECTED') {
          this.isNewVersionAvailable.next(true);
        }
      });
  }

  private checkForUpdateAfterInterval(updateInterval: number) {
    const appIsStable$ = this.appRef.isStable.pipe(
      first((isStable) => isStable === true),
    );
    const everyInterval$ = interval(updateInterval);
    const everyIntervalOnceAppIsStable$ = concat(appIsStable$, everyInterval$);

    everyIntervalOnceAppIsStable$.subscribe(() => {
      this.swUpdate.checkForUpdate();
    });
  }
}
