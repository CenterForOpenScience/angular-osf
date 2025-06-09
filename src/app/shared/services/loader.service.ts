import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  show() {
    this._isLoading.set(true);
  }

  hide() {
    this._isLoading.set(false);
  }
}
